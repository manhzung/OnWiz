/**
 * Badge component for gamification
 */

import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
  children: ReactNode;
  variant?: 'gold' | 'silver' | 'bronze' | 'purple' | 'blue' | 'green';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

const variantClasses = {
  gold: 'bg-gradient-to-br from-yellow-400 to-yellow-300 text-[#8b6914] border-2 border-yellow-400',
  silver: 'bg-gradient-to-br from-gray-300 to-gray-200 text-[#4a4a4a] border-2 border-gray-300',
  bronze: 'bg-gradient-to-br from-[#cd7f32] to-[#e6a857] text-[#5a3a1a] border-2 border-[#cd7f32]',
  purple: 'bg-gradient-to-br from-primary to-primary-light text-white border-2 border-primary',
  blue: 'bg-gradient-to-br from-blue-500 to-blue-400 text-white border-2 border-blue-500',
  green: 'bg-gradient-to-br from-green-500 to-green-400 text-white border-2 border-green-500',
};

const sizeClasses = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-4 text-base',
};

export const Badge = ({
  children,
  variant = 'purple',
  size = 'md',
  animated = false,
  className = '',
}: BadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-semibold rounded-full uppercase tracking-wider shadow-md relative overflow-hidden',
        variantClasses[variant],
        sizeClasses[size],
        animated && 'animate-[pulse_2s_ease-in-out_infinite]',
        'before:content-[""] before:absolute before:-top-1/2 before:-left-1/2 before:w-[200%] before:h-[200%] before:bg-gradient-to-br before:from-transparent before:via-white/30 before:to-transparent before:rotate-45 before:animate-[shine_3s_infinite]',
        className
      )}
    >
      {children}
      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
      `}</style>
    </span>
  );
};

