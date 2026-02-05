/**
 * Keira - Progress Bar Component
 * Regis Architecture v2.9.0
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from './utils';

interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showLabel?: boolean;
}

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ className, value, max = 100, showLabel = false, ...props }, ref) => {
    const percent = Math.min(100, Math.max(0, (value / max) * 100));

    return (
      <div
        ref={ref}
        className={cn('relative bg-black/70 rounded-xl h-7 overflow-hidden', className)}
        {...props}
      >
        <div
          className={cn(
            'h-full rounded-xl transition-all duration-300',
            'bg-gradient-to-r from-[#505050] via-[#808080] to-[#505050]',
            'relative overflow-hidden'
          )}
          style={{ width: `${percent}%` }}
        >
          <div
            className={cn(
              'absolute inset-0',
              'bg-gradient-to-r from-transparent via-white/20 to-transparent',
              'animate-shimmer'
            )}
          />
        </div>
        {showLabel && (
          <span className="absolute inset-0 flex items-center justify-center text-xs font-mono text-white/80">
            {Math.round(percent)}%
          </span>
        )}
      </div>
    );
  }
);
ProgressBar.displayName = 'ProgressBar';
