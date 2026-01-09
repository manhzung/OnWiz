/**
 * Input component
 */

import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  endAdornment?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', endAdornment, ...props }, ref) => {
    const inputId = props.id || `input-${props.name || 'default'}`;
    const hasError = !!error;

    return (
      <div className={cn('flex flex-col gap-2 w-full', className)}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-900">
            {label}
            {props.required && <span className="text-error ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full px-4 py-4 text-base text-gray-900 bg-white border-[1.5px] rounded-lg transition-all duration-250 outline-none',
              'placeholder:text-gray-400',
              'hover:border-gray-400 disabled:hover:border-gray-300',
              'focus:border-primary focus:shadow-[0_0_0_3px_rgba(124,58,237,0.1)]',
              'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60',
              hasError && 'border-error focus:border-error focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]',
              endAdornment && 'pr-12', // Add padding right if there's an adornment
              className
            )}
            {...props}
          />
          {endAdornment && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center text-gray-500">
              {endAdornment}
            </div>
          )}
        </div>
        {error && <span className="text-sm text-error">{error}</span>}
        {helperText && !error && (
          <span className="text-sm text-gray-600">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

