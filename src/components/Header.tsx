'use client';

import Link from 'next/link';
import React from 'react';

import { ModeToggle } from '@/components/mode-toggle';
import RentalCart from '@/components/RentalCart';
import Username from '@/components/Username';
import { useCurrentUser } from '@/lib/auth-client';

import Logo from './Logo';
import MobileMenu from './MobileMenu';
import Navbar from './Navbar';

const Header = () => {
  const { isLoggedIn: isLogged, ready } = useCurrentUser();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-white/10 bg-primary shadow-sm dark:border-border dark:bg-card">
      <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center px-16 xl:px-8 md:px-4">
        <div className="flex w-full items-center justify-between">
          <Logo />

          <div className="flex items-center justify-between gap-3">
            <Navbar />

            <hr className="mx-2 h-6 border-0 border-l border-white/30 md:hidden" />

            {/* login */}
            {!ready ? (
              // Giữ chỗ trong lúc đọc session để header không bị nhảy bố cục
              <div className="h-10 w-[236px] lg:hidden" aria-hidden />
            ) : isLogged ? (
              <div className="flex items-center justify-between gap-3">
                <RentalCart />

                {/* <Notification /> */}

                <Username compact />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <Link
                  href="/signup"
                  className="flex h-10 min-w-[110px] items-center justify-center rounded-lg border border-white/60 px-4 text-sm font-medium text-white transition-colors hover:bg-white/10 lg:hidden"
                >
                  Đăng ký
                </Link>

                <Link
                  href="/signin"
                  className="flex h-10 items-center justify-center whitespace-nowrap rounded-lg bg-white px-4 text-sm font-semibold text-primary transition-all hover:bg-white/90 active:scale-[0.98]"
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
