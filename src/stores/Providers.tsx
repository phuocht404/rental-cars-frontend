'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useEffect, useState } from 'react';
import { Provider } from 'react-redux';

import { makeQueryClient } from '@/lib/query';

import { readStoredUser, SessionUser, writeStoredUser } from '@/lib/session';
import { API } from '@/services';

import { setUser } from './reducers/authReducer';
import { hydrateCart, loadCartItems } from './reducers/cartReducer';
import { store } from './store';

const SESSION_CHECK_KEY = 'session-checked-at';
const SESSION_CHECK_INTERVAL_MS = 5 * 60 * 1000;

const shouldRecheckSession = () => {
  try {
    return Date.now() - Number(sessionStorage.getItem(SESSION_CHECK_KEY) ?? 0) > SESSION_CHECK_INTERVAL_MS;
  } catch {
    return true;
  }
};

const markSessionChecked = () => {
  try {
    sessionStorage.setItem(SESSION_CHECK_KEY, String(Date.now()));
  } catch {
    // bỏ qua
  }
};

function Providers({ children }: { children: ReactNode }) {
  // Mỗi trình duyệt một QueryClient (tạo trong state để không dùng chung giữa các request SSR)
  const [queryClient] = useState(makeQueryClient);

  // Nạp session + giỏ hàng sau khi mount để HTML server và client giống nhau (không lỗi hydration)
  useEffect(() => {
    const storedUser = readStoredUser();

    store.dispatch(setUser(storedUser));
    store.dispatch(hydrateCart(loadCartItems()));

    // Đồng bộ lại với server (phiên có thể đã bị thu hồi, vai trò có thể đã đổi),
    // nhưng tối đa 5 phút một lần mỗi tab để không gọi API ở mọi lần tải trang
    if (storedUser && shouldRecheckSession()) {
      API.get('auth/me')
        .then(async ({ data }) => {
          markSessionChecked();
          const user: SessionUser = { ...storedUser, ...data };

          // Vai trò đổi (ví dụ vừa được duyệt làm chủ xe): cấp lại token để proxy điều hướng theo vai trò mới
          if (data.role !== storedUser.role) await API.post('auth/refresh').catch(() => undefined);

          writeStoredUser(user);
          store.dispatch(setUser(user));
        })
        .catch(() => {
          // interceptor đã xoá session khi không refresh được
        });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>{children}</Provider>
    </QueryClientProvider>
  );
}

export default Providers;
