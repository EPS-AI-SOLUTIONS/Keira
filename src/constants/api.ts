/**
 * Keira - API Configuration Constants
 * Regis Architecture v2.9.0
 */

// =============================================================================
// ENDPOINTS
// =============================================================================

export const API_CONFIG = {
  /** Base URL for API */
  BASE_URL: '/api',

  /** Video upload endpoint */
  UPLOAD: '/upload',

  /** Frame extraction endpoint */
  FRAME: '/frame',

  /** Start processing endpoint */
  START: '/start',

  /** Job status endpoint */
  STATUS: '/status',

  /** Download result endpoint */
  DOWNLOAD: '/download',
} as const;

// =============================================================================
// TIMEOUTS
// =============================================================================

export const API_TIMEOUTS = {
  /** Default request timeout (ms) */
  DEFAULT: 30_000,

  /** Upload timeout (ms) */
  UPLOAD: 300_000,

  /** Processing timeout (ms) */
  PROCESSING: 600_000,
} as const;

// =============================================================================
// ERROR CODES
// =============================================================================

export const API_ERRORS = {
  NETWORK: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  SERVER: 'SERVER_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
} as const;
