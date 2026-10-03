'use client';

import { LogOut, Menu, X } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

import { CookiesStorage } from '@/config/cookie';
import { useAppSelector } from '@/stores/hooks';
import { logout } from '@/stores/reducers/authReducer';
import { selectDep, setDependence } from '@/stores/reducers/depReducer';

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
    href: '/owner-registration',
  },
];

const MobileMenu = () => {
  const dispatch = useDispatch();
  const dep = useAppSelector(selectDep);
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Function to close the mobile menu when the screen size is larger than 1024px
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const closeMenu = () => {
    if (window.innerWidth >= 1024 && isOpen) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    // Add an event listener to check for screen size changes
    window.addEventListener('resize', closeMenu);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', closeMenu);
    };
  }, [closeMenu, isOpen]);

  // check login and logout
  useEffect(() => {
    const isLogged = CookiesStorage.getCookieData('accessToken');

    if (isLogged) {
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }
  }, [dep]);

  const handleLogout = () => {
    // clear local storage
    localStorage.removeItem('user');

    // clear redux store
    dispatch(logout());
    dispatch(setDependence({}));

    // clear cookie storage
    CookiesStorage.clearAllCookies();

    setIsLogged(false);
    toast.info('Đã đăng xuất!!!');
    // redirect to home page
    window.location.reload();
  };

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
              {mobileMenuItems.map(({ title, href }, index) => (
                <li
                  key={index}
                  className="w-full cursor-pointer rounded-lg hover:bg-accent hover:underline"
                >
                  <Link
                    href={href}
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
