import 'server-only';

import { cookies } from 'next/headers';

// Server component gọi thẳng backend (không qua rewrite) để tránh một vòng mạng thừa
export const API_URL =
  process.env.API_URL ||
  `http://${process.env.NEXT_PUBLIC_BACKEND_HOSTNAME || 'localhost'}:${process.env.NEXT_PUBLIC_BACKEND_PORT || 8080}`;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

interface ServerFetchOptions {
  /** Số giây cache (ISR). false = không cache. */
  revalidate?: number | false;
  tags?: string[];
  /** Gửi kèm cookie đăng nhập của người dùng hiện tại */
  auth?: boolean;
}

export async function serverFetch<T>(
  path: string,
  { revalidate = 60, tags, auth = false }: ServerFetchOptions = {},
): Promise<T> {
  const headers: Record<string, string> = { accept: 'application/json' };

  // Request từ server Next đi chung một IP: dùng khoá nội bộ để backend không tính chung rate limit
  if (process.env.API_INTERNAL_KEY) headers['x-internal-key'] = process.env.API_INTERNAL_KEY;

  if (auth) {
    headers.cookie = (await cookies()).toString();
  }

  const res = await fetch(`${API_URL}/api/v1/${path.replace(/^\//, '')}`, {
    headers,
    ...(auth || revalidate === false
      ? { cache: 'no-store' as const }
      : { next: { revalidate, tags } }),
  });

  if (!res.ok) {
    throw new ApiError(res.status, `API ${path} trả về ${res.status}`);
  }

  return res.json() as Promise<T>;
}

/** Trả về null khi 404 thay vì ném lỗi, dùng cho các trang chi tiết */
export async function serverFetchOrNull<T>(
  path: string,
  options?: ServerFetchOptions,
): Promise<T | null> {
  try {
    return await serverFetch<T>(path, options);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}
