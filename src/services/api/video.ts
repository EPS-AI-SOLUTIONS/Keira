/**
 * Keira - Video API Service
 * Regis Architecture v2.9.0
 */

import type { VideoInfo } from '../../types';
import { apiFetch, apiFetchBlob } from './http';

// =============================================================================
// VIDEO API
// =============================================================================

export const videoApi = {
  /**
   * Upload video file
   */
  upload: async (file: File): Promise<VideoInfo> => {
    const formData = new FormData();
    formData.append('file', file);

    return apiFetch<VideoInfo>('/upload', {
      method: 'POST',
      body: formData,
    });
  },

  /**
   * Get frame at specific time
   */
  getFrame: async (videoId: string, time: number): Promise<string> => {
    const blob = await apiFetchBlob(`/frame/${videoId}?time=${time}`);
    return URL.createObjectURL(blob);
  },

  /**
   * Delete video
   */
  delete: (videoId: string): Promise<void> => {
    return apiFetch<void>(`/video/${videoId}`, {
      method: 'DELETE',
    });
  },
};
