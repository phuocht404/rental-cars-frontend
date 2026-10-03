'use client';

import { useState } from 'react';

import UpdateStatusAlertDialog from '@/components/admin/cars/update-status-alert-dialog';
import { Button } from '@/components/ui/button';
import { Command, CommandGroup } from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const StatusCombobox = ({
  status,
  statusInit,
  carId,
}: {
  status: any;
  statusInit: any;
  carId: number;
}) => {
  const [open, setOpen] = useState(false);
  // Trạng thái hiện tại lấy thẳng từ props; danh sách tự làm mới sau khi đổi trạng thái
  const value: { key: string; value: string } = statusInit;


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'justify-between rounded-full px-2 py-1 text-white',
            value.key === 'AVAILABLE'
              ? 'bg-success/60'
              : value.key === 'UNAVAILABLE'
              ? 'bg-error/60'
              : value.key === 'RENTING'
              ? 'bg-warning/60'
              : 'bg-warning/60',
          )}
        >
          {value
            ? status.find((statusItem: any) => statusItem.key === value.key)
                ?.value
            : ''}
          {/* <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /> */}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandGroup className="">
            {status.map((statusItem: any) => (
              <UpdateStatusAlertDialog
                statusItem={statusItem}
                statusInit={statusInit}
                carId={carId}
                key={statusItem.key}
              />
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StatusCombobox;
