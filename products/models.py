from django.db import models
from django.contrib.auth import get_user_model

#“Use the user table of THIS project”

User = get_user_model()

# Category Table - choose mutiple category
class Categories(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

# PRODUCT TABLE - store product basic information
class Products(models.Model):
    name = models.CharField(max_length=50)
    category = models.ManyToManyField(Categories, related_name='products', db_table='product_categories')
    image= models.ImageField(upload_to='product/cover_image/')
    description = models.TextField()
    original_price=models.DecimalField(max_digits=10,decimal_places=2)
    discount_price=models.DecimalField(max_digits=10,decimal_places=2)
    material=models.CharField(max_length=30)
    warranty=models.CharField(max_length=20)
    is_in_stock=models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "products"
        ordering = ['-created_at']

    def __str__(self):
        return self.name

#STORE MULTIPLE IMAGES FOR PRODUCT
class ProductImage(models.Model):
    product = models.ForeignKey(Products, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='product/gallery/')

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "product_images"
        ordering = ['-created_at']
        verbose_name = "Product Image"
        verbose_name_plural = "Product Images"

    def __str__(self):
        return self.product.name
    
#BOOKING TABLE 
class Booking(models.Model):
    STATUS_CHOICES = [
    ("pending", "Pending"),
    ("confirmed", "Confirmed"),
    ("shipped", "Shipped"),
    ("delivered", "Delivered"),
    ("cancelled", "Cancelled"),
    ]
    
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    product=models.ForeignKey(Products,on_delete=models.CASCADE,related_name='bookings')

    name = models.CharField(max_length=50)
    phone = models.CharField(max_length=15)
    email = models.EmailField()
    address = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "bookings"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username}-{self.product.name}"

#FEEDBACK TABLE-STORE USER FEEDBACK
class Feedback(models.Model):
    product = models.ForeignKey(Products, on_delete=models.CASCADE, related_name='feedbacks')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    RATING_CHOICES = [
        (1, "⭐"),
        (2, "⭐⭐"),
        (3, "⭐⭐⭐"),
        (4, "⭐⭐⭐⭐"),
        (5, "⭐⭐⭐⭐⭐"),
    ]
    rating = models.IntegerField(choices=RATING_CHOICES, default=5)
    message = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "feedbacks"
        ordering = ['-created_at']
        verbose_name = "Feedback"
        verbose_name_plural = "Feedbacks"
        unique_together = ['product', 'user']   # 🔥 one user → one feedback per product

    def __str__(self):
        return f"{self.user.username} - {self.product.name}"