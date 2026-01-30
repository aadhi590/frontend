// Mock Authentication Service - No Database Required
// This allows you to test the app without setting up PostgreSQL

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  emailVerified: boolean;
  mfaEnabled: boolean;
}

// In-memory user storage for development
const mockUsers = new Map<string, any>();
const mockSessions = new Map<string, any>();
const mockTransactions = new Map<string, any[]>();

// Mock sample transactions
const MOCK_TRANSACTIONS = [
  {
    amount: 500,
    recipientName: "Starbucks",
    merchantCategory: "Food & Beverage",
    riskScore: 2,
  },
  {
    amount: 1200,
    recipientName: "Amazon",
    merchantCategory: "Shopping",
    riskScore: 15,
  },
  {
    amount: 2500,
    recipientName: "Electricity Bill",
    merchantCategory: "Utilities",
    riskScore: 8,
  },
  {
    amount: 750,
    recipientName: "Uber",
    merchantCategory: "Travel",
    riskScore: 5,
  },
  {
    amount: 3500,
    recipientName: "Hospital",
    merchantCategory: "Medical",
    riskScore: 12,
  },
];

// Initialize default test user
const seedMockData = () => {
  const defaultUser = {
    id: "user_demo_001",
    email: "test@example.com",
    passwordHash: "password123",
    name: "Demo User",
    phone: "+91-9999999999",
    emailVerified: true,
    mfaEnabled: false,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
  };

  mockUsers.set("test@example.com", defaultUser);

  // Seed sample transactions
  const transactions = MOCK_TRANSACTIONS.map((txn, i) => ({
    id: `txn_demo_${i + 1}`,
    userId: defaultUser.id,
    ...txn,
    recipientId: `recipient_${i}`,
    merchantName: txn.recipientName,
    decision: "APPROVED",
    fallbackUsed: false,
    createdAt: new Date(
      Date.now() - (5 - i) * 24 * 60 * 60 * 1000,
    ).toISOString(),
    status: "COMPLETED",
  }));

  mockTransactions.set(defaultUser.id, transactions);
};

// Seed on module load
seedMockData();

export const mockAuthService = {
  async register(
    name: string,
    email: string,
    password: string,
    phone?: string,
  ) {
    // Check if user exists
    if (mockUsers.has(email.toLowerCase())) {
      throw new Error("Email already registered");
    }

    const user = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: email.toLowerCase(),
      passwordHash: password, // In real app, this would be hashed
      name,
      phone: phone || null,
      emailVerified: false,
      mfaEnabled: false,
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    mockUsers.set(email.toLowerCase(), user);
    mockTransactions.set(user.id, []);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      emailVerified: user.emailVerified,
      mfaEnabled: user.mfaEnabled,
    };
  },

  async login(email: string, password: string) {
    const user = mockUsers.get(email.toLowerCase());

    if (!user) {
      throw new Error("Invalid credentials");
    }

    if (user.passwordHash !== password) {
      throw new Error("Invalid credentials");
    }

    if (!user.isActive) {
      throw new Error("Account is deactivated");
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      emailVerified: user.emailVerified,
      mfaEnabled: user.mfaEnabled,
    };
  },

  async createTransaction(userId: string, data: any) {
    const userTransactions = mockTransactions.get(userId) || [];

    const transaction = {
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      ...data,
      createdAt: new Date().toISOString(),
      status: "PENDING",
    };

    userTransactions.push(transaction);
    mockTransactions.set(userId, userTransactions);

    return transaction;
  },

  async getTransactions(
    userId: string,
    limit: number = 10,
    offset: number = 0,
  ) {
    const userTransactions = mockTransactions.get(userId) || [];
    return userTransactions.slice(offset, offset + limit);
  },

  async getUserHistory(userId: string) {
    const transactions = mockTransactions.get(userId) || [];

    if (transactions.length === 0) {
      return {
        avgAmount: 1200,
        maxAmount: 5000,
        transactionCount: 0,
        frequentMerchants: [],
        frequentCategories: [],
        avgDailyTransactions: 0,
      };
    }

    const amounts = transactions.map((t) => parseFloat(t.amount));
    const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const maxAmount = Math.max(...amounts);

    return {
      avgAmount,
      maxAmount,
      transactionCount: transactions.length,
      lastTransactionTime: transactions[transactions.length - 1]?.createdAt,
      frequentMerchants: [
        ...new Set(transactions.map((t) => t.merchantName).filter(Boolean)),
      ],
      frequentCategories: [
        ...new Set(transactions.map((t) => t.merchantCategory).filter(Boolean)),
      ],
      avgDailyTransactions: transactions.length,
    };
  },
};
