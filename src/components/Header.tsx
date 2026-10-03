'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import { ModeToggle } from '@/components/mode-toggle';
import RentalCart from '@/components/RentalCart';
import Username from '@/components/Username';
import { CookiesStorage } from '@/config/cookie';
import { useAppSelector } from '@/stores/hooks';
import { selectDep } from '@/stores/reducers/depReducer';

import Logo from './Logo';
import MobileMenu from './MobileMenu';
import Navbar from './Navbar';
import Notification from './Notification';

const Header = () => {
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const dep = useAppSelector(selectDep);

  // check login and logout
  useEffect(() => {
    const isLogged = CookiesStorage.getCookieData('accessToken');

    if (isLogged) {
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }
  }, [dep]);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-white/10 bg-primary shadow-sm dark:border-border dark:bg-card">
      <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center px-16 xl:px-8 md:px-4">
        <div className="flex w-full items-center justify-between">
          <Logo />

          <div className="flex items-center justify-between gap-3">
            <Navbar />

            <hr className="mx-2 h-6 border-0 border-l border-white/30 md:hidden" />

            {/* login */}
            {isLogged ? (
              <div className="flex items-center justify-between gap-3">
                <RentalCart />

                {/* <Notification /> */}

                <Username />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4 lg:hidden">
                <Link
                  href="/signup"
                  className="flex h-10 min-w-[110px] items-center justify-center rounded-lg border border-white/60 px-4 text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  Đăng ký
                </Link>

                <Link
                  href="/signin"
                  className="flex h-10 min-w-[110px] items-center justify-center rounded-lg bg-white px-4 text-sm font-semibold text-primary transition-all hover:bg-white/90 active:scale-[0.98]"
                >
                  Đăng nhập
                </Link>
              </div>
            )}

            <ModeToggle />

            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
