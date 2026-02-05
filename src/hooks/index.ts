/**
 * Keira - Hooks Barrel Export
 * Regis Architecture v2.9.0 - Modular Structure
 */

// Keyboard Shortcuts
export { useHotkey, isHotkeyPressed } from './useHotkey';
export { useKeyboardShortcuts } from './useKeyboardShortcuts';

// Canvas & Mask
export {
  useMaskCanvas,
  type UseMaskCanvasOptions,
  type UseMaskCanvasReturn,
} from './useMaskCanvas';

export {
  useMaskBrush,
  type UseMaskBrushOptions,
  type UseMaskBrushReturn,
  type BrushSize,
  type PaintMode,
} from './useMaskBrush';

// Processing
export {
  useProcessingJob,
  getStageLabel,
  STAGE_LABELS,
  type UseProcessingJobOptions,
  type UseProcessingJobReturn,
} from './useProcessingJob';

// Utilities
export {
  useAsyncAction,
  type UseAsyncActionReturn,
} from './useAsyncAction';

export {
  useDebounce,
  useDebouncedCallback,
} from './useDebounce';
