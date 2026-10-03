import { Pen } from 'lucide-react';

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
  name: string;
  data: any;
}

const UpdateInfoDialog = ({ label, name, data }: UpdateInfoDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-transparent hover:bg-accent"
        >
          <Pen size={13} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cập nhật {name}</DialogTitle>
        </DialogHeader>

        <EditUserInfoForm label={label} name={name} data={data} />
      </DialogContent>
    </Dialog>
  );
};

export default UpdateInfoDialog;
