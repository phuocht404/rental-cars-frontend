'use client';

import { Pen } from 'lucide-react';
import { useState } from 'react';

import EditUserInfoForm from '@/components/forms/EditUserInfoForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface UpdateInfoDialogProps {
  label: string;
  name: 'phone' | 'email';
  data?: string | null;
}

const UpdateInfoDialog = ({ label, name, data }: UpdateInfoDialogProps) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Cập nhật ${label}`}
          className="h-8 w-8 rounded-full bg-transparent hover:bg-accent"
        >
          <Pen size={13} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cập nhật {label}</DialogTitle>
        </DialogHeader>

        <EditUserInfoForm
          label={label}
          name={name}
          data={data}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UpdateInfoDialog;
