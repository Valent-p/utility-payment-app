from django.contrib import admin
from .models import Transaction


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['payment_reference', 'customer', 'amount', 'payment_status', 'created_at']
    list_filter = ['payment_status', 'created_at']
    search_fields = ['customer__name', 'customer__account_number', 'payment_reference']
    readonly_fields = ['created_at', 'updated_at']
