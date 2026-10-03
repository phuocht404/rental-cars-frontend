import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { SessionUser } from '@/lib/session';
import type { RootState } from '@/stores/store';

interface AuthState {
  user: SessionUser | null;
  // true khi đã đọc xong session ở client (tránh nháy giao diện "chưa đăng nhập")
  ready: boolean;
}

const initialState: AuthState = { user: null, ready: false };

const authReducer = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<SessionUser | null>) {
      state.user = action.payload;
      state.ready = true;
    },
    logout(state) {
      state.user = null;
      state.ready = true;
    },
  },
});

export const { setUser, logout } = authReducer.actions;

export default authReducer.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectAuthReady = (state: RootState) => state.auth.ready;
