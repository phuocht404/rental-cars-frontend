'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { cn } from '@/lib/utils';

const sidebar: { title: string; href: string }[] = [
  {
    title: 'Hướng dẫn chung',
    href: '/howitwork',
  },
  {
    title: 'Hướng dẫn đặt xe',
    href: '/bookinghowto',
  },
  {
    title: 'Hướng dẫn thanh toán',
    href: '/paymenthowto',
  },
  {
    title: 'Quy chế hoạt động',
    href: '/regu',
  },
];

// Phần duy nhất cần chạy ở client: biết đường dẫn hiện tại để đánh dấu mục đang xem
export default function InstructionNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Hướng dẫn"
      className="sticky top-24 lg:static lg:-mx-4 lg:overflow-x-auto lg:px-4"
    >
      <ul className="flex flex-col gap-1 lg:flex-row lg:gap-2">
        {sidebar.map(({ title, href }) => {
          const active = pathname === href;

          return (
            <li key={href} className="lg:shrink-0">
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'block whitespace-nowrap rounded-lg border-l-4 px-4 py-3 text-sm transition-colors lg:border-l-0 lg:border lg:px-4 lg:py-2',
                  active
                    ? 'border-primary bg-primary/10 font-semibold text-primary lg:border-primary'
                    : 'border-transparent text-muted-foreground hover:bg-accent hover:text-foreground lg:border-border',
                )}
              >
                {title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
