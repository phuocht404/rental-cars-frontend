'use client';

import UserAvatar from '@/components/user-avatar';
import { ColumnDef } from '@tanstack/react-table';



import { CarType } from '@/components/admin/schemas';
import { DataTableColumnHeader } from '@/components/admin/tables/data-table-column-header';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDateToDMY } from '@/lib/utils';
import ConfirmOwnerRegistrationAlertDialog from './confirm-owner-registration-alert-dialog';

export const columns: ColumnDef<CarType>[] = [
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
    cell: ({ row }) => <div className="text-center">{row.getValue('id')}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'avatarUrl',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ảnh" />
    ),
    cell: ({ row }) => (
      <UserAvatar name={(row.original as any).name} src={row.getValue('avatarUrl') as string | null} />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên nguời dùng" />
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.getValue('name')}</div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'registerAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày đăng ký" />
    ),
    cell: ({ row }) => (
      <div className="text-center">
        {formatDateToDMY(row.getValue('registerAt'))}
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: 'actions',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Hành động"
        className="text-center"
      />
    ),
    cell: ({ row }) => (
      <div className="flex justify-center gap-2">
        <ConfirmOwnerRegistrationAlertDialog
          row={row}
          title="Xác nhận"
          isConfirm={true}
        />
        <ConfirmOwnerRegistrationAlertDialog
          row={row}
          title="Từ chối"
          className="bg-red-500 hover:bg-red-600"
          isConfirm={false}
        />
      </div>
    ),
  },
];
