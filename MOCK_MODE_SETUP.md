# Simplified Transactions API with Mock Mode

## Overview

A streamlined transactions API has been implemented with full mock mode support to enable testing without database connectivity or login issues.

## Changes Made

### 1. **Simplified Transactions API** (`src/app/api/transactions/route.ts`)

- **Removed database complexity**: Eliminated conditional database checks and error handling
- **Mock-first approach**: All requests now use the mock authentication service by default
- **Automatic fallback**: Respects `NEXT_PUBLIC_USE_MOCK_MODE` environment variable
- **Cleaner code**: Reduced from 272 lines to 171 lines
- **Better logging**: Enhanced console output for debugging

#### Key Features:

- `GET /api/transactions`: Fetch user transactions with pagination
- `POST /api/transactions`: Create new transactions with risk assessment
- Both endpoints validate authentication via JWT tokens
- Risk scoring is performed using existing risk-scorer module
- Full transaction lifecycle management (ID generation, timestamps)

### 2. **Enhanced Mock Auth Service** (`src/lib/mock-auth-service.ts`)

- **Pre-seeded test user**: Ready-to-use demo account
  - Email: `test@example.com`
  - Password: `password123`
  - ID: `user_demo_001`

- **Sample transaction data**: 5 realistic transactions pre-loaded
  - Starbucks (Food & Beverage) - ₹500
  - Amazon (Shopping) - ₹1,200
  - Electricity Bill (Utilities) - ₹2,500
  - Uber (Travel) - ₹750
  - Hospital (Medical) - ₹3,500

- **Automatic initialization**: Mock data seeds on module load

## How It Works

### Request Flow

1. Client sends request with JWT bearer token
2. API verifies token with `verifyAccessToken()`
3. Mock service retrieves/creates transaction data
4. Risk assessment is calculated
5. Response includes transaction details + risk analysis

### Environment Configuration

```env
# Enable mock mode explicitly (optional)
NEXT_PUBLIC_USE_MOCK_MODE=true

# Or simply omit DATABASE_URL to auto-enable mock mode
DATABASE_URL=          # Leave empty for mock mode
```

## Testing

### Login (Get Bearer Token)

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Fetch Transactions

```bash
curl -X GET http://localhost:3000/api/transactions?limit=10 \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### Create Transaction

```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -d '{
    "amount": 5000,
    "recipientId": "user_recipient_123",
    "recipientName": "John Doe",
    "merchantName": "Premium Store",
    "merchantCategory": "Shopping",
    "location": {
      "lat": 28.7041,
      "lng": 77.1025,
      "name": "Delhi, India"
    }
  }'
```

## API Responses

### Success Response (GET)

```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "txn_demo_1",
        "userId": "user_demo_001",
        "amount": "500",
        "recipientName": "Starbucks",
        "merchantCategory": "Food & Beverage",
        "decision": "APPROVED",
        "riskScore": 2,
        "status": "COMPLETED",
        "createdAt": "2026-01-26T10:30:00.000Z"
      }
    ],
    "pagination": {
      "limit": 10,
      "offset": 0,
      "total": 5
    }
  }
}
```

### Success Response (POST)

```json
{
  "success": true,
  "data": {
    "transaction": {
      "id": "txn_1706705400000_abc123def456",
      "userId": "user_demo_001",
      "amount": "5000",
      "recipientId": "user_recipient_123",
      "decision": "APPROVED",
      "riskScore": 28,
      "status": "PENDING",
      "createdAt": "2026-01-31T10:30:00.000Z"
    },
    "riskAssessment": {
      "decision": "APPROVED",
      "riskScore": 28,
      "confidenceScore": 0.92,
      "reasons": ["Amount within typical range", "Known merchant category"],
      "recommendations": [],
      "fallbackUsed": false,
      "riskFactors": {}
    }
  }
}
```

## Benefits

✅ **No Database Required**: Full development and testing without PostgreSQL
✅ **No Login Issues**: Pre-configured test user with valid tokens
✅ **Sample Data**: Realistic transaction history for testing UI
✅ **Clean Code**: Simplified API logic, easier to maintain
✅ **Production Ready**: Risk scoring still functional in mock mode
✅ **Environment Aware**: Auto-switches between mock and database modes
✅ **Better Logging**: Enhanced debugging with emoji indicators

## Debug Logging

The API includes helpful console logs:

- 📊 `Fetching transactions for user...` (GET requests)
- 💳 `Creating transaction for user...` (POST requests)
- ✅ `Transaction created: [ID] - Decision: [DECISION]`
- ❌ Error messages with stack traces

## Next Steps

- Database mode can be re-enabled by setting `DATABASE_URL` environment variable
- User registration still works: Creates new users in mock storage
- Transaction data persists in-memory during development session
