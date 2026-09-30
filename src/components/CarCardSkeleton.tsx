import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

const CarCardSkeleton = () => (
  <div className="flex min-h-[356px] min-w-[180px] flex-col gap-6 rounded-lg border border-border bg-card p-4 shadow-md xl:min-h-[398px]">
    <Skeleton className="h-[204px] w-full rounded-lg" />
    <div className="flex flex-col gap-3">
      <Skeleton className="h-5 w-20 rounded-full" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="my-2 h-[1px] w-full bg-border" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-20" />
      </div>
    </div>
  </div>
);

export default CarCardSkeleton;
