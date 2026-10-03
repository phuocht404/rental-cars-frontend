'use client';

import { CalendarDays, CarFront, ChevronLeft, ChevronRight, SearchX } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

import { Button, buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { GET_MY_ORDERS } from '@/lib/api-constants';
import { queryKeys, useApiQuery } from '@/lib/query';
import { cn, formatCurrency, formatDateToDMY } from '@/lib/utils';

const PAGE_SIZE = 8;

const TABS = [
  { value: '', label: 'Tất cả' },
  { value: 'PENDING', label: 'Chờ xác nhận' },
  { value: 'CONFIRMED', label: 'Đã xác nhận' },
  { value: 'COMPLETED', label: 'Hoàn thành' },
  { value: 'CANCELED', label: 'Đã huỷ' },
];

const STATUS: Record<string, { label: string; className: string }> = {
  PENDING: { label: 'Chờ xác nhận', className: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300' },
  CONFIRMED: { label: 'Đã xác nhận', className: 'bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300' },
  COMPLETED: { label: 'Hoàn thành', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300' },
  CANCELED: { label: 'Đã huỷ', className: 'bg-muted text-muted-foreground' },
};

interface Trip {
  id: number;
  startDate: string;
  endDate: string;
  orderDetailStatus: string;
  carName: string;
  carSlug: string;
  thumbnail: string | null;
}

interface MyOrder {
  id: number;
  totalAmount: number;
  deposits: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
  trips: Trip[];
}

const TripCard = ({ order }: { order: MyOrder }) => {
  const first = order.trips[0];
  const status = STATUS[order.orderStatus] ?? STATUS.PENDING;
  const unpaid = order.paymentStatus === 'PENDING' && order.orderStatus !== 'CANCELED';

  return (
    <li className="flex gap-4 rounded-2xl border border-border bg-card p-3 transition-shadow hover:shadow-md sm:flex-col">
      <div className="relative aspect-[4/3] w-44 shrink-0 overflow-hidden rounded-xl bg-muted sm:w-full">
        {first?.thumbnail ? (
          <Image src={first.thumbnail} alt={`Xe ${first.carName}`} fill sizes="(max-width: 640px) 100vw, 176px" className="object-cover" />
        ) : (
          <CarFront className="absolute inset-0 m-auto h-8 w-8 text-muted-foreground" aria-hidden />
        )}
        {order.trips.length > 1 && (
          <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
            {order.trips.length} xe
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 py-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-semibold">
              {order.trips.map((trip) => trip.carName).join(', ') || `Đơn #${order.id}`}
            </p>
            <p className="text-xs text-muted-foreground">Mã đơn #{order.id}</p>
          </div>
          <span className={cn('whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold', status.className)}>
            {status.label}
          </span>
        </div>

        {first && (
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarDays size={15} aria-hidden />
            {formatDateToDMY(new Date(first.startDate))} - {formatDateToDMY(new Date(first.endDate))}
          </p>
        )}

        {unpaid && (
          <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
            Chưa thanh toán tiền cọc. Đơn sẽ tự huỷ nếu không thanh toán.
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-end justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Tổng <span className="font-semibold text-foreground">{formatCurrency(order.totalAmount)}</span>
            <span className="mx-1">·</span>
            Cọc {formatCurrency(order.deposits)}
          </p>
          <Link href={`/mytrips/${order.id}`} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
            Xem chi tiết
          </Link>
        </div>
      </div>
    </li>
  );
};

const TripSkeleton = () => (
  <li className="flex gap-4 rounded-2xl border border-border p-3 sm:flex-col" aria-hidden>
    <Skeleton className="aspect-[4/3] w-44 rounded-xl sm:w-full" />
    <div className="flex flex-1 flex-col gap-3 py-1">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="mt-auto h-8 w-full" />
    </div>
  </li>
);

const Mytrips = () => {
  const [tab, setTab] = useState('');
  const [page, setPage] = useState(1);

  const { data, isPending, isFetching } = useApiQuery<{ data: MyOrder[]; meta: { totalPages: number } }>(
    queryKeys.myTrips,
    GET_MY_ORDERS,
    { page, limit: PAGE_SIZE, ...(tab && { orderStatus: tab }) },
    { keepPrevious: true },
  );

  const orders = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-6 md:p-4">
      <h1 className="mb-6 text-2xl font-bold">Lịch sử thuê xe</h1>

      <div role="tablist" aria-label="Lọc theo trạng thái" className="-mx-1 mb-6 flex gap-2 overflow-x-auto px-1 [scrollbar-width:none]">
        {TABS.map((item) => (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={tab === item.value}
            onClick={() => {
              setTab(item.value);
              setPage(1);
            }}
            className={cn(
              'h-9 shrink-0 whitespace-nowrap rounded-full border px-4 text-sm font-medium transition-colors',
              tab === item.value
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border hover:border-primary/50 hover:bg-primary/5',
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {isPending ? (
        <ul className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <TripSkeleton key={index} />
          ))}
        </ul>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border px-6 py-14 text-center">
          <SearchX className="h-10 w-10 text-muted-foreground" aria-hidden />
          <p className="font-semibold">{tab ? 'Không có chuyến nào ở trạng thái này' : 'Bạn chưa thuê chuyến xe nào'}</p>
          <Link href="/search" className={buttonVariants({ size: 'sm' })}>
            Tìm xe ngay
          </Link>
        </div>
      ) : (
        <ul className={cn('flex flex-col gap-4 transition-opacity', isFetching && 'opacity-60')} aria-busy={isFetching}>
          {orders.map((order) => (
            <TripCard key={order.id} order={order} />
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <nav aria-label="Phân trang" className="mt-6 flex items-center justify-center gap-3 text-sm">
          <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => setPage(page - 1)} aria-label="Trang trước">
            <ChevronLeft size={16} />
          </Button>
          <span>
            Trang {page} / {totalPages}
          </span>
          <Button variant="outline" size="icon" disabled={page >= totalPages} onClick={() => setPage(page + 1)} aria-label="Trang sau">
            <ChevronRight size={16} />
          </Button>
        </nav>
      )}
    </div>
  );
};

export default Mytrips;
