'use client';

import { Check } from 'lucide-react';
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
import { CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';

interface UpdateStatusDialogProps {
  statusItem: {
    key: string;
    value: string;
  };
  statusInit: {
    key: string;
    value: string;
  };
  className?: string;
  handleUpdateStatus?: (status: string) => void;
}

const UpdateOrderDetailStatusAlertDialog = (props: UpdateStatusDialogProps) => {
  const { statusItem, statusInit, className, handleUpdateStatus } = props;
  const value = statusItem;


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
              if (handleUpdateStatus) {
                handleUpdateStatus(value.key);
              }
            }}
          >
            Cập nhật
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UpdateOrderDetailStatusAlertDialog;
