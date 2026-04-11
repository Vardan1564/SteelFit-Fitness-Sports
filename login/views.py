from django.shortcuts import render

# Create your views here.
def profile(request):
    return render(request,'login/profile.html')

def login(request):
    return render(request,'login/login.html')

def register(request):
    return render(request,'login/register.html')