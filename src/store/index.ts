/**
 * Keira - Store Barrel Export
 * Regis Architecture v2.9.0 - Modular Structure
 */

// Main store
export {
  useAppStore,
  useVideo,
  useROI,
  useCurrentJob,
  useSettings,
  useCurrentView,
  useJobHistory,
} from './useAppStore';

// Individual slices (for modular extension and testing)
export {
  createVideoSlice,
  createROISlice,
  createMaskSlice,
  createProcessingSlice,
  createSettingsSlice,
  createUISlice,
  defaultSettings,
  type VideoSlice,
  type ROISlice,
  type MaskSlice,
  type ProcessingSlice,
  type SettingsSlice,
  type UISlice,
} from './slices';
