import { ReactNode } from 'react';

import Sidebar from '@/components/profile/Sidebar';

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-[260px_minmax(0,1fr)] items-start gap-8 lg:grid-cols-1 lg:gap-6">
      <Sidebar />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
