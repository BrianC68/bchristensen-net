from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Department(models.Model):
    '''Model that holds store departments used in categorizing the shopping list.'''

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='departments')
    name = models.CharField(max_length=255)
    shopping_list = models.ForeignKey('ShoppingList', on_delete=models.CASCADE, related_name='departments')

    class Meta:
        # Default ordering by department name ascending
        ordering = ['name']
        # Prevent duplicate entries
        unique_together = ['user', 'name', 'shopping_list']

    def __str__(self):
        return f'{self.name}: {self.shopping_list}'


class ShoppingList(models.Model):
    '''Model that holds a users shopping lists.'''
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shopping_lists')
    name = models.CharField(max_length=255)
    shares = models.ManyToManyField(User, blank=True)

    class Meta:
        # Default ordering by shopping list name ascending
        ordering = ['name']
        # Prevent duplicate entries
        unique_together = ['user', 'name']

    def __str__(self):
        return self.name


class ShoppingListItem(models.Model):
    '''Model that holds shopping list items.'''

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='list_items')
    shopping_list = models.ForeignKey(ShoppingList, on_delete=models.CASCADE, related_name='list_items')
    item = models.CharField(max_length=255)
    quantity = models.IntegerField(default=1, blank=False, null=False)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, blank=True, null=True)
    on_list = models.BooleanField(default=True)

    class Meta:
        # Default ordering by department name ascending
        ordering = ['department']
        # Prevent duplicate entries
        unique_together = ['user', 'item', 'shopping_list']


class UserProfile(models.Model):
    '''Model that holds additional user information, including Push Notification token.'''

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='profile')
    push_token = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        unique_together = ['user', 'push_token']
        
