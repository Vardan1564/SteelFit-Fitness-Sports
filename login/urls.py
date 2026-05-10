from django.contrib import admin
from django.urls import path
from . import views
from django.contrib.auth.models import User

urlpatterns = [
    path('profile/',views.profile, name='profile'),
    path('login/', views.login, name='login'),
    path('register/', views.register, name='register'),
    path('logout/',views.logout_view,name='logout'),

]
