from rest_framework import serializers
from .models import Transaction


class TransactionSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    customer_account_number = serializers.CharField(source='customer.account_number', read_only=True)

    class Meta:
        model = Transaction
        fields = ['id', 'customer', 'customer_name', 'customer_account_number', 'amount', 
                  'payment_status', 'payment_reference', 'created_at']
        read_only_fields = ['id', 'created_at', 'customer']
