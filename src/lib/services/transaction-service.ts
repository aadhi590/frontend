import { useAuthStore } from '../auth-store';

export interface Transaction {
  id: string;
  userId: string;
  amount: string;
  currency: string;
  recipientId: string;
  recipientName?: string;
  merchantName?: string;
  merchantCategory?: string;
  locationLat?: string;
  locationLng?: string;
  locationName?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'FAILED' | 'UNDER_REVIEW';
  decision?: 'ALLOW' | 'ALLOW_WITH_WARNING' | 'REVIEW' | 'REJECT';
  riskScore?: number;
  fallbackUsed: boolean;
  metadata?: any;
  createdAt: string;
  completedAt?: string;
  failedAt?: string;
  failureReason?: string;
}

export interface RiskAssessmentResult {
  decision: 'ALLOW' | 'ALLOW_WITH_WARNING' | 'REVIEW' | 'REJECT';
  riskScore: number;
  confidenceScore: number;
  reasons: string[];
  recommendations: string[];
  fallbackUsed: boolean;
  riskFactors: Array<{
    name: string;
    score: number;
    weight: number;
    reason: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }>;
}

export interface CreateTransactionData {
  amount: number;
  recipientId: string;
  recipientName?: string;
  merchantName?: string;
  merchantCategory?: string;
  location?: {
    lat: number;
    lng: number;
    name?: string;
  };
}

export interface CreateTransactionResponse {
  success: boolean;
  data?: {
    transaction: Transaction;
    riskAssessment: RiskAssessmentResult;
  };
  error?: string;
}

export interface GetTransactionsResponse {
  success: boolean;
  data?: {
    transactions: Transaction[];
    pagination: {
      limit: number;
      offset: number;
      total: number;
    };
  };
  error?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export class TransactionService {
  private getAuthHeader(): string | null {
    const accessToken = useAuthStore.getState().accessToken;
    return accessToken ? `Bearer ${accessToken}` : null;
  }
  
  async createTransaction(data: CreateTransactionData): Promise<CreateTransactionResponse> {
    try {
      const authHeader = this.getAuthHeader();
      if (!authHeader) {
        return { success: false, error: 'Not authenticated' };
      }
      
      const response = await fetch(`${API_BASE_URL}/api/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        return { success: false, error: result.error || 'Transaction creation failed' };
      }
      
      return result;
    } catch (error) {
      console.error('Create transaction error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }
  
  async getTransactions(limit: number = 10, offset: number = 0): Promise<GetTransactionsResponse> {
    try {
      const authHeader = this.getAuthHeader();
      if (!authHeader) {
        return { success: false, error: 'Not authenticated' };
      }
      
      const response = await fetch(
        `${API_BASE_URL}/api/transactions?limit=${limit}&offset=${offset}`,
        {
          headers: {
            'Authorization': authHeader,
          },
        }
      );
      
      const result = await response.json();
      
      if (!response.ok) {
        return { success: false, error: result.error || 'Failed to fetch transactions' };
      }
      
      return result;
    } catch (error) {
      console.error('Get transactions error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }
  
  async getTransactionById(id: string): Promise<{ success: boolean; data?: Transaction; error?: string }> {
    try {
      const authHeader = this.getAuthHeader();
      if (!authHeader) {
        return { success: false, error: 'Not authenticated' };
      }
      
      const response = await fetch(`${API_BASE_URL}/api/transactions/${id}`, {
        headers: {
          'Authorization': authHeader,
        },
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        return { success: false, error: result.error || 'Failed to fetch transaction' };
      }
      
      return result;
    } catch (error) {
      console.error('Get transaction error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }
}

export const transactionService = new TransactionService();
