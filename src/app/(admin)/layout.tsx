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
    <div className="h-screen w-screen overflow-y-auto overflow-x-hidden bg-white dark:bg-black dark:text-white">
      <div className="flex items-start justify-between">
        <Sidebar className="h-screen w-1/6 border-r-2 border-slate-50" />
        <div className="w-full overflow-x-auto">
          <Header />
          <main className="w-full bg-white p-4 dark:bg-black">{children}</main>
        </div>
      </div>
    </div>
  );
}
