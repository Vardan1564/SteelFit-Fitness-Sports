from django.shortcuts import render,redirect
from django.contrib import messages
from .forms import ContactForm

# Create your views here.
def contactus(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)

        if form.is_valid():
            form.save()
            messages.success(request, "Message sent! We'll get back to you shortly.")
            return redirect('contactus')
    else:
        form = ContactForm()
    return render(request, 'contactUs/contactus.html', {'form' : form})

