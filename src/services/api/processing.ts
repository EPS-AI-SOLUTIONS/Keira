/**
 * Keira - Processing API Service
 * Regis Architecture v2.9.0
 */

import type { ROI, ExportSettings, ProcessingStatusResponse } from '../../types';
import { API_CONFIG } from '../../constants';
import { apiFetch } from './http';

// =============================================================================
// PROCESSING API
// =============================================================================

export const processingApi = {
  /**
   * Start video processing
   */
  start: async (
    videoId: string,
    roi: ROI,
    maskDataUrl: string,
    settings: ExportSettings
  ): Promise<{ jobId: string }> => {
    return apiFetch<{ jobId: string }>('/process/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        videoId,
        roi,
        maskDataUrl,
        settings,
      }),
    });
  },

  /**
   * Get processing status
   */
  getStatus: (jobId: string): Promise<ProcessingStatusResponse> => {
    return apiFetch<ProcessingStatusResponse>(`/process/status/${jobId}`);
  },

  /**
   * Cancel processing job
   */
  cancel: (jobId: string): Promise<void> => {
    return apiFetch<void>(`/process/cancel/${jobId}`, {
      method: 'POST',
    });
  },

  /**
   * Get output download URL
   */
  getOutputUrl: (jobId: string): string => {
    return `${API_CONFIG.BASE_URL}/process/download/${jobId}`;
  },
};
