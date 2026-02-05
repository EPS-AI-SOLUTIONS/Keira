/**
 * Keira - Video Configuration Constants
 * Regis Architecture v2.9.0
 */

// =============================================================================
// FILE CONSTRAINTS
// =============================================================================

export const VIDEO_CONFIG = {
  /** Maximum file size in bytes (2GB) */
  MAX_SIZE_BYTES: 2 * 1024 * 1024 * 1024,

  /** Maximum file size in GB for display */
  MAX_SIZE_GB: 2,

  /** Valid MIME types */
  VALID_TYPES: [
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-msvideo',
  ] as const,

  /** Valid file extensions for display */
  VALID_EXTENSIONS: ['MP4', 'WebM', 'MOV', 'AVI'] as const,

  /** Accept string for file input */
  ACCEPT: 'video/*',
} as const;

// =============================================================================
// PROCESSING
// =============================================================================

export const PROCESSING_CONFIG = {
  /** Upload progress simulation interval (ms) */
  UPLOAD_PROGRESS_INTERVAL: 200,

  /** Upload progress increment */
  UPLOAD_PROGRESS_STEP: 10,

  /** Max simulated progress before completion */
  UPLOAD_PROGRESS_MAX: 90,

  /** Polling interval for job status (ms) */
  JOB_POLL_INTERVAL: 1000,
} as const;
