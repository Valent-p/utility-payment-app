from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token

# Import views (we'll create these next)
# from .views import UserViewSet, CustomerViewSet

app_name = 'accounts'

# Create a router for the ViewSets
router = DefaultRouter()
# router.register(r'users', UserViewSet, basename='user')
# router.register(r'customers', CustomerViewSet, basename='customer')

urlpatterns = [
    path('', include(router.urls)),
    # Token authentication endpoint
    path('token/', obtain_auth_token, name='api_token_auth'),
]
