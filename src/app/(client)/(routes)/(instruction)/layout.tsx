'use client';

import Image from 'next/image';
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

export default function InstructionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-10">
      {/* banner */}
      <div className="relative flex min-h-[260px] items-end overflow-hidden rounded-2xl bg-primary/10 md:min-h-[200px]">
        <Image
          src="/images/banner-instruction.png"
          alt=""
          fill
          priority
          sizes="(max-width: 1400px) 100vw, 1400px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <h1 className="relative p-10 text-5xl font-bold tracking-tight text-white lg:text-4xl md:p-6 md:text-3xl">
          Hướng dẫn &amp; Quy chế
        </h1>
      </div>

      {/* content */}
      <div className="grid grid-cols-[260px_1fr] items-start gap-10 lg:grid-cols-1 lg:gap-6">
        {/* sidebar */}
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

        {/* main */}
        <div className="min-w-0 rounded-2xl border border-border bg-card p-10 md:p-5 [&_li]:max-w-[75ch] [&_p]:max-w-[75ch]">
          {children}
        </div>
      </div>
    </div>
  );
}
