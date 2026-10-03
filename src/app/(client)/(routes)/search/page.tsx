import { ChevronLeftIcon, ChevronRightIcon, SearchX } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import React, { Suspense } from 'react';

import CarCard from '@/components/CarCard';
import SearchSkeleton from '@/components/skeletons/search-skeleton';
import { parseSearchParams, SearchQuery, toApiQuery, toSearchUrl } from '@/lib/search-params';
import { serverFetch } from '@/lib/server-api';
import { cn } from '@/lib/utils';
import type { CarSummary, Paginated } from '@/types/car';

import SearchToolbar from './search-toolbar';

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export const metadata: Metadata = {
  title: 'Tìm xe tự lái',
  description:
    'Tìm và so sánh xe ô tô tự lái còn trống tại Đà Nẵng theo ngày, mức giá, số chỗ và năm sản xuất.',
  // Mọi biến thể bộ lọc đều quy về một URL chuẩn để tránh nội dung trùng lặp
  alternates: { canonical: '/search' },
};

const pageNumbers = (current: number, total: number) => {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  return Array.from(pages).filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
};

const Pagination = ({ query, totalPages }: { query: SearchQuery; totalPages: number }) => {
  if (totalPages <= 1) return null;

  const pages = pageNumbers(query.page, totalPages);
  const linkClass =
    'flex h-10 w-10 items-center justify-center rounded-full text-sm transition-colors hover:bg-accent';

  return (
    <nav aria-label="Phân trang" className="mt-10 flex items-center justify-center gap-2">
      {query.page > 1 && (
        <Link href={toSearchUrl({ ...query, page: query.page - 1 })} className={linkClass} aria-label="Trang trước" scroll={false}>
          <ChevronLeftIcon className="h-4 w-4" />
        </Link>
      )}

      {pages.map((page, index) => (
        <React.Fragment key={page}>
          {index > 0 && page - pages[index - 1] > 1 && <span className="px-1">…</span>}
          <Link
            href={toSearchUrl({ ...query, page })}
            aria-current={page === query.page ? 'page' : undefined}
            scroll={false}
            className={cn(
              linkClass,
              page === query.page && 'bg-primary text-primary-foreground hover:bg-primary',
            )}
          >
            {page}
          </Link>
        </React.Fragment>
      ))}

      {query.page < totalPages && (
        <Link href={toSearchUrl({ ...query, page: query.page + 1 })} className={linkClass} aria-label="Trang sau" scroll={false}>
          <ChevronRightIcon className="h-4 w-4" />
        </Link>
      )}
    </nav>
  );
};

const SearchResults = async ({ query }: { query: SearchQuery }) => {
  // Lịch trống thay đổi thường xuyên nên chỉ cache ngắn
  const result = await serverFetch<Paginated<CarSummary>>(`cars/search/cars?${toApiQuery(query)}`, {
    revalidate: 30,
    tags: ['cars'],
  }).catch(() => null);

  if (!result) {
    return (
      <p className="mt-8 rounded-2xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
        Không tải được danh sách xe. Vui lòng thử lại sau.
      </p>
    );
  }

  if (result.data.length === 0) {
    return (
      <div className="mx-auto mt-8 flex max-w-md flex-col items-center gap-3 rounded-2xl border border-dashed border-border px-6 py-16 text-center">
        <SearchX className="h-10 w-10 text-muted-foreground" aria-hidden />
        <h2 className="text-xl font-semibold">Chưa có xe phù hợp</h2>
        <p className="text-sm text-muted-foreground">
          Không có xe nào trống trong khoảng ngày này. Hãy thử đổi ngày thuê hoặc bỏ bớt bộ lọc.
        </p>
      </div>
    );
  }

  return (
    <>
      <p className="mt-6 text-sm text-muted-foreground">
        Tìm thấy {result.meta.totalCars ?? result.data.length} xe còn trống
      </p>
      <div className="mt-4 grid grid-cols-4 gap-6 xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
        {result.data.map((car) => (
          <div className="col-span-1" key={car.slug}>
            <CarCard {...car} />
          </div>
        ))}
      </div>
      <Pagination query={query} totalPages={result.meta.totalPages} />
    </>
  );
};

export default async function SearchPage({ searchParams }: PageProps) {
  const query = parseSearchParams(await searchParams);

  return (
    <div>
      <h1 className="sr-only">Tìm xe tự lái tại Đà Nẵng</h1>

      <header className="sticky top-16 z-20 border-b border-border bg-background/95 py-4 backdrop-blur">
        <SearchToolbar query={query} />
      </header>

      {/* key theo query: đổi bộ lọc/trang sẽ hiện skeleton ngay trong lúc server tải kết quả mới */}
      <Suspense
        key={toApiQuery(query)}
        fallback={
          <div className="mt-8 grid grid-cols-4 gap-6 xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
            <SearchSkeleton />
          </div>
        }
      >
        <SearchResults query={query} />
      </Suspense>
    </div>
  );
}
