'use client';

import { Pen } from 'lucide-react';
import React, { useState } from 'react';

import EditProfileForm from '@/components/forms/EditProfileForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface EditProfileDialogProps {
  name?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
}

export function EditProfileDialog({ name, dateOfBirth, gender }: EditProfileDialogProps) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Sửa thông tin"
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
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
