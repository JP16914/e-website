import { create } from 'zustand';
import { api } from '@/lib/api';
import { CartItem } from '@/lib/types';

interface CartResponse {
  items: CartItem[];
  subtotal: number;
}

interface CartState {
  items: CartItem[];
  count: number;
  subtotal: number;
  isLoading: boolean;

  fetchCart: (isUser: boolean) => Promise<void>;
  addItem: (isUser: boolean, productId: string, qty: number) => Promise<void>;
  updateItem: (isUser: boolean, productId: string, qty: number) => Promise<void>;
  removeItem: (isUser: boolean, productId: string) => Promise<void>;
  clearCart: (isUser: boolean) => Promise<void>;
  mergeCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  count: 0,
  subtotal: 0,
  isLoading: false,

  fetchCart: async (isUser) => {
    set({ isLoading: true });
    try {
      const endpoint = isUser ? '/cart/items' : '/guest-cart/items';
      const { data } = await api.get<CartResponse>(endpoint);
      const items = data.items || [];
      const subtotal = data.subtotal || 0;
      const count = items.reduce((acc, item) => acc + item.qty, 0);
      set({ items, subtotal, count, isLoading: false });
    } catch (error) {
      set({ items: [], subtotal: 0, count: 0, isLoading: false });
    }
  },

  addItem: async (isUser, productId, qty) => {
    const endpoint = isUser ? '/cart/items' : '/guest-cart/items';
    await api.post(endpoint, { productId, qty });
    await get().fetchCart(isUser);
  },

  updateItem: async (isUser, productId, qty) => {
    const endpoint = isUser ? `/cart/items/${productId}` : `/guest-cart/items/${productId}`;
    await api.put(endpoint, { qty }); // Start user said PUT/PATCH for logged in, PUT for guest. API client handles standard axios.
    await get().fetchCart(isUser);
  },

  removeItem: async (isUser, productId) => {
    const endpoint = isUser ? `/cart/items/${productId}` : `/guest-cart/items/${productId}`;
    await api.delete(endpoint);
    await get().fetchCart(isUser);
  },

  clearCart: async (isUser) => {
    const endpoint = isUser ? '/cart' : '/guest-cart';
    await api.delete(endpoint);
    set({ items: [], count: 0, subtotal: 0 });
  },

  mergeCart: async () => {
    try {
      const { data } = await api.post<CartResponse>('/cart/merge-guest');
      const items = data.items || [];
      const subtotal = data.subtotal || 0;
      const count = items.reduce((acc, item) => acc + item.qty, 0);
      set({ items, subtotal, count });
    } catch (e) {
      console.error("Cart merge failed", e);
    }
  }
}));
