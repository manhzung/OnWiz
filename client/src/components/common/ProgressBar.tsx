/**
 * Progress Bar component for gamification
 */

import { cn } from '../../utils/cn';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  label?: string;
  showLabel?: boolean;
  variant?: 'purple' | 'blue' | 'green' | 'gold';
  animated?: boolean;
  className?: string;
}

const variantGradients = {
  purple: 'bg-gradient-primary shadow-[0_0_10px_rgba(124,58,237,0.5)]',
  blue: 'bg-gradient-to-r from-blue-500 to-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]',
  green: 'bg-gradient-to-r from-green-500 to-green-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]',
  gold: 'bg-gradient-to-r from-yellow-400 to-yellow-300 shadow-[0_0_10px_rgba(255,215,0,0.5)]',
};

export const ProgressBar = ({
  value,
  max = 100,
  label,
  showLabel = true,
  variant = 'purple',
  animated = true,
  className = '',
}: ProgressBarProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn('w-full', className)}>
      {label && showLabel && (
        <div className="flex justify-between items-center mb-2 text-sm font-medium text-gray-600">
          <span>{label}</span>
          <span className="text-primary font-semibold">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
        <div
          className={cn(
            'h-full rounded-full relative transition-all duration-600 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden',
            variantGradients[variant],
            animated && 'animate-[progressPulse_2s_ease-in-out_infinite]'
          )}
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[progressShine_2s_infinite]" />
        </div>
      </div>
      <style>{`
        @keyframes progressShine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes progressPulse {
          0%, 100% { box-shadow: 0 0 10px rgba(124, 58, 237, 0.5); }
          50% { box-shadow: 0 0 20px rgba(124, 58, 237, 0.8); }
        }
      `}</style>
    </div>
  );
};

