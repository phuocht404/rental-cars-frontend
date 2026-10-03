'use client';

import UserAvatar from '@/components/user-avatar';
import { ColumnDef } from '@tanstack/react-table';

import { UserType } from '@/components/admin/schemas';
import { DataTableColumnHeader } from '@/components/admin/tables/data-table-column-header';
import { DataTableRowActions } from '@/components/admin/tables/data-table-row-action';
import { DeleteDialog } from '@/components/admin/users/delete-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { cn, formatDateToDMY } from '@/lib/utils';

import { role, status } from './common/data';

export const columns: ColumnDef<UserType>[] = [
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
    accessorKey: 'username',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tài khoản" />
    ),
    cell: ({ row }) => <div className="">{row.getValue('username')}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Họ tên" />
    ),
    cell: ({ row }) => (
      <div className="">
        {row.getValue('name') ? (
          <>{row.getValue('name')}</>
        ) : (
          <>Không có dữ liệu</>
        )}
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="">
        {row.getValue('email') ? (
          <>{row.getValue('email')}</>
        ) : (
          <>Không có dữ liệu</>
        )}
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Số điện thoại" />
    ),
    cell: ({ row }) => (
      <div className="">
        {row.getValue('phone') ? (
          <>{row.getValue('phone')}</>
        ) : (
          <>Không có dữ liệu</>
        )}
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày tham gia" />
    ),
    cell: ({ row }) => (
      <div className="">{formatDateToDMY(row.getValue('createdAt'))}</div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vai trò" />
    ),
    cell: ({ row }) => {
      const roleList = role.find(
        (roleList) => roleList.key === row.getValue('role'),
      );

      if (!roleList) {
        return null;
      }

      return (
        <div className="flex items-center">
          <span className="whitespace-nowrap">{roleList.value}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trạng thái" />
    ),
    cell: ({ row }) => {
      const statusItem = status.find(
        (statusItem) => statusItem.key === row.getValue('status'),
      );

      if (!statusItem) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          <span
            className={cn(
              'whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold text-white',
              statusItem.key === 'ACTIVE'
                ? 'bg-success/70'
                : statusItem.key === 'INACTIVE'
                ? 'bg-error/70'
                : 'bg-warning/70',
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
    id: 'actions',
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        onDeleted={<DeleteDialog data={row.original} />}
      />
    ),
  },
];
