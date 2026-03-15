"""
Gregg Construction - Estimates Models
"""

from django.db import models
from django.conf import settings
from projects.models import Project
from materials.models import Material, SmartHomeSystem


class ProjectSelection(models.Model):
    """Client material selections for a project"""
    
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='selections'
    )
    material = models.ForeignKey(
        Material,
        on_delete=models.CASCADE,
        related_name='project_selections'
    )
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=1)
    location_notes = models.CharField(max_length=200, blank=True)  # e.g., "Master Bathroom"
    client_notes = models.TextField(blank=True)
    contractor_notes = models.TextField(blank=True)
    is_approved = models.BooleanField(default=False)
    added_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['project', 'material__category']
    
    def __str__(self):
        return f"{self.project.project_name} - {self.material.name}"
    
    @property
    def material_cost(self):
        """Calculate total material cost"""
        return self.quantity * self.material.unit_cost
    
    @property
    def labor_cost(self):
        """Calculate total labor cost"""
        return self.quantity * self.material.labor_cost_per_unit
    
    @property
    def total_cost(self):
        """Calculate total cost (material + labor)"""
        return self.material_cost + self.labor_cost


class SmartHomeSelection(models.Model):
    """Client smart home selections for a project"""
    
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='smart_home_selections'
    )
    system = models.ForeignKey(
        SmartHomeSystem,
        on_delete=models.CASCADE,
        related_name='project_selections'
    )
    quantity = models.IntegerField(default=1)
    location_notes = models.CharField(max_length=200, blank=True)
    client_notes = models.TextField(blank=True)
    contractor_notes = models.TextField(blank=True)
    is_approved = models.BooleanField(default=False)
    added_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['project', 'system__system_type']
    
    def __str__(self):
        return f"{self.project.project_name} - {self.system.name}"
    
    @property
    def total_cost(self):
        return (self.system.base_cost + self.system.installation_cost) * self.quantity


class Estimate(models.Model):
    """Generated estimate for a project"""
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('pending', 'Pending Review'),
        ('sent', 'Sent to Client'),
        ('approved', 'Client Approved'),
        ('rejected', 'Client Rejected'),
        ('revised', 'Revision Requested'),
    ]
    
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='estimates'
    )
    version = models.IntegerField(default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    
    # Calculated totals
    materials_subtotal = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    labor_subtotal = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    smart_home_subtotal = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    subtotal = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    tax_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    markup_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=20.00)
    markup_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    
    # Client-visible total (may differ from actual)
    client_total = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    
    # Notes
    internal_notes = models.TextField(blank=True)
    client_notes = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_estimates'
    )
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Estimate #{self.id} - {self.project.project_name} v{self.version}"
    
    def calculate_totals(self):
        """Recalculate all estimate totals"""
        
        # Materials
        material_selections = self.project.selections.all()
        self.materials_subtotal = sum(s.material_cost for s in material_selections)
        self.labor_subtotal = sum(s.labor_cost for s in material_selections)
        
        # Smart home
        smart_selections = self.project.smart_home_selections.all()
        self.smart_home_subtotal = sum(s.total_cost for s in smart_selections)
        
        # Subtotal
        self.subtotal = self.materials_subtotal + self.labor_subtotal + self.smart_home_subtotal
        
        # Tax
        tax_rate = self.project.tax_rate
        self.tax_amount = self.materials_subtotal * tax_rate
        
        # Markup
        self.markup_amount = self.subtotal * (self.markup_percentage / 100)
        
        # Total
        self.total = self.subtotal + self.tax_amount + self.markup_amount
        
        # Client total (can be adjusted separately)
        if self.client_total == 0:
            self.client_total = self.total
        
        self.save()


class EstimateLineItem(models.Model):
    """Detailed line items in an estimate"""
    
    estimate = models.ForeignKey(
        Estimate,
        on_delete=models.CASCADE,
        related_name='line_items'
    )
    category = models.CharField(max_length=100)
    description = models.CharField(max_length=300)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=50)
    unit_cost = models.DecimalField(max_digits=12, decimal_places=2)
    labor_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=14, decimal_places=2)
    
    # Hidden from client
    vendor_info = models.TextField(blank=True)
    actual_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    class Meta:
        ordering = ['category', 'description']
    
    def __str__(self):
        return f"{self.description} - ${self.total}"


class Takeoff(models.Model):
    """Material takeoff/purchase list for contractor"""
    
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='takeoffs'
    )
    estimate = models.ForeignKey(
        Estimate,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='takeoffs'
    )
    name = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    compiled_data = models.JSONField(default=dict)
    total_cost = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    notes = models.TextField(blank=True)
    
    def __str__(self):
        return f"Takeoff: {self.name} - {self.project.project_name}"
    
    def compile_materials(self):
        """Compile all project selections into organized takeoff"""
        
        selections = self.project.selections.all()
        organized = {}
        
        for selection in selections:
            category = selection.material.category.name
            if category not in organized:
                organized[category] = []
            
            organized[category].append({
                'material': selection.material.name,
                'brand': selection.material.brand.name if selection.material.brand else 'Generic',
                'model': selection.material.model_number,
                'sku': selection.material.sku,
                'quantity': float(selection.quantity),
                'unit': selection.material.unit_type,
                'unit_cost': float(selection.material.unit_cost),
                'total_cost': float(selection.material_cost),
                'vendor': selection.material.vendor.name if selection.material.vendor else 'TBD',
                'vendor_url': selection.material.vendor_url,
                'location': selection.location_notes,
            })
        
        self.compiled_data = organized
        self.total_cost = sum(s.total_cost for s in selections)
        self.save()
