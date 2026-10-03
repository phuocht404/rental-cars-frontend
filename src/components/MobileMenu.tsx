'use client';

import { LogOut, Menu, X } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { signOut, useCurrentUser } from '@/lib/auth-client';

import { Button } from './ui/button';
import Username from './Username';

const mobileMenuItems: { title: string; href: string }[] = [
  {
    title: 'Trang chủ',
    href: '/',
  },
  {
    title: 'Giới thiệu',
    href: '/about',
  },
  {
    title: 'Đăng ký chủ xe',
    href: '/#explorer',
  },
];

const MobileMenu = () => {
  const { isLoggedIn: isLogged, user } = useCurrentUser();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Đóng menu khi màn hình đủ rộng để hiện menu desktop
  useEffect(() => {
    if (!isOpen) return;

    const closeMenu = () => {
      if (window.innerWidth >= 1024) setIsOpen(false);
    };

    window.addEventListener('resize', closeMenu);
    return () => window.removeEventListener('resize', closeMenu);
  }, [isOpen]);

  const handleLogout = async () => {
    await signOut();
    toast.info('Đã đăng xuất!!!');
    window.location.assign(new URL('/', window.location.origin).href);
  };

  const items = [
    ...mobileMenuItems,
    ...(user?.role === 'CAROWNER' ? [{ title: 'Quản lý xe', href: '/mycars' }] : []),
  ];

  return (
    <div className="relative z-50 hidden lg:block">
      <Button variant="ghost" size="icon" className="" onClick={toggleMenu}>
        <Menu size={20} />
      </Button>

      {isOpen && (
        <div className="fixed left-0 top-0 h-full w-full bg-background">
          <Button
            variant="outline"
            className="absolute right-4 top-4 rounded-full"
            size="icon"
            onClick={toggleMenu}
          >
            <X size={20} />
          </Button>

          <div className="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/4 transform rounded-lg bg-card p-4">
            {isLogged && (
              <Link href="/">
                <Username className="text-base font-medium text-foreground" />
              </Link>
            )}

            <hr className="my-4 w-full border border-solid border-border/50" />

            <ul className="flex flex-col items-center justify-center">
              {items.map(({ title, href }, index) => (
                <li
                  key={index}
                  className="w-full cursor-pointer rounded-lg hover:bg-accent hover:underline"
                >
                  <Link
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center whitespace-nowrap px-32 py-4 text-base font-medium"
                  >
                    {title}
                  </Link>
                </li>
              ))}
            </ul>

            <hr className="my-4 w-full border border-solid border-border/50" />

            {/* check login */}
            {isLogged ? (
              <Button
                variant="ghost"
                className="w-full text-base font-medium hover:underline"
                onClick={handleLogout}
              >
                <LogOut size={18} className="mr-3 rotate-180" />
                Đăng xuất
              </Button>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <Link
                  href="/signup"
                  className="flex min-w-[110px] items-center justify-center rounded-md border border-solid border-border p-2 text-base font-medium hover:underline"
                >
                  Đăng ký
                </Link>

                <Link
                  href="/signin"
                  className="flex min-w-[110px] items-center justify-center rounded-md border border-solid border-border bg-primary p-2 text-base font-medium text-white hover:underline"
                >
                  Đăng nhập
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
