import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  createdAt: string;
}

export type KycStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'PENDING' | 'APPROVED' | 'REJECTED';

export interface KycData {
  aadhaarNumber?: string;
  panNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  dob?: string;
  aadhaarFront?: string;
  aadhaarBack?: string;
  panCard?: string;
  selfie?: string;
  status: KycStatus;
  submittedAt?: string;
  rejectionReason?: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  kycData: KycData;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateKyc: (data: Partial<KycData>) => void;
  submitKyc: () => Promise<{ success: boolean; error?: string }>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      kycData: {
        status: 'NOT_STARTED',
      },
      
      login: async (email: string, password: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Basic validation
        if (!email || !password) {
          return { success: false, error: 'Email and password are required' };
        }
        
        if (password.length < 6) {
          return { success: false, error: 'Invalid credentials' };
        }
        
        // Mock successful login
        const user: User = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          name: email.split('@')[0],
          createdAt: new Date().toISOString(),
        };
        
        set({ isLoggedIn: true, user });
        return { success: true };
      },
      
      register: async (name: string, email: string, password: string, phone?: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Validation
        if (!name || !email || !password) {
          return { success: false, error: 'All fields are required' };
        }
        
        if (password.length < 8) {
          return { success: false, error: 'Password must be at least 8 characters' };
        }
        
        if (!email.includes('@')) {
          return { success: false, error: 'Invalid email address' };
        }
        
        // Mock successful registration
        const user: User = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          name,
          phone,
          createdAt: new Date().toISOString(),
        };
        
        set({ isLoggedIn: true, user });
        return { success: true };
      },
      
      logout: () => {
        set({ isLoggedIn: false, user: null });
      },
      
      updateKyc: (data: Partial<KycData>) => {
        set(state => ({
          kycData: { ...state.kycData, ...data, status: 'IN_PROGRESS' }
        }));
      },
      
      submitKyc: async () => {
        const { kycData } = get();
        
        // Validate required fields
        if (!kycData.aadhaarNumber || !kycData.panNumber) {
          return { success: false, error: 'Aadhaar and PAN are required' };
        }
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        set(state => ({
          kycData: {
            ...state.kycData,
            status: 'PENDING',
            submittedAt: new Date().toISOString(),
          }
        }));
        
        return { success: true };
      },
    }),
    {
      name: 'auth-storage',
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