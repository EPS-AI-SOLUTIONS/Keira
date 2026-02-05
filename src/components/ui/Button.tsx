/**
 * Keira - Button Components
 * Regis Architecture v2.9.0
 */

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from './utils';

// =============================================================================
// VARIANTS
// =============================================================================

export type ButtonVariant = 'default' | 'primary' | 'danger' | 'ghost';

const buttonVariants: Record<ButtonVariant, string> = {
  default:
    'bg-[#1e1e1e]/85 text-[#c0c0c0] hover:bg-[#2d2d2d]/90 hover:text-white',
  primary:
    'bg-[#3c3c3c]/85 text-white font-bold hover:bg-[#505050]/90',
  danger:
    'bg-[#280a0a]/80 text-[#cc6666] hover:bg-[#320f0f]/85 hover:text-[#dd8888]',
  ghost:
    'bg-transparent text-[#808080] hover:bg-white/5 hover:text-white',
};

// =============================================================================
// BUTTON
// =============================================================================

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2',
        'px-5 py-3 rounded-xl',
        'text-xs font-semibold uppercase tracking-widest',
        'border-none cursor-pointer',
        'transition-all duration-200',
        buttonVariants[variant],
        disabled && 'bg-black/50 text-[#505050] cursor-not-allowed',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);
Button.displayName = 'Button';

// =============================================================================
// ICON BUTTON
// =============================================================================

export const IconButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center',
        'p-2 rounded-lg',
        'border-none cursor-pointer',
        'transition-all duration-200',
        buttonVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);
IconButton.displayName = 'IconButton';
