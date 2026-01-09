/**
 * Button component
 */

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: ReactNode;
}

const variantClasses = {
  primary: 'bg-gradient-primary text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:hover:translate-y-0 disabled:hover:shadow-md',
  secondary: 'bg-gray-700 text-white hover:bg-gray-800',
  outline: 'bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white',
  ghost: 'bg-transparent text-primary hover:bg-gray-100',
};

const sizeClasses = {
  sm: 'px-4 py-2 text-sm min-h-[36px]',
  md: 'px-6 py-4 text-base min-h-[44px]',
  lg: 'px-8 py-6 text-lg min-h-[52px]',
};

export const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        'border-none rounded-lg font-medium cursor-pointer transition-all duration-250 inline-flex items-center justify-center gap-2 relative overflow-hidden',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        'disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
