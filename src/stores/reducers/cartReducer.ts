import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '@/stores/store';

export interface CartItem {
  carId: number;
  carName: string;
  pricePerDay: number;
  images: string;
  // DD/MM/YYYY
  startDate: string;
  endDate: string;
  // Chỉ để hiển thị ước tính; server luôn tính lại khi thanh toán
  deposits: number;
  totalAmount: number;
}

interface CartState {
  items: CartItem[];
  hydrated: boolean;
}

const STORAGE_KEY = 'cart-storage';

export const loadCartItems = (): CartItem[] => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;

    return Array.isArray(parsed?.items) ? parsed.items : [];
  } catch {
    return [];
  }
};

export const saveCartItems = (items: CartItem[]) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ items }));
  } catch {
    // bỏ qua khi localStorage không dùng được
  }
};

const initialState: CartState = { items: [], hydrated: false };

const cartReducer = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    hydrateCart(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
      state.hydrated = true;
    },
    addItem(state, action: PayloadAction<CartItem>) {
      if (state.items.some((item) => item.carId === action.payload.carId)) return;
      state.items.push(action.payload);
    },
    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter((item) => item.carId !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { hydrateCart, addItem, removeItem, clearCart } = cartReducer.actions;
export default cartReducer.reducer;

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectIsInCart = (carId: number) => (state: RootState) =>
  state.cart.items.some((item) => item.carId === carId);
