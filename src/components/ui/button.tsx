import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({ className, children, variant = 'primary', size = 'md', isLoading = false, disabled, ...props }: ButtonProps) {
  const baseStyles =
    'font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none hover:cursor-pointer';

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/80 active:bg-primary/90',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 bg-gray-700 text-gray-100 hover:bg-gray-600',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-100 border-medium hover:bg-gray-800 hover:text-gray-100 text-gray-100',
    ghost: 'bg-transparent hover:bg-gray-100 hover:bg-gray-800 hover:text-gray-100 text-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs rounded-md',
    md: 'h-10 px-4 py-2 text-sm rounded-md',
    lg: 'h-12 px-6 py-3 text-base rounded-lg',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], isLoading && 'cursor-not-allowed opacity-70', className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg className="mr-2 -ml-1 h-4 w-4 animate-spin text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}
