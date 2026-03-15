"""
Gregg Construction - Project Views
"""

from rest_framework import generics, permissions, status, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from .models import Project, ProjectImage, ProjectDocument, ClimateZone, ZipCodeClimate
from .serializers import (
    ProjectSerializer,
    ProjectCreateSerializer,
    ProjectDetailSerializer,
    ProjectImageSerializer,
    ProjectDocumentSerializer,
    ClimateZoneSerializer,
    ZipCodeClimateSerializer
)


class IsOwnerOrContractor(permissions.BasePermission):
    """Permission to only allow owners or contractors to access"""
    
    def has_object_permission(self, request, view, obj):
        if request.user.is_contractor:
            return True
        return obj.owner == request.user


class ProjectListCreateView(generics.ListCreateAPIView):
    """List and create projects"""
    
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['project_type', 'status', 'style']
    search_fields = ['project_name', 'city', 'state']
    ordering_fields = ['created_at', 'updated_at', 'project_name']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProjectCreateSerializer
        return ProjectSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.is_contractor:
            return Project.objects.all()
        return Project.objects.filter(owner=user)


class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, delete a project"""
    
    serializer_class = ProjectDetailSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrContractor]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_contractor:
            return Project.objects.all()
        return Project.objects.filter(owner=user)


class ProjectImageUploadView(generics.CreateAPIView):
    """Upload images to a project"""
    
    serializer_class = ProjectImageSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        project_id = self.kwargs.get('project_id')
        project = Project.objects.get(id=project_id)
        serializer.save(project=project)


class ProjectStatusUpdateView(APIView):
    """Update project status (contractor only)"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def patch(self, request, pk):
        if not request.user.is_contractor:
            return Response(
                {"error": "Only contractors can update project status"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            project = Project.objects.get(pk=pk)
            new_status = request.data.get('status')
            if new_status:
                project.status = new_status
                project.save()
                return Response(ProjectSerializer(project).data)
            return Response(
                {"error": "Status field required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Project.DoesNotExist:
            return Response(
                {"error": "Project not found"},
                status=status.HTTP_404_NOT_FOUND
            )


class ClimateZoneListView(generics.ListAPIView):
    """List all climate zones"""
    
    queryset = ClimateZone.objects.all()
    serializer_class = ClimateZoneSerializer
    permission_classes = [permissions.IsAuthenticated]


class ZipCodeLookupView(APIView):
    """Look up climate zone and tax rate by zip code"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, zip_code):
        try:
            zip_info = ZipCodeClimate.objects.get(zip_code=zip_code)
            return Response(ZipCodeClimateSerializer(zip_info).data)
        except ZipCodeClimate.DoesNotExist:
            return Response(
                {"error": "Zip code not found in database"},
                status=status.HTTP_404_NOT_FOUND
            )
