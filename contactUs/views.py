from django.shortcuts import render
from django.contrib import messages
from .forms import ContactForm

# Create your views here.
def contactus(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)

        if form.is_valid():
            form.save()
            messages.success(request,"Message sent successfully!")
            return redirect('contact')

    else:
        form = ContactForm()

    return render(request, 'contactUs/contactus.html',{'form':form})


    
    
    