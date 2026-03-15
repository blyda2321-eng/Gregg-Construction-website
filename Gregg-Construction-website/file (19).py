"""
Gregg Construction - Estimates URLs
"""

from django.urls import path
from .views import (
    ProjectSelectionListCreateView,
    ProjectSelectionDetailView,
    SmartHomeSelectionListCreateView,
    ProjectSummaryView,
    GenerateEstimateView,
    EstimateDetailView,
    TakeoffGenerateView,
    TakeoffListView
)

urlpatterns = [
    path('projects/<int:project_id>/selections/', ProjectSelectionListCreateView.as_view(), name='selection_list_create'),
    path('selections/<int:pk>/', ProjectSelectionDetailView.as_view(), name='selection_detail'),
    path('projects/<int:project_id>/smart-home/', SmartHomeSelectionListCreateView.as_view(), name='smart_home_selection_list'),
    path('projects/<int:project_id>/summary/', ProjectSummaryView.as_view(), name='project_summary'),
    path('projects/<int:project_id>/generate-estimate/', GenerateEstimateView.as_view(), name='generate_estimate'),
    path('<int:pk>/', EstimateDetailView.as_view(), name='estimate_detail'),
    path('projects/<int:project_id>/generate-takeoff/', TakeoffGenerateView.as_view(), name='generate_takeoff'),
    path('projects/<int:project_id>/takeoffs/', TakeoffListView.as_view(), name='takeoff_list'),
]
