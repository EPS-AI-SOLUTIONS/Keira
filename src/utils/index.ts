/**
 * Keira - Utilities Barrel Export
 * Regis Architecture v2.9.0
 */

// Canvas utilities
export {
  extractROIFromImage,
  initializeCanvas,
  fillCanvas,
  applyBrushToMask,
  renderMaskOverlay,
  exportMaskToDataUrl,
  getCanvasMousePosition,
  clampToCanvas,
  DEFAULT_MASK_OVERLAY,
  type BrushSize,
  type MaskOverlayConfig,
} from './canvas';

// Validation utilities
export {
  validateVideoType,
  validateVideoSize,
  validateVideoFile,
  validateROIDimensions,
  validateROIBounds,
  type ValidationResult,
} from './validation';
