from django.http import HttpResponse
from django.shortcuts import render

def home(request):
    # return HttpResponse("hello, world. this is home page")
    return render(request, 'baseLayout.html')

def aboutus(request):
    # return HttpResponse("hello, world. this is home page")
    return render(request, 'aboutus.html')

