/**
 * Keira - Async Action Hook
 * Regis Architecture v2.9.0
 *
 * Generic hook for managing async operation states (loading, error, data)
 */

import { useState, useCallback } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface UseAsyncActionReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  execute: (...args: unknown[]) => Promise<T | null>;
  reset: () => void;
  setError: (error: string | null) => void;
}

// =============================================================================
// HOOK
// =============================================================================

export function useAsyncAction<T>(
  asyncFn: (...args: unknown[]) => Promise<T>
): UseAsyncActionReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: unknown[]): Promise<T | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await asyncFn(...args);
        setData(result);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [asyncFn]
  );

  const reset = useCallback(() => {
    setData(null);
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    data,
    isLoading,
    error,
    execute,
    reset,
    setError,
  };
}
