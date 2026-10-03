'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import UserAvatar from '@/components/user-avatar';
import { GET_USER_BY_ID } from '@/lib/api-constants';
import { useCurrentUser } from '@/lib/auth-client';
import { formatDateToDMY } from '@/lib/utils';
import { API } from '@/services';

export function UserInfoAlertDialog({
  userId,
  avatarUrl,
  name,
}: {
  userId: number;
  avatarUrl?: string | null;
  name?: string | null;
}) {
  const [user, setUser] = useState<any>({});
  const [loaded, setLoaded] = useState<boolean>(false);
  const { isLoggedIn } = useCurrentUser();

  // Chỉ tải khi người dùng mở hộp thoại (và đã đăng nhập), không gọi API ngay khi trang render
  async function getUser() {
    try {
      if (!userId || !isLoggedIn || loaded) {
        return;
      }

      setLoaded(true);

      const { data } = await API.get(GET_USER_BY_ID + `/${userId}`);
      if (data) {
        setUser(data);
      }
    } catch (error: any) {
      toast.error(error?.error, { description: error?.message });
    }
  }

  return (
    <AlertDialog onOpenChange={(open) => open && getUser()}>
      <AlertDialogTrigger asChild>
        <button type="button" aria-label="Xem thông tin chủ xe" className="rounded-full transition-transform hover:scale-105">
          <UserAvatar name={name} src={avatarUrl} className="h-16 w-16 text-lg" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="mb-6">
            Thông tin người dùng
          </AlertDialogTitle>
          <AlertDialogDescription className="">
            <div className="flex h-full w-full items-center justify-between gap-3">
              <div className="flex w-1/3 flex-col items-center justify-between gap-3">
                <UserAvatar name={user?.name ?? name} src={avatarUrl} className="h-24 w-24 text-2xl" />

                <span className="text-xl font-bold text-foreground">
                  {user?.name}
                </span>

                <span className="text-xs text-muted-foreground">
                  Tham gia từ {formatDateToDMY(user?.createdAt)}
                </span>
              </div>

              <div className="flex h-full w-2/3 flex-col items-center justify-start gap-3 text-foreground">
                <div className="mb-4 flex w-full items-center justify-around gap-3 rounded-lg bg-primary/20 p-2">
                  <div className=" inline-flex flex-col items-center justify-center gap-1">
                    <span className="text-foreground">Số chuyến</span>
                    <span className="font-bold">{user?.trips}</span>
                  </div>
                  <div className="inline-flex flex-col items-center justify-center gap-1">
                    <span className="text-foreground">Tỉ lệ đồng ý</span>
                    <span className="font-bold">{user?.successRate}%</span>
                  </div>
                </div>
                {!isLoggedIn && (
                  <span className="text-sm text-muted-foreground">
                    Đăng nhập để xem thêm thông tin chủ xe.
                  </span>
                )}
                {user?.email && (
                <div className="flex w-full items-center justify-between gap-3">
                  <span className="font-bold">Email:</span>
                  <span className="">{user?.email}</span>
                </div>
                )}
                {user?.phone && (
                <div className="flex w-full items-center justify-between gap-3">
                  <span className="font-bold">Số điện thoại:</span>
                  <span className="">{user?.phone}</span>
                </div>
                )}
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Trở về</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
