/**
 * Keira - Slider Component
 * Regis Architecture v2.9.0
 */

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from './utils';

interface SliderProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ className, label, ...props }, ref) => (
    <div className={cn('flex items-center gap-4', className)}>
      {label && (
        <label className="text-gray-400 text-sm min-w-fit">{label}</label>
      )}
      <input
        ref={ref}
        type="range"
        className={cn(
          'flex-1 h-2 rounded-full appearance-none cursor-pointer',
          'bg-black/70',
          '[&::-webkit-slider-thumb]:appearance-none',
          '[&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4',
          '[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full',
          '[&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform',
          '[&::-webkit-slider-thumb]:hover:scale-110'
        )}
        {...props}
      />
    </div>
  )
);
Slider.displayName = 'Slider';
