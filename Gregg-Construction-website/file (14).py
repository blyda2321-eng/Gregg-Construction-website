"""
Gregg Construction - Materials Views
"""

from rest_framework import generics, permissions, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from .models import (
    MaterialCategory, Brand, Material, SmartHomeSystem, Vendor
)
from .serializers import (
    MaterialCategorySerializer,
    BrandSerializer,
    MaterialClientSerializer,
    MaterialContractorSerializer,
    SmartHomeClientSerializer,
    SmartHomeContractorSerializer,
    VendorSerializer
)
from projects.models import Project


class MaterialCategoryListView(generics.ListAPIView):
    """List all material categories"""
    
    queryset = MaterialCategory.objects.filter(is_active=True, parent=None)
    serializer_class = MaterialCategorySerializer
    permission_classes = [permissions.IsAuthenticated]


class BrandListView(generics.ListAPIView):
    """List all brands"""
    
    queryset = Brand.objects.filter(is_active=True)
    serializer_class = BrandSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']


class MaterialListView(generics.ListAPIView):
    """List materials with role-based serialization"""
    
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'brand', 'tier']
    search_fields = ['name', 'client_description']
    ordering_fields = ['name', 'tier', 'created_at']
    
    def get_serializer_class(self):
        if self.request.user.is_contractor:
            return MaterialContractorSerializer
        return MaterialClientSerializer
    
    def get_queryset(self):
        queryset = Material.objects.filter(is_active=True)
        
        # Filter by category slug
        category_slug = self.request.query_params.get('category_slug')
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        
        # Filter by project climate zone
        project_id = self.request.query_params.get('project_id')
        if project_id:
            try:
                project = Project.objects.get(id=project_id)
                if project.climate_zone:
                    queryset = queryset.filter(
                        models.Q(all_climate_zones=True) |
                        models.Q(climate_zones=project.climate_zone)
                    )
            except Project.DoesNotExist:
                pass
        
        return queryset.distinct()


class MaterialDetailView(generics.RetrieveAPIView):
    """Get single material details"""
    
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        if self.request.user.is_contractor:
            return MaterialContractorSerializer
        return MaterialClientSerializer
    
    def get_queryset(self):
        return Material.objects.filter(is_active=True)


class MaterialsByCategoryView(APIView):
    """Get materials organized by category for a project"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, project_id):
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return Response({"error": "Project not found"}, status=404)
        
        categories = MaterialCategory.objects.filter(is_active=True, parent=None)
        result = []
        
        for category in categories:
            materials = Material.objects.filter(
                category__in=[category] + list(category.subcategories.all()),
                is_active=True
            )
            
            # Filter by climate zone
            if project.climate_zone:
                materials = materials.filter(
                    models.Q(all_climate_zones=True) |
                    models.Q(climate_zones=project.climate_zone)
                )
            
            if request.user.is_contractor:
                serializer = MaterialContractorSerializer(materials, many=True)
            else:
                serializer = MaterialClientSerializer(materials, many=True)
            
            result.append({
                'category': MaterialCategorySerializer(category).data,
                'materials': serializer.data
            })
        
        return Response(result)


class SmartHomeListView(generics.ListAPIView):
    """List smart home systems"""
    
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['system_type', 'brand', 'outdoor_rated']
    search_fields = ['name', 'client_description']
    
    def get_serializer_class(self):
        if self.request.user.is_contractor:
            return SmartHomeContractorSerializer
        return SmartHomeClientSerializer
    
    def get_queryset(self):
        return SmartHomeSystem.objects.filter(is_active=True)


class VendorListView(generics.ListAPIView):
    """List vendors (contractor only)"""
    
    queryset = Vendor.objects.filter(is_active=True)
    serializer_class = VendorSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_contractor:
            return Vendor.objects.filter(is_active=True)
        return Vendor.objects.none()
