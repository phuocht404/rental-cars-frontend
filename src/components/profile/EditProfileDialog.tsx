'use client';

import { Pen } from 'lucide-react';
import { toast } from 'sonner';

import EditProfileForm from '@/components/forms/EditProfileForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { API } from '@/services';

interface EditProfileDialogProps {
  name: string;
  dateOfBirth: Date;
  gender: string;
}

export function EditProfileDialog({
  name,
  dateOfBirth,
  gender,
}: EditProfileDialogProps) {
  const updateProfile = async () => {
    try {
      const payload = {
        name: name,
        dateOfBirth: dateOfBirth,
        gender: gender,
      };

      const res = await API.put('/users/me', payload);
    } catch (error: any) {
      toast.error(error.error, {
        description: error.message,
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full bg-transparent hover:bg-accent"
        >
          <Pen size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cập nhật thông tin</DialogTitle>
        </DialogHeader>

        <EditProfileForm
          name={name}
          dateOfBirth={dateOfBirth}
          gender={gender}
        />
      </DialogContent>
    </Dialog>
  );
}
