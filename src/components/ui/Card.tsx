'use client';

import { forwardRef } from 'react';
import { CardProps } from '@/types/ui';

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = '', hoverable = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          bg-white rounded-lg shadow-sm border border-gray-200
          ${hoverable ? 'hover:shadow-md transition duration-200 cursor-pointer' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
