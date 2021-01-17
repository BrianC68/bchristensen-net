from django.contrib import admin
from .models import Department, ShoppingList, ShoppingListItem, UserProfile


class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['user', 'name', 'shopping_list']


class ShoppingListAdmin(admin.ModelAdmin):
    list_display = ['user', 'name']


class ShoppingListItemAdmin(admin.ModelAdmin):
    list_display = ['user', 'shopping_list', 'item', 'quantity', 'department', 'on_list']

class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'push_token']


admin.site.register(Department, DepartmentAdmin)
admin.site.register(ShoppingList, ShoppingListAdmin)
admin.site.register(ShoppingListItem, ShoppingListItemAdmin)
admin.site.register(UserProfile, UserProfileAdmin)
