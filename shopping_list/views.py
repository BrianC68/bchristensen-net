from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, ListCreateAPIView, RetrieveAPIView, \
                    RetrieveUpdateDestroyAPIView, CreateAPIView
from rest_framework import permissions, authentication, status
from rest_framework.serializers import ListSerializer
from rest_framework.status import HTTP_404_NOT_FOUND
from .models import Department, ShoppingList, ShoppingListItem
from .serializers import DepartmentDetailSerializer, DepartmentSerializer, ShoppingListRUDSerializer, ShoppingListSerializer, \
                    ShoppingListItemSerializer, ShoppingListDetailSerializer, ShoppingListItemDetailSerializer, UserSerializer

User = get_user_model()


class DepartmentList(ListCreateAPIView):
    '''List all departments, or create a new one for the shopping list passed in (pk).'''

    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [authentication.TokenAuthentication]
    
    def get_queryset(self):
        user_depts = Department.objects.filter(shopping_list=self.kwargs['pk'], user=self.request.user)
        shared_depts = Department.objects.filter(shopping_list=self.kwargs['pk'], shopping_list__shares=self.request.user)
        queryset = user_depts | shared_depts
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class DepartmentDetail(RetrieveUpdateDestroyAPIView):
    '''Retrieve, update or delete a department.'''

    serializer_class = DepartmentDetailSerializer
    # queryset = Department.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [authentication.TokenAuthentication]

    def perform_create(self, serializer):
      serializer.save(user=self.request.user)
        
    def get_queryset(self):
       user_depts = Department.objects.filter(id=self.kwargs['pk'], user=self.request.user)
       shared_depts = Department.objects.filter(id=self.kwargs['pk'], shopping_list__shares=self.request.user)
       queryset = user_depts | shared_depts
       return queryset


class ShoppingLists(ListCreateAPIView):
    '''Display all shopping lists, or create a new one.'''

    serializer_class = ShoppingListSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [authentication.TokenAuthentication]

    def get_queryset(self):
        user_lists = ShoppingList.objects.filter(user=self.request.user)
        shared_lists = ShoppingList.objects.filter(shares=self.request.user)
        queryset = user_lists | shared_lists
        # Remove duplicate model instances because of "shares" manytomanyfield.
        queryset = queryset.distinct()
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ShoppingListRUD(RetrieveUpdateDestroyAPIView):
    '''Retrieve, update or delete a shopping list.'''

    serializer_class = ShoppingListRUDSerializer
    queryset = ShoppingList.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [authentication.TokenAuthentication]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def put(self, request, pk, format=None):
        '''Overwrite put method in case a username is passed in when a user shares the list with another user.'''
        list = self.get_object()
        if request.data['username']:
            try:
                share_user = User.objects.get(username=request.data['username'])
                if request.data['action'] == 'remove':
                    list.shares.remove(share_user.id)
                else:
                    list.shares.add(share_user.id)
            except User.DoesNotExist:
                return Response({"non_field_errors": ["User does not exist!"]}, status=HTTP_404_NOT_FOUND)
                
        serializer = ShoppingListSerializer(list, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ShoppingListItems(ListCreateAPIView):
    '''Display all shopping list items, or create a new one.'''

    serializer_class = ShoppingListItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [authentication.TokenAuthentication]

    def get_queryset(self):
        user_items = ShoppingListItem.objects.filter(shopping_list=self.kwargs['pk'], user=self.request.user)
        shared_items = ShoppingListItem.objects.filter(shopping_list=self.kwargs['pk'], shares=self.request.user)
        queryset = user_items |shared_items
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ShoppingListItemDetail(RetrieveUpdateDestroyAPIView):
    '''Retrieve, update or delete shopping list item.'''

    serializer_class = ShoppingListItemDetailSerializer
    queryset = ShoppingListItem.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [authentication.TokenAuthentication]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ShoppingListDetail(ListAPIView):
    '''Return a particular shopping list along with all list items and departments.'''

    serializer_class = ShoppingListDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [authentication.TokenAuthentication]
    
    def get_queryset(self):
        user_lists = ShoppingList.objects.filter(user=self.request.user, id=self.kwargs['pk'])
        shared_lists = ShoppingList.objects.filter(shares=self.request.user, id=self.kwargs['pk'])
        queryset = user_lists | shared_lists
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class UserCreate(CreateAPIView):
    '''Register a new user.'''

    queryset=User.objects.all()
    serializer_class = UserSerializer


class UserList(ListAPIView):
    '''List all usernames.'''

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [authentication.TokenAuthentication]


class UserDetail(RetrieveAPIView):
    '''Return a particular user.'''

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [authentication.TokenAuthentication]


class CustomAuthToken(ObtainAuthToken):
    '''Returns an auth token and user info when the user logs in with username and password.'''

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': {
                'id': user.pk,
                'username': user.username
            }
        })
