/**
 * SuspenseFallback Component
 * @module components/SuspenseFallback
 *
 * Loading fallback for React Suspense boundaries.
 * Ported from ClaudeHydra/GeminiHydra cross-pollination.
 */

import { memo } from 'react';
import { Loader2 } from 'lucide-react';

interface SuspenseFallbackProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SuspenseFallback = memo<SuspenseFallbackProps>(
  ({ message = 'Loading...', size = 'md' }) => {
    const sizeClasses = {
      sm: 'h-8 w-8',
      md: 'h-12 w-12',
      lg: 'h-16 w-16',
    };

    return (
      <div className="flex flex-col items-center justify-center h-full w-full gap-3 text-gray-500">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-green-500`} />
        <span className="text-sm font-mono">{message}</span>
      </div>
    );
  }
);

SuspenseFallback.displayName = 'SuspenseFallback';

export default SuspenseFallback;
