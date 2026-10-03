import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

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
  const [menu, setMenu] = useState<any[]>(menuItems);
  const pathName = usePathname();

  const generateMenu = () => {
    const userInfo: any = JSON.parse(localStorage.getItem('user') || '{}');

    if (userInfo.role && userInfo?.role === 'TRAVELER') {
      setMenu([
        ...menuItems,
        {
          title: 'Đăng ký chủ xe',
          href: '#explorer',
        },
      ]);
    } else if (userInfo.role && userInfo?.role === 'CAROWNER') {
      setMenu([
        ...menuItems,
        {
          title: 'Quản lý xe',
          href: '/mycars',
        },
      ]);
    }
  };

  useEffect(() => {
    generateMenu();
  }, []);

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
