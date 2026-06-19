'use client';

import { forwardRef } from 'react';
import { ButtonProps } from '@/types/ui';
import { ButtonVariant, ButtonSize } from '@/types/ui';

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = ButtonVariant.Primary,
      size = ButtonSize.Medium,
      isLoading = false,
      disabled = false,
      children,
      fullWidth = false,
      leftIcon,
      rightIcon,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'font-semibold rounded-lg transition duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variants = {
      [ButtonVariant.Primary]: 'bg-gray-900 hover:bg-gray-900 active:bg-gray-900 text-white focus:ring-gray-700 disabled:opacity-50 disabled:cursor-not-allowed',
      [ButtonVariant.Secondary]: 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-900 border border-gray-300 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed',
      [ButtonVariant.Ghost]: 'text-gray-800 hover:bg-gray-50 active:bg-gray-100 focus:ring-gray-700 disabled:opacity-50 disabled:cursor-not-allowed',
    };

    const sizes = {
      [ButtonSize.Small]: 'px-3 py-2 text-sm min-h-9',
      [ButtonSize.Medium]: 'px-6 py-3 text-base min-h-11',
      [ButtonSize.Large]: 'px-8 py-3 text-base min-h-12',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
            </svg>
            {children}
          </>
        ) : (
          <>
            {leftIcon && <span>{leftIcon}</span>}
            {children}
            {rightIcon && <span>{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
