# Water Utility Payment System - API Quick Reference

## Base URL

```
http://localhost:8000/api
```

## Authentication

No authentication required for MVP version.

---

## API Endpoints Summary

| Method | Endpoint                             | Description             |
| ------ | ------------------------------------ | ----------------------- |
| POST   | `/customer/register/`                | Register new customer   |
| GET    | `/customer/<account_number>/`        | Get customer profile    |
| PUT    | `/customer/<account_number>/update/` | Update customer profile |
| GET    | `/bill/<account_number>/`            | Get bill information    |
| POST   | `/pay/`                              | Process payment         |
| GET    | `/transactions/<account_number>/`    | Get transaction history |

---

## Detailed Endpoint Reference

### 1. Register New Customer

**Endpoint:** `POST /api/customer/register/`

**Request:**

```bash
curl -X POST http://localhost:8000/api/customer/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "account_number": "ACC004",
    "name": "Jane Smith",
    "phone": "+254701234567",
    "address": "100 Main Street, Nairobi",
    "meter_number": "MTR004"
  }'
```

**Success Response (201):**

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

**Error Response (400):**

```json
{
  "success": false,
  "message": "Customer with this account number already exists"
}
```

---

### 2. Get Customer Profile

**Endpoint:** `GET /api/customer/<account_number>/`

**Request:**

```bash
curl http://localhost:8000/api/customer/ACC001/
```

**Response (200):**

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

**Error Response (404):**

```json
{
  "success": false,
  "message": "Customer not found"
}
```

---

### 3. Update Customer Profile

**Endpoint:** `PUT /api/customer/<account_number>/update/`

**Request:**

```bash
curl -X PUT http://localhost:8000/api/customer/ACC001/update/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John M. Musyoka",
    "phone": "+254702234567",
    "address": "456 Nairobi Street, Nairobi"
  }'
```

**Response (200):**

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

### 4. Get Bill Information

**Endpoint:** `GET /api/bill/<account_number>/`

**Request:**

```bash
curl http://localhost:8000/api/bill/ACC001/
```

**Response (200):**

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
    "customer_name": "John Musyoka",
    "customer_account_number": "ACC001",
    "billing_month": "2026-03-01",
    "amount_due": "2500.00",
    "due_date": "2026-03-31",
    "status": "unpaid",
    "created_at": "2026-03-15T10:00:00Z"
  }
}
```

**No Outstanding Bills Response (200):**

```json
{
  "success": true,
  "customer": { ... },
  "bill": null,
  "message": "No outstanding bills"
}
```

---

### 5. Process Payment

**Endpoint:** `POST /api/pay/`

**Request:**

```bash
curl -X POST http://localhost:8000/api/pay/ \
  -H "Content-Type: application/json" \
  -d '{
    "account_number": "ACC001",
    "amount": 2500.00
  }'
```

**Success Response (201):**

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

**Error Response (400):**

```json
{
  "success": false,
  "message": "account_number and amount are required"
}
```

---

### 6. Get Transaction History

**Endpoint:** `GET /api/transactions/<account_number>/`

**Request:**

```bash
curl http://localhost:8000/api/transactions/ACC001/
```

**Response (200):**

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
    },
    {
      "id": 2,
      "customer": 1,
      "customer_name": "John Musyoka",
      "customer_account_number": "ACC001",
      "amount": "1500.00",
      "payment_status": "success",
      "payment_reference": "PAY-XYZ9876543",
      "created_at": "2026-03-14T15:20:00Z"
    }
  ]
}
```

---

## Request/Response Format

### Common Headers

```
Content-Type: application/json
Accept: application/json
```

### Status Codes

| Code | Meaning                                 |
| ---- | --------------------------------------- |
| 200  | OK - Request successful                 |
| 201  | Created - Resource created successfully |
| 400  | Bad Request - Invalid data              |
| 404  | Not Found - Resource not found          |
| 500  | Server Error - Internal error           |

---

## Field Validation Rules

### Customer Registration

- `account_number`: Required, must be unique
- `name`: Required, max 100 characters
- `phone`: Required, max 20 characters
- `address`: Required, any length
- `meter_number`: Required, must be unique

### Payment Processing

- `account_number`: Required, must exist
- `amount`: Required, must be numeric and positive

### Profile Update

- `name`: Optional, max 100 characters
- `phone`: Optional, max 20 characters
- `address`: Optional, any length

---

## Example Use Cases

### Scenario 1: New Customer Registration

```bash
# Register
curl -X POST http://localhost:8000/api/customer/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "account_number": "ACC010",
    "name": "Alice Johnson",
    "phone": "+254700123456",
    "address": "150 Industrial Area, Nairobi",
    "meter_number": "MTR010"
  }'

# View profile
curl http://localhost:8000/api/customer/ACC010/

# Update profile
curl -X PUT http://localhost:8000/api/customer/ACC010/update/ \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+254719876543"
  }'
```

### Scenario 2: Check and Pay Bill

```bash
# Check bill
curl http://localhost:8000/api/bill/ACC001/

# Pay bill
curl -X POST http://localhost:8000/api/pay/ \
  -H "Content-Type: application/json" \
  -d '{
    "account_number": "ACC001",
    "amount": 2500.00
  }'

# View transactions
curl http://localhost:8000/api/transactions/ACC001/
```

---

## Pagination

Transaction history supports pagination:

- Default page size: 10 items
- Use `?page=2` to get second page

Example:

```bash
curl http://localhost:8000/api/transactions/ACC001/?page=2
```

---

## Rate Limiting

No rate limiting implemented in MVP version.

---

## CORS Configuration

Frontend on `localhost:3000` is allowed to access this API.
Other origins can be added in Django settings.

---

## Support

For more information, see SYSTEM_DOCUMENTATION.md
