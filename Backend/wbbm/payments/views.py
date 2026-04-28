from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from datetime import datetime
import uuid
import requests
from django.conf import settings
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
    Process payment initiation - return config for PayChangu Inline.
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
        
        # In a real integration, we generate a unique transaction reference
        tx_ref = f"UTIL-{uuid.uuid4().hex[:12].upper()}"
        
        # Create a pending transaction record
        transaction = Transaction.objects.create(
            customer=customer,
            amount=amount,
            payment_status='pending', 
            payment_reference=tx_ref
        )
        
        return Response({
            'success': True,
            'message': 'Payment initiated',
            'config': {
                'public_key': settings.PAYCHANGU_PUBLIC_KEY,
                'tx_ref': tx_ref,
                'amount': amount,
                'currency': 'MWK',
                'customer': {
                    'email': f"{customer.account_number}@utility.mw", # Placeholder email
                    'first_name': customer.name.split(' ')[0],
                    'last_name': customer.name.split(' ')[-1] if ' ' in customer.name else '',
                },
                'customization': {
                    'title': 'Utility Bill Payment',
                    'description': f'Payment for Account {customer.account_number}',
                }
            }
        }, status=status.HTTP_200_OK)
        
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


@api_view(['POST'])
def verify_payment(request):
    """
    Verify payment with PayChangu after checkout.
    POST /api/verify-payment/
    Expected body: {tx_ref}
    """
    tx_ref = request.data.get('tx_ref')
    
    if not tx_ref:
        return Response({
            'success': False,
            'message': 'tx_ref is required'
        }, status=status.HTTP_400_BAD_REQUEST)

    try:
        # 1. Call PayChangu Verification API
        headers = {
            'Authorization': f'Bearer {settings.PAYCHANGU_SECRET_KEY}',
            'Accept': 'application/json',
        }
        verify_url = f"{settings.PAYCHANGU_BASE_URL}/verify-payment/{tx_ref}"
        print(f"DEBUG: Verifying payment at {verify_url}")
        
        response = requests.get(verify_url, headers=headers)
        res_data = response.json()
        print(f"DEBUG: Paychangu Response: {res_data}")

        # Check for success in both status and nested data status
        status_val = res_data.get('status', '').lower()
        data_status = res_data.get('data', {}).get('status', '').lower()
        
        if response.status_code == 200 and (status_val == 'success' or data_status == 'success'):
            # 2. Update transaction status
            try:
                transaction = Transaction.objects.get(payment_reference=tx_ref)
                transaction.payment_status = 'success'
                transaction.save()
                
                # 3. Mark corresponding bill as paid
                bill = Bill.objects.filter(customer=transaction.customer, status='unpaid').first()
                if bill:
                    # Verify amount matches (optional but recommended)
                    paid_amount = float(res_data.get('data', {}).get('amount', 0))
                    if paid_amount >= float(bill.amount_due):
                        bill.status = 'paid'
                        bill.save()
                
                return Response({
                    'success': True,
                    'message': 'Payment verified successfully',
                    'transaction': TransactionSerializer(transaction).data,
                    'bill_status': 'paid' if bill and bill.status == 'paid' else 'unpaid'
                })
            except Transaction.DoesNotExist:
                return Response({
                    'success': False,
                    'message': 'Transaction record not found'
                }, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({
                'success': False,
                'message': res_data.get('message', 'Verification failed')
            }, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
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
