'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { Inbox } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { DataTablePagination } from '@/components/admin/tables/data-table-pagination';
import { DataTableToolbar } from '@/components/admin/tables/data-table-toolbar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

export interface ServerTableOptions {
  pageCount: number;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  columnFilters: ColumnFiltersState;
  onColumnFiltersChange: OnChangeFn<ColumnFiltersState>;
  /** Đang tải trang mới (giữ dữ liệu cũ trên màn hình, chỉ làm mờ) */
  isFetching?: boolean;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  search?: string;
  filters?: any[];
  initVisibleColumns?: string[];
  statuses?: any[];
  /** Có giá trị thì phân trang + lọc + tìm kiếm do server xử lý */
  server?: ServerTableOptions;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  search,
  filters,
  initVisibleColumns = [],
  server,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [localColumnFilters, setLocalColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const columnFilters = server?.columnFilters ?? localColumnFilters;

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table chưa hỗ trợ React Compiler
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility: {
        ...columnVisibility,
        ...columns.reduce((acc: any, column: any) => {
          if (initVisibleColumns.includes(column.id)) {
            acc[column.id] = true;
          }
          return acc;
        }, {}),
      },
      rowSelection,
      columnFilters,
      ...(server && { pagination: server.pagination }),
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: server?.onColumnFiltersChange ?? setLocalColumnFilters,
    ...(server && {
      manualPagination: true,
      manualFiltering: true,
      pageCount: Math.max(server.pageCount, 1),
      onPaginationChange: server.onPaginationChange,
    }),
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  useEffect(() => {
    if (initVisibleColumns.length > 0) {
      table.getAllColumns().map((column) => {
        column.toggleVisibility(false);
      });
      initVisibleColumns.forEach((columnId) => {
        table.getColumn(columnId)?.toggleVisibility(true);
      });
    }
  }, [initVisibleColumns, table]);

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        filters={filters}
        search={search}
        initVisibleColumns={initVisibleColumns}
      />

      <div
        className={cn(
          'overflow-hidden rounded-xl border border-border transition-opacity',
          server?.isFetching && 'opacity-60',
        )}
        aria-busy={server?.isFetching || undefined}
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row: any) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell: any) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-40 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Inbox className="h-8 w-8" />
                    <span className="text-sm">Không có dữ liệu.</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
