from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime, timedelta
from customers.models import Customer
from billing.models import Bill
from transactions.models import Transaction


class Command(BaseCommand):
    help = 'Load sample data for water utility payment system'

    def handle(self, *args, **options):
        # Create sample customers
        customers_data = [
            {
                'account_number': 'ACC001',
                'name': 'John Musyoka',
                'phone': '+254701234567',
                'address': '123 Nairobi Street, Nairobi',
                'meter_number': 'MTR001'
            },
            {
                'account_number': 'ACC002',
                'name': 'Jane Kipchoge',
                'phone': '+254702345678',
                'address': '456 Mombasa Road, Mombasa',
                'meter_number': 'MTR002'
            },
            {
                'account_number': 'ACC003',
                'name': 'Peter Kariuki',
                'phone': '+254703456789',
                'address': '789 Kisumu Lane, Kisumu',
                'meter_number': 'MTR003'
            },
        ]

        for cust_data in customers_data:
            customer, created = Customer.objects.get_or_create(
                account_number=cust_data['account_number'],
                defaults=cust_data
            )
            if created:
                self.stdout.write(f"Created customer: {customer.name}")
            else:
                self.stdout.write(f"Customer already exists: {customer.name}")

        # Create sample bills
        customers = Customer.objects.all()
        
        for customer in customers:
            # Create an unpaid bill for this month
            current_month = timezone.now().date().replace(day=1)
            due_date = current_month + timedelta(days=30)
            
            bill, created = Bill.objects.get_or_create(
                customer=customer,
                billing_month=current_month,
                defaults={
                    'amount_due': 2500.00,
                    'due_date': due_date,
                    'status': 'unpaid'
                }
            )
            if created:
                self.stdout.write(f"Created bill for: {customer.name}")

        # Create sample transactions for the first customer
        if customers.exists():
            customer = customers.first()
            transaction, created = Transaction.objects.get_or_create(
                payment_reference='PAY-ABC1234567',
                defaults={
                    'customer': customer,
                    'amount': 2500.00,
                    'payment_status': 'success',
                }
            )
            if created:
                self.stdout.write(f"Created transaction for: {customer.name}")

        self.stdout.write(self.style.SUCCESS('Sample data loaded successfully!'))
