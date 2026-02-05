/**
 * Keira - Skeleton Component
 * Regis Architecture v2.9.0
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from './utils';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, width, height, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'bg-[#808080]/20 rounded animate-pulse',
        className
      )}
      style={{ width, height, ...style }}
      {...props}
    />
  )
);
Skeleton.displayName = 'Skeleton';
