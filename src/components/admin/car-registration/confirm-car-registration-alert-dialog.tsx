'use client';

import React from 'react';

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
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '@/lib/query';
import { API } from '@/services';
import {
  UPDATE_CAR_STATUS,
} from '@/lib/api-constants';

interface ConfirmCarRegistrationAlertDialogProps {
  row: any;
  title: string;
  status: string;
  className?: string;
}

const ConfirmCarRegistrationAlertDialog = ({
  row,
  title,
  status,
  className,
}: ConfirmCarRegistrationAlertDialogProps) => {
  const queryClient = useQueryClient();

  const updateCarStatus = async () => {
    try {
      const id = row.original.id;

      const res = await API.patch(`${UPDATE_CAR_STATUS}/${id}`, {
        status,
      });

      if (res.status === 200) {
        toast.success('Cập nhật thành công');
        queryClient.invalidateQueries({ queryKey: queryKeys.adminCarRegistrations });
        queryClient.invalidateQueries({ queryKey: queryKeys.adminCars });
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className={cn('', className)}>{title}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {status === 'AVAILABLE'
              ? 'Xác nhận yêu cầu đăng ký'
              : 'Xác nhận từ chối yêu cầu đăng ký'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {status ? (
              <>
                Xe <strong>{row.original.name}</strong> sẽ được cấp phép cho
                thuê
              </>
            ) : (
              <>
                Yêu cầu đăng ký xe <strong>{row.original.name}</strong> sẽ bị từ
                chối
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Trở về</AlertDialogCancel>
          <AlertDialogAction onClick={updateCarStatus}>
            Xác nhận
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmCarRegistrationAlertDialog;
