/**
 * Keira - Components Barrel Export
 * Regis Architecture v2.9.0 - Modular Structure
 */

// Feature components
export { VideoUpload } from './VideoUpload';
export { ROISelector } from './ROISelector';
export { MaskEditor } from './MaskEditor';
export { ProcessingView } from './ProcessingView';

// UI components
export * from './ui';

// Error Handling
export { ErrorBoundary, withErrorBoundary } from './ErrorBoundary';

// Utility Components
export { SuspenseFallback } from './SuspenseFallback';

// Lazy Components (Code Splitting)
export {
  VideoUploadLazy,
  ROISelectorLazy,
  MaskEditorLazy,
  ProcessingViewLazy,
  LazyComponentWrapper,
  WithSuspense,
} from './LazyComponents';
