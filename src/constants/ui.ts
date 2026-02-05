/**
 * Keira - UI Configuration Constants
 * Regis Architecture v2.9.0
 */

// =============================================================================
// BRUSH DEFAULTS
// =============================================================================

export const BRUSH_CONFIG = {
  /** Default brush width */
  DEFAULT_WIDTH: 64,

  /** Default brush height */
  DEFAULT_HEIGHT: 64,

  /** Minimum brush size */
  MIN_SIZE: 1,

  /** Maximum brush size */
  MAX_SIZE: 256,
} as const;

// =============================================================================
// ROI CONSTRAINTS
// =============================================================================

export const ROI_CONFIG = {
  /** Minimum ROI dimension */
  MIN_SIZE: 10,

  /** Handle size for ROI resize */
  HANDLE_SIZE: 8,

  /** Minimum initial selection size */
  MIN_SELECTION: 20,
} as const;

// =============================================================================
// ANIMATION
// =============================================================================

export const ANIMATION_CONFIG = {
  /** Standard transition duration (ms) */
  TRANSITION_DURATION: 200,

  /** Fast transition duration (ms) */
  TRANSITION_FAST: 150,

  /** Slow transition duration (ms) */
  TRANSITION_SLOW: 300,

  /** Spring stiffness for motion */
  SPRING_STIFFNESS: 300,

  /** Spring damping for motion */
  SPRING_DAMPING: 30,
} as const;

// =============================================================================
// COLORS
// =============================================================================

export const MASK_OVERLAY_COLOR = {
  r: 0,
  g: 255,
  b: 65,
  alpha: 100,
} as const;
