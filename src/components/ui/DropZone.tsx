/**
 * Keira - Drop Zone Component
 * Regis Architecture v2.9.0
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from './utils';

interface DropZoneProps extends HTMLAttributes<HTMLDivElement> {
  isDragging?: boolean;
  disabled?: boolean;
}

export const DropZone = forwardRef<HTMLDivElement, DropZoneProps>(
  ({ className, isDragging, disabled, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'border-2 border-dashed border-[#808080]/30 rounded-2xl',
        'p-12 text-center cursor-pointer',
        'transition-all duration-300',
        isDragging && 'border-[#808080]/60 bg-[#808080]/5',
        !isDragging && 'hover:border-[#808080]/50 hover:bg-[#808080]/3',
        disabled && 'pointer-events-none opacity-50',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
DropZone.displayName = 'DropZone';
