import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

// Màu nền cố định theo tên để cùng một người luôn có cùng màu
const PALETTE = [
  'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-200',
  'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200',
  'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200',
  'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-200',
  'bg-violet-100 text-violet-800 dark:bg-violet-500/20 dark:text-violet-200',
];

export const initialsOf = (name?: string | null) =>
  (name ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || '?';

const colorOf = (name?: string | null) =>
  PALETTE[[...(name ?? '')].reduce((sum, char) => sum + char.charCodeAt(0), 0) % PALETTE.length];

interface UserAvatarProps {
  name?: string | null;
  src?: string | null;
  className?: string;
}

/** Ảnh đại diện; không có ảnh (hoặc ảnh lỗi) thì hiện chữ cái đầu của tên */
const UserAvatar = ({ name, src, className }: UserAvatarProps) => (
  <Avatar className={cn('h-10 w-10', className)}>
    {src && <AvatarImage src={src} alt={name ?? 'Ảnh đại diện'} className="object-cover" />}
    <AvatarFallback className={cn('font-semibold', colorOf(name))}>{initialsOf(name)}</AvatarFallback>
  </Avatar>
);

export default UserAvatar;
