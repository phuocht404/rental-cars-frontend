import Image from 'next/image';
import React from 'react';

import InstructionNav from './instruction-nav';

export default function InstructionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <InstructionNav />

        {/* main */}
        <div className="min-w-0 rounded-2xl border border-border bg-card p-10 md:p-5 [&_li]:max-w-[75ch] [&_p]:max-w-[75ch]">
          {children}
        </div>
      </div>
    </div>
  );
}
