'use client';

import { ColumnDef } from '@tanstack/react-table';

import { paymentStatus } from '@/app/(client)/(routes)/(profiles)/myorders/common/data';
import { orderStatus } from '@/app/(client)/(routes)/(profiles)/mytrips/data';
import { DataTableColumnHeader } from '@/components/admin/tables/data-table-column-header';
import { DataTableRowActions } from '@/components/admin/tables/data-table-row-action';
import { DeleteDialog } from '@/components/admin/users/delete-dialog';
import { Checkbox } from '@/components/ui/checkbox';
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
    accessorKey: 'orderStatus',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="TT đơn hàng" />
    ),
    cell: ({ row }) => {
      const statusItem = orderStatus.find(
        (statusItem) => statusItem.key === row.getValue('orderStatus'),
      );

      if (!statusItem) {
        return null;
      }

      return (
        <div className="flex items-center justify-center">
          <span
            className={cn(
              'whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold text-white',
              statusItem.key === 'PENDING'
                ? 'bg-warning/60'
                : statusItem.key === 'CONFIRMED'
                ? 'bg-info/60'
                : statusItem.key === 'CANCELED'
                ? 'bg-error/60'
                : statusItem.key === 'COMPLETED'
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
              'whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold text-white',
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
      <DataTableRowActions
        row={row}
        onDeleted={<DeleteDialog data={row.original} />}
      />
    ),
  },
];
