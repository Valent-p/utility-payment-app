# API Documentation with Examples

## Base URL
```
http://localhost:8000/api
```

## Endpoints

### 1. Get Bill by Account Number

**Endpoint:**
```
GET /api/bill/<account_number>/
```

**Example Request:**
```bash
curl http://localhost:8000/api/bill/ACC001/
```

**Successful Response (200):**
```json
{
    "success": true,
    "customer": {
        "id": 1,
        "account_number": "ACC001",
        "name": "Kondwani Phiri",
        "phone": "+265701234567",
        "address": "123 Lilongwe Street, Lilongwe",
        "meter_number": "MTR001",
        "created_at": "2026-03-15T10:30:45.123456Z"
    },
    "bill": {
        "id": 1,
        "customer": 1,
        "customer_name": "Kondwani Phiri",
        "customer_account_number": "ACC001",
        "billing_month": "2026-03-01",
        "amount_due": "2500.00",
        "due_date": "2026-03-31",
        "status": "unpaid",
        "created_at": "2026-03-15T10:30:45.123456Z"
    }
}
```

**When No Outstanding Bills:**
```json
{
    "success": true,
    "customer": {
        "id": 1,
        "account_number": "ACC001",
        "name": "Kondwani Phiri",
        "phone": "+265701234567",
        "address": "123 Lilongwe Street, Lilongwe",
        "meter_number": "MTR001",
        "created_at": "2026-03-15T10:30:45.123456Z"
    },
    "bill": null,
    "message": "No outstanding bills"
}
```

**Error Response (404):**
```json
{
    "success": false,
    "message": "Customer not found"
}
```

---

### 2. Process Payment

**Endpoint:**
```
POST /api/pay/
Content-Type: application/json
```

**Example Request:**
```bash
curl -X POST http://localhost:8000/api/pay/ \
  -H "Content-Type: application/json" \
  -d '{
    "account_number": "ACC001",
    "amount": 2500.00
  }'
```

**Request Body Schema:**
```json
{
    "account_number": "string (required)",
    "amount": "number (required, > 0)"
}
```

**Successful Response (201):**
```json
{
    "success": true,
    "message": "Payment processed successfully",
    "transaction": {
        "id": 1,
        "customer": 1,
        "customer_name": "Kondwani Phiri",
        "customer_account_number": "ACC001",
        "amount": "2500.00",
        "payment_status": "success",
        "payment_reference": "PAY-A1B2C3D4E5",
        "created_at": "2026-03-15T11:00:00.123456Z"
    },
    "bill_status": "paid"
}
```

**When Bill is Not Fully Covered:**
```json
{
    "success": true,
    "message": "Payment processed successfully",
    "transaction": {
        "id": 2,
        "customer": 1,
        "customer_name": "Kondwani Phiri",
        "customer_account_number": "ACC001",
        "amount": "1000.00",
        "payment_status": "success",
        "payment_reference": "PAY-F6G7H8I9J0",
        "created_at": "2026-03-15T11:15:00.123456Z"
    },
    "bill_status": "no_bill"
}
```

**Error Response - Missing Fields (400):**
```json
{
    "success": false,
    "message": "account_number and amount are required"
}
```

**Error Response - Invalid Amount (400):**
```json
{
    "success": false,
    "message": "Invalid amount"
}
```

**Error Response - Account Not Found (404):**
```json
{
    "success": false,
    "message": "Customer not found"
}
```

---

### 3. Get Transaction History

**Endpoint:**
```
GET /api/transactions/<account_number>/
```

**Example Request:**
```bash
curl http://localhost:8000/api/transactions/ACC001/
```

**Successful Response (200) - With Transactions:**
```json
{
    "success": true,
    "customer": {
        "id": 1,
        "account_number": "ACC001",
        "name": "Kondwani Phiri",
        "phone": "+265701234567",
        "address": "123 Lilongwe Street, Lilongwe",
        "meter_number": "MTR001",
        "created_at": "2026-03-15T10:30:45.123456Z"
    },
    "transactions": [
        {
            "id": 1,
            "customer": 1,
            "customer_name": "Kondwani Phiri",
            "customer_account_number": "ACC001",
            "amount": "2500.00",
            "payment_status": "success",
            "payment_reference": "PAY-A1B2C3D4E5",
            "created_at": "2026-03-15T11:00:00.123456Z"
        },
        {
            "id": 2,
            "customer": 1,
            "customer_name": "Kondwani Phiri",
            "customer_account_number": "ACC001",
            "amount": "1500.00",
            "payment_status": "success",
            "payment_reference": "PAY-F6G7H8I9J0",
            "created_at": "2026-02-15T09:30:00.123456Z"
        }
    ]
}
```

**Successful Response (200) - No Transactions:**
```json
{
    "success": true,
    "customer": {
        "id": 2,
        "account_number": "ACC002",
        "name": "Tinenenji Banda",
        "phone": "+265702345678",
        "address": "456 Blantyre Road, Blantyre",
        "meter_number": "MTR002",
        "created_at": "2026-03-15T10:30:45.123456Z"
    },
    "transactions": []
}
```

**Error Response (404):**
```json
{
    "success": false,
    "message": "Customer not found"
}
```

---

## Testing with JavaScript/Fetch

### Example 1: Check Bill

```javascript
async function checkBill(accountNumber) {
    try {
        const response = await fetch(`http://localhost:8000/api/bill/${accountNumber}/`);
        const data = await response.json();
        
        if (data.success) {
            console.log('Customer:', data.customer.name);
            if (data.bill) {
                console.log('Outstanding Bill:', data.bill.amount_due);
            } else {
                console.log('No outstanding bills');
            }
        } else {
            console.error('Error:', data.message);
        }
    } catch (error) {
        console.error('Network error:', error);
    }
}

checkBill('ACC001');
```

### Example 2: Process Payment

```javascript
async function payBill(accountNumber, amount) {
    try {
        const response = await fetch('http://localhost:8000/api/pay/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                account_number: accountNumber,
                amount: parseFloat(amount)
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            console.log('Payment successful!');
            console.log('Reference:', data.transaction.payment_reference);
            console.log('Status:', data.transaction.payment_status);
        } else {
            console.error('Error:', data.message);
        }
    } catch (error) {
        console.error('Network error:', error);
    }
}

payBill('ACC001', 2500.00);
```

### Example 3: View Transaction History

```javascript
async function getHistory(accountNumber) {
    try {
        const response = await fetch(`http://localhost:8000/api/transactions/${accountNumber}/`);
        const data = await response.json();
        
        if (data.success) {
            console.log(`Customer: ${data.customer.name}`);
            console.log(`Total Transactions: ${data.transactions.length}`);
            
            data.transactions.forEach((txn, index) => {
                console.log(`${index + 1}. ${txn.payment_reference} - MWK ${txn.amount} (${txn.payment_status})`);
            });
        } else {
            console.error('Error:', data.message);
        }
    } catch (error) {
        console.error('Network error:', error);
    }
}

getHistory('ACC001');
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input parameters |
| 404 | Not Found - Customer or resource not found |
| 500 | Internal Server Error - Server issue |

---

## Response Format

All responses follow this format:

**Success:**
```json
{
    "success": true,
    "message": "Optional message",
    "data": {...}
}
```

**Error:**
```json
{
    "success": false,
    "message": "Error description"
}
```

---

## Payment Status Values

- `pending` - Payment is waiting for processing
- `success` - Payment was successful
- `failed` - Payment failed

---

## Bill Status Values

- `unpaid` - Bill has not been paid
- `paid` - Bill has been paid

---

## Quick Test Account Numbers

Use these pre-loaded test accounts:
- `ACC001` - Kondwani Phiri (MWK 2,500 outstanding)
- `ACC002` - Tinenenji Banda (MWK 2,500 outstanding)
- `ACC003` - Mayamiko Chiumia (MWK 2,500 outstanding)
