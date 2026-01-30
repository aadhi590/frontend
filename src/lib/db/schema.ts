import { pgTable, uuid, varchar, text, timestamp, boolean, decimal, integer, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const kycStatusEnum = pgEnum('kyc_status', ['NOT_STARTED', 'IN_PROGRESS', 'PENDING', 'APPROVED', 'REJECTED']);
export const transactionStatusEnum = pgEnum('transaction_status', ['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'FAILED', 'UNDER_REVIEW']);
export const decisionEnum = pgEnum('decision', ['ALLOW', 'ALLOW_WITH_WARNING', 'REVIEW', 'REJECT']);
export const documentTypeEnum = pgEnum('document_type', ['AADHAAR', 'PAN', 'PASSPORT', 'DRIVING_LICENSE', 'VOTER_ID']);

// Users Table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  phone: varchar('phone', { length: 20 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  lastLogin: timestamp('last_login'),
  isActive: boolean('is_active').default(true).notNull(),
  mfaEnabled: boolean('mfa_enabled').default(false).notNull(),
  mfaSecret: text('mfa_secret'),
  emailVerified: boolean('email_verified').default(false).notNull(),
  phoneVerified: boolean('phone_verified').default(false).notNull(),
});

// KYC Data Table
export const kycData = pgTable('kyc_data', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull().unique(),
  aadhaarNumber: text('aadhaar_number'),
  panNumber: text('pan_number'),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 100 }),
  pincode: varchar('pincode', { length: 10 }),
  dob: timestamp('dob'),
  status: kycStatusEnum('status').default('NOT_STARTED').notNull(),
  submittedAt: timestamp('submitted_at'),
  verifiedAt: timestamp('verified_at'),
  verifiedBy: varchar('verified_by', { length: 100 }),
  rejectionReason: text('rejection_reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// KYC Documents Table
export const kycDocuments = pgTable('kyc_documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  documentType: documentTypeEnum('document_type').notNull(),
  documentNumber: text('document_number'),
  documentUrl: text('document_url').notNull(),
  verificationStatus: kycStatusEnum('verification_status').default('PENDING').notNull(),
  verifiedAt: timestamp('verified_at'),
  verifiedBy: varchar('verified_by', { length: 100 }),
  rejectionReason: text('rejection_reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Transactions Table
export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  amount: decimal('amount', { precision: 15, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('INR').notNull(),
  recipientId: varchar('recipient_id', { length: 255 }).notNull(),
  recipientName: varchar('recipient_name', { length: 255 }),
  merchantName: varchar('merchant_name', { length: 255 }),
  merchantCategory: varchar('merchant_category', { length: 100 }),
  locationLat: decimal('location_lat', { precision: 10, scale: 8 }),
  locationLng: decimal('location_lng', { precision: 11, scale: 8 }),
  locationName: varchar('location_name', { length: 255 }),
  status: transactionStatusEnum('status').default('PENDING').notNull(),
  decision: decisionEnum('decision'),
  riskScore: integer('risk_score'),
  fallbackUsed: boolean('fallback_used').default(false).notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
  failedAt: timestamp('failed_at'),
  failureReason: text('failure_reason'),
});

// Risk Assessments Table
export const riskAssessments = pgTable('risk_assessments', {
  id: uuid('id').primaryKey().defaultRandom(),
  transactionId: uuid('transaction_id').references(() => transactions.id).notNull(),
  riskScore: integer('risk_score').notNull(),
  confidenceScore: decimal('confidence_score', { precision: 5, scale: 2 }),
  decision: decisionEnum('decision').notNull(),
  reasons: jsonb('reasons').notNull(),
  dataQualityScore: decimal('data_quality_score', { precision: 5, scale: 2 }),
  missingFields: jsonb('missing_fields'),
  modelVersion: varchar('model_version', { length: 50 }),
  assessedAt: timestamp('assessed_at').defaultNow().notNull(),
});

// Audit Logs Table
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  action: varchar('action', { length: 100 }).notNull(),
  resourceType: varchar('resource_type', { length: 100 }).notNull(),
  resourceId: uuid('resource_id'),
  changes: jsonb('changes'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// External Data Sources Table
export const externalData = pgTable('external_data', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  sourceType: varchar('source_type', { length: 100 }).notNull(),
  data: jsonb('data').notNull(),
  fetchedAt: timestamp('fetched_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at'),
});

// User Sessions Table (for JWT token management)
export const userSessions = pgTable('user_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  refreshToken: text('refresh_token').notNull().unique(),
  deviceInfo: text('device_info'),
  ipAddress: varchar('ip_address', { length: 45 }),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  revokedAt: timestamp('revoked_at'),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  kycData: one(kycData),
  kycDocuments: many(kycDocuments),
  transactions: many(transactions),
  auditLogs: many(auditLogs),
  externalData: many(externalData),
  sessions: many(userSessions),
}));

export const transactionsRelations = relations(transactions, ({ one, many }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
  riskAssessments: many(riskAssessments),
}));

export const riskAssessmentsRelations = relations(riskAssessments, ({ one }) => ({
  transaction: one(transactions, {
    fields: [riskAssessments.transactionId],
    references: [transactions.id],
  }),
}));
