from django.shortcuts import render
from . import models
from django.db.models import Count

# Create your views here.
def products(request):
    products = models.Products.objects.prefetch_related('category','images')
    categories = models.Categories.objects.annotate(
        count=Count('products')   # 🔥 count products in each category
    )
    return render(request,'products/products.html',{'products':products,'categories':categories})

def home(request):
    return render(request,'home.html')

def product_detail(request):
    return render(request,'products/product_detail.html')