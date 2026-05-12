from django.shortcuts import render,redirect
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth import login as auth_login
from django.contrib.auth import authenticate,logout


# Create your views here.
def profile(request):
    return render(request,'login/profile.html')


# login system
def login(request):
    if request.method == "POST":
        username = request.POST.get('username')
        password = request.POST.get('password')

        # check user 
        user = authenticate(
            request,
            username = username,
            password = password
        )

        if user is not None:
            # login user
            auth_login(request, user)

            messages.success(request, "Login Successful")

            return redirect('home')
        else :
            messages.error(request, "Invalid username or Password")
            return redirect('login')

    return render(request,'login/login.html')


# register system
def register(request):
    if request.method == "POST":
        # get data from user 
        username = request.POST.get('username')
        email = request.POST.get('email')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')

        if password1 != password2:
            messages.error(request, "Password do not match")
            return redirect('register')
        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already exists")
            return redirect('register')

        # creating user 
        user = User.objects.create_user(
            username= username,
            email=email,
            password=password1
        )

        # Auto login user after register
        auth_login(request, user)

        messages.success(request, "Account created successfully")

        return redirect('home')

    return render(request,'login/register.html')


#logout system

def logout_view(request):

    logout(request)

    messages.success(request,"Logged out successfully")

    return redirect('home')
