'use client';

import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { columns } from '@/components/admin/cars/columns';
import { fuel, status } from '@/components/admin/cars/common/data';
import { DataTable } from '@/components/admin/tables/data-table';
import TableSkeleton from '@/components/skeletons/table-skeleton';
import { GET_ALL_CARS } from '@/lib/api-constants';
import { queryKeys, useApiQuery } from '@/lib/query';
import { useServerTable } from '@/lib/use-server-table';

const filterCars = [{ status }, { fuel }];
const FILTER_COLUMNS = ['status', 'fuel'];
const initVisibleColumns = [
  'id',
  'name',
  'licensePlates',
  'seats',
  'fuel',
  'pricePerDay',
  'brand',
  'createdAt',
  'status',
  'actions',
];

export default function CarsPage() {
  const { params, tableState } = useServerTable({ searchColumn: 'name', filterColumns: FILTER_COLUMNS });
  const { data, isPending, isFetching } = useApiQuery<any>(queryKeys.adminCars, GET_ALL_CARS, params, {
    keepPrevious: true,
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Quản lý xe</h1>

        <Link
          href="/admin/cars/new"
          className="flex items-center justify-between gap-2 rounded border border-gray-100 bg-primary px-4 py-1 text-white hover:bg-primary/90 active:scale-95"
        >
          <PlusCircle className="h-4 w-4" />
          Thêm
        </Link>
      </div>

      {isPending ? (
        <TableSkeleton />
      ) : (
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          search="name"
          filters={filterCars}
          initVisibleColumns={initVisibleColumns}
          server={{ ...tableState, pageCount: data?.meta?.totalPages ?? 1, isFetching }}
        />
      )}
    </div>
  );
}
