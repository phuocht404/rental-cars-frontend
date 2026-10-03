'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UPDATE_ORDER_DETAIL_STATUS_BY_ID } from '@/lib/api-constants';
import { cn } from '@/lib/utils';
import { queryKeys } from '@/lib/query';
import { API } from '@/services';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UpdateOrderDetailDialogProps {
  title: string;
  orderDetailId: number;
  orderDetailStatus: string;
  carId: number;
  className?: string;
  totalAmount?: number;
}

const UpdateOrderDetailDialog = ({
  title,
  orderDetailId,
  orderDetailStatus,
  carId,
  className,
  totalAmount,
}: UpdateOrderDetailDialogProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [note, setNote] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const submit = async () => {
    setIsLoading(true);
    try {
      let body: any = {
        orderDetailStatus,
        carId,
      };

      if (orderDetailStatus === 'CANCELED' && note) {
        body = {
          ...body,
          note,
          paymentStatus: 'REFUND',
        };
      }

      if (orderDetailStatus === 'CONFIRMED' && totalAmount) {
        const serviceFee = totalAmount * 0.5;

        body = {
          ...body,
          paymentStatus: 'PAID',
          serviceFee,
        };
      }

      if (orderDetailStatus === 'RECEIVED') {
        body = {
          ...body,
          carStatus: 'RENTING',
        };
      }

      if (orderDetailStatus === 'COMPLETED') {
        body = {
          ...body,
          carStatus: 'AVAILABLE',
        };
      }

      const res = await API.patch(
        UPDATE_ORDER_DETAIL_STATUS_BY_ID + `/${orderDetailId}`,
        body,
      );

      if (res.status === 200) {
        queryClient.invalidateQueries({ queryKey: queryKeys.myOrderDetails });
        queryClient.invalidateQueries({ queryKey: queryKeys.adminAnalytics });
        queryClient.invalidateQueries({ queryKey: ["order-detail"] });
        toast.success('Cập nhật trạng thái đơn hàng thành công');
        setOpen(false);
      }

      setIsLoading(false);
    } catch (error: any) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={cn('min-w-[92px] bg-info', className)}>
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[425px]">
        <DialogHeader className="mb-4">
          <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
          <DialogDescription>
            <p className="inline font-bold">{title}</p> đơn hàng này?
          </DialogDescription>
        </DialogHeader>
        {orderDetailStatus === 'CANCELED' && (
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="note" className="text-right">
                Chú thích
              </Label>
              <Input
                id="note"
                className="col-span-3"
                required={true}
                onChange={(event) => setNote(event.target.value)}
              />
            </div>
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button type="submit" onClick={submit} isLoading={isLoading}>
            Cập nhật
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateOrderDetailDialog;
