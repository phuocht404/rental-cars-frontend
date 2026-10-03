import React from 'react';
import { Button } from './ui/button';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const BackButton = ({ className }: { className?: string }) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <Button
      variant="outline"
      className={cn(
        'inline-flex items-center justify-center rounded-full px-2.5 py-1',
        className,
      )}
      onClick={handleBack}
    >
      <ChevronLeft size={20} className="text-muted-foreground" />
    </Button>
  );
};

export default BackButton;
