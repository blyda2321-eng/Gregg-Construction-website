"""
Gregg Construction - Account URLs
"""

from django.urls import path
from .views import (
    RegisterView,
    UserProfileView,
    CurrentUserView,
    ClientListView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('me/', CurrentUserView.as_view(), name='current_user'),
    path('clients/', ClientListView.as_view(), name='client_list'),
]
