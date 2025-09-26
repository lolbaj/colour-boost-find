import React, { useState } from 'react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  totalStars?: number;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  totalStars = 5,
  size = 'md',
  readonly = false,
  className
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [internalRating, setInternalRating] = useState(rating);

  const handleClick = (starIndex: number) => {
    if (readonly || !onRatingChange) return;
    const newRating = starIndex + 1;
    setInternalRating(newRating);
    onRatingChange(newRating);
  };

  const handleMouseEnter = (starIndex: number) => {
    if (readonly) return;
    setHoverRating(starIndex + 1);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverRating(0);
  };

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const currentRating = hoverRating || rating || internalRating;

  return (
    <div className={cn('flex items-center', className)}>
      {Array.from({ length: totalStars }).map((_, index) => (
        <Button
          key={index}
          variant="ghost"
          size="sm"
          className={cn(
            'p-0 h-auto w-auto',
            readonly ? 'cursor-default' : 'cursor-pointer'
          )}
          onClick={() => handleClick(index)}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
          disabled={readonly}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={cn(
              sizeClasses[size],
              index < currentRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300',
              readonly ? 'hover:text-yellow-400' : ''
            )}
            viewBox="0 0 24 24"
            fill={index < currentRating ? 'currentColor' : 'none'}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
            />
          </svg>
        </Button>
      ))}
      <span className="ml-2 text-sm text-gray-500">
        {currentRating.toFixed(1)}/5.0
      </span>
    </div>
  );
};

export { StarRating };