import React, { useState } from 'react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  readonly = false,
  size = 'md',
  showValue = false,
  className = ''
}) => {
  const [hoverRating, setHoverRating] = useState<number>(0);
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const handleClick = (value: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (!readonly) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= displayRating;
          const isHalf = star - 0.5 === displayRating;
          
          return (
            <button
              key={star}
              type="button"
              disabled={readonly}
              onClick={() => handleClick(star)}
              onMouseEnter={() => handleMouseEnter(star)}
              onMouseLeave={handleMouseLeave}
              className={`
                ${sizeClasses[size]} 
                ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} 
                transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded
                ${readonly ? '' : 'hover:brightness-110'}
              `}
            >
              {isHalf ? (
                <svg className={sizeClasses[size]} viewBox="0 0 24 24" fill="none">
                  <defs>
                    <linearGradient id={`half-star-${star}`}>
                      <stop offset="50%" stopColor="#fbbf24" />
                      <stop offset="50%" stopColor="#e5e7eb" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                    fill={`url(#half-star-${star})`}
                    stroke="#fbbf24"
                    strokeWidth="1"
                  />
                </svg>
              ) : (
                <svg 
                  className={sizeClasses[size]} 
                  fill={isFilled ? '#fbbf24' : '#e5e7eb'} 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
      
      {showValue && (
        <span className={`ml-2 text-gray-600 font-medium ${textSizeClasses[size]}`}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

// Компонент для відображення тільки рейтингу (без можливості редагування)
export const StarDisplay: React.FC<{
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}> = ({ rating, size = 'md', showValue = true, className = '' }) => {
  return (
    <StarRating
      rating={rating}
      readonly={true}
      size={size}
      showValue={showValue}
      className={className}
    />
  );
};