from django.shortcuts import render,get_object_or_404,redirect
from . import models
from django.db.models import Count
from django.contrib.auth.decorators import login_required
from .forms import FeedbackForm
from django.contrib import messages



# Create your views here.
@login_required
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
        models.Products.objects.prefetch_related('category','images','feedbacks__user'),
        id = id
    )
    reviews = product.feedbacks.select_related('user')
    return render(request,'products/product_detail.html',{'product':product,'reviews':reviews})

@login_required
def feedback(request):
    if request.method=="POST":
       form = FeedbackForm(request.POST)

       if form.is_valid():
           feedback = form.save(commit=False)
           models.Feedback.objects.update_or_create(
               product=feedback.product,
               user=request.user,
               defaults={
                   'rating': feedback.rating,
                   'message': feedback.message,
               },
           )
           messages.success(request,"Feedback submitted")

           return redirect(request.META.get('HTTP_REFERER','/'))
       else:
           messages.error(request,"Unable to submit feedback. Please try again.")
           return redirect(request.META.get('HTTP_REFERER','/'))

    return redirect('products')


