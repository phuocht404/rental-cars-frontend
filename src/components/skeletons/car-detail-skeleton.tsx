import { Skeleton } from '@/components/ui/skeleton';

/** Khung chờ cho trang chi tiết xe: tab, ảnh, thông tin và panel đặt xe. */
const CarDetailSkeleton = () => (
  <div className="flex flex-col gap-6" aria-hidden="true">
    <Skeleton className="h-12 w-full rounded-xl" />

    <div className="grid grid-cols-[2fr_1fr] gap-3 lg:grid-cols-1">
      <Skeleton className="aspect-[3/2] w-full rounded-xl" />
      <div className="grid grid-rows-3 gap-3 lg:grid-cols-3 lg:grid-rows-1">
        <Skeleton className="aspect-[2/1] w-full rounded-xl" />
        <Skeleton className="aspect-[2/1] w-full rounded-xl" />
        <Skeleton className="aspect-[2/1] w-full rounded-xl" />
      </div>
    </div>

    <div className="flex items-start gap-6 lg:flex-col">
      <div className="flex w-2/3 flex-col gap-4 rounded-2xl border border-border p-8 lg:w-full md:p-5">
        <Skeleton className="h-9 w-2/3" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-px w-full" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-14" />
          <Skeleton className="h-14" />
          <Skeleton className="h-14" />
        </div>
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>

      <div className="flex w-1/3 flex-col gap-4 rounded-2xl border border-border p-8 lg:w-full md:p-5">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>
    </div>
  </div>
);

export default CarDetailSkeleton;
