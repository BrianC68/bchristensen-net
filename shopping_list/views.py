from django.contrib.auth import get_user_model
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.generics import ListAPIView, ListCreateAPIView, RetrieveAPIView, \
                    RetrieveUpdateDestroyAPIView, CreateAPIView
from rest_framework import permissions, authentication, status
from rest_framework.serializers import ListSerializer
from rest_framework.status import HTTP_404_NOT_FOUND
from .models import Department, ShoppingList, ShoppingListItem, UserProfile
from .serializers import DepartmentDetailSerializer, DepartmentSerializer, \
                    ShoppingListRUDSerializer, ShoppingListSerializer, \
                    ShoppingListItemSerializer, ShoppingListDetailSerializer, \
                    ShoppingListItemDetailSerializer, UserProfileSerializer, UserSerializer

import requests
import json

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

    def send_push_notification(self, share_user_id, sender, list_title):
        headers = {
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip, deflate',
            'Content-Type': 'application/json'
        }

        push_token = UserProfile.objects.get(user=share_user_id).push_token
        
        if push_token is not None:
            body = {
                'to': push_token,
                'title': 'sh@ppinglist Notification',
                'body': f'{sender} has shared a list with you,  {list_title}.',
                'data': { 'sender': sender },
                'sound': 'default',
                'channelId': 'sh@ppingListShare',
            }
            body_json = json.dumps(body)

            try:
                r = requests.post('https://exp.host/--/api/v2/push/send', data=body_json, headers=headers)
                # print(r)
            except requests.exceptions.RequestException as err:
                # print(err)
                pass

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
                    self.send_push_notification(share_user.id, request.user.username, request.data['name']) # Send push notification to shared user
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

    def send_push_notifications(self, push_tokens, sender, list_title, list_item):
        headers = {
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip, deflate',
            'Content-Type': 'application/json'
        }

        for token in push_tokens:
            body = {
                'to': token,
                'title': 'sh@ppinglist Notification',
                'body': f'{sender} has added {list_item} to {list_title}',
                'data': { 'sender': sender },
                'sound': 'default',
                'channelId': 'sh@ppingList',
            }
            body_json = json.dumps(body)

            try:
                r = requests.post('https://exp.host/--/api/v2/push/send', data=body_json, headers=headers)
                # print(r)
            except requests.exceptions.RequestException as err:
                # print(err)
                pass

    def get_queryset(self):
        user_items = ShoppingListItem.objects.filter(shopping_list=self.kwargs['pk'], user=self.request.user)
        shared_items = ShoppingListItem.objects.filter(shopping_list=self.kwargs['pk'], shopping_list__shares=self.request.user)
        queryset = user_items |shared_items
        return queryset

    def perform_create(self, serializer):
        notifications = self.request.data['notifications']
        if notifications:
            data = dict(serializer.validated_data.items())
            # adding_item = data['on_list']
            sender = self.request.user.username
            sender_id = self.request.user.id
            list_title = data['shopping_list']
            list_item = data['item']
            list_owner = ShoppingList.objects.get(id=data['shopping_list'].id).user.id
            list_shares = [list_owner]
            shares = list(ShoppingList.objects.filter(id=data['shopping_list'].id).values_list('shares', flat=True))
            if notifications:
                for share in shares:
                    if share not in list_shares:
                        list_shares.append(share)
            list_shares.remove(sender_id) # remove the sender, don't need to notify the sender of the notification
            # print(list_shares)

            push_tokens = UserProfile.objects.filter(user__in=list_shares, push_token__isnull=False).values_list('push_token', flat=True)
            # print(push_tokens)
            if len(push_tokens) >= 1:
                self.send_push_notifications(push_tokens, sender, list_title, list_item)

        serializer.save(user=self.request.user)


class ShoppingListItemDetail(RetrieveUpdateDestroyAPIView):
    '''Retrieve, update or delete shopping list item.'''

    serializer_class = ShoppingListItemDetailSerializer
    queryset = ShoppingListItem.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [authentication.TokenAuthentication]

    def send_push_notifications(self, push_tokens, sender, list_title, list_item):
        headers = {
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip, deflate',
            'Content-Type': 'application/json'
        }

        for token in push_tokens:
            body = {
                'to': token,
                'title': 'sh@ppinglist Notification',
                'body': f'{sender} has added or updated {list_item} on {list_title}',
                'data': { 'sender': sender },
                'sound': 'default',
                'channelId': 'sh@ppingList',
            }
            body_json = json.dumps(body)

            try:
                r = requests.post('https://exp.host/--/api/v2/push/send', data=body_json, headers=headers)
                # print(r)
            except requests.exceptions.RequestException as err:
                # print(err)
                pass

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        notifications = self.request.data['notifications']
        if notifications:
            data = dict(serializer.validated_data.items())
            adding_item = data['on_list']
            sender = self.request.user.username
            sender_id = self.request.user.id
            list_title = data['shopping_list']
            list_item = data['item']
            list_owner = ShoppingList.objects.get(id=data['shopping_list'].id).user.id
            list_shares = [list_owner]
            shares = list(ShoppingList.objects.filter(id=data['shopping_list'].id).values_list('shares', flat=True))
            for share in shares:
                if share not in list_shares:
                    list_shares.append(share)
            list_shares.remove(sender_id) # remove the sender, don't need to notify the sender of the notification
            # print(list_shares)

            push_tokens = UserProfile.objects.filter(user__in=list_shares, push_token__isnull=False).values_list('push_token', flat=True)
            if notifications:
                if len(push_tokens) >= 1 and adding_item:
                    self.send_push_notifications(push_tokens, sender, list_title, list_item)

        return super().perform_update(serializer)


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


class UserProfileDetail(RetrieveUpdateDestroyAPIView):
    '''Retrieve, update or destroy user profile fields.'''

    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [authentication.TokenAuthentication]

    def get_queryset(self):
        queryset = UserProfile.objects.filter(user=self.request.user, id=self.kwargs['pk'])
        queryset.filter(user=self.request.user)
        return queryset


class CustomAuthToken(ObtainAuthToken):
    '''Returns an auth token and user info when the user logs in with username and password.'''

    def post(self, request, *args, **kwargs):

        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        # create user profile for storing push token
        profile, created = UserProfile.objects.get_or_create(user=user)

        return Response({
            'token': token.key,
            'user': {
                'id': user.pk,
                'username': user.username,
                'push_token': profile.push_token,
                'profile_id': profile.pk
            }
        })
