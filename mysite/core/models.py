from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class Product(models.Model):
    product_name=models.CharField(max_length=100)
    product_quantity=models.CharField(max_length=100)
    product_details=models.CharField(max_length=200)
    def __str__(self):
        return self.product_name
class Profile(models.Model):
    user=models.OneToOneField(User,on_delete=models.CASCADE)
    typeofuser=models.CharField(max_length=100)
    wallet=models.CharField(max_length=100)
    