"""
Gregg Construction - Materials Serializers
"""

from rest_framework import serializers
from .models import (
    MaterialCategory, Vendor, Brand, Material,
    MaterialImage, SmartHomeSystem, PricingHistory
)


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name', 'logo', 'website', 'description', 'is_premium']


class MaterialCategorySerializer(serializers.ModelSerializer):
    subcategories = serializers.SerializerMethodField()
    
    class Meta:
        model = MaterialCategory
        fields = [
            'id', 'name', 'slug', 'category_type', 'parent',
            'description', 'icon', 'display_order', 'subcategories'
        ]
    
    def get_subcategories(self, obj):
        subcats = obj.subcategories.filter(is_active=True)
        return MaterialCategorySerializer(subcats, many=True).data


class MaterialImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaterialImage
        fields = ['id', 'image', 'caption', 'is_primary', 'display_order']


class MaterialClientSerializer(serializers.ModelSerializer):
    """Materials serializer for clients (no pricing)"""
    
    brand = BrandSerializer(read_only=True)
    category = MaterialCategorySerializer(read_only=True)
    images = MaterialImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Material
        fields = [
            'id', 'name', 'slug', 'category', 'brand',
            'client_description', 'features', 'image', 'tier',
            'specifications', 'warranty_info', 'images',
            'in_stock', 'lead_time_days'
        ]


class MaterialContractorSerializer(serializers.ModelSerializer):
    """Materials serializer for contractors (includes pricing)"""
    
    brand = BrandSerializer(read_only=True)
    category = MaterialCategorySerializer(read_only=True)
    images = MaterialImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Material
        fields = '__all__'


class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = '__all__'


class SmartHomeClientSerializer(serializers.ModelSerializer):
    """Smart home serializer for clients"""
    
    brand = BrandSerializer(read_only=True)
    
    class Meta:
        model = SmartHomeSystem
        fields = [
            'id', 'name', 'brand', 'system_type',
            'client_description', 'features', 'image',
            'requires_hub', 'outdoor_rated'
        ]


class SmartHomeContractorSerializer(serializers.ModelSerializer):
    """Smart home serializer for contractors"""
    
    brand = BrandSerializer(read_only=True)
    
    class Meta:
        model = SmartHomeSystem
        fields = '__all__'


class PricingHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingHistory
        fields = '__all__'
