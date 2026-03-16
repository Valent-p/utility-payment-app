from django.urls import path
from . import views

app_name = 'payments'

urlpatterns = [
    path('bill/<str:account_number>/', views.get_bill, name='get_bill'),
    path('pay/', views.process_payment, name='process_payment'),
    path('transactions/<str:account_number>/', views.get_transactions, name='get_transactions'),
    path('customer/register/', views.register_customer, name='register_customer'),
    path('customer/<str:account_number>/', views.get_customer_profile, name='get_customer_profile'),
    path('customer/<str:account_number>/update/', views.update_customer_profile, name='update_customer_profile'),
]
