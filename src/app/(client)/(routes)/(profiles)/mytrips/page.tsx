'use client';

import React from 'react';

import { columns } from '@/app/(client)/(routes)/(profiles)/mytrips/columns';
import { orderStatus, paymentStatus } from '@/app/(client)/(routes)/(profiles)/mytrips/data';
import { DataTable } from '@/components/admin/tables/data-table';
import TableSkeleton from '@/components/skeletons/table-skeleton';
import { GET_MY_ORDERS } from '@/lib/api-constants';
import { queryKeys, useApiQuery } from '@/lib/query';
import { useServerTable } from '@/lib/use-server-table';

const filterOrders = [{ orderStatus }, { paymentStatus }];
const FILTER_COLUMNS = ['orderStatus', 'paymentStatus'];
const initVisibleColumns = ['id', 'deposits', 'totalAmount', 'orderStatus', 'paymentStatus', 'createdAt', 'actions'];

const Mytrips = () => {
  const { params, tableState } = useServerTable({ filterColumns: FILTER_COLUMNS });
  const { data, isPending, isFetching } = useApiQuery<any>(queryKeys.myTrips, GET_MY_ORDERS, params, {
    keepPrevious: true,
  });

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-6 md:p-4">
      <header className="mb-10 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Lịch sử thuê xe</h1>
      </header>

      {isPending ? (
        <TableSkeleton />
      ) : (
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          filters={filterOrders}
          initVisibleColumns={initVisibleColumns}
          server={{ ...tableState, pageCount: data?.meta?.totalPages ?? 1, isFetching }}
        />
      )}
    </div>
  );
};

export default Mytrips;
