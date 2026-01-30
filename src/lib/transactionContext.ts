// src/lib/transactionContext.ts

export type TransactionContext = {
  amount: number;
  recipientId: string;
  time: string;
  location?: string | null;
  merchant?: string | null;
};

export function buildTransactionContext(partial: Partial<TransactionContext>) {
  return {
    amount: partial.amount ?? 0,
    recipientId: partial.recipientId ?? "UNKNOWN",
    time: partial.time ?? new Date().toISOString(),

    // messy / missing allowed
    location: partial.location ?? null,
    merchant: partial.merchant ?? null,
  };
}
