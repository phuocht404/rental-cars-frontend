import React from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import OwnerRegistrationForm from '../forms/owner-registration-form';

const OwnerRegistrationDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-primary text-white">
          Đăng ký ngay
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary">
            Đăng ký xe cho thuê
          </DialogTitle>
          <DialogDescription>
            Bạn vui lòng điền đầy đủ thông tin, chúng tôi sẽ liên hệ vói bạn
            trong vòng một ngày làm việc.
          </DialogDescription>
          <DialogDescription className="text-red-500">
            *Lưu ý: Email và số điện thoại phải trùng với tài khoản của bạn
          </DialogDescription>
        </DialogHeader>
        <div className="">
          <OwnerRegistrationForm />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OwnerRegistrationDialog;
