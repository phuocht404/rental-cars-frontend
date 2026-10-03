import { Skeleton } from '@/components/ui/skeleton';

/** Khung chờ cho bảng dữ liệu: thanh công cụ, các hàng và phân trang. */
const TableSkeleton = () => {
  return (
    <div className="space-y-4" aria-hidden="true">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-9 w-[250px] md:w-full" />
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-28" />
        </div>
        <Skeleton className="h-9 w-20" />
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <Skeleton className="h-11 w-full rounded-none" />
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 border-t border-border p-4"
          >
            <Skeleton className="h-4 w-1/6" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/5" />
            <Skeleton className="ml-auto h-4 w-16" />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-9 w-56" />
      </div>
    </div>
  );
};

export default TableSkeleton;
