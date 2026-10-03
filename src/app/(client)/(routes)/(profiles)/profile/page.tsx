import Image from 'next/image';
import { redirect } from 'next/navigation';
import React from 'react';

import AvatarDialog from '@/components/profile/AvatarDialog';
import { EditProfileDialog } from '@/components/profile/EditProfileDialog';
import UpdateInfoDialog from '@/components/profile/UpdateInfoDialog';
import UserAvatar from '@/components/user-avatar';
import { ApiError, serverFetch } from '@/lib/server-api';
import { formatDateToDMY } from '@/lib/utils';
import { GenderEnum } from '@/types/enums';

interface Profile {
  name: string | null;
  username: string;
  email: string | null;
  phone: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  avatarUrl: string | null;
  createdAt: string;
  trips: number;
}

// Render ở server với cookie đăng nhập: trang hiện ngay dữ liệu, không có vòng loading phía client
const getProfile = async () => {
  try {
    return await serverFetch<Profile>('users/profile', { auth: true });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) redirect('/signin?callbackUrl=/profile');
    throw error;
  }
};

export default async function ProfilePage() {
  const user = await getProfile();

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-6 md:p-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center justify-start gap-4">
          <h1 className="text-2xl font-bold">Thông tin tài khoản</h1>

          <EditProfileDialog name={user.name} dateOfBirth={user.dateOfBirth} gender={user.gender} />
        </div>
        <span className="flex items-center justify-center gap-1 rounded-xl border border-border px-4 py-4">
          <Image src="/icons/suitcase-icon.svg" alt="" width={24} height={24} />
          <span className="text-2xl font-bold text-primary">{user.trips ?? 0}</span>
          <span>chuyến</span>
        </span>
      </header>

      <div className="mt-6 flex items-start justify-between gap-6 md:flex-col md:items-stretch">
        <div className="flex w-1/3 flex-col items-stretch justify-center gap-3 md:w-full">
          <div className="relative flex items-center justify-center">
            <AvatarDialog
              src={user.avatarUrl}
              className="absolute-center z-[1] h-[146px] w-[146px] cursor-pointer rounded-full bg-accent/10 hover:bg-accent/40"
            />
            <UserAvatar name={user.name || user.username} src={user.avatarUrl} className="h-[146px] w-[146px] text-4xl" />
          </div>
          <div className="flex flex-col items-center justify-center gap-3">
            <p className="text-2xl font-medium">{user.name || user.username}</p>
            <span className="text-sm">Tham gia: {formatDateToDMY(new Date(user.createdAt))}</span>
          </div>
        </div>

        <dl className="flex w-2/3 flex-col items-stretch justify-center gap-3 px-4 md:w-full md:px-0">
          <div className="flex items-center justify-between">
            <dt className="text-base text-foreground/80">Ngày sinh</dt>
            <dd className="text-base font-medium">
              {user.dateOfBirth ? formatDateToDMY(new Date(user.dateOfBirth)) : 'Chưa cập nhật'}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-base text-foreground/80">Giới tính</dt>
            <dd className="text-base font-medium">
              {(user.gender && GenderEnum[user.gender]) || 'Chưa cập nhật'}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-base text-foreground/80">Số điện thoại</dt>
            <dd className="flex items-center justify-center gap-3 text-base font-medium">
              <span>{user.phone || 'Thêm số điện thoại'}</span>
              <UpdateInfoDialog label="số điện thoại" name="phone" data={user.phone} />
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-base text-foreground/80">Email</dt>
            <dd className="flex items-center justify-center gap-3 text-base font-medium">
              <span>{user.email || 'Thêm email'}</span>
              <UpdateInfoDialog label="email" name="email" data={user.email} />
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
