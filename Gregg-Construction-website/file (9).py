"""
Gregg Construction - Project Serializers
"""

from rest_framework import serializers
from .models import Project, ProjectImage, ProjectDocument, ClimateZone, ZipCodeClimate
from accounts.serializers import UserSerializer


class ClimateZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClimateZone
        fields = '__all__'


class ZipCodeClimateSerializer(serializers.ModelSerializer):
    climate_zone = ClimateZoneSerializer(read_only=True)
    
    class Meta:
        model = ZipCodeClimate
        fields = '__all__'


class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = '__all__'


class ProjectDocumentSerializer(serializers.ModelSerializer):
    uploaded_by = UserSerializer(read_only=True)
    
    class Meta:
        model = ProjectDocument
        fields = '__all__'


class ProjectSerializer(serializers.ModelSerializer):
    """Serializer for project list views"""
    
    owner = UserSerializer(read_only=True)
    climate_zone = ClimateZoneSerializer(read_only=True)
    
    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ['owner', 'created_at', 'updated_at']


class ProjectCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating projects"""
    
    class Meta:
        model = Project
        fields = [
            'project_name', 'project_type', 'style', 'address',
            'city', 'state', 'zip_code', 'square_footage',
            'num_floors', 'num_bedrooms', 'num_bathrooms',
            'garage_spaces', 'target_start_date', 'target_completion_date',
            'client_notes'
        ]
    
    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)


class ProjectDetailSerializer(serializers.ModelSerializer):
    """Detailed project serializer with related data"""
    
    owner = UserSerializer(read_only=True)
    climate_zone = ClimateZoneSerializer(read_only=True)
    images = ProjectImageSerializer(many=True, read_only=True)
    documents = ProjectDocumentSerializer(many=True, read_only=True)
    tax_rate = serializers.DecimalField(max_digits=6, decimal_places=4, read_only=True)
    
    class Meta:
        model = Project
        fields = '__all__'
