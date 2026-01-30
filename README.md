# BankSaathi - Scalable FinTech Platform

A production-ready, scalable FinTech platform that enables real-time financial decision-making with intelligent risk assessment, security, and compliance features.

## 🚀 Features Implemented

### ✅ Backend Infrastructure
- **RESTful API** with Next.js API routes
- **PostgreSQL Database** with Drizzle ORM
- **JWT Authentication** with access and refresh tokens
- **Field-level Encryption** for PII data (AES-256-GCM)
- **Password Hashing** with bcrypt (12 salt rounds)
- **Session Management** with token tracking

### ✅ Security & Compliance
- **End-to-end Encryption** for sensitive data
- **Route Protection** with middleware
- **GDPR-ready** data structures
- **Audit Logging** for all operations
- **Data Masking** utilities for PII

### ✅ Intelligent Decision Engine
- **Enhanced Risk Scoring** with multi-factor analysis:
  - Amount-based risk assessment
  - Location-based anomaly detection
  - Merchant risk evaluation
  - Behavioral pattern analysis
  - Velocity checks
- **Fallback Engine** for handling missing data
- **Confidence Scoring** with uncertainty quantification
- **Explainable AI** with detailed risk breakdowns
- **Actionable Recommendations**

### ✅ Real-time Transaction Processing
- **Transaction API** with risk assessment
- **Historical Analysis** for pattern detection
- **Real-time Decision Making** (< 500ms)
- **Transaction Status Tracking**

### ✅ KYC Management
- **Document Submission** API
- **Aadhaar & PAN Validation**
- **Encrypted Storage** of sensitive documents
- **Status Tracking** (NOT_STARTED → IN_PROGRESS → PENDING → APPROVED/REJECTED)

### ✅ Premium Frontend
- **CRED-inspired Design** with glassmorphism
- **Real-time Risk Visualization**
- **Interactive Risk Factor Breakdown**
- **Loading States & Error Handling**
- **Dark Mode Support**
- **Responsive Design**

## 📋 Prerequisites

- **Node.js** 20+ 
- **PostgreSQL** 14+
- **npm** or **yarn**

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd frontend-1
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Update `.env.local` with your configuration:

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/banksaathi

# Security (Generate secure random strings for production)
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
ENCRYPTION_KEY=your-32-byte-encryption-key

# Node Environment
NODE_ENV=development
```

### 4. Set Up Database

#### Option A: Local PostgreSQL

1. Install PostgreSQL 14+
2. Create database:
```bash
createdb banksaathi
```

3. Run migrations:
```bash
npm run db:push
```

#### Option B: Managed Database (Recommended)

Use a managed PostgreSQL service:
- **Supabase** (Free tier available)
- **Neon** (Serverless PostgreSQL)
- **AWS RDS**
- **Railway**

Update `DATABASE_URL` in `.env.local` with your connection string.

### 5. Generate Database Schema

```bash
npm run db:generate
npm run db:push
```

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
frontend-1/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts          # Login endpoint
│   │   │   │   └── register/route.ts       # Registration endpoint
│   │   │   ├── transactions/route.ts       # Transaction CRUD
│   │   │   └── kyc/submit/route.ts         # KYC submission
│   │   ├── dashboard/
│   │   ├── analytics/
│   │   ├── security/
│   │   ├── vault/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── BankSaathiApp.tsx              # Main app component
│   │   └── ui/
│   │       └── bank-saathi/
│   │           ├── LayoutComponents.tsx    # Layout components
│   │           └── BaseComponents.tsx      # Base UI components
│   ├── lib/
│   │   ├── db/
│   │   │   ├── schema.ts                  # Database schema
│   │   │   └── client.ts                  # Database client
│   │   ├── security/
│   │   │   ├── encryption.ts              # Encryption utilities
│   │   │   └── jwt.ts                     # JWT management
│   │   ├── decision-engine/
│   │   │   └── risk-scorer.ts             # Risk assessment engine
│   │   ├── services/
│   │   │   └── transaction-service.ts     # Transaction service
│   │   ├── auth-store.ts                  # Auth state management
│   │   └── utils.ts
│   └── middleware.ts                       # Route protection
├── .env.local                              # Environment variables
├── .env.example                            # Environment template
├── drizzle.config.ts                       # Drizzle ORM config
├── package.json
└── README.md
```

## 🔑 API Endpoints

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "phone": "+1234567890"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### Transactions

#### Create Transaction
```http
POST /api/transactions
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "amount": 5000,
  "recipientId": "@recipient-username",
  "recipientName": "Recipient Name",
  "merchantName": "Amazon",
  "merchantCategory": "shopping",
  "location": {
    "lat": 28.6139,
    "lng": 77.2090,
    "name": "New Delhi"
  }
}
```

#### Get Transactions
```http
GET /api/transactions?limit=10&offset=0
Authorization: Bearer <access_token>
```

### KYC

#### Submit KYC
```http
POST /api/kyc/submit
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "aadhaarNumber": "123456789012",
  "panNumber": "ABCDE1234F",
  "address": "123 Main St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "dob": "1990-01-01"
}
```

#### Get KYC Status
```http
GET /api/kyc/submit
Authorization: Bearer <access_token>
```

## 🧪 Testing

### Manual Testing

1. **Register a new user**
   - Navigate to `/register`
   - Fill in the form
   - Verify JWT tokens are stored

2. **Create a transaction**
   - Navigate to the payment flow
   - Enter an amount
   - Observe real-time risk assessment
   - Check risk factor breakdown

3. **Test fallback engine**
   - Create transactions without location/merchant data
   - Verify fallback mode activates
   - Check confidence scores

### API Testing with cURL

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Create Transaction (replace TOKEN with actual token)
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"amount":1000,"recipientId":"@test"}'
```

## 🔒 Security Best Practices

### For Development
- Use `.env.local` for local secrets (never commit)
- Use weak secrets for development only
- Enable debug logging

### For Production
- Generate strong random secrets:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- Use environment variables from hosting platform
- Enable HTTPS only
- Set `NODE_ENV=production`
- Use managed database with SSL
- Enable rate limiting
- Set up monitoring and alerting

## 📊 Database Schema

### Key Tables

- **users**: User accounts with encrypted PII
- **transactions**: Transaction records with risk scores
- **risk_assessments**: Detailed risk analysis
- **kyc_data**: KYC information (encrypted)
- **kyc_documents**: Document storage references
- **audit_logs**: Complete audit trail
- **user_sessions**: JWT session management

## 🎨 Design System

### Colors
- **Primary Green**: `#1A5F3F` - Trust and security
- **Accent Gold**: `#D4AF37` - Premium feel
- **Safe Green**: `#10B981` - Approved transactions
- **Warn Yellow**: `#F59E0B` - Caution
- **Risk Red**: `#EF4444` - Rejected/high risk

### Typography
- **Font**: System fonts with fallback
- **Weights**: 400 (regular), 700 (bold), 900 (black)
- **Tracking**: Tight for headings, wide for labels

## 🚧 Roadmap

### Phase 2 (Next Steps)
- [ ] Real-time WebSocket notifications
- [ ] ML-based fraud detection
- [ ] Document verification integration
- [ ] Payment gateway integration (Stripe)
- [ ] Email/SMS notifications
- [ ] Admin dashboard
- [ ] Analytics and reporting
- [ ] Mobile app (React Native)

### Phase 3 (Future)
- [ ] Multi-currency support
- [ ] Cryptocurrency integration
- [ ] Investment portfolio management
- [ ] Bill payment automation
- [ ] Open banking integration
- [ ] Credit scoring and lending

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Test database connection
psql -h localhost -U postgres -d banksaathi

# Check if database exists
psql -U postgres -c "\l"

# Recreate database
dropdb banksaathi
createdb banksaathi
npm run db:push
```

### JWT Token Issues
- Ensure `JWT_SECRET` is set in `.env.local`
- Check token expiry (access tokens expire in 15 minutes)
- Use refresh token to get new access token

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install --legacy-peer-deps
npm run dev
```

## 📝 License

MIT

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📧 Support

For issues and questions:
- Create an issue on GitHub
- Email: support@banksaathi.com

---

Built with ❤️ using Next.js, PostgreSQL, and Drizzle ORM
