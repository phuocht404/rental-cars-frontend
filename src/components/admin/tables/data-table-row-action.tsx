'use client';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import { FileSignature } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  onDeleted?: any;
}

export function DataTableRowActions<TData>({
  row,
  onDeleted,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter();
  const pathname = usePathname();


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            router.push(`${pathname}/${row?.original?.id}`);
          }}
        >
          Cập nhật
          <DropdownMenuShortcut>
            <FileSignature className="h-4 w-4 text-warning" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          {onDeleted}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
