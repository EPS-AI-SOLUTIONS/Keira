/**
 * LazyComponents - Code Splitting with React.lazy
 * @module components/LazyComponents
 *
 * Lazy-loaded components for better performance.
 * Ported from ClaudeHydra/GeminiHydra cross-pollination.
 */

import React, { lazy, Suspense, type ComponentType } from 'react';
import { SuspenseFallback } from './SuspenseFallback';

// ============================================
// LAZY COMPONENT DEFINITIONS
// ============================================

export const VideoUploadLazy = lazy(() =>
  import('./VideoUpload').then((m) => ({ default: m.VideoUpload }))
);
export const ROISelectorLazy = lazy(() =>
  import('./ROISelector').then((m) => ({ default: m.ROISelector }))
);
export const MaskEditorLazy = lazy(() =>
  import('./MaskEditor').then((m) => ({ default: m.MaskEditor }))
);
export const ProcessingViewLazy = lazy(() =>
  import('./ProcessingView').then((m) => ({ default: m.ProcessingView }))
);

// ============================================
// SUSPENSE WRAPPER UTILITY
// ============================================

interface LazyComponentWrapperProps {
  children: React.ReactNode;
  fallbackMessage?: string;
}

/**
 * Wrapper component for lazy-loaded components with Suspense
 */
export const LazyComponentWrapper = ({
  children,
  fallbackMessage = 'Loading...',
}: LazyComponentWrapperProps): React.ReactElement => {
  return (
    <Suspense fallback={<SuspenseFallback message={fallbackMessage} />}>
      {children}
    </Suspense>
  );
};

// ============================================
// HOC FOR LAZY LOADING
// ============================================

/**
 * Higher-order component that wraps a component with Suspense
 */
export function WithSuspense<P extends object>(
  Component: ComponentType<P>,
  fallbackMessage?: string
): React.FC<P> {
  const WrappedComponent: React.FC<P> = (props) => (
    <Suspense fallback={<SuspenseFallback message={fallbackMessage} />}>
      <Component {...props} />
    </Suspense>
  );

  WrappedComponent.displayName = `WithSuspense(${Component.displayName || Component.name || 'Component'})`;

  return WrappedComponent;
}

export default {
  VideoUploadLazy,
  ROISelectorLazy,
  MaskEditorLazy,
  ProcessingViewLazy,
  LazyComponentWrapper,
  WithSuspense,
};
