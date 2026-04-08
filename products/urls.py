from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('',views.products, name='products'),
    path('home/',views.home, name='home'),
    path('product_detail/',views.product_detail, name='product_detail'),
]
