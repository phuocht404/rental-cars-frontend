'use client';

import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { columns } from '@/app/(client)/(routes)/(profiles)/mycars/columns';
import { fuel, status } from '@/components/admin/cars/common/data';
import { DataTable } from '@/components/admin/tables/data-table';
import TableSkeleton from '@/components/skeletons/table-skeleton';
import { GET_ALL_MY_CAR } from '@/lib/api-constants';
import { queryKeys, useApiQuery } from '@/lib/query';

// Khai báo ngoài component để không tạo mảng mới mỗi lần render (DataTable phụ thuộc vào tham chiếu)
const filterCars = [{ status }, { fuel }];
const initVisibleColumns = ['id', 'CarImage', 'name', 'licensePlates', 'status', 'fuel', 'pricePerDay', 'actions'];

const MycarsPage = () => {
  const { data: cars, isPending } = useApiQuery<any[]>(queryKeys.myCars, GET_ALL_MY_CAR);

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-6 md:p-4">
      <header className="mb-10 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Danh sách xe</h1>

        <Link
          href="/mycars/new"
          className="flex items-center justify-between gap-2 rounded border border-border bg-primary px-4 py-1 text-white hover:bg-primary/90 active:scale-95"
        >
          <PlusCircle className="mr-2 size-4" />
          Thêm
        </Link>
      </header>

      {isPending ? (
        <TableSkeleton />
      ) : (
        <DataTable
          columns={columns}
          data={cars ?? []}
          search="name"
          filters={filterCars}
          initVisibleColumns={initVisibleColumns}
          statuses={status}
        />
      )}
    </div>
  );
};

export default MycarsPage;
