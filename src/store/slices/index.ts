/**
 * Keira - Store Slices Barrel Export
 * Regis Architecture v2.9.0
 */

export {
  createVideoSlice,
  videoInitialState,
  type VideoSlice,
} from './videoSlice';

export {
  createROISlice,
  roiInitialState,
  type ROISlice,
} from './roiSlice';

export {
  createMaskSlice,
  maskInitialState,
  type MaskSlice,
} from './maskSlice';

export {
  createProcessingSlice,
  processingInitialState,
  type ProcessingSlice,
} from './processingSlice';

export {
  createSettingsSlice,
  settingsInitialState,
  defaultSettings,
  type SettingsSlice,
} from './settingsSlice';

export {
  createUISlice,
  uiInitialState,
  type UISlice,
} from './uiSlice';
