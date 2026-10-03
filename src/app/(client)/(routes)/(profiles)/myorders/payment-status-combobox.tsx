'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { paymentStatus } from '@/app/(client)/(routes)/(profiles)/myorders/common/data';
import UpdateOrderDetailStatusAlertDialog from '@/app/(client)/(routes)/(profiles)/myorders/update-order-detail-status-alert-dialog';
import { Button } from '@/components/ui/button';
import { Command, CommandGroup } from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { UPDATE_PAYMENT_STATUS_BY_ID } from '@/lib/api-constants';
import { cn } from '@/lib/utils';
import { API } from '@/services';

const PaymentStatusCombobox = ({
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

  const updatePaymentStatus = async (status: string) => {
    try {
      const res = await API.patch(
        UPDATE_PAYMENT_STATUS_BY_ID + `/${orderDetailId}`,
        {
          paymentStatus: status,
          carId: carId,
        },
      );
      if (res.status === 200) {
        setValue({
          key: res.data.paymentStatus,
          value: paymentStatus.find(
            (statusItem: any) => statusItem.key === res.data.paymentStatus,
          )?.value as string,
        });

        toast.success('Cập nhật trạng thái xe thành công');
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
            'justify-between rounded-full px-2 py-1 text-white',
            value.key === 'PENDING'
              ? 'bg-info/60'
              : value.key === 'DEPOSIT'
              ? 'bg-info/60'
              : value.key === 'PAID'
              ? 'bg-success'
              : value.key === 'RECEIVED'
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
              <UpdateOrderDetailStatusAlertDialog
                statusItem={statusItem}
                statusInit={value}
                key={statusItem.key}
                handleUpdateStatus={updatePaymentStatus}
              />
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default PaymentStatusCombobox;
