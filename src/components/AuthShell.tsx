import { Home } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import TooltipCustom from '@/components/ui/tooltip-custom';

interface AuthShellProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

/** Khung dùng chung cho đăng nhập / đăng ký: ảnh bên trái, form bên phải. */
const AuthShell = ({ title, description, children, footer }: AuthShellProps) => {
  return (
    <div className="grid h-[100dvh] w-full grid-cols-2 overflow-y-auto bg-background lg:grid-cols-1">
      <div className="sticky top-0 h-[100dvh] lg:hidden">
        <Image
          src="/images/banner-img2.png"
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />
        <div className="absolute bottom-0 left-0 flex max-w-[460px] flex-col gap-3 p-12">
          <h2 className="text-4xl font-bold leading-tight tracking-tight text-white">
            Thuê xe tự lái tại Đà Nẵng
          </h2>
          <p className="text-base leading-relaxed text-white/85">
            Chọn xe, chọn ngày và nhận xe ngay trên Rental Cars.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-10">
        <div className="flex w-full max-w-sm flex-col gap-8">
          <TooltipCustom content="Trang chủ">
            <Link
              href="/"
              aria-label="Về trang chủ"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Home size={16} />
            </Link>
          </TooltipCustom>

          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          {children}

          <div className="flex items-center gap-2 text-sm">{footer}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthShell;
