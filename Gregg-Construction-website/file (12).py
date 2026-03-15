"""
Gregg Construction - Materials Models
"""

from django.db import models
from projects.models import ClimateZone


class MaterialCategory(models.Model):
    """Categories for organizing materials"""
    
    CATEGORY_TYPE_CHOICES = [
        ('exterior', 'Exterior'),
        ('interior', 'Interior'),
        ('mechanical', 'Mechanical'),
        ('premium', 'Premium/Smart Home'),
        ('landscaping', 'Landscaping'),
    ]
    
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    category_type = models.CharField(max_length=50, choices=CATEGORY_TYPE_CHOICES)
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='subcategories'
    )
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)  # Icon class name
    display_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    # Project type restrictions
    available_for_residential = models.BooleanField(default=True)
    available_for_commercial = models.BooleanField(default=True)
    
    class Meta:
        verbose_name_plural = 'Material Categories'
        ordering = ['display_order', 'name']
    
    def __str__(self):
        if self.parent:
            return f"{self.parent.name} > {self.name}"
        return self.name


class Vendor(models.Model):
    """Vendor/Supplier information"""
    
    name = models.CharField(max_length=200)
    website = models.URLField(blank=True)
    api_endpoint = models.URLField(blank=True)
    api_key = models.CharField(max_length=200, blank=True)
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=20, blank=True)
    account_number = models.CharField(max_length=100, blank=True)
    notes = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    last_price_update = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return self.name


class Brand(models.Model):
    """Product brands"""
    
    name = models.CharField(max_length=100, unique=True)
    logo = models.ImageField(upload_to='brand_logos/', blank=True, null=True)
    website = models.URLField(blank=True)
    description = models.TextField(blank=True)
    is_premium = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Material(models.Model):
    """Individual material/product items"""
    
    TIER_CHOICES = [
        ('standard', 'Standard'),
        ('premium', 'Premium'),
        ('luxury', 'Luxury'),
    ]
    
    # Basic Info
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    category = models.ForeignKey(
        MaterialCategory,
        on_delete=models.CASCADE,
        related_name='materials'
    )
    brand = models.ForeignKey(
        Brand,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='materials'
    )
    
    # Client-visible information
    client_description = models.TextField()  # User-friendly description
    features = models.TextField(blank=True)  # Bullet points for clients
    image = models.ImageField(upload_to='materials/', blank=True, null=True)
    tier = models.CharField(max_length=20, choices=TIER_CHOICES, default='standard')
    
    # Contractor-only information
    model_number = models.CharField(max_length=100, blank=True)
    sku = models.CharField(max_length=100, blank=True)
    vendor = models.ForeignKey(Vendor, on_delete=models.SET_NULL, null=True, blank=True)
    vendor_url = models.URLField(blank=True)
    
    # Pricing (contractor only)
    unit_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    unit_type = models.CharField(max_length=50, default='each')  # each, sqft, linear ft, etc.
    labor_cost_per_unit = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    # Specifications
    specifications = models.JSONField(default=dict, blank=True)
    warranty_info = models.TextField(blank=True)
    
    # Climate zone compatibility
    climate_zones = models.ManyToManyField(
        ClimateZone,
        blank=True,
        related_name='compatible_materials'
    )
    all_climate_zones = models.BooleanField(default=True)  # If true, available everywhere
    
    # Availability
    is_active = models.BooleanField(default=True)
    in_stock = models.BooleanField(default=True)
    lead_time_days = models.IntegerField(default=0)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_price_update = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['category', 'tier', 'name']
    
    def __str__(self):
        brand_name = self.brand.name if self.brand else "Generic"
        return f"{brand_name} - {self.name}"
    
    def is_compatible_with_zone(self, climate_zone):
        """Check if material is compatible with a climate zone"""
        if self.all_climate_zones:
            return True
        return self.climate_zones.filter(id=climate_zone.id).exists()


class MaterialImage(models.Model):
    """Additional images for materials"""
    
    material = models.ForeignKey(Material, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='material_images/')
    caption = models.CharField(max_length=200, blank=True)
    is_primary = models.BooleanField(default=False)
    display_order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['display_order']
    
    def __str__(self):
        return f"Image for {self.material.name}"


class SmartHomeSystem(models.Model):
    """Smart home and automation systems"""
    
    SYSTEM_TYPE_CHOICES = [
        ('whole_home', 'Whole Home Control'),
        ('lighting', 'Lighting Control'),
        ('climate', 'Climate Control'),
        ('security', 'Security System'),
        ('audio', 'Audio/Video'),
        ('shades', 'Motorized Shades'),
        ('fireplace', 'Fireplace Control'),
        ('garage', 'Garage/Access'),
        ('outdoor', 'Outdoor Living'),
    ]
    
    name = models.CharField(max_length=200)
    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True)
    system_type = models.CharField(max_length=50, choices=SYSTEM_TYPE_CHOICES)
    
    # Client info
    client_description = models.TextField()
    features = models.TextField()
    image = models.ImageField(upload_to='smart_home/', blank=True, null=True)
    
    # Contractor info
    model_number = models.CharField(max_length=100, blank=True)
    base_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    installation_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    vendor = models.ForeignKey(Vendor, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Compatibility
    compatible_with = models.ManyToManyField('self', blank=True)
    requires_hub = models.BooleanField(default=False)
    hub_system = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='connected_devices'
    )
    
    # Climate compatibility
    outdoor_rated = models.BooleanField(default=False)
    min_operating_temp = models.IntegerField(null=True, blank=True)
    max_operating_temp = models.IntegerField(null=True, blank=True)
    
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['system_type', 'brand', 'name']
    
    def __str__(self):
        return f"{self.brand.name if self.brand else 'Generic'} - {self.name}"


class PricingHistory(models.Model):
    """Track pricing changes over time"""
    
    material = models.ForeignKey(
        Material,
        on_delete=models.CASCADE,
        related_name='pricing_history'
    )
    old_price = models.DecimalField(max_digits=12, decimal_places=2)
    new_price = models.DecimalField(max_digits=12, decimal_places=2)
    changed_at = models.DateTimeField(auto_now_add=True)
    source = models.CharField(max_length=100, blank=True)  # API, manual, etc.
    
    class Meta:
        ordering = ['-changed_at']
    
    def __str__(self):
        return f"{self.material.name}: ${self.old_price} → ${self.new_price}"
