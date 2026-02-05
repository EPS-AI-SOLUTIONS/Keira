/**
 * Keira - API Services Barrel Export
 * Regis Architecture v2.9.0
 */

import { apiFetch } from './http';
import { videoApi } from './video';
import { processingApi } from './processing';

// =============================================================================
// COMBINED API CLIENT
// =============================================================================

/**
 * Combined API client (backwards compatible)
 */
export const api = {
  // Health
  health: () => apiFetch<{ status: string }>('/health'),

  // Video (delegated)
  uploadVideo: videoApi.upload,
  getFrame: videoApi.getFrame,
  deleteVideo: videoApi.delete,

  // Processing (delegated)
  startProcessing: processingApi.start,
  getProcessingStatus: processingApi.getStatus,
  cancelProcessing: processingApi.cancel,
  getOutputUrl: processingApi.getOutputUrl,
};

// =============================================================================
// INDIVIDUAL EXPORTS
// =============================================================================

export { ApiError, apiFetch, apiFetchBlob } from './http';
export { videoApi } from './video';
export { processingApi } from './processing';
