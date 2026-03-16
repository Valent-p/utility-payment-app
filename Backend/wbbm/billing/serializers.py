from rest_framework import serializers
from .models import Bill
from customers.models import Customer


class BillSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    customer_account_number = serializers.CharField(source='customer.account_number', read_only=True)

    class Meta:
        model = Bill
        fields = ['id', 'customer', 'customer_name', 'customer_account_number', 'billing_month', 
                  'amount_due', 'due_date', 'status', 'created_at']
        read_only_fields = ['id', 'created_at']


class BillDetailSerializer(serializers.ModelSerializer):
    customer = serializers.SerializerMethodField()

    def get_customer(self, obj):
        from customers.serializers import CustomerSerializer
        return CustomerSerializer(obj.customer).data

    class Meta:
        model = Bill
        fields = ['id', 'customer', 'billing_month', 'amount_due', 'due_date', 'status', 'created_at']
        read_only_fields = ['id', 'created_at']
