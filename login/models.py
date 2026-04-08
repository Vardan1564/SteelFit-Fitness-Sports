from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

#USER TABLE EXTRA FIELDS
class Profile(models.Model):
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name="profile"
    )
    phone = models.CharField(max_length=15)
    address = models.TextField()
    image = models.ImageField(upload_to='profile/', null=True, blank=True)

    def __str__(self):
        return self.user.username