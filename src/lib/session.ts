export type UserRole = 'ADMIN' | 'CAROWNER' | 'TRAVELER';

// Thông tin hiển thị của người dùng đã đăng nhập. Token KHÔNG nằm ở đây mà trong cookie httpOnly.
export interface SessionUser {
  id: number;
  username: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
  role: UserRole;
}

const STORAGE_KEY = 'user';

export const readStoredUser = (): SessionUser | null => {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const user = raw ? JSON.parse(raw) : null;

    return user?.username ? user : null;
  } catch {
    return null;
  }
};

export const writeStoredUser = (user: SessionUser) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch {
    // localStorage có thể bị chặn (chế độ riêng tư); session vẫn hoạt động nhờ cookie
  }
};

export const clearStoredUser = () => {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // bỏ qua
  }
};
