import SearchSkeleton from '@/components/skeletons/search-skeleton';

export default function Loading() {
  return (
    <div className="mt-24 grid grid-cols-4 gap-6 xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
      <SearchSkeleton />
    </div>
  );
}
