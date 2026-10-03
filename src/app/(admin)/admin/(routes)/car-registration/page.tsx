'use client';

import React from 'react';

import { columns } from '@/components/admin/car-registration/columns';
import { DataTable } from '@/components/admin/tables/data-table';
import TableSkeleton from '@/components/skeletons/table-skeleton';
import { GET_ALL_CAR_REGISTRATION } from '@/lib/api-constants';
import { queryKeys, useApiQuery } from '@/lib/query';

const initVisibleColumns = ['id', 'name', 'licensePlates', 'seats', 'fuel', 'pricePerDay', 'brand', 'createdAt', 'status', 'actions'];

const Page = () => {
  const { data: registers, isPending } = useApiQuery<any[]>(queryKeys.adminCarRegistrations, GET_ALL_CAR_REGISTRATION, { status: 'UNAVAILABLE' });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Yêu cầu đăng ký xe</h1>
        {!!registers?.length && (
          <span className="rounded-full bg-yellow-500/15 px-3 py-1 text-sm">
            {registers.length} xe đang chờ duyệt
          </span>
        )}
      </div>

      {isPending ? (
        <TableSkeleton />
      ) : (
        <DataTable columns={columns} data={registers ?? []} search="name" initVisibleColumns={initVisibleColumns} />
      )}
    </div>
  );
};

export default Page;
