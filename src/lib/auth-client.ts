'use client';

import { API } from '@/services';
import { useAppSelector } from '@/stores/hooks';
import {
  logout,
  selectAuthReady,
  selectCurrentUser,
  setUser,
} from '@/stores/reducers/authReducer';
import { store } from '@/stores/store';

import { clearStoredUser, SessionUser, writeStoredUser } from './session';

export const setSession = (user: SessionUser) => {
  writeStoredUser(user);
  store.dispatch(setUser(user));
};

export const clearSession = () => {
  clearStoredUser();
  try {
    sessionStorage.removeItem('session-checked-at');
  } catch {
    // bỏ qua
  }
  store.dispatch(logout());
};

/** Đăng xuất: xoá cookie ở server rồi xoá thông tin phía client */
export const signOut = async () => {
  try {
    await API.post('auth/logout');
  } finally {
    clearSession();
  }
};

export const useCurrentUser = () => {
  const user = useAppSelector(selectCurrentUser);
  const ready = useAppSelector(selectAuthReady);

  return { user, ready, isLoggedIn: !!user };
};
