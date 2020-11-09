from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Department, ShoppingList, ShoppingListItem

User = get_user_model()


class DepartmentSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Department
        fields = ['id', 'user', 'name', 'shopping_list']


class DepartmentDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'user', 'name', 'shopping_list']


class ShoppingListItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShoppingListItem
        fields = ['id', 'user', 'shopping_list', 'item', 'quantity', 'department', 'on_list']


class ShoppingListItemDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShoppingListItem
        fields = ['id', 'user', 'shopping_list', 'item', 'quantity', 'department', 'on_list']


class ShoppingListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShoppingList
        fields = ['id', 'user', 'name']


class ShoppingListRUDSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShoppingList
        fields = ['id', 'user', 'name']


class ShoppingListDetailSerializer(serializers.ModelSerializer):
    departments = DepartmentSerializer(many=True, read_only=True)
    list_items = ShoppingListItemSerializer(many=True, read_only=True)

    class Meta:
        model = ShoppingList
        fields = ['id', 'user', 'name', 'list_items', 'departments']

    # Todo: override create() to handle saving departments and list items


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    # departments = serializers.PrimaryKeyRelatedField(many=True, queryset=Department.objects.all())
    # shopping_lists = serializers.PrimaryKeyRelatedField(many=True, queryset=ShoppingList.objects.all())
    # list_items = serializers.PrimaryKeyRelatedField(many=True, queryset=ShoppingListItem.objects.all())
    
    class Meta:
        model = User
        # fields = ['id', 'username', 'departments', 'shopping_lists', 'list_items']
        fields = ['id', 'username', 'password']

    def create(self, validated_data):
        user = super(UserSerializer, self).create(validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user
