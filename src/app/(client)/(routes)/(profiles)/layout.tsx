import type { Metadata } from 'next';
import { ReactNode } from 'react';

import Sidebar from '@/components/profile/Sidebar';

// Trang cá nhân không cần (và không nên) xuất hiện trên công cụ tìm kiếm
export const metadata: Metadata = {
  title: 'Tài khoản',
  robots: { index: false, follow: false },
};

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-[260px_minmax(0,1fr)] items-start gap-8 lg:grid-cols-1 lg:gap-6">
      <Sidebar />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
