import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  emailVerified: boolean;
  mfaEnabled: boolean;
}

export type KycStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'PENDING' | 'APPROVED' | 'REJECTED';

export interface KycData {
  status: KycStatus;
  submittedAt?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  city?: string;
  state?: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  kycData: KycData;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  fetchKycStatus: () => Promise<void>;
  submitKyc: (data: {
    aadhaarNumber: string;
    panNumber: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    dob?: string;
  }) => Promise<{ success: boolean; error?: string }>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      kycData: {
        status: 'NOT_STARTED',
      },
      
      setTokens: (accessToken: string, refreshToken: string) => {
        set({ accessToken, refreshToken });
        if (typeof document !== 'undefined') {
          document.cookie = `accessToken=${accessToken}; path=/; max-age=900`; // 15 minutes
        }
      },
      
      login: async (email: string, password: string) => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });
          
          const result = await response.json();
          
          if (!response.ok) {
            return { success: false, error: result.error || 'Login failed' };
          }
          
          const { user, accessToken, refreshToken } = result.data;
          
          set({
            isLoggedIn: true,
            user,
            accessToken,
            refreshToken,
          });
          
          if (typeof document !== 'undefined') {
            document.cookie = `accessToken=${accessToken}; path=/; max-age=900`;
          }
          
          // Fetch KYC status after login
          get().fetchKycStatus();
          
          return { success: true };
        } catch (error) {
          console.error('Login error:', error);
          return { success: false, error: 'Network error. Please try again.' };
        }
      },
      
      register: async (name: string, email: string, password: string, phone?: string) => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password, phone }),
          });
          
          const result = await response.json();
          
          if (!response.ok) {
            return { success: false, error: result.error || 'Registration failed' };
          }
          
          const { user, accessToken, refreshToken } = result.data;
          
          set({
            isLoggedIn: true,
            user,
            accessToken,
            refreshToken,
          });
          
          if (typeof document !== 'undefined') {
            document.cookie = `accessToken=${accessToken}; path=/; max-age=900`;
          }
          
          return { success: true };
        } catch (error) {
          console.error('Registration error:', error);
          return { success: false, error: 'Network error. Please try again.' };
        }
      },
      
      logout: () => {
        set({
          isLoggedIn: false,
          user: null,
          accessToken: null,
          refreshToken: null,
          kycData: { status: 'NOT_STARTED' },
        });
        
        if (typeof document !== 'undefined') {
          document.cookie = 'accessToken=; path=/; max-age=0';
        }
      },
      
      fetchKycStatus: async () => {
        const { accessToken } = get();
        if (!accessToken) return;
        
        try {
          const response = await fetch(`${API_BASE_URL}/api/kyc/submit`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });
          
          if (response.ok) {
            const result = await response.json();
            set({ kycData: result.data });
          }
        } catch (error) {
          console.error('Fetch KYC status error:', error);
        }
      },
      
      submitKyc: async (data) => {
        const { accessToken } = get();
        if (!accessToken) {
          return { success: false, error: 'Not authenticated' };
        }
        
        try {
          const response = await fetch(`${API_BASE_URL}/api/kyc/submit`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(data),
          });
          
          const result = await response.json();
          
          if (!response.ok) {
            return { success: false, error: result.error || 'KYC submission failed' };
          }
          
          set({ kycData: result.data });
          return { success: true };
        } catch (error) {
          console.error('KYC submission error:', error);
          return { success: false, error: 'Network error. Please try again.' };
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        refreshToken: state.refreshToken,
        kycData: state.kycData,
      }),
    }
  )
);

// Legacy export for backward compatibility
export const auth = {
  get isLoggedIn() {
    return useAuthStore.getState().isLoggedIn;
  },
  set isLoggedIn(value: boolean) {
    useAuthStore.setState({ isLoggedIn: value });
  },
  get kycStatus() {
    return useAuthStore.getState().kycData.status;
  },
  set kycStatus(value: KycStatus) {
    useAuthStore.setState(state => ({
      kycData: { ...state.kycData, status: value }
    }));
  },
};