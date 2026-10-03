'use client';

import { ClassValue } from 'clsx';
import Link from 'next/link';
import React from 'react';

import { useCurrentUser } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

import UserAvatar from './user-avatar';

// Lấy thông tin từ session ở client, không gọi API mỗi lần render header
const Username = ({ className, compact }: { className?: ClassValue; compact?: boolean }) => {
  const { user } = useCurrentUser();

  if (!user) return null;

  return (
    <Link
      href={user.role === 'ADMIN' ? '/admin/dashboard' : '/profile'}
      className="flex items-center justify-center gap-2 rounded-full border border-white/30 py-1 pl-1 pr-4 transition-colors hover:bg-white/10 active:scale-[0.98] dark:border-border"
    >
      <UserAvatar name={user.name || user.username} src={user.avatarUrl} className="h-7 w-7 text-xs" />
      <p className={cn('max-w-[12ch] truncate text-sm font-medium text-white dark:text-white', compact && 'sm:hidden', className)}>
        {user.name || user.username}
      </p>
    </Link>
  );
};

export default Username;
