/**
 * Keira - Stats Card Component
 * Regis Architecture v2.9.0
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from './utils';

interface StatsCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
}

export const StatsCard = forwardRef<HTMLDivElement, StatsCardProps>(
  ({ className, label, value, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'bg-black/50 rounded-xl p-4 text-center',
        className
      )}
      {...props}
    >
      <div className="text-lg font-bold text-white">{value}</div>
      <div className="text-[10px] text-[#606060] uppercase tracking-wider mt-1">
        {label}
      </div>
    </div>
  )
);
StatsCard.displayName = 'StatsCard';
