'use client';

import { Delete } from 'lucide-react';
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
import { DELETE_USER } from '@/lib/api-constants';
import { queryKeys } from '@/lib/query';
import { API } from '@/services';

export function DeleteDialog({ data }: { data: any }) {
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    const res = await API.destroy(DELETE_USER + `/${data.id}`);

    if (res.status === 200) {
      toast.success('Xóa người dùng thành công');
      //   load data
      queryClient.invalidateQueries({ queryKey: queryKeys.adminUsers });
    } else {
      toast.error('Xóa người dùng thất bại');
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="flex w-full items-center justify-between gap-2 rounded px-2 py-1 text-sm hover:bg-slate-100">
          Xóa
          <span className="">
            <Delete className="h-4 w-4 text-error" />
          </span>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa người dùng "{data?.name}" ?</AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Xóa</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
