import { Star } from 'lucide-react';

const StarRating = ({ rating }: any) => {
  return (
    <div className="flex items-center justify-center gap-1">
      <span>
        <Star
          size={16}
          className={rating >= 1 ? 'text-yellow-300' : 'text-muted-foreground'}
        />
      </span>
      <span>
        <Star
          size={16}
          className={rating >= 2 ? 'text-yellow-300' : 'text-muted-foreground'}
        />
      </span>
      <span>
        <Star
          size={16}
          className={rating >= 3 ? 'text-yellow-300' : 'text-muted-foreground'}
        />
      </span>
      <span>
        <Star
          size={16}
          className={rating >= 4 ? 'text-yellow-300' : 'text-muted-foreground'}
        />
      </span>
      <span>
        <Star
          size={16}
          className={rating >= 5 ? 'text-yellow-300' : 'text-muted-foreground'}
        />
      </span>
    </div>
  );
};

export default StarRating;
