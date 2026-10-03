import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

/** Khung chờ cùng hình dạng với CarCard để tránh nhảy layout. */
const CarCardSkeleton = () => (
  <div className="flex h-full min-w-[180px] flex-col gap-4 rounded-2xl border border-border bg-card p-3 shadow-sm">
    <Skeleton className="aspect-[4/3] w-full rounded-xl" />
    <div className="flex flex-col gap-3 px-1 pb-1">
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="mt-2 flex items-end justify-between border-t border-border pt-3">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-5 w-24" />
      </div>
    </div>
  </div>
);

export default CarCardSkeleton;
