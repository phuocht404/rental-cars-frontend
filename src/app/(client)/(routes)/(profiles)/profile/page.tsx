'use client';

import { Camera } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

import AvatarDialog from '@/components/profile/AvatarDialog';
import { EditProfileDialog } from '@/components/profile/EditProfileDialog';
import UpdateInfoDialog from '@/components/profile/UpdateInfoDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GET_USER_BY_USERNAME } from '@/lib/api-constants';
import { formatDateToDMY } from '@/lib/utils';
import { API } from '@/services';
import { GenderEnum } from '@/types/enums';

const ProfilePage = () => {
  const [user, setUser] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getUser = async () => {
    setIsLoading(true);
    try {
      const userInfo: any = JSON.parse(localStorage.getItem('user') || '{}');

      const { data } = await API.get(
        GET_USER_BY_USERNAME + `/${userInfo?.username}`,
      );

      setUser(data);

      setIsLoading(false);
    } catch (error: any) {
      toast.error(error?.error, { description: error?.message });
    } finally {
      setIsLoading(true);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-6 md:p-4">
      <div className="">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center justify-start gap-4">
            <h3 className="text-2xl font-bold">Thông tin tài khoản</h3>

            <EditProfileDialog
              name={user.name}
              dateOfBirth={user.dateOfBirth}
              gender={user.gender}
            />
          </div>
          <span className="flex items-center justify-center gap-1 rounded-xl border border-border px-4 py-4">
            <Image
              src="/icons/suitcase-icon.svg"
              alt=""
              width={24}
              height={24}
            />
            <p className="text-2xl font-bold text-primary">0</p>
            <p>chuyến</p>
          </span>
        </header>

        <div className="mt-6 flex items-start justify-between gap-6 md:flex-col md:items-stretch">
          <div className="flex w-1/3 flex-col items-stretch md:w-full justify-center gap-3">
            <div className="relative flex items-center justify-center">
              <AvatarDialog
                src={user?.avatarUrl}
                className="absolute-center z-[1] h-[146px] w-[146px] cursor-pointer rounded-full bg-accent/10 hover:bg-accent/40"
              />
              <Avatar className="h-[146px] w-[146px] cursor-pointer">
                <AvatarImage src={user?.avatarUrl} alt="avatar" className="" />
                <AvatarFallback>
                  <Camera className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col items-center justify-center gap-3">
              <h3 className="text-2xl font-medium">{user?.name}</h3>
              <span className="text-sm">
                Tham gia: {formatDateToDMY(user?.createdAt)}
              </span>
            </div>
          </div>

          <div className="flex w-2/3 flex-col items-stretch justify-center gap-3 px-4 md:w-full md:px-0">
            <div className="flex items-center justify-between">
              <span className="text-base text-foreground/80">Ngày sinh</span>
              <span className="text-base font-medium">
                {formatDateToDMY(user?.dateOfBirth)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base text-foreground/80">Giới tính</span>
              <span className="text-base font-medium">{GenderEnum[user?.gender]}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base text-foreground/80">Số điện thoại</span>
              <span className="flex items-center justify-center gap-3 text-base font-medium">
                {user.phone ? <p>{user.phone}</p> : <p>Thêm số điện thoại</p>}
                <UpdateInfoDialog
                  label="số điện thoại"
                  name="phone"
                  data={user.phone}
                />
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base text-foreground/80">Email</span>
              <span className="flex items-center justify-center gap-3 text-base font-medium">
                {user.email ? <p>{user.email}</p> : <p>Thêm email</p>}
                <UpdateInfoDialog
                  label="email"
                  name="email"
                  data={user.email}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
