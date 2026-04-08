from django.db import models

#Contact us model
class ContactUs(models.Model):
    SUBJECT_CHOICES = [
        ('product', 'Product Enquiry'),
        ('booking', 'Booking Help'),
        ('delivery', 'Delivery & Logistics'),
        ('returns', 'Returns & Warranty'),
        ('b2b', 'Partnership / B2B'),
        ('other', 'Other'),
    ]

    first_name = models.CharField(max_length=50)
    last_name =  models.CharField(max_length=50)
    email =  models.EmailField()
    phone = models.CharField(max_length=15)
    subject = models.CharField(max_length=20,choices=SUBJECT_CHOICES)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "contact_us"   # ✅ your custom table name
        ordering = ['-created_at']  # optional but recommended

    def __str__(self):
        return f"{self.first_name} - {self.subject}"


