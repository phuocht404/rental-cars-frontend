'use client';

import { Camera, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { UPLOAD_AVATAR } from '@/lib/api-constants';
import { setSession, useCurrentUser } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { API } from '@/services';

const AvatarDialog = ({
  src,
  className,
}: {
  src?: string | null;
  className: string;
}) => {
  const router = useRouter();
  const { user } = useCurrentUser();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Ảnh mới chọn (chưa lưu); không có thì hiển thị ảnh hiện tại từ props
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const avatarUrl = previewUrl ?? src ?? '';
  const [fileImage, setFileImage] = useState<any>(null);


  function handleFileChange(e: any) {
    const file = e.target.files[0];

    setFileImage(file);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
  }

  function handleCancer() {
    setPreviewUrl(null);
    setIsLoading(false);
  }

  async function handleUploadAvatar() {
    setIsLoading(true);
    setIsOpen(true);
    try {
      const formData = new FormData();
      formData.append('file', fileImage);

      const avatar = await API.patch(
        UPLOAD_AVATAR,
        {
          file: formData.get('file'),
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (avatar.status === 200) {
        toast.success('Cập nhật ảnh đại diện thành công');
        if (user) setSession({ ...user, avatarUrl: avatar.data?.avatarUrl });
        setIsOpen(false);
        // Làm mới dữ liệu server component thay vì tải lại toàn trang
        setPreviewUrl(null);
        router.refresh();
      } else {
        toast.error('Cập nhật ảnh đại diện thất bại');
        setFileImage(null);
      }
    } catch (error: any) {
      toast.error('Cập nhật ảnh đại diện thất bại', { description: error?.message });
      setFileImage(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <div className={cn('flex items-center justify-center', className)}>
          <Camera className="h-8 w-8 text-gray-300" />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cập nhật ảnh đại diện</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription className="flex items-center justify-center border">
          {avatarUrl && (
            <Image src={avatarUrl} alt="avatar" width={146} height={146} />
          )}
        </AlertDialogDescription>
        <AlertDialogFooter>
          <div className="my-4 flex w-full items-center justify-between gap-3">
            <AlertDialogCancel onClick={handleCancer}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUploadAvatar}
              disabled={isLoading}
              asChild
              className="cursor-pointer"
            >
              {isLoading ? (
                <span>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang cập nhật...
                </span>
              ) : (
                <span>Cập nhật Avatar</span>
              )}
            </AlertDialogAction>
          </div>
          <div className="w-full text-center">
            <label
              htmlFor="files"
              className="block cursor-pointer rounded-lg border border-border px-3 py-2"
            >
              Chọn ảnh
            </label>
            <Input
              id="files"
              type="file"
              onChange={handleFileChange}
              name="avatarUrl"
              className="hidden"
              placeholder="Chọn ảnh"
            />
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AvatarDialog;
