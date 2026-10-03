import axios, { AxiosError, AxiosRequestConfig } from 'axios';

import { clearStoredUser } from '@/lib/session';
import { store } from '@/stores/store';
import { logout } from '@/stores/reducers/authReducer';

// Gọi qua rewrite cùng origin (/api/v1 → backend) nên cookie httpOnly được gửi kèm tự động
const instance = axios.create({
  baseURL: '/api/v1/',
  timeout: 30 * 1000,
  withCredentials: true,
  headers: {
    accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

const normalize = (url: string) => url.replace(/^\/+/, '');

// Các endpoint tự xử lý xác thực, không thử refresh khi gặp 401
const NO_REFRESH = /^auth\/(signin|signup|refresh|logout)/;

let refreshing: Promise<boolean> | null = null;

const refreshSession = () => {
  refreshing ??= instance
    .post('auth/refresh')
    .then(() => true)
    .catch(() => false)
    .finally(() => {
      refreshing = null;
    });

  return refreshing;
};

instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    const original = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;
    const url = normalize(original?.url ?? '');

    if (error.response?.status === 401 && original && !original._retry && !NO_REFRESH.test(url)) {
      original._retry = true;

      if (await refreshSession()) return instance(original);

      // Hết phiên đăng nhập: xoá thông tin hiển thị phía client
      clearStoredUser();
      store.dispatch(logout());
    }

    return Promise.reject(
      error.response?.data ?? { message: error.message || 'Không kết nối được tới máy chủ' },
    );
  },
);

const _get = (url: string, params = {}, options: AxiosRequestConfig = {}) =>
  instance.get(normalize(url), { ...options, params });

const post = (url: string, body = {}, options: AxiosRequestConfig = {}) =>
  instance.post(normalize(url), body, options);

const put = (url: string, body = {}, options: AxiosRequestConfig = {}) =>
  instance.put(normalize(url), body, options);

const patch = (url: string, body = {}, options: AxiosRequestConfig = {}) =>
  instance.patch(normalize(url), body, options);

const _delete = (url: string, options: AxiosRequestConfig = {}) =>
  instance.delete(normalize(url), options);

export { _get as get, post, put, patch, _delete as destroy };
