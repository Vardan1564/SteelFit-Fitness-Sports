from django.shortcuts import render,get_object_or_404
from . import models
from django.db.models import Count

# Create your views here.
def products(request):
    products = models.Products.objects.prefetch_related('category','images')
    categories = models.Categories.objects.annotate(
        count=Count('products')   #Count products in each category
    )
    return render(request,'products/products.html',{'products':products,'categories':categories})

def home(request):
    return render(request,'home.html')

def product_detail(request, id):
    product = get_object_or_404(
        models.Products.objects.prefetch_related('category','images'),
        id = id
    )
    return render(request,'products/product_detail.html',{'product':product})