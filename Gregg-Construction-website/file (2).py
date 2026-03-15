"""
Gregg Construction - User Account Models
"""

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom user model for Gregg Construction"""
    
    ROLE_CHOICES = [
        ('client', 'Client'),
        ('contractor', 'Contractor'),
        ('admin', 'Administrator'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='client')
    phone = models.CharField(max_length=20, blank=True)
    company_name = models.CharField(max_length=200, blank=True)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=50, blank=True)
    zip_code = models.CharField(max_length=10, blank=True)
    profile_image = models.ImageField(upload_to='profiles/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.role})"
    
    @property
    def is_contractor(self):
        return self.role in ['contractor', 'admin']
    
    @property
    def is_client(self):
        return self.role == 'client'


class ClientProfile(models.Model):
    """Extended profile for clients"""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='client_profile')
    preferred_contact_method = models.CharField(max_length=20, default='email')
    notes = models.TextField(blank=True)
    
    def __str__(self):
        return f"Client Profile: {self.user.get_full_name()}"


class ContractorProfile(models.Model):
    """Extended profile for contractors"""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='contractor_profile')
    license_number = models.CharField(max_length=100, blank=True)
    insurance_info = models.TextField(blank=True)
    default_markup_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=20.00)
    
    def __str__(self):
        return f"Contractor Profile: {self.user.get_full_name()}"
