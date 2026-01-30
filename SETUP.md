# BankSaathi - Quick Setup Guide

## ✅ What's Been Implemented

### Backend Infrastructure (Complete)
✅ **Database Schema** - PostgreSQL with Drizzle ORM
  - Users table with encrypted PII
  - Transactions with risk scores
  - KYC data management
  - Audit logging
  - Session management

✅ **Security Layer**
  - AES-256-GCM encryption for sensitive data
  - JWT authentication (access + refresh tokens)
  - bcrypt password hashing
  - Field-level encryption
  - Data masking utilities

✅ **API Endpoints**
  - `/api/auth/register` - User registration
  - `/api/auth/login` - User login
  - `/api/transactions` - Create & fetch transactions
  - `/api/kyc/submit` - KYC submission & status

✅ **Enhanced Risk Scoring Engine**
  - Multi-factor risk assessment (amount, location, merchant, behavior, velocity)
  - Confidence scoring with uncertainty quantification
  - Fallback engine for missing data
  - Explainable AI with detailed breakdowns
  - Actionable recommendations

✅ **Frontend Integration**
  - Real API integration (replaced mock data)
  - Real-time risk visualization
  - Interactive risk factor breakdown
  - Loading states & error handling
  - Premium UI with dark mode

## 🚀 Quick Start (3 Steps)

### Step 1: Set Up Database

**Option A: Use Supabase (Easiest - Free Tier)**
1. Go to https://supabase.com
2. Create a new project
3. Copy the connection string from Settings → Database
4. Update `.env.local`:
   ```env
   DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
   ```

**Option B: Local PostgreSQL**
```bash
# Install PostgreSQL (if not installed)
# Windows: Download from postgresql.org
# Mac: brew install postgresql
# Linux: sudo apt install postgresql

# Create database
createdb banksaathi

# Update .env.local
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/banksaathi
```

### Step 2: Push Database Schema

```bash
npm run db:push
```

This creates all tables in your database.

### Step 3: Run the App

```bash
npm run dev
```

Visit `http://localhost:3000`

## 🎯 Testing the Features

### 1. Test Authentication
1. Go to `/register`
2. Create an account
3. Login at `/login`
4. You'll be redirected to the dashboard

### 2. Test Transaction with Risk Assessment
1. Click "Transfer" button on home screen
2. Enter amount: `5000`
3. Click "Validate & Execute"
4. **Observe**:
   - Real-time risk scoring
   - Confidence percentage
   - Risk factor breakdown
   - Fallback mode activation (if data missing)
   - Actionable recommendations

### 3. Test Different Risk Scenarios

**Low Risk (Amount: 500)**
- Should show "Transaction Approved"
- Green indicator
- High confidence score

**Medium Risk (Amount: 3000)**
- Should show "Proceed with Caution"
- Yellow indicator
- Warning about amount vs. average

**High Risk (Amount: 10000)**
- Should show "Manual Review Required"
- Orange/Red indicator
- Multiple risk factors flagged

### 4. Test Fallback Engine
- The system automatically handles missing location/merchant data
- You'll see "Fallback Mode Active" banner
- Confidence score adjusts based on data quality

## 📊 What the Risk Engine Analyzes

1. **Transaction Amount** (Weight: 25%)
   - Compares to your historical average
   - Flags amounts >2x average

2. **Location** (Weight: 20%)
   - Distance from last transaction
   - New location detection
   - Geographic risk areas

3. **Merchant** (Weight: 20%)
   - Merchant reputation
   - Category risk (gambling, crypto, etc.)
   - Frequency of use

4. **Behavioral Patterns** (Weight: 15%)
   - Time of day anomalies
   - Transaction frequency
   - Device fingerprint changes

5. **Velocity** (Weight: 20%)
   - Transactions per day
   - Rapid succession detection

## 🔐 Security Features

### Data Encryption
- **PII Data**: Email, phone, name → AES-256-GCM encrypted
- **KYC Documents**: Aadhaar, PAN → Encrypted at rest
- **Passwords**: bcrypt with 12 salt rounds
- **Tokens**: JWT with HMAC-SHA256

### Authentication Flow
1. User registers/logs in
2. Server generates:
   - Access token (15 min expiry)
   - Refresh token (7 day expiry)
3. Access token stored in cookie
4. Refresh token in localStorage
5. Middleware validates on each request

### Audit Trail
Every action is logged:
- User ID
- Action type
- Resource affected
- IP address
- Timestamp
- Changes made

## 📁 Key Files Created

### Backend
```
src/lib/db/
├── schema.ts              # Complete database schema
└── client.ts              # Database connection

src/lib/security/
├── encryption.ts          # AES-256-GCM encryption
└── jwt.ts                 # JWT token management

src/lib/decision-engine/
└── risk-scorer.ts         # Enhanced risk assessment

src/app/api/
├── auth/
│   ├── login/route.ts
│   └── register/route.ts
├── transactions/route.ts
└── kyc/submit/route.ts

src/middleware.ts          # Route protection
```

### Frontend
```
src/lib/
├── auth-store.ts          # Real API integration
└── services/
    └── transaction-service.ts

src/components/
└── BankSaathiApp.tsx      # Updated with API calls
```

### Configuration
```
.env.local                 # Environment variables
.env.example               # Template
drizzle.config.ts          # Database config
```

## 🎨 UI Features

### Risk Visualization
- **Color-coded indicators**:
  - 🟢 Green: Safe (0-29 risk score)
  - 🟡 Yellow: Caution (30-59)
  - 🟠 Orange: Review (60-89)
  - 🔴 Red: Reject (90-100)

- **Risk Factor Cards**:
  - Individual factor breakdown
  - Severity indicators
  - Progress bars
  - Detailed explanations

- **Fallback Mode Banner**:
  - Shows when data is missing
  - Lists inferred fields
  - Explains confidence impact

- **Recommendations**:
  - Actionable next steps
  - Context-aware suggestions
  - Security tips

## 🐛 Common Issues & Fixes

### "Cannot connect to database"
```bash
# Check if PostgreSQL is running
# Windows: Services → PostgreSQL
# Mac/Linux: sudo service postgresql status

# Test connection
psql -h localhost -U postgres -d banksaathi
```

### "JWT_SECRET not found"
```bash
# Make sure .env.local exists
cp .env.example .env.local

# Generate secure secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### "Module not found" errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Database tables not created
```bash
# Push schema again
npm run db:push

# Or generate migrations
npm run db:generate
npm run db:migrate
```

## 📈 Next Steps

### Immediate (Ready to Implement)
1. **Real-time Notifications** - WebSocket integration
2. **Email Verification** - SendGrid/Resend integration
3. **Document Upload** - S3/Cloudflare R2 for KYC docs
4. **Admin Dashboard** - User management interface

### Short-term (1-2 weeks)
1. **ML Fraud Detection** - TensorFlow.js integration
2. **Payment Gateway** - Stripe integration
3. **SMS Notifications** - Twilio integration
4. **Advanced Analytics** - Charts and insights

### Long-term (1-3 months)
1. **Mobile App** - React Native
2. **Multi-currency** - Forex integration
3. **Investment Features** - Portfolio management
4. **Open Banking** - Plaid/Yodlee integration

## 💡 Pro Tips

1. **Use Supabase for Quick Start**
   - Free PostgreSQL database
   - Built-in auth (optional)
   - Real-time subscriptions
   - No server management

2. **Monitor Database Performance**
   ```bash
   npm run db:studio
   ```
   Opens Drizzle Studio for visual database management

3. **Test with Different Amounts**
   - 500: Low risk
   - 2500: Medium risk
   - 5000: High risk
   - 10000: Very high risk

4. **Check Audit Logs**
   - All transactions are logged
   - Query `audit_logs` table
   - Track user actions

5. **Use Dark Mode**
   - Toggle in UI
   - All components support dark mode
   - Premium aesthetic

## 🎓 Learning Resources

### Understanding the Code
- **Risk Scorer**: `src/lib/decision-engine/risk-scorer.ts`
  - Multi-factor analysis
  - Weighted scoring
  - Confidence calculation

- **API Routes**: `src/app/api/`
  - RESTful design
  - JWT authentication
  - Error handling

- **Database Schema**: `src/lib/db/schema.ts`
  - Drizzle ORM syntax
  - Relations
  - Indexes

### Technologies Used
- **Next.js 15**: App Router, Server Components
- **Drizzle ORM**: Type-safe database queries
- **PostgreSQL**: Relational database
- **JWT**: Stateless authentication
- **bcrypt**: Password hashing
- **Framer Motion**: Animations
- **Tailwind CSS**: Styling

## 📞 Support

If you encounter issues:
1. Check this guide first
2. Review the main README.md
3. Check console for errors
4. Verify environment variables
5. Test database connection

---

**Status**: ✅ Fully Functional
**Last Updated**: January 31, 2026
**Version**: 1.0.0
