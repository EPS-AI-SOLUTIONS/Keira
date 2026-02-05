/**
 * Keira - Section Label Component
 * Regis Architecture v2.9.0
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from './utils';

export const SectionLabel = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'text-[#808080] text-xs font-bold',
        'uppercase tracking-widest py-1.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
SectionLabel.displayName = 'SectionLabel';
