'use client';

import { BellRing } from 'lucide-react';
import React from 'react';

import { columns } from '@/app/(client)/(routes)/(profiles)/myorders/columns';
import {
  orderDetailStatus,
  paymentStatus,
} from '@/app/(client)/(routes)/(profiles)/myorders/common/data';
import { DataTable } from '@/components/admin/tables/data-table';
import TableSkeleton from '@/components/skeletons/table-skeleton';
import { GET_ORDER_DETAIL_BY_USER_ID } from '@/lib/api-constants';
import { queryKeys, useApiQuery } from '@/lib/query';

const filterOrderDetail = [{ orderDetailStatus }, { paymentStatus }];
const initVisibleColumns = [
  'id',
  'orderId',
  'carId',
  'startDate',
  'endDate',
  'totalAmount',
  'orderDetailStatus',
  'paymentStatus',
  'actions',
];

const MyordersPage = () => {
  const { data: orders, isPending } = useApiQuery<any[]>(queryKeys.myOrderDetails, GET_ORDER_DETAIL_BY_USER_ID);
  const pendingCount = orders?.filter((order) => order.orderDetailStatus === 'PENDING').length ?? 0;

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-6 md:p-4">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Đơn đặt xe</h1>
      </header>

      {pendingCount > 0 && (
        <p
          role="status"
          className="mb-6 flex items-center gap-2 rounded-lg border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm"
        >
          <BellRing className="h-4 w-4" aria-hidden />
          Có {pendingCount} chuyến đang chờ bạn xác nhận. Chuyến chưa xác nhận sẽ tự huỷ khi tới ngày nhận xe.
        </p>
      )}

      {isPending ? (
        <TableSkeleton />
      ) : (
        <DataTable
          columns={columns}
          data={orders ?? []}
          filters={filterOrderDetail}
          initVisibleColumns={initVisibleColumns}
        />
      )}
    </div>
  );
};

export default MyordersPage;
