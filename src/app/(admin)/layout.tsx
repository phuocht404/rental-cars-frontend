import type { Metadata } from 'next';
import React from 'react';

import Header from '@/components/admin/header';
import { Sidebar } from '@/components/admin/sidebar';

export const metadata: Metadata = {
  title: { default: 'Quản trị', template: '%s | Quản trị Rental Cars' },
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh w-full bg-background text-foreground">
      <div className="flex items-start justify-between">
        <Sidebar className="sticky top-0 h-dvh w-1/6 shrink-0 border-r border-border" />
        <div className="w-full overflow-x-auto">
          <Header />
          <main className="w-full p-4">{children}</main>
        </div>
      </div>
    </div>
  );
}
