from django.urls.conf import include
from django.urls import path, include
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

urlpatterns = [
    path('shopping-lists/', views.ShoppingLists.as_view()),
    path('shopping-list/<pk>/', views.ShoppingListRUD.as_view()),
    path('shopping-list/<pk>/detail/', views.ShoppingListDetail.as_view()),
    path('shopping-list/<pk>/depts/', views.DepartmentList.as_view()),
    path('shopping-list/dept/<pk>/', views.DepartmentDetail.as_view()),
    path('shopping-list/<pk>/items/', views.ShoppingListItems.as_view()),
    path('shopping-list/item/<pk>/', views.ShoppingListItemDetail.as_view()),
    path('users/', views.UserList.as_view()),
    path('users/register/', views.UserCreate.as_view()),
    path('users/<pk>/', views.UserDetail.as_view()),
]

urlpatterns += [
    path('users/auth/', include('rest_framework.urls')),
    path('users/auth/token/', views.CustomAuthToken.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
