'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import Link from 'next/link';

import {
  orderDetailStatus,
  paymentStatus,
} from '@/app/(client)/(routes)/(profiles)/myorders/common/data';
import { DataTableColumnHeader } from '@/components/admin/tables/data-table-column-header';
import { Checkbox } from '@/components/ui/checkbox';
import TooltipCustom from '@/components/ui/tooltip-custom';
import { cn, formatDateToDMY, formatNumberToCurrency } from '@/lib/utils';

export const columns: ColumnDef<any>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="">{row.getValue('id')}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'orderId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mã đơn" />
    ),
    cell: ({ row }) => <div className="">{row.getValue('orderId')}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'carId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mã xe" />
    ),
    cell: ({ row }) => <div className="">{row.getValue('carId')}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'pricePerDay',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Giá/ngày" />
    ),
    cell: ({ row }) => (
      <div className="">
        {formatNumberToCurrency(row.getValue('pricePerDay'))}
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'deposits',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cọc" />
    ),
    cell: ({ row }) => (
      <div className="">{formatNumberToCurrency(row.getValue('deposits'))}</div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'startDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày bắt đầu" />
    ),
    cell: ({ row }) => (
      <div className="">{formatDateToDMY(row.getValue('startDate'))}</div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'endDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày kết thúc" />
    ),
    cell: ({ row }) => (
      <div className="">{formatDateToDMY(row.getValue('endDate'))}</div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'totalAmount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tổng tiền" />
    ),
    cell: ({ row }) => (
      <div className="">
        {formatNumberToCurrency(row.getValue('totalAmount'))}
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'orderDetailStatus',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="TT đơn hàng" />
    ),
    cell: ({ row }) => {
      const statusItem = orderDetailStatus.find(
        (statusItem) => statusItem.key === row.getValue('orderDetailStatus'),
      );

      if (!statusItem) {
        return null;
      }

      return (
        <div className="flex items-center justify-center">
          <span
            className={cn(
              'whitespace-nowrap rounded-full px-3 py-1 text-center text-xs font-semibold text-white',
              statusItem.key === 'PENDING'
                ? 'bg-warning/60'
                : statusItem.key === 'CONFIRMED'
                ? 'bg-success/50'
                : statusItem.key === 'CANCELED'
                ? 'bg-error/60'
                : statusItem.key === 'COMPLETED'
                ? 'bg-success/60'
                : statusItem.key === 'RECEIVED'
                ? 'bg-info/60'
                : 'bg-warning/60',
            )}
          >
            {statusItem.value}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'paymentStatus',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="TT thanh toán" />
    ),
    cell: ({ row }) => {
      const statusItem = paymentStatus.find(
        (statusItem) => statusItem.key === row.getValue('paymentStatus'),
      );

      if (!statusItem) {
        return null;
      }

      return (
        <div className="flex items-center justify-center">
          <span
            className={cn(
              'whitespace-nowrap rounded-full px-3 py-1 text-center text-xs font-semibold text-white',
              statusItem.key === 'PENDING'
                ? 'bg-warning/60'
                : statusItem.key === 'DEPOSIT'
                ? 'bg-info/60'
                : statusItem.key === 'REFUND'
                ? 'bg-error/60'
                : statusItem.key === 'PAID'
                ? 'bg-success/60'
                : 'bg-warning/60',
            )}
          >
            {statusItem.value}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày tạo" />
    ),
    cell: ({ row }) => (
      <div className="">{formatDateToDMY(row.getValue('createdAt'))}</div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex items-center justify-between gap-2">
        <Link
          href={`/myorders/${row.getValue('id')}`}
          className="rounded-full p-1 text-primary hover:bg-accent"
        >
          <TooltipCustom content="Xem chi tiet">
            <Eye className="h-4 w-4" />
          </TooltipCustom>
        </Link>
      </div>
    ),
  },
];
