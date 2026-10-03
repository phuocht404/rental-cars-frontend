'use client';

import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { DataTable } from '@/components/admin/tables/data-table';
import { columns } from '@/components/admin/users/columns';
import { role, status } from '@/components/admin/users/common/data';
import TableSkeleton from '@/components/skeletons/table-skeleton';
import { GET_ALL_USERS } from '@/lib/api-constants';
import { queryKeys, useApiQuery } from '@/lib/query';
import { useServerTable } from '@/lib/use-server-table';

const filterUser = [{ status }, { role }];
const FILTER_COLUMNS = ['status', 'role'];

export default function UsersPage() {
  const { params, tableState } = useServerTable({ searchColumn: 'name', filterColumns: FILTER_COLUMNS });
  const { data, isPending, isFetching } = useApiQuery<any>(queryKeys.adminUsers, GET_ALL_USERS, params, {
    keepPrevious: true,
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Quản lý người dùng</h1>

        <Link
          href="/admin/users/new"
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
          filters={filterUser}
          server={{ ...tableState, pageCount: data?.meta?.totalPages ?? 1, isFetching }}
        />
      )}
    </div>
  );
}
