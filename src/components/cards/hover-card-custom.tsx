import { HelpCircle } from 'lucide-react';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { cn } from '@/lib/utils';

const HoverCardCustom = ({
  content,
  className,
}: {
  content: string;
  className?: string;
}) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <HelpCircle className={cn('h-4 w-4 text-muted-foreground', className)} />
      </HoverCardTrigger>
      <HoverCardContent className="">
        <div className="text-center text-xs text-muted-foreground">{content}</div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default HoverCardCustom;
