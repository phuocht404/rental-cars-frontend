import { ClassValue } from 'clsx';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import { GET_USER_BY_USERNAME } from '@/lib/api-constants';
import { cn } from '@/lib/utils';
import { API } from '@/services';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Skeleton } from './ui/skeleton';

const Username = ({ className }: { className?: ClassValue }) => {
  const [username, setUsername] = useState<string>('nguoidung');
  const [avatarUrl, setAvatarUrl] = useState<string>(
    'https://github.com/shadcn.png',
  );

  const getUserByUsername = async () => {
    const userInfo: any = JSON.parse(localStorage.getItem('user') || '{}');

    const { data } = await API.get(
      GET_USER_BY_USERNAME + `/${userInfo?.username}`,
    );

    if (data) {
      setAvatarUrl(data?.avatarUrl);
      setUsername(data?.username);
    }
  };

  // get user from local storage
  useEffect(() => {
    getUserByUsername();
  }, []);

  return (
    <Link
      href="/profile"
      className="flex items-center justify-center gap-2 rounded-full border border-border px-4 py-2 hover:border-blue-200 hover:bg-blue-200/20 active:scale-95"
    >
      <Avatar className="h-6 w-6">
        <AvatarImage src={avatarUrl} alt="Avatar" />
        <AvatarFallback>
          <Skeleton className="h-6 w-6 rounded-full" />
        </AvatarFallback>
      </Avatar>
      <p className={cn('text-base text-white dark:text-white', className)}>
        {username}
      </p>
    </Link>
  );
};

export default Username;
