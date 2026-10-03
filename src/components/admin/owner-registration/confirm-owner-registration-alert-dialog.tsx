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
import { UPDATE_REQUEST_OWNER_REGISTRATION } from '@/lib/api-constants';

interface ConfirmOwnerRegistrationAlertDialogProps {
  row: any;
  title: string;
  isConfirm: boolean;
  className?: string;
}

const ConfirmOwnerRegistrationAlertDialog = ({
  row,
  title,
  isConfirm,
  className,
}: ConfirmOwnerRegistrationAlertDialogProps) => {
  const queryClient = useQueryClient();

  const updateRole = async () => {
    try {
      const id = row.original.id;

      const res = await API.patch(
        `${UPDATE_REQUEST_OWNER_REGISTRATION}/${id}`,
        {
          isConfirm,
        },
      );

      if (res.status === 200) {
        toast.success('Cập nhật thành công');
        queryClient.invalidateQueries({ queryKey: queryKeys.adminOwnerRegistrations });
        queryClient.invalidateQueries({ queryKey: queryKeys.adminUsers });
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
            {isConfirm
              ? 'Xác nhận cấp vai trò chủ xe'
              : 'Xác nhận từ chối yêu cầu đăng ký'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isConfirm ? (
              <>
                Người dùng <strong>{row.original.name}</strong> sẽ được cập nhật
                vai trò thành chủ xe
              </>
            ) : (
              <>
                Yêu cầu đăng ký của người dùng{' '}
                <strong>{row.original.name}</strong> sẽ bị từ chối
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Trở về</AlertDialogCancel>
          <AlertDialogAction onClick={updateRole}>Xác nhận</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmOwnerRegistrationAlertDialog;
