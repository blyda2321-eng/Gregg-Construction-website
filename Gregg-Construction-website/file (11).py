"""
Gregg Construction - Project URLs
"""

from django.urls import path
from .views import (
    ProjectListCreateView,
    ProjectDetailView,
    ProjectImageUploadView,
    ProjectStatusUpdateView,
    ClimateZoneListView,
    ZipCodeLookupView
)

urlpatterns = [
    path('', ProjectListCreateView.as_view(), name='project_list_create'),
    path('<int:pk>/', ProjectDetailView.as_view(), name='project_detail'),
    path('<int:project_id>/images/', ProjectImageUploadView.as_view(), name='project_image_upload'),
    path('<int:pk>/status/', ProjectStatusUpdateView.as_view(), name='project_status_update'),
    path('climate-zones/', ClimateZoneListView.as_view(), name='climate_zone_list'),
    path('zip-lookup/<str:zip_code>/', ZipCodeLookupView.as_view(), name='zip_lookup'),
]
