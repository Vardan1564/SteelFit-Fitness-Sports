from django import forms
from .models import ContactUs

class ContactForm(forms.ModelForm):
    class Meta():
        model = ContactUs
        fields = ['first_name','last_name','email','phone','subject','message']
