from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Customer
from .serializers import CustomerSerializer

class CustomerCreateView(generics.CreateAPIView):
    serializer_class = CustomerSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response({
                'success': True,
                'message': 'Customer registered successfully',
                'customer': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            'success': False,
            'message': 'Registration failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

class CustomerDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = CustomerSerializer
    lookup_field = 'account_number'
    lookup_url_kwarg = 'account_number'

    def get_object(self):
        account_number = self.kwargs['account_number']
        obj = get_object_or_404(Customer, account_number=account_number)
        return obj

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response({
                'success': True,
                'message': 'Profile updated successfully',
                'customer': serializer.data
            })
        return Response({
            'success': False,
            'message': 'Update failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            'success': True,
            'customer': serializer.data
        })

class LoginView(APIView):
    def post(self, request):
        account_number = request.data.get('account_number')
        password = request.data.get('password')
        
        if not account_number or not password:
            return Response({
                'success': False,
                'message': 'Account number and password required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            customer = get_object_or_404(Customer, account_number=account_number)
            if customer.check_password(password):
                return Response({
                    'success': True,
                    'message': 'Login successful',
                    'account_number': account_number
                })
            else:
                return Response({
                    'success': False,
                    'message': 'Invalid password'
                }, status=status.HTTP_401_UNAUTHORIZED)
        except:
            return Response({
                'success': False,
                'message': 'Account not found'
            }, status=status.HTTP_404_NOT_FOUND)

