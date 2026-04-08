from django.contrib import admin

from .models import ContactUs

@admin.register(ContactUs)
class ContactUsAdmin(admin.ModelAdmin):
    list_display=['first_name','last_name','email','phone','subject','message','created_at']
    list_filter=['subject']
    search_fields = ['first_name']