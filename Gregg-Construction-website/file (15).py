"""
Gregg Construction - Materials URLs
"""

from django.urls import path
from .views import (
    MaterialCategoryListView,
    BrandListView,
    MaterialListView,
    MaterialDetailView,
    MaterialsByCategoryView,
    SmartHomeListView,
    VendorListView
)

urlpatterns = [
    path('categories/', MaterialCategoryListView.as_view(), name='category_list'),
    path('brands/', BrandListView.as_view(), name='brand_list'),
    path('', MaterialListView.as_view(), name='material_list'),
    path('<slug:slug>/', MaterialDetailView.as_view(), name='material_detail'),
    path('by-project/<int:project_id>/', MaterialsByCategoryView.as_view(), name='materials_by_project'),
    path('smart-home/', SmartHomeListView.as_view(), name='smart_home_list'),
    path('vendors/', VendorListView.as_view(), name='vendor_list'),
]
