from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Department, ShoppingList, ShoppingListItem

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    # departments = serializers.PrimaryKeyRelatedField(many=True, queryset=Department.objects.all())
    # shopping_lists = serializers.PrimaryKeyRelatedField(many=True, queryset=ShoppingList.objects.all())
    # list_items = serializers.PrimaryKeyRelatedField(many=True, queryset=ShoppingListItem.objects.all())
    
    class Meta:
        model = User
        # fields = ['id', 'username', 'departments', 'shopping_lists', 'list_items']
        fields = ['id', 'username', 'password']
        # exclude = ['password',]

    def create(self, validated_data):
        user = super(UserSerializer, self).create(validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user


class DepartmentSerializer(serializers.ModelSerializer):
    added_by = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Department
        fields = ['id', 'user', 'added_by', 'name', 'shopping_list']


class DepartmentDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'user', 'name', 'shopping_list']


class ShoppingListItemSerializer(serializers.ModelSerializer):
    added_by = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = ShoppingListItem
        fields = ['id', 'user', 'added_by', 'shopping_list', 'item', 'quantity', 'department', 'on_list']


class ShoppingListItemDetailSerializer(serializers.ModelSerializer):
    added_by = serializers.ReadOnlyField(source='user.username')
    
    class Meta:
        model = ShoppingListItem
        fields = ['id', 'user', 'added_by', 'shopping_list', 'item', 'quantity', 'department', 'on_list']


class ShoppingListSerializer(serializers.ModelSerializer):
    list_owner = serializers.ReadOnlyField(source='user.username')
    shares = UserSerializer(read_only=True, many=True)

    class Meta:
        model = ShoppingList
        fields = ['id', 'user', 'list_owner', 'name', 'shares']


class ShoppingListRUDSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShoppingList
        fields = ['id', 'user', 'name', 'shares']


class ShoppingListDetailSerializer(serializers.ModelSerializer):
    departments = DepartmentSerializer(many=True, read_only=True)
    list_items = ShoppingListItemSerializer(many=True, read_only=True)
    shares = UserSerializer(read_only=True, many=True)


    class Meta:
        model = ShoppingList
        fields = ['id', 'user', 'name', 'shares', 'list_items', 'departments']
