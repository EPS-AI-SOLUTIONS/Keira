/**
 * Keira - Time Display Component
 * Regis Architecture v2.9.0
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from './utils';

export const TimeDisplay = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center',
        'px-3.5 py-2 min-w-[90px]',
        'bg-black/70 rounded-xl',
        'text-white text-sm font-bold font-mono',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
TimeDisplay.displayName = 'TimeDisplay';
