/**
 * Keira - Glass Card Component
 * Regis Architecture v2.9.0
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from './utils';

export const GlassCard = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'bg-[#0f0f0f]/65 backdrop-blur-xl rounded-xl',
        'border border-white/8 shadow-2xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
GlassCard.displayName = 'GlassCard';
