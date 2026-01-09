/**
 * Points Display component for gamification
 */

import { useState, useEffect } from 'react';
import { cn } from '../../utils/cn';

interface PointsDisplayProps {
  points: number;
  label?: string;
  animated?: boolean;
  className?: string;
}

export const PointsDisplay = ({
  points,
  label = 'Điểm',
  animated = true,
  className = '',
}: PointsDisplayProps) => {
  const [displayPoints, setDisplayPoints] = useState(0);

  useEffect(() => {
    if (animated) {
      const duration = 1000;
      const steps = 30;
      const increment = points / steps;
      const stepDuration = duration / steps;

      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= points) {
          setDisplayPoints(points);
          clearInterval(timer);
        } else {
          setDisplayPoints(Math.floor(current));
        }
      }, stepDuration);

      return () => clearInterval(timer);
    } else {
      setDisplayPoints(points);
    }
  }, [points, animated]);

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20 rounded-xl backdrop-blur-sm',
        className
      )}
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent leading-none">
          {displayPoints.toLocaleString()}
        </span>
        <span className="text-xs text-gray-600 uppercase tracking-wider">{label}</span>
      </div>
    </div>
  );
};

