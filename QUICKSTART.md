# Quick Start: Mock Mode Transactions API

## 🚀 Get Started in 30 Seconds

### 1. Start the development server

```bash
npm run dev
```

### 2. Login with test credentials

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Copy the `accessToken` from the response.

### 3. Fetch transactions

```bash
curl -X GET http://localhost:3000/api/transactions \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

You'll see 5 pre-loaded sample transactions!

## 📚 Test Credentials

| Field        | Value              |
| ------------ | ------------------ |
| **Email**    | `test@example.com` |
| **Password** | `password123`      |
| **Name**     | Demo User          |

## 💡 What's Changed

### Transactions API (`/api/transactions`)

- ✅ 100% mock mode by default
- ✅ No database required
- ✅ Removed 100 lines of complex DB code
- ✅ Works with existing JWT & risk scoring

### Mock Auth Service

- ✅ Pre-seeded test user
- ✅ 5 realistic sample transactions
- ✅ Auto-initializes on startup

## 🔧 Environment Variables

```env
# Explicitly enable mock mode (optional)
NEXT_PUBLIC_USE_MOCK_MODE=true

# Leave this empty to use mock mode
DATABASE_URL=
```

## 🎯 Common Operations

### Register a new user (mock)

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+91-9876543210"
  }'
```

### Create a transaction

```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "amount": 2500,
    "recipientId": "user_123",
    "recipientName": "Coffee Shop",
    "merchantName": "Starbucks India",
    "merchantCategory": "Food & Beverage"
  }'
```

Response includes:

- ✅ Transaction details with auto-generated ID
- ✅ Risk assessment (score, decision, confidence)
- ✅ Recommendations (if high-risk)

## 📊 Pre-loaded Sample Transactions

1. **Starbucks** - ₹500 (Food & Beverage) - Low risk
2. **Amazon** - ₹1,200 (Shopping) - Low-Medium risk
3. **Electricity** - ₹2,500 (Utilities) - Medium risk
4. **Uber** - ₹750 (Travel) - Low risk
5. **Hospital** - ₹3,500 (Medical) - Medium risk

## 🐛 Debug Logging

Watch the console for helpful logs:

```
📊 Fetching transactions for user user_demo_001 (mock mode: true)
💳 Creating transaction for user user_demo_001 - Amount: ₹5000
✅ Transaction created: txn_1706705400000_abc123 - Decision: APPROVED
```

## ❓ FAQ

**Q: Will this work without a database?**
A: Yes! That's the whole point. It's designed to work 100% offline with in-memory storage.

**Q: Can I use real user accounts?**
A: Yes! The mock service supports registration. New users get their own transaction history.

**Q: How long do transactions persist?**
A: Transactions stay in memory during the development session. Refresh/restart clears them.

**Q: Can I switch back to database mode?**
A: Yes! Set `DATABASE_URL` in `.env` and the API will use the database instead.

**Q: What about the risk scoring?**
A: It's fully functional. Even in mock mode, transactions get proper risk assessments.

## 📝 Files Modified

- `src/app/api/transactions/route.ts` - Simplified to 171 lines (was 272)
- `src/lib/mock-auth-service.ts` - Added seeding function with sample data

## ✨ Benefits

- 🚀 Fast iteration (no DB setup needed)
- 🧪 Easy testing (predefined data)
- 🔍 Clean code (100+ lines removed)
- 🎯 Production ready (risk scoring works)
- ⚡ Zero latency (in-memory operations)
