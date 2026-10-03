'use client';

import { Check } from 'lucide-react';
import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { CommandItem } from '@/components/ui/command';
import { UPDATE_CAR_STATUS } from '@/lib/api-constants';
import { cn } from '@/lib/utils';
import { queryKeys } from '@/lib/query';
import { API } from '@/services';

interface UpdateStatusDialogProps {
  statusItem: {
    key: string;
    value: string;
  };
  carId: number;
  statusInit: {
    key: string;
    value: string;
  };
  className?: string;
}

const UpdateStatusAlertDialog = (props: UpdateStatusDialogProps) => {
  const { statusItem, carId, statusInit, className } = props;
  const [value, setValue] = useState<typeof statusItem>(statusItem);
  const queryClient = useQueryClient();

  const updateCarStatus = async (status: string) => {
    try {
      const res = await API.patch(UPDATE_CAR_STATUS + `/${carId}`, { status });
      if (res.status === 200) {
        toast.success('Cập nhật trạng thái xe thành công');
        queryClient.invalidateQueries({ queryKey: queryKeys.adminCars });
        queryClient.invalidateQueries({ queryKey: queryKeys.adminCarRegistrations });
        setValue(res.data.status);
        window.location.reload();
      }
    } catch (error: any) {
      toast.error(error.error, {
        description: error.message,
      });
    }
  };


  return (
    <AlertDialog>
      <AlertDialogTrigger className={cn('w-full', className)}>
        <CommandItem
          key={statusItem.value}
          value={statusItem.value}
          className="w-full cursor-pointer bg-transparent"
        >
          <Check
            className={cn(
              'mr-2 h-4 w-4',
              value.key === statusInit.key
                ? 'bg-primary/10 opacity-100'
                : 'opacity-0',
            )}
          />
          {statusItem.value}
        </CommandItem>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Bạn có chắc muốn cập nhật trạng thái xe?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Trạng thái xe sẽ thay đổi từ{' '}
            <span className="font-bold">{statusInit.value}</span> sang{' '}
            <span className="font-bold">{statusItem.value}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex w-full flex-row items-center justify-between">
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              updateCarStatus(value.key);
            }}
          >
            Cập nhật
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UpdateStatusAlertDialog;
