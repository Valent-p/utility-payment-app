from django.contrib import admin
from .models import Customer


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['name', 'account_number', 'phone', 'meter_number', 'created_at']
    search_fields = ['name', 'account_number', 'phone']
    readonly_fields = ['created_at', 'updated_at']
