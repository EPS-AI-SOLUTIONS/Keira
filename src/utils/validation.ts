/**
 * Keira - Validation Utilities
 * Regis Architecture v2.9.0
 */

import { VIDEO_CONFIG } from '../constants';

// =============================================================================
// TYPES
// =============================================================================

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

// =============================================================================
// FILE VALIDATION
// =============================================================================

/**
 * Validate video file type
 */
export function validateVideoType(file: File): ValidationResult {
  const validTypes: readonly string[] = VIDEO_CONFIG.VALID_TYPES;
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Please upload a valid video file (${VIDEO_CONFIG.VALID_EXTENSIONS.join(', ')})`,
    };
  }
  return { valid: true };
}

/**
 * Validate video file size
 */
export function validateVideoSize(file: File): ValidationResult {
  if (file.size > VIDEO_CONFIG.MAX_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size must be less than ${VIDEO_CONFIG.MAX_SIZE_GB}GB`,
    };
  }
  return { valid: true };
}

/**
 * Validate video file (type + size)
 */
export function validateVideoFile(file: File): ValidationResult {
  const typeResult = validateVideoType(file);
  if (!typeResult.valid) return typeResult;

  const sizeResult = validateVideoSize(file);
  if (!sizeResult.valid) return sizeResult;

  return { valid: true };
}

// =============================================================================
// ROI VALIDATION
// =============================================================================

/**
 * Validate ROI dimensions
 */
export function validateROIDimensions(
  width: number,
  height: number,
  minSize = 10
): ValidationResult {
  if (width < minSize || height < minSize) {
    return {
      valid: false,
      error: `ROI must be at least ${minSize}x${minSize} pixels`,
    };
  }
  return { valid: true };
}

/**
 * Validate ROI bounds within frame
 */
export function validateROIBounds(
  x: number,
  y: number,
  width: number,
  height: number,
  frameWidth: number,
  frameHeight: number
): ValidationResult {
  if (x < 0 || y < 0 || x + width > frameWidth || y + height > frameHeight) {
    return {
      valid: false,
      error: 'ROI extends beyond frame boundaries',
    };
  }
  return { valid: true };
}
