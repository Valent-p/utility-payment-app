# Water Utility Payment System - MVP

A simple full-stack application for a water utility payment system with customer bill lookup, payment processing, and transaction history.

## Project Structure

```
Group_1/
├── Backend/
│   └── wbbm/ (Django Project)
│       ├── manage.py
│       ├── db.sqlite3
│       ├── wbbm/ (Project Settings)
│       │   ├── __init__.py
│       │   ├── settings.py (Updated with REST Framework, CORS)
│       │   ├── urls.py (API routes)
│       │   ├── wsgi.py
│       │   └── asgi.py
│       ├── customers/ (Customer App)
│       │   ├── models.py (Customer model)
│       │   ├── serializers.py (Customer serializer)
│       │   ├── views.py
│       │   ├── admin.py (Admin registration)
│       │   ├── migrations/
│       │   └── ...
│       ├── billing/ (Billing App)
│       │   ├── models.py (Bill model)
│       │   ├── serializers.py (Bill serializers)
│       │   ├── admin.py
│       │   ├── migrations/
│       │   └── ...
│       ├── transactions/ (Transactions App)
│       │   ├── models.py (Transaction model)
│       │   ├── serializers.py (Transaction serializer)
│       │   ├── admin.py
│       │   ├── migrations/
│       │   └── ...
│       ├── payments/ (API Views)
│       │   ├── views.py (API endpoints)
│       │   ├── urls.py (Payment routes)
│       │   └── ...
│       └── ...other apps...
└── Frontend/
    ├── index.html (Main page - complete single-page app)
    ├── package.json
    └── src/
        └── components/ (React components)
            ├── BillLookup.js
            ├── PaymentPage.js
            └── TransactionHistory.js
```

## Backend Models

### Customer Model
```python
class Customer(models.Model):
    account_number: CharField (unique, max_length=50)
    name: CharField (max_length=100)
    phone: CharField (max_length=20)
    address: TextField
    meter_number: CharField (unique, max_length=50)
    created_at: DateTimeField (auto-added)
    updated_at: DateTimeField (auto-updated)
```

### Bill Model
```python
class Bill(models.Model):
    customer: ForeignKey(Customer)
    billing_month: DateField
    amount_due: DecimalField (max_digits=10, decimal_places=2)
    due_date: DateField
    status: CharField (choices: 'unpaid', 'paid')
    created_at: DateTimeField (auto-added)
    updated_at: DateTimeField (auto-updated)
```

### Transaction Model
```python
class Transaction(models.Model):
    customer: ForeignKey(Customer)
    amount: DecimalField (max_digits=10, decimal_places=2)
    payment_status: CharField (choices: 'pending', 'success', 'failed')
    payment_reference: CharField (unique, max_length=100)
    created_at: DateTimeField (auto-added)
    updated_at: DateTimeField (auto-updated)
```

## API Endpoints

All endpoints are prefixed with `/api/`

### 1. Get Bill Information
```
GET /api/bill/<account_number>/
```

**Response (Success):**
```json
{
    "success": true,
    "customer": {
        "id": 1,
        "account_number": "ACC001",
        "name": "Valentino Phiri",
        "phone": "+265899001155",
        "address": "123 Lilongwe Avenue, Lilongwe",
        "meter_number": "MTR001",
        "created_at": "2026-03-15T10:30:00Z"
    },
    "bill": {
        "id": 1,
        "billing_month": "2026-03-01",
        "amount_due": "2500.00",
        "due_date": "2026-03-31",
        "status": "unpaid",
        "created_at": "2026-03-15T10:30:00Z"
    }
}
```

**Response (No Bills):**
```json
{
    "success": true,
    "customer": {...},
    "bill": null,
    "message": "No outstanding bills"
}
```

**Response (Not Found):**
```json
{
    "success": false,
    "message": "Customer not found"
}
```

### 2. Process Payment
```
POST /api/pay/
Content-Type: application/json

{
    "account_number": "ACC001",
    "amount": 2500.00
}
```

**Response (Success):**
```json
{
    "success": true,
    "message": "Payment processed successfully",
    "transaction": {
        "id": 1,
        "customer": 1,
        "customer_name": "Valentino Phiri",
        "customer_account_number": "ACC001",
        "amount": "2500.00",
        "payment_status": "success",
        "payment_reference": "PAY-ABC1234567",
        "created_at": "2026-03-15T11:00:00Z"
    },
    "bill_status": "paid"
}
```

**Response (Error):**
```json
{
    "success": false,
    "message": "Customer not found"
}
```

### 3. Get Transaction History
```
GET /api/transactions/<account_number>/
```

**Response:**
```json
{
    "success": true,
    "customer": {
        "id": 1,
        "account_number": "ACC001",
        "name": "Valentino Phiri",
        "phone": "+265899001155",
        "address": "123 Lilongwe Avenue, Lilongwe",
        "meter_number": "MTR001",
        "created_at": "2026-03-15T10:30:00Z"
    },
    "transactions": [
        {
            "id": 1,
            "customer": 1,
            "customer_name": "Valentino Phiri",
            "customer_account_number": "ACC001",
            "amount": "2500.00",
            "payment_status": "success",
            "payment_reference": "PAY-ABC1234567",
            "created_at": "2026-03-15T11:00:00Z"
        },
        {
            "id": 2,
            "customer": 1,
            "customer_name": "Valentino Phiri",
            "customer_account_number": "ACC001",
            "amount": "1500.00",
            "payment_status": "success",
            "payment_reference": "PAY-DEF9876543",
            "created_at": "2026-02-15T09:30:00Z"
        }
    ]
}
```

## Getting Started

### Prerequisites
- Python 3.8+
- pip
- Node.js (optional, for npm packages)
- Windows, macOS, or Linux

### Backend Setup

1. **Navigate to Backend Directory**
   ```bash
   cd Backend/wbbm
   ```

2. **Create Virtual Environment** (if not already created)
   ```bash
   python -m venv .venv
   ```

3. **Activate Virtual Environment**
   - Windows:
     ```bash
     .venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source .venv/bin/activate
     ```

4. **Install Dependencies**
   ```bash
   pip install django djangorestframework django-cors-headers
   ```

5. **Run Migrations**
   ```bash
   python manage.py migrate
   ```

6. **Load Sample Data**
   ```bash
   python manage.py load_sample_data
   ```

7. **Create Superuser (Optional, for Admin)**
   ```bash
   python manage.py createsuperuser
   ```

8. **Start Development Server**
   ```bash
   python manage.py runserver
   ```
   Server runs on: `http://localhost:8000`

### Frontend Setup

1. **Navigate to Frontend Directory**
   ```bash
   cd Frontend
   ```

2. **Open in Browser**
   Simply open `index.html` in your web browser or use a local server:
   
   **Using Python:**
   ```bash
   python -m http.server 3000
   ```
   
   **Using Node.js (http-server):**
   ```bash
   npm install -g http-server
   http-server -p 3000
   ```

3. **Access the Application**
   Open: `http://localhost:3000/index.html`

## Sample Data

The following customers are pre-loaded:

| Account # | Name | Phone | Address | Meter # | Outstanding Bill |
|-----------|------|-------|---------|---------|------------------|
| ACC001 | Valentino Phiri | +265899001155 | 123 Lilongwe Avenue, Lilongwe | MTR001 | MWK 2,500.00 |
| ACC002 | Chimwemwe Banda | +265991234568 | 456 Blantyre Road, Blantyre | MTR002 | MWK 2,500.00 |
| ACC003 | Thokozani Moyo | +265888888888 | 789 Mzuzu Drive, Mzuzu | MTR003 | MWK 2,500.00 |

Use any of these account numbers to test the application.

## Features

✅ **Bill Lookup**: Enter account number to view customer info and outstanding bills
✅ **Payment Processing**: Simulate PayChangu payment for bills
✅ **Transaction History**: View all past payments for a customer
✅ **Responsive Design**: Works on desktop and mobile devices
✅ **Real-time Updates**: Live bill status and payment confirmation
✅ **Error Handling**: Comprehensive error messages

## Technology Stack

**Backend:**
- Django 4.2
- Django REST Framework
- SQLite Database
- Python 3.12

**Frontend:**
- Vanilla JavaScript (no build tools required)
- Fetch API
- CSS3 with animations
- Responsive Grid Layout

## API Testing

### Using cURL

**Check Bill:**
```bash
curl http://localhost:8000/api/bill/ACC001/
```

**Process Payment:**
```bash
curl -X POST http://localhost:8000/api/pay/ \
  -H "Content-Type: application/json" \
  -d '{"account_number": "ACC001", "amount": 2500}'
```

**Get Transactions:**
```bash
curl http://localhost:8000/api/transactions/ACC001/
```

### Using Postman

1. Import the endpoints as shown above
2. Set request method to GET or POST
3. Add JSON body for POST requests
4. Click Send

## Admin Panel

Access Django admin at: `http://localhost:8000/admin`

- Username: (created during superuser setup)
- Password: (created during superuser setup)

Manage:
- Customers
- Bills
- Transactions

## Future Enhancements

- Integrate with actual PayChangu API
- Add user authentication
- Email notifications for payments
- Payment history export (PDF)
- Multiple payment methods
- Mobile app (React Native)
- Advanced analytics and reporting
- Rate limiting and throttling

## Troubleshooting

**CORS Error in Frontend?**
- Ensure Backend is running on http://localhost:8000
- Check CORS_ALLOWED_ORIGINS in settings.py

**Database Errors?**
- Run: `python manage.py migrate`
- Delete db.sqlite3 and re-run migrations if needed

**Port Already in Use?**
- Backend: `python manage.py runserver 8001`
- Frontend: `python -m http.server 3001`
- Update API_URL in frontend accordingly

**Module Not Found?**
- Ensure virtual environment is activated
- Run: `pip install -r requirements.txt`

## License

This is a simple MVP for educational purposes.
