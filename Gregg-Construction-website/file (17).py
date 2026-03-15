"""
Gregg Construction - Estimates Serializers
"""

from rest_framework import serializers
from .models import (
    ProjectSelection, SmartHomeSelection,
    Estimate, EstimateLineItem, Takeoff
)
from materials.serializers import (
    MaterialClientSerializer, MaterialContractorSerializer,
    SmartHomeClientSerializer, SmartHomeContractorSerializer
)


class ProjectSelectionClientSerializer(serializers.ModelSerializer):
    """Selection serializer for clients (no pricing)"""
    
    material = MaterialClientSerializer(read_only=True)
    
    class Meta:
        model = ProjectSelection
        fields = [
            'id', 'material', 'quantity', 'location_notes',
            'client_notes', 'is_approved', 'added_at'
        ]


class ProjectSelectionContractorSerializer(serializers.ModelSerializer):
    """Selection serializer for contractors (with pricing)"""
    
    material = MaterialContractorSerializer(read_only=True)
    material_cost = serializers.DecimalField(max_digits=14, decimal_places=2, read_only=True)
    labor_cost = serializers.DecimalField(max_digits=14, decimal_places=2, read_only=True)
    total_cost = serializers.DecimalField(max_digits=14, decimal_places=2, read_only=True)
    
    class Meta:
        model = ProjectSelection
        fields = '__all__'


class ProjectSelectionCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating selections"""
    
    class Meta:
        model = ProjectSelection
        fields = ['project', 'material', 'quantity', 'location_notes', 'client_notes']


class SmartHomeSelectionClientSerializer(serializers.ModelSerializer):
    system = SmartHomeClientSerializer(read_only=True)
    
    class Meta:
        model = SmartHomeSelection
        fields = [
            'id', 'system', 'quantity', 'location_notes',
            'client_notes', 'is_approved', 'added_at'
        ]


class SmartHomeSelectionContractorSerializer(serializers.ModelSerializer):
    system = SmartHomeContractorSerializer(read_only=True)
    total_cost = serializers.DecimalField(max_digits=14, decimal_places=2, read_only=True)
    
    class Meta:
        model = SmartHomeSelection
        fields = '__all__'


class EstimateLineItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstimateLineItem
        fields = '__all__'


class EstimateClientSerializer(serializers.ModelSerializer):
    """Estimate for clients (limited info)"""
    
    class Meta:
        model = Estimate
        fields = [
            'id', 'version', 'status', 'client_total',
            'client_notes', 'created_at', 'sent_at'
        ]


class EstimateContractorSerializer(serializers.ModelSerializer):
    """Estimate for contractors (full details)"""
    
    line_items = EstimateLineItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Estimate
        fields = '__all__'


class TakeoffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Takeoff
        fields = '__all__'


class ProjectSummaryClientSerializer(serializers.Serializer):
    """Complete project summary for clients"""
    
    project_name = serializers.CharField()
    project_type = serializers.CharField()
    style = serializers.CharField()
    location = serializers.CharField()
    selections = ProjectSelectionClientSerializer(many=True)
    smart_home_selections = SmartHomeSelectionClientSerializer(many=True)
    status = serializers.CharField()


class ProjectSummaryContractorSerializer(serializers.Serializer):
    """Complete project summary for contractors"""
    
    project_name = serializers.CharField()
    project_type = serializers.CharField()
    style = serializers.CharField()
    location = serializers.CharField()
    climate_zone = serializers.CharField()
    tax_rate = serializers.DecimalField(max_digits=6, decimal_places=4)
    selections = ProjectSelectionContractorSerializer(many=True)
    smart_home_selections = SmartHomeSelectionContractorSerializer(many=True)
    materials_subtotal = serializers.DecimalField(max_digits=14, decimal_places=2)
    labor_subtotal = serializers.DecimalField(max_digits=14, decimal_places=2)
    smart_home_subtotal = serializers.DecimalField(max_digits=14, decimal_places=2)
    tax_amount = serializers.DecimalField(max_digits=14, decimal_places=2)
    total = serializers.DecimalField(max_digits=14, decimal_places=2)
    status = serializers.CharField()
