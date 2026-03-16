from django.urls import path
from . import views

urlpatterns = [
    path('customer/register/', views.CustomerCreateView.as_view(), name='customer-register'),
    path('login/', views.LoginView.as_view(), name='customer-login'),
    path('customer/<str:account_number>/', views.CustomerDetailView.as_view(), name='customer-detail'),
]


