'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { setSession, useCurrentUser } from '@/lib/auth-client';
import { API } from '@/services';

/** Cập nhật hồ sơ của chính mình rồi làm mới dữ liệu đã render ở server */
export const useUpdateProfile = () => {
  const router = useRouter();
  const { user } = useCurrentUser();

  return useCallback(
    async (payload: Record<string, unknown>) => {
      const { data } = await API.patch('users/me', payload);

      if (user) {
        setSession({
          ...user,
          name: data.name,
          email: data.email,
          phone: data.phone,
          avatarUrl: data.avatarUrl,
        });
      }

      router.refresh();
      return data;
    },
    [router, user],
  );
};

export const apiErrorMessage = (error: any) =>
  (Array.isArray(error?.message) ? error.message.join(', ') : error?.message) ||
  'Có lỗi xảy ra, vui lòng thử lại';
