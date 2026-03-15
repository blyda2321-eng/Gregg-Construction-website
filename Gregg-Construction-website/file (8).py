"""
Gregg Construction - Project Models
"""

from django.db import models
from django.conf import settings


class ClimateZone(models.Model):
    """Climate zone definitions"""
    
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    min_temp = models.IntegerField(null=True, blank=True)
    max_temp = models.IntegerField(null=True, blank=True)
    humidity_level = models.CharField(max_length=50, blank=True)
    
    def __str__(self):
        return f"Zone {self.code}: {self.name}"


class ZipCodeClimate(models.Model):
    """Maps zip codes to climate zones"""
    
    zip_code = models.CharField(max_length=10, unique=True)
    climate_zone = models.ForeignKey(ClimateZone, on_delete=models.CASCADE)
    state = models.CharField(max_length=2)
    city = models.CharField(max_length=100)
    county = models.CharField(max_length=100, blank=True)
    tax_rate = models.DecimalField(max_digits=6, decimal_places=4, default=0.0000)
    
    def __str__(self):
        return f"{self.zip_code} - {self.city}, {self.state}"


class Project(models.Model):
    """Main project model"""
    
    PROJECT_TYPE_CHOICES = [
        ('new_residential', 'New Residential Home'),
        ('residential_remodel', 'Residential Remodel/Addition'),
        ('commercial', 'Commercial Building'),
        ('multi_unit', 'Multi-Unit Housing'),
        ('custom_design', 'Custom Design-Build'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('design', 'Design Phase'),
        ('review', 'Contractor Review'),
        ('estimate', 'Estimate Phase'),
        ('approved', 'Client Approved'),
        ('build', 'Build Phase'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    STYLE_CHOICES = [
        ('ranch', 'Ranch'),
        ('colonial', 'Colonial'),
        ('modern', 'Modern'),
        ('craftsman', 'Craftsman'),
        ('contemporary', 'Contemporary'),
        ('mediterranean', 'Mediterranean'),
        ('victorian', 'Victorian'),
        ('farmhouse', 'Farmhouse'),
        ('industrial', 'Industrial'),
        ('minimalist', 'Minimalist'),
        ('traditional', 'Traditional'),
        ('custom', 'Custom'),
    ]
    
    # Basic Info
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='projects'
    )
    project_name = models.CharField(max_length=200)
    project_type = models.CharField(max_length=50, choices=PROJECT_TYPE_CHOICES)
    style = models.CharField(max_length=50, choices=STYLE_CHOICES, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    
    # Location
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=50)
    zip_code = models.CharField(max_length=10)
    climate_zone = models.ForeignKey(
        ClimateZone,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    
    # Specifications
    square_footage = models.IntegerField(null=True, blank=True)
    num_floors = models.IntegerField(default=1)
    num_bedrooms = models.IntegerField(null=True, blank=True)
    num_bathrooms = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True)
    garage_spaces = models.IntegerField(default=0)
    
    # Dates
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    target_start_date = models.DateField(null=True, blank=True)
    target_completion_date = models.DateField(null=True, blank=True)
    
    # Notes
    client_notes = models.TextField(blank=True)
    contractor_notes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Project'
        verbose_name_plural = 'Projects'
    
    def __str__(self):
        return f"{self.project_name} - {self.owner.get_full_name()}"
    
    def save(self, *args, **kwargs):
        # Auto-assign climate zone based on zip code
        if self.zip_code and not self.climate_zone:
            try:
                zip_climate = ZipCodeClimate.objects.get(zip_code=self.zip_code)
                self.climate_zone = zip_climate.climate_zone
            except ZipCodeClimate.DoesNotExist:
                pass
        super().save(*args, **kwargs)
    
    @property
    def tax_rate(self):
        """Get tax rate for project location"""
        try:
            zip_climate = ZipCodeClimate.objects.get(zip_code=self.zip_code)
            return zip_climate.tax_rate
        except ZipCodeClimate.DoesNotExist:
            return 0.0


class ProjectImage(models.Model):
    """Images/inspiration photos for projects"""
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='project_images/')
    caption = models.CharField(max_length=200, blank=True)
    is_inspiration = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Image for {self.project.project_name}"


class ProjectDocument(models.Model):
    """Documents attached to projects"""
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='documents')
    document = models.FileField(upload_to='project_documents/')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} - {self.project.project_name}"
