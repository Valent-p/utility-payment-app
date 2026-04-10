from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from datetime import datetime
import uuid
from customers.models import Customer
from customers.serializers import CustomerSerializer
from billing.models import Bill
from billing.serializers import BillDetailSerializer
from transactions.models import Transaction
from transactions.serializers import TransactionSerializer


@api_view(['GET'])
def get_bill(request, account_number):
    """
    Get customer information and outstanding bill.
    GET /api/bill/<account_number>
    """
    try:
        customer = Customer.objects.get(account_number=account_number)
        # Get the most recent unpaid bill
        bill = Bill.objects.filter(customer=customer, status='unpaid').first()
        
        if bill:
            return Response({
                'success': True,
                'customer': CustomerSerializer(customer).data,
                'bill': {
                    **BillDetailSerializer(bill).data,
                    'meter_reading_previous': 1240.5, # Simulated readings
                    'meter_reading_current': 1255.2,
                    'consumption': 14.7,
                    'period': bill.billing_month.strftime('%B %Y')
                },
            })
        else:
            # If no unpaid bill, return all paid info
            return Response({
                'success': True,
                'customer': CustomerSerializer(customer).data,
                'bill': None,
                'message': 'No outstanding bills'
            })
    except Customer.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Customer not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def process_payment(request):
    """
    Process payment - simulate PayChangu payment.
    POST /api/pay
    Expected body: {account_number, amount}
    """
    account_number = request.data.get('account_number')
    amount = request.data.get('amount')

    if not account_number or not amount:
        return Response({
            'success': False,
            'message': 'account_number and amount are required'
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        amount = float(amount)
        customer = Customer.objects.get(account_number=account_number)
        
        # In a real PayChangu flow, we would call their API to get a checkout URL.
        # Here we simulate that by generating a reference and assuming success for MVP.
        payment_reference = f"CHG-{uuid.uuid4().hex[:12].upper()}"
        
        # Create transaction record as 'pending' initially in a real system
        # Here we immediately mark as 'success' to simplify the MVP flow
        transaction = Transaction.objects.create(
            customer=customer,
            amount=amount,
            payment_status='success', 
            payment_reference=payment_reference
        )
        
        # Mark corresponding bill as paid
        bill = Bill.objects.filter(customer=customer, status='unpaid').first()
        if bill:
            # If payment covers at least the amount due, mark as paid
            if amount >= float(bill.amount_due):
                bill.status = 'paid'
                bill.save()
            else:
                # Handle partial payment if needed (out of scope for MVP?)
                pass
        
        return Response({
            'success': True,
            'message': 'Payment processed successfully via PayChangu (Simulated)',
            'redirect_url': 'http://localhost:5173/dashboard?status=success', # Simulated return
            'transaction': TransactionSerializer(transaction).data,
            'bill_status': 'paid' if bill and bill.status == 'paid' else 'unpaid',
        }, status=status.HTTP_201_CREATED)
        
    except Customer.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Customer not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except (ValueError, TypeError):
        return Response({
            'success': False,
            'message': 'Invalid amount'
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_transactions(request, account_number):
    """
    Get transaction history for a customer.
    GET /api/transactions/<account_number>
    """
    try:
        customer = Customer.objects.get(account_number=account_number)
        transactions = Transaction.objects.filter(customer=customer)
        serializer = TransactionSerializer(transactions, many=True)
        return Response({
            'success': True,
            'customer': CustomerSerializer(customer).data,
            'transactions': serializer.data,
        })
    except Customer.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Customer not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def register_customer(request):
    """
    Register a new customer.
    POST /api/customer/register/
    Expected body: {account_number, name, phone, address, meter_number}
    """
    data = request.data

    required_fields = ['account_number', 'name', 'phone', 'address', 'meter_number']
    if not all(field in data for field in required_fields):
        return Response({
            'success': False,
            'message': 'Missing required fields: ' + ', '.join(required_fields)
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Check if customer already exists
        if Customer.objects.filter(account_number=data['account_number']).exists():
            return Response({
                'success': False,
                'message': 'Customer with this account number already exists'
            }, status=status.HTTP_400_BAD_REQUEST)

        if Customer.objects.filter(meter_number=data['meter_number']).exists():
            return Response({
                'success': False,
                'message': 'Customer with this meter number already exists'
            }, status=status.HTTP_400_BAD_REQUEST)

        customer = Customer.objects.create(
            account_number=data['account_number'],
            name=data['name'],
            phone=data['phone'],
            address=data['address'],
            meter_number=data['meter_number']
        )

        return Response({
            'success': True,
            'message': 'Customer registered successfully',
            'customer': CustomerSerializer(customer).data,
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_customer_profile(request, account_number):
    """
    Get customer profile information.
    GET /api/customer/<account_number>/
    """
    try:
        customer = Customer.objects.get(account_number=account_number)
        return Response({
            'success': True,
            'customer': CustomerSerializer(customer).data,
        })
    except Customer.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Customer not found'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
def update_customer_profile(request, account_number):
    """
    Update customer profile information.
    PUT /api/customer/<account_number>/update/
    """
    try:
        customer = Customer.objects.get(account_number=account_number)

        # Update only the provided fields
        if 'name' in request.data:
            customer.name = request.data['name']
        if 'phone' in request.data:
            customer.phone = request.data['phone']
        if 'address' in request.data:
            customer.address = request.data['address']

        customer.save()

        return Response({
            'success': True,
            'message': 'Customer profile updated successfully',
            'customer': CustomerSerializer(customer).data,
        })

    except Customer.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Customer not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)
