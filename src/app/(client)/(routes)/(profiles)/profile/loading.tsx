import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="w-full rounded-2xl border border-border bg-card p-6 md:p-4" aria-hidden>
      <Skeleton className="h-8 w-64" />
      <div className="mt-6 flex gap-6 md:flex-col">
        <div className="flex w-1/3 flex-col items-center gap-3 md:w-full">
          <Skeleton className="h-[146px] w-[146px] rounded-full" />
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="flex w-2/3 flex-col gap-4 md:w-full">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-6 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
