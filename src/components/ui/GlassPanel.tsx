/**
 * Keira - Glass Panel Component
 * Regis Architecture v2.9.0
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from './utils';

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className, hoverable = true, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'bg-black/75 backdrop-blur-lg rounded-2xl border-none',
        hoverable && 'transition-colors hover:bg-[#0c0c0c]/82',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
GlassPanel.displayName = 'GlassPanel';
