import { create } from 'zustand';
import { api } from '@/lib/api';
import { User } from '@/lib/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  checkAuth: () => Promise<void>;
  login: (creds: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAdmin: false,

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const { data } = await api.get<User>('/users/me');
      set({ user: data, isAdmin: data.role === 'ADMIN', isLoading: false });
    } catch (error) {
      // 401 expected
      set({ user: null, isAdmin: false, isLoading: false });
    }
  },

  login: async (creds) => {
    const { data } = await api.post<User>('/auth/login', creds);
    set({ user: data, isAdmin: data.role === 'ADMIN', isLoading: false });
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch { }
    set({ user: null, isAdmin: false });
    // Optional: reload page to clear all state
    window.location.href = '/';
  },
}));
