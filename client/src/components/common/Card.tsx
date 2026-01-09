/**
 * Card component for dashboard
 */

import { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}

export const Card = ({ title, children, className = '', actions }: CardProps) => {
  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 relative',
        'hover:shadow-[0_8px_24px_rgba(124,58,237,0.15)] hover:-translate-y-1 hover:border-primary',
        'after:content-[""] after:absolute after:inset-0 after:bg-gradient-primary after:opacity-0 after:transition-opacity after:duration-300 after:pointer-events-none after:z-0',
        'hover:after:opacity-[0.02]',
        className
      )}
    >
      {(title || actions) && (
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-br from-primary/5 to-secondary/5">
          {title && <h3 className="text-lg font-semibold text-gray-900 m-0">{title}</h3>}
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
    </div>
  );
};

