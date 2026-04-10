import os
import django
import sys
from datetime import date, timedelta

# Set up Django environment
sys.path.append(os.path.join(os.getcwd(), 'Backend', 'wbbm'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wbbm.settings')
django.setup()

from customers.models import Customer
from billing.models import Bill

def load_sample_bills():
    customers = Customer.objects.all()
    if not customers:
        print("No customers found. Please register a customer first.")
        return

    today = date.today()
    last_month = today.replace(day=1) - timedelta(days=1)
    
    for customer in customers:
        # Create an unpaid bill for the current month
        Bill.objects.get_or_create(
            customer=customer,
            billing_month=today.replace(day=1),
            defaults={
                'amount_due': 45.50,
                'due_date': today + timedelta(days=15),
                'status': 'unpaid'
            }
        )
        
        # Create a paid bill for the previous month
        Bill.objects.get_or_create(
            customer=customer,
            billing_month=last_month.replace(day=1),
            defaults={
                'amount_due': 38.20,
                'due_date': last_month + timedelta(days=15),
                'status': 'paid'
            }
        )
        
    print(f"Sample bills created for {customers.count()} customers.")

if __name__ == "__main__":
    load_sample_bills()
