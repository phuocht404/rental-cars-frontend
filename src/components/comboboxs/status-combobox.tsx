import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const StatusCombobox = ({
  statuses,
}: {
  statuses: any;
  initStatus: string;
}) => {
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<any | null>(null);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="w-[150px] justify-start">
          {selectedStatus ? (
            <>
              <selectedStatus.icon className="mr-2 h-4 w-4 shrink-0" />
              {selectedStatus.label}
            </>
          ) : (
            <>+ Set status</>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Đổi trạng thái..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {statuses.map((status: any) => (
                <CommandItem
                  key={status.value}
                  value={status.value}
                  onSelect={(value) => {
                    setSelectedStatus(
                      statuses.find(
                        (priority: any) => priority.value === value,
                      ) || null,
                    );
                    setOpen(false);
                  }}
                >
                  <span>{status.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StatusCombobox;
