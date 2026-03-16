# Water Utility Payment System - Full Documentation

## Overview
A simple MVP full-stack application for a water utility payment system that integrates payment simulation with PayChangu. Built with Django REST Framework backend and React.js frontend.

---

## Backend Setup

### Installation
1. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install django djangorestframework django-cors-headers
   ```

3. Run migrations:
   ```bash
   python manage.py migrate
   ```

4. Load sample data (optional):
   ```bash
   python manage.py load_sample_data
   ```

5. Start development server:
   ```bash
   python manage.py runserver
   ```

### Database Models

#### Customer Model
```python
class Customer(models.Model):
    account_number    # CharField(max_length=50, unique=True)
    name              # CharField(max_length=100)
    phone             # CharField(max_length=20)
    address           # TextField
    meter_number      # CharField(max_length=50, unique=True)
    created_at        # DateTimeField(auto_now_add=True)
    updated_at        # DateTimeField(auto_now=True)
```

#### Bill Model
```python
class Bill(models.Model):
    customer          # ForeignKey(Customer)
    billing_month     # DateField
    amount_due        # DecimalField
    due_date          # DateField
    status            # CharField (unpaid/paid)
    created_at        # DateTimeField(auto_now_add=True)
    updated_at        # DateTimeField(auto_now=True)
```

#### Transaction Model
```python
class Transaction(models.Model):
    customer          # ForeignKey(Customer)
    amount            # DecimalField
    payment_status    # CharField (pending/success/failed)
    payment_reference # CharField(max_length=100, unique=True)
    created_at        # DateTimeField(auto_now_add=True)
    updated_at        # DateTimeField(auto_now=True)
```

---

## API Endpoints

### Bills & Payments

#### 1. Get Bill and Customer Info
```
GET /api/bill/<account_number>/
```
**Response:**
```json
{
  "success": true,
  "customer": {
    "id": 1,
    "account_number": "ACC001",
    "name": "John Musyoka",
    "phone": "+254701234567",
    "address": "123 Nairobi Street, Nairobi",
    "meter_number": "MTR001",
    "created_at": "2026-03-15T10:00:00Z"
  },
  "bill": {
    "id": 1,
    "customer": 1,
    "billing_month": "2026-03-01",
    "amount_due": "2500.00",
    "due_date": "2026-03-31",
    "status": "unpaid",
    "created_at": "2026-03-15T10:00:00Z"
  }
}
```

#### 2. Process Payment
```
POST /api/pay/
```
**Request Body:**
```json
{
  "account_number": "ACC001",
  "amount": 2500.00
}
```
**Response:**
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "transaction": {
    "id": 1,
    "customer": 1,
    "customer_name": "John Musyoka",
    "customer_account_number": "ACC001",
    "amount": "2500.00",
    "payment_status": "success",
    "payment_reference": "PAY-ABC1234567",
    "created_at": "2026-03-15T10:05:00Z"
  },
  "bill_status": "paid"
}
```

#### 3. Get Transaction History
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
    "name": "John Musyoka",
    "phone": "+254701234567",
    "address": "123 Nairobi Street, Nairobi",
    "meter_number": "MTR001",
    "created_at": "2026-03-15T10:00:00Z"
  },
  "transactions": [
    {
      "id": 1,
      "customer": 1,
      "customer_name": "John Musyoka",
      "customer_account_number": "ACC001",
      "amount": "2500.00",
      "payment_status": "success",
      "payment_reference": "PAY-ABC1234567",
      "created_at": "2026-03-15T10:05:00Z"
    }
  ]
}
```

### Account Management

#### 4. Register New Customer
```
POST /api/customer/register/
```
**Request Body:**
```json
{
  "account_number": "ACC004",
  "name": "Jane Smith",
  "phone": "+254701234567",
  "address": "100 Main Street, Nairobi",
  "meter_number": "MTR004"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Customer registered successfully",
  "customer": {
    "id": 4,
    "account_number": "ACC004",
    "name": "Jane Smith",
    "phone": "+254701234567",
    "address": "100 Main Street, Nairobi",
    "meter_number": "MTR004",
    "created_at": "2026-03-15T10:30:00Z"
  }
}
```

#### 5. Get Customer Profile
```
GET /api/customer/<account_number>/
```
**Response:**
```json
{
  "success": true,
  "customer": {
    "id": 1,
    "account_number": "ACC001",
    "name": "John Musyoka",
    "phone": "+254701234567",
    "address": "123 Nairobi Street, Nairobi",
    "meter_number": "MTR001",
    "created_at": "2026-03-15T10:00:00Z"
  }
}
```

#### 6. Update Customer Profile
```
PUT /api/customer/<account_number>/update/
```
**Request Body:**
```json
{
  "name": "John M. Musyoka",
  "phone": "+254702234567",
  "address": "456 Nairobi Street, Nairobi"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Customer profile updated successfully",
  "customer": {
    "id": 1,
    "account_number": "ACC001",
    "name": "John M. Musyoka",
    "phone": "+254702234567",
    "address": "456 Nairobi Street, Nairobi",
    "meter_number": "MTR001",
    "created_at": "2026-03-15T10:00:00Z"
  }
}
```

---

## Frontend Setup

### Installation
1. Navigate to Frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Start development server:
   ```bash
   npm run dev
   # or
   pnpm run dev
   ```

### File Structure
```
Frontend/
├── src/
│   ├── api.js                    # API helper functions
│   ├── App.js                    # Main app component
│   ├── components/
│   │   ├── BillLookup.js        # Check bill page
│   │   ├── PaymentPage.js       # Payment processing page
│   │   ├── TransactionHistory.js # Transaction history page
│   │   ├── RegisterCustomer.js  # Customer registration page
│   │   └── CustomerProfile.js   # Customer profile page
│   └── styles/
│       ├── RegisterCustomer.css # Register styles
│       └── CustomerProfile.css  # Profile styles
├── package.json
└── index.html
```

### Components Description

#### 1. RegisterCustomer Component
- **Path:** `src/components/RegisterCustomer.js`
- **Features:**
  - New customer registration form
  - Account number, name, phone, address, meter number fields
  - Validation and error handling
  - Success confirmation message

#### 2. CustomerProfile Component
- **Path:** `src/components/CustomerProfile.js`
- **Features:**
  - Search customer by account number
  - View complete profile information
  - Edit profile (name, phone, address)
  - Save changes functionality

#### 3. BillLookup Component
- **Path:** `src/components/BillLookup.js`
- **Features:**
  - Enter account number to check bill
  - Display customer name and outstanding amount
  - Show bill status (paid/unpaid)

#### 4. PaymentPage Component
- **Path:** `src/components/PaymentPage.js`
- **Features:**
  - Display customer and bill information
  - Amount to pay (pre-filled from bill)
  - Payment confirmation
  - Simulated PayChangu integration

#### 5. TransactionHistory Component
- **Path:** `src/components/TransactionHistory.js`
- **Features:**
  - Display all payment transactions for a customer
  - Payment date, amount, reference number
  - Payment status

---

## API Functions (Frontend)

### api.js Functions

```javascript
// Bill and Payment Functions
fetchBill(accountNumber)           // Get bill info
processPayment(accountNumber, amount) // Process payment
fetchTransactions(accountNumber)   // Get transaction history

// Account Management Functions
registerCustomer(customerData)     // Register new customer
fetchCustomerProfile(accountNumber) // Get customer profile
updateCustomerProfile(accountNumber, customerData) // Update profile
```

---

## Sample Data

The system comes with 3 sample customers and bills:

1. **John Musyoka** (ACC001)
   - Phone: +254701234567
   - Address: 123 Nairobi Street, Nairobi
   - Meter: MTR001
   - Outstanding Bill: 2500.00 KES

2. **Jane Kipchoge** (ACC002)
   - Phone: +254702345678
   - Address: 456 Mombasa Road, Mombasa
   - Meter: MTR002
   - Outstanding Bill: 2500.00 KES

3. **Peter Kariuki** (ACC003)
   - Phone: +254703456789
   - Address: 789 Kisumu Lane, Kisumu
   - Meter: MTR003
   - Outstanding Bill: 2500.00 KES

---

## Features

### Current Features
✅ Customer registration
✅ View customer profile
✅ Edit customer information
✅ Check outstanding bills
✅ Simulate payment processing
✅ View payment history
✅ Payment status tracking
✅ CORS support for cross-origin requests

### Future Enhancements (Not Included in MVP)
- Actual PayChangu integration
- User authentication/login
- Email notifications
- SMS notifications
- Payment scheduling
- Multiple bill management
- Admin dashboard
- Advanced reporting
- Docker containerization

---

## Configuration

### Backend Settings (wbbm/settings.py)
- DEBUG = True (for development)
- ALLOWED_HOSTS = [] (add your hosts as needed)
- CORS_ALLOWED_ORIGINS includes localhost:3000 and localhost:8000

### Frontend API URL
- API_URL = "http://localhost:8000/api" (in src/api.js)

---

## Error Handling

All API responses follow this format:
```json
{
  "success": true/false,
  "message": "Response message",
  "data": {} // optional
}
```

### Common Error Responses

1. **Customer Not Found (404)**
   ```json
   {
     "success": false,
     "message": "Customer not found"
   }
   ```

2. **Missing Required Fields (400)**
   ```json
   {
     "success": false,
     "message": "Missing required fields: account_number, amount"
   }
   ```

3. **Duplicate Account (400)**
   ```json
   {
     "success": false,
     "message": "Customer with this account number already exists"
   }
   ```

---

## Testing the Application

### Manual Testing Steps

1. **Register a Customer:**
   - Go to "Register" tab
   - Fill in all required fields
   - Click "Register Account"
   - Verify confirmation message

2. **View Profile:**
   - Go to "My Profile" tab
   - Enter account number (ACC001, ACC002, or ACC003)
   - Click "Load Profile"
   - View customer information

3. **Edit Profile:**
   - Load profile (as above)
   - Click "Edit Profile"
   - Modify name, phone, or address
   - Click "Save Changes"

4. **Check Bill:**
   - Go to "Check Bill" tab
   - Enter account number
   - View outstanding balance

5. **Make Payment:**
   - Go to "Pay Bill" tab
   - Enter amount
   - Click "Pay Now"
   - Verify payment confirmation

6. **View History:**
   - Go to "History" tab
   - See all payment transactions

---

## Project Structure Summary

```
d:\PROJ\Group_1\
├── Backend/
│   └── wbbm/
│       ├── manage.py
│       ├── db.sqlite3
│       ├── wbbm/              # Project settings
│       ├── customers/         # Customer app
│       ├── billing/           # Billing app
│       ├── transactions/      # Transaction app
│       └── payments/          # API views and URLs
└── Frontend/
    ├── src/
    │   ├── components/        # React components
    │   ├── styles/           # CSS files
    │   ├── api.js            # API functions
    │   └── App.js            # Main app
    └── package.json
```

---

## Troubleshooting

### Django Issues
- **ModuleNotFoundError: No module named 'django'**
  - Solution: Activate virtual environment and run: `pip install django djangorestframework`

- **No migrations to apply**
  - Solution: Models may already be migrated. Run: `python manage.py makemigrations <app_name>`

### React Issues
- **API connection errors**
  - Ensure Django server is running on port 8000
  - Check CORS settings in Django settings.py
  - Verify API_URL in Frontend src/api.js

- **Port already in use**
  - Django: `python manage.py runserver 8001`
  - React: `npm run dev -- --port 3001`

---

## Support & Contact
For issues or questions, refer to the Django and React official documentation.
