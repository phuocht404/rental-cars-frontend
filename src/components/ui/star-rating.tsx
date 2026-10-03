import { Star } from 'lucide-react';

import { cn } from '@/lib/utils';

const StarRating = ({ rating, size = 16, className }: { rating: number; size?: number; className?: string }) => (
  <div className={cn('flex items-center gap-0.5', className)} role="img" aria-label={`${rating} trên 5 sao`}>
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={size}
        aria-hidden
        className={rating >= star ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted-foreground/40'}
      />
    ))}
  </div>
);

export default StarRating;
