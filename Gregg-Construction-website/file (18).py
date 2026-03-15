"""
Gregg Construction - Estimates Views
"""

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Sum
from .models import (
    ProjectSelection, SmartHomeSelection,
    Estimate, Takeoff
)
from .serializers import (
    ProjectSelectionClientSerializer,
    ProjectSelectionContractorSerializer,
    ProjectSelectionCreateSerializer,
    SmartHomeSelectionClientSerializer,
    SmartHomeSelectionContractorSerializer,
    EstimateClientSerializer,
    EstimateContractorSerializer,
    TakeoffSerializer,
    ProjectSummaryClientSerializer,
    ProjectSummaryContractorSerializer
)
from projects.models import Project


class ProjectSelectionListCreateView(generics.ListCreateAPIView):
    """List and create material selections for a project"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProjectSelectionCreateSerializer
        if self.request.user.is_contractor:
            return ProjectSelectionContractorSerializer
        return ProjectSelectionClientSerializer
    
    def get_queryset(self):
        project_id = self.kwargs.get('project_id')
        return ProjectSelection.objects.filter(project_id=project_id)


class ProjectSelectionDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, delete a selection"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.user.is_contractor:
            return ProjectSelectionContractorSerializer
        return ProjectSelectionClientSerializer
    
    def get_queryset(self):
        return ProjectSelection.objects.all()


class SmartHomeSelectionListCreateView(generics.ListCreateAPIView):
    """List and create smart home selections"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.user.is_contractor:
            return SmartHomeSelectionContractorSerializer
        return SmartHomeSelectionClientSerializer
    
    def get_queryset(self):
        project_id = self.kwargs.get('project_id')
        return SmartHomeSelection.objects.filter(project_id=project_id)


class ProjectSummaryView(APIView):
    """Get complete project summary with all selections"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, project_id):
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return Response({"error": "Project not found"}, status=404)
        
        # Check permissions
        if not request.user.is_contractor and project.owner != request.user:
            return Response({"error": "Access denied"}, status=403)
        
        selections = project.selections.all()
        smart_selections = project.smart_home_selections.all()
        
        if request.user.is_contractor:
            # Full contractor view with all pricing
            materials_subtotal = sum(s.material_cost for s in selections)
            labor_subtotal = sum(s.labor_cost for s in selections)
            smart_home_subtotal = sum(s.total_cost for s in smart_selections)
            tax_amount = materials_subtotal * project.tax_rate
            total = materials_subtotal + labor_subtotal + smart_home_subtotal + tax_amount
            
            data = {
                'project_name': project.project_name,
                'project_type': project.get_project_type_display(),
                'style': project.get_style_display() if project.style else 'Not specified',
                'location': f"{project.city}, {project.state} {project.zip_code}",
                'climate_zone': str(project.climate_zone) if project.climate_zone else 'Unknown',
                'tax_rate': project.tax_rate,
                'selections': ProjectSelectionContractorSerializer(selections, many=True).data,
                'smart_home_selections': SmartHomeSelectionContractorSerializer(smart_selections, many=True).data,
                'materials_subtotal': materials_subtotal,
                'labor_subtotal': labor_subtotal,
                'smart_home_subtotal': smart_home_subtotal,
                'tax_amount': tax_amount,
                'total': total,
                'status': project.get_status_display()
            }
        else:
            # Client view without pricing
            data = {
                'project_name': project.project_name,
                'project_type': project.get_project_type_display(),
                'style': project.get_style_display() if project.style else 'Not specified',
                'location': f"{project.city}, {project.state}",
                'selections': ProjectSelectionClientSerializer(selections, many=True).data,
                'smart_home_selections': SmartHomeSelectionClientSerializer(smart_selections, many=True).data,
                'status': project.get_status_display()
            }
        
        return Response(data)


class GenerateEstimateView(APIView):
    """Generate a new estimate for a project"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, project_id):
        if not request.user.is_contractor:
            return Response({"error": "Only contractors can generate estimates"}, status=403)
        
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return Response({"error": "Project not found"}, status=404)
        
        # Get latest version number
        latest = Estimate.objects.filter(project=project).order_by('-version').first()
        new_version = (latest.version + 1) if latest else 1
        
        # Create new estimate
        estimate = Estimate.objects.create(
            project=project,
            version=new_version,
            created_by=request.user,
            markup_percentage=request.data.get('markup_percentage', 20.00)
        )
        
        # Calculate totals
        estimate.calculate_totals()
        
        return Response(EstimateContractorSerializer(estimate).data, status=201)


class EstimateDetailView(generics.RetrieveUpdateAPIView):
    """Get and update estimate details"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.user.is_contractor:
            return EstimateContractorSerializer
        return EstimateClientSerializer
    
    def get_queryset(self):
        return Estimate.objects.all()


class TakeoffGenerateView(APIView):
    """Generate a takeoff for a project"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, project_id):
        if not request.user.is_contractor:
            return Response({"error": "Only contractors can generate takeoffs"}, status=403)
        
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            return Response({"error": "Project not found"}, status=404)
        
        takeoff = Takeoff.objects.create(
            project=project,
            name=request.data.get('name', f"Takeoff - {project.project_name}")
        )
        
        takeoff.compile_materials()
        
        return Response(TakeoffSerializer(takeoff).data, status=201)


class TakeoffListView(generics.ListAPIView):
    """List takeoffs for a project"""
    
    serializer_class = TakeoffSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if not self.request.user.is_contractor:
            return Takeoff.objects.none()
        
        project_id = self.kwargs.get('project_id')
        return Takeoff.objects.filter(project_id=project_id)
