# Quick Start Guide - Water Utility Payment System

## 🚀 Get Started in 5 Minutes

This guide will get you up and running with the Water Utility Payment System MVP.

---

## Prerequisites

- Python 3.8+ installed
- Node.js 14+ installed
- Git (optional)

---

## Step 1: Backend Setup (2 minutes)

### 1.1 Navigate to Backend

```bash
cd d:\PROJ\Group_1\Backend\wbbm
```

### 1.2 Create Virtual Environment (if not already done)

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

### 1.3 Install Dependencies

```bash
pip install django djangorestframework django-cors-headers
```

### 1.4 Run Migrations

```bash
python manage.py migrate
```

### 1.5 Start Django Server

```bash
python manage.py runserver
```

✅ Backend is now running on `http://localhost:8000`

---

## Step 2: Frontend Setup (2 minutes)

### 2.1 Open New Terminal and Navigate to Frontend

```bash
cd d:\PROJ\Group_1\Frontend
```

### 2.2 Install Dependencies

```bash
npm install
# or
pnpm install
```

### 2.3 Start Development Server

```bash
npm run dev
# or
pnpm run dev
```

✅ Frontend is now running on `http://localhost:3000` (or similar)

---

## Step 3: Load Sample Data (Optional - 30 seconds)

If you want to test with pre-loaded customers and bills:

```bash
# In the backend terminal (while in Backend/wbbm directory)
python manage.py shell

# Then in Python shell:
from customers.models import Customer
from billing.models import Bill
from datetime import datetime, timedelta
from django.utils import timezone

# Customer 1
c1 = Customer.objects.create(
    account_number='ACC001',
    name='Kondwani Phiri',
    phone='+265701234567',
    address='123 Lilongwe Street, Lilongwe',
    meter_number='MTR001'
)

# Bill for Customer 1
Bill.objects.create(
    customer=c1,
    billing_month=timezone.now().date().replace(day=1),
    amount_due=2500.00,
    due_date=timezone.now().date() + timedelta(days=30),
    status='unpaid'
)

# Exit
exit()
```

---

## Step 4: Start Using the Application

Open your browser and go to **`http://localhost:3000`**

You'll see 5 tabs:

1. **Register** - Create new customer accounts
2. **My Profile** - View/edit customer information
3. **Check Bill** - Look up outstanding balance
4. **Pay Bill** - Make a payment
5. **History** - View payment history

---

## Test the System

### Test 1: Register a New Customer

1. Click **Register** tab
2. Fill in the form:
   - Account Number: `ACC999`
   - Name: `Your Name`
   - Phone: `+265701234567`
   - Address: `Your Address`
   - Meter Number: `MTR999`
3. Click **Register Account**
4. You should see "Registration successful!"

### Test 2: View Your Profile

1. Click **My Profile** tab
2. Enter: `ACC999`
3. Click **Load Profile**
4. You should see your profile details

### Test 3: Edit Your Profile

1. While in Profile (from Test 2)
2. Click **Edit Profile**
3. Change your phone number
4. Click **Save Changes**
5. Verify the update

### Test 4: Check a Bill (Using Sample Data)

1. Click **Check Bill** tab
2. Enter: `ACC001` (if you created sample data)
3. You should see the customer and outstanding bill

### Test 5: Make a Payment

1. Click **Pay Bill** tab
2. Enter: `ACC001`
3. Enter amount to pay
4. Click **Pay Now**
5. You should see a confirmation message

### Test 6: View Payment History

1. Click **History** tab
2. Enter: `ACC001`
3. You should see all payment transactions

---

## Common Issues & Solutions

### Issue: Backend won't start

```
ERROR: ModuleNotFoundError: No module named 'django'
```

**Solution:**

```bash
# Make sure virtual environment is activated
pip install django djangorestframework django-cors-headers
```

### Issue: Frontend won't connect to backend

```
Error: API connection failed
```

**Solutions:**

1. Verify Django is running on port 8000
2. Check that both servers are running
3. Verify API_URL in `Frontend/src/api.js` is correct

### Issue: Port already in use

```bash
# Run on different port:
# Django
python manage.py runserver 8001

# React
npm run dev -- --port 3001
```

### Issue: Module not found errors in backend

```bash
# Reinstall packages
pip install -r requirements.txt
```

---

## API Testing with cURL

Test the API directly from command line:

### Get Bill

```bash
curl http://localhost:8000/api/bill/ACC001/
```

### Make Payment

```bash
curl -X POST http://localhost:8000/api/pay/ \
  -H "Content-Type: application/json" \
  -d '{"account_number":"ACC001","amount":2500.00}'
```

### Register Customer

```bash
curl -X POST http://localhost:8000/api/customer/register/ \
  -H "Content-Type: application/json" \
  -d '{"account_number":"ACC005","name":"Test User","phone":"+265701234567","address":"Test Address","meter_number":"MTR005"}'
```

---

## File Structure

```
d:\PROJ\Group_1\
├── Backend/
│   └── wbbm/
│       ├── manage.py
│       ├── db.sqlite3
│       ├── customers/
│       ├── billing/
│       ├── transactions/
│       ├── payments/
│       └── wbbm/
├── Frontend/
│   ├── src/
│   │   ├── api.js
│   │   ├── App.js
│   │   ├── components/
│   │   └── styles/
│   └── package.json
├── SYSTEM_DOCUMENTATION.md
└── API_REFERENCE.md
```

---

## Default Sample Credentials

If you loaded sample data, these accounts are pre-created:

| Account | Name          | Phone         | Meter  | Balance |
| ------- | ------------- | ------------- | ------ | ------- |
| ACC001  | Kondwani Phiri  | +265701234567 | MTR001 | 2500.00 |
| ACC002  | Tinenenji Banda | +265702345678 | MTR002 | 2500.00 |
| ACC003  | Mayamiko Chiumia | +265703456789 | MTR003 | 2500.00 |

---

## Next Steps

1. ✅ Explore all features in the application
2. ✅ Create your own test customer accounts
3. ✅ Read `SYSTEM_DOCUMENTATION.md` for detailed info
4. ✅ Check `API_REFERENCE.md` for API endpoints

---

## Database Reset

To clear all data and start fresh:

```bash
# In Backend/wbbm directory with venv activated

# Delete database
rm db.sqlite3

# Recreate database
python manage.py migrate

# Reload sample data (optional)
python manage.py load_sample_data
```

---

## Stop Servers

When you're done:

```bash
# Backend: Press Ctrl+C in backend terminal

# Frontend: Press Ctrl+C in frontend terminal
```

---

## Tips & Tricks

1. **Real-time Testing:** Keep developer console open (F12) to see network requests
2. **Backend Admin:** Go to `http://localhost:8000/admin/` to manage data directly
3. **Check Network:** Go to Network tab in DevTools to see API calls
4. **API Testing:** Use the file NEXT TO THIS FILE called API_REFERENCE.md

---

## Enjoy! 🎉

Your Water Utility Payment System is now ready to use!

For detailed documentation, see **SYSTEM_DOCUMENTATION.md**
