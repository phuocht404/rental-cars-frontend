'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { orderDetailStatus } from '@/app/(client)/(routes)/(profiles)/myorders/common/data';
import UpdateOrderDetailStatusAlertDialog from '@/app/(client)/(routes)/(profiles)/myorders/update-order-detail-status-alert-dialog';
import { Button } from '@/components/ui/button';
import { Command, CommandGroup } from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { UPDATE_ORDER_DETAIL_STATUS_BY_ID } from '@/lib/api-constants';
import { cn } from '@/lib/utils';
import { API } from '@/services';

const OrderStatusCombobox = ({
  status,
  statusInit,
  orderDetailId,
  carId,
}: {
  status: any;
  statusInit: any;
  orderDetailId: number;
  carId: number;
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<{
    key: string;
    value: string;
  }>(statusInit);

  const updateOrderDetailStatus = async (status: string) => {
    try {
      const res = await API.patch(
        UPDATE_ORDER_DETAIL_STATUS_BY_ID + `/${orderDetailId}`,
        {
          orderDetailStatus: status,
          carId: carId,
        },
      );
      if (res.status === 200) {
        setValue({
          key: res.data.orderDetailStatus,
          value: orderDetailStatus.find(
            (statusItem: any) => statusItem.key === res.data.orderDetailStatus,
          )?.value as string,
        });

        toast.success('Cập nhật trạng thái đơn hàng thành công');
      }
    } catch (error: any) {
      toast.error(error.error, {
        description: error.message,
      });
    }
  };


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'flex min-w-[86px] justify-center rounded-full px-2 py-1 text-white',
            value.key === 'PENDING'
              ? 'bg-warning/60'
              : value.key === 'CONFIRMED'
              ? 'bg-success/50'
              : value.key === 'CANCELED'
              ? 'bg-error/60'
              : value.key === 'COMPLETED'
              ? 'bg-success'
              : value.key === 'RECEIVED'
              ? 'bg-info/60'
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
              <UpdateOrderDetailStatusAlertDialog
                statusItem={statusItem}
                statusInit={value}
                key={statusItem.key}
                handleUpdateStatus={updateOrderDetailStatus}
              />
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default OrderStatusCombobox;
