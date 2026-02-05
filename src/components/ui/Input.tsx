/**
 * Keira - Input Component
 * Regis Architecture v2.9.0
 */

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from './utils';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'w-full px-4 py-3',
        'bg-black/60 backdrop-blur-md',
        'border border-white/10 rounded-xl',
        'text-[#d0d0d0] placeholder:text-[#606060]',
        'transition-all duration-200',
        'focus:bg-[#0f0f0f]/75 focus:border-[#808080]/30 focus:outline-none',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';
