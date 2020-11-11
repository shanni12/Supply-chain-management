import uuid
from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Product(models.Model):
    owner = models.CharField(max_length=100)
    product_name = models.CharField(max_length=100)
    product_quantity = models.CharField(max_length=100)
    product_details = models.CharField(max_length=200)
    is_available = models.BooleanField(default=True)
    sent_by = models.CharField(max_length=100, null=True)
    product_id = models.UUIDField(primary_key=True, default=uuid.uuid4)

    def __str__(self):
        return self.product_name


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    type_of_user = models.CharField(max_length=100)

