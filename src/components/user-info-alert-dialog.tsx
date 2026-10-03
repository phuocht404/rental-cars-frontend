'use client';

import React, { useEffect, useState } from 'react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GET_USER_BY_ID } from '@/lib/api-constants';
import { formatDateToDMY } from '@/lib/utils';
import { API } from '@/services';

export function UserInfoAlertDialog({
  userId,
  avatarUrl,
}: {
  userId: number;
  avatarUrl: string;
}) {
  const [user, setUser] = useState<any>({});

  async function getUser() {
    try {
      if (!userId) {
        return;
      }

      const { data } = await API.get(GET_USER_BY_ID + `/${userId}`);
      if (data) {
        setUser(data);
      }
    } catch (error: any) {
      toast.error(error?.error, { description: error?.message });
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Avatar className="h-20 w-20">
          <AvatarImage src={avatarUrl} alt="avatar" />
          <AvatarFallback>Avatar</AvatarFallback>
        </Avatar>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="mb-6">
            Thông tin người dùng
          </AlertDialogTitle>
          <AlertDialogDescription className="">
            <div className="flex h-full w-full items-center justify-between gap-3">
              <div className="flex w-1/3 flex-col items-center justify-between gap-3">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={avatarUrl} alt="avatar" />
                  <AvatarFallback>Avatar</AvatarFallback>
                </Avatar>

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
                <div className="flex w-full items-center justify-between gap-3">
                  <span className="font-bold">Email:</span>
                  <span className="">{user?.email}</span>
                </div>
                <div className="flex w-full items-center justify-between gap-3">
                  <span className="font-bold">Số điện thoại:</span>
                  <span className="">{user?.phone}</span>
                </div>
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
