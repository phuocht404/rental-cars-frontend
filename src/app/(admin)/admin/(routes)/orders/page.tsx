'use client';

import React from 'react';

import { columns } from '@/components/admin/orders/columns';
import { orderStatus, paymentStatus } from '@/components/admin/orders/data';
import { DataTable } from '@/components/admin/tables/data-table';
import TableSkeleton from '@/components/skeletons/table-skeleton';
import { GET_ALL_ORDERS } from '@/lib/api-constants';
import { queryKeys, useApiQuery } from '@/lib/query';
import { useServerTable } from '@/lib/use-server-table';

const filter = [{ orderStatus }, { paymentStatus }];
const FILTER_COLUMNS = ['orderStatus', 'paymentStatus'];
const initVisibleColumns = [
  'id',
  'deposits',
  'totalAmount',
  'orderStatus',
  'paymentStatus',
  'createdAt',
  'actions',
];

const OrderPage = () => {
  // Ô tìm kiếm tìm theo mã đơn hoặc tên khách
  const { params, tableState } = useServerTable({ searchColumn: 'id', filterColumns: FILTER_COLUMNS });
  const { data, isPending, isFetching } = useApiQuery<any>(queryKeys.adminOrders, GET_ALL_ORDERS, params, {
    keepPrevious: true,
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>
      </div>

      {isPending ? (
        <TableSkeleton />
      ) : (
        <DataTable
          columns={columns}
          data={data?.data ?? []}
          search="id"
          filters={filter}
          initVisibleColumns={initVisibleColumns}
          server={{ ...tableState, pageCount: data?.meta?.totalPages ?? 1, isFetching }}
        />
      )}
    </div>
  );
};

export default OrderPage;
