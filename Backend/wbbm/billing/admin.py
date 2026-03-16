from django.contrib import admin
from .models import Bill


@admin.register(Bill)
class BillAdmin(admin.ModelAdmin):
    list_display = ['customer', 'billing_month', 'amount_due', 'status', 'due_date']
    list_filter = ['status', 'billing_month']
    search_fields = ['customer__name', 'customer__account_number']
    readonly_fields = ['created_at', 'updated_at']
