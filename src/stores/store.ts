import { combineReducers, configureStore } from '@reduxjs/toolkit';

import authReducer from './reducers/authReducer';
import cartReducer, { saveCartItems } from './reducers/cartReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

// Lưu giỏ hàng xuống localStorage mỗi khi thay đổi (chỉ sau khi đã nạp từ localStorage lên)
let lastSavedItems = store.getState().cart.items;
store.subscribe(() => {
  const { items, hydrated } = store.getState().cart;

  if (hydrated && items !== lastSavedItems) {
    lastSavedItems = items;
    saveCartItems(items);
  }
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
