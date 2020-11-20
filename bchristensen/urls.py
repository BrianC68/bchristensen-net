from django.contrib import admin
from django.urls import path
from django.urls.conf import include
# from core import views

urlpatterns = [
    # path('', views.index, name='index'),
    path('admin/', admin.site.urls),
    path('api/', include('shopping_list.urls')),
    # path('shopping-list-api/', views.index),
    # path('manifest.json', views.manifest),

]
