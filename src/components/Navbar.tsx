'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { useCurrentUser } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

const menuItems: { title: string; href: string }[] = [
  {
    title: 'Trang chủ',
    href: '/',
  },
  {
    title: 'Giới thiệu',
    href: '/about',
  },
];

const Navbar = () => {
  const pathName = usePathname();
  const { user } = useCurrentUser();

  const menu = [
    ...menuItems,
    ...(user?.role === 'TRAVELER' ? [{ title: 'Đăng ký chủ xe', href: '/#explorer' }] : []),
    ...(user?.role === 'CAROWNER' ? [{ title: 'Quản lý xe', href: '/mycars' }] : []),
  ];

  return (
    <ul className="flex items-center justify-center gap-1 md:hidden">
      {menu.map(({ title, href }, index) => (
        <li
          key={index}
        >
          <Link
            href={href}
            className={cn(
              'block whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white',
              pathName === href && 'bg-white/15 text-white',
            )}
          >
            {title}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Navbar;
