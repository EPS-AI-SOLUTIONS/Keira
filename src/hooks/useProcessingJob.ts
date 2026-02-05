/**
 * Keira - Processing Job Hook
 * Regis Architecture v2.9.0
 *
 * Manages processing job lifecycle, polling, and status updates
 */

import { useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { api } from '../services';
import { PROCESSING_CONFIG } from '../constants';
import type { ProcessingJob, ProcessingProgress, ROI, ExportSettings, VideoInfo, ProcessingStage } from '../types';

// =============================================================================
// TYPES
// =============================================================================

export interface UseProcessingJobOptions {
  video: VideoInfo | null;
  roi: ROI | null;
  maskDataUrl: string | null;
  settings: ExportSettings;
  onJobCreated: (job: ProcessingJob) => void;
  onProgressUpdate: (progress: ProcessingProgress) => void;
  onComplete: (outputUrl: string) => void;
  onError: (error: string) => void;
}

export interface UseProcessingJobReturn {
  startProcessing: () => Promise<void>;
  cancelProcessing: () => Promise<void>;
  isStarted: boolean;
}

// =============================================================================
// HELPERS
// =============================================================================

function createInitialJob(
  video: VideoInfo,
  roi: ROI,
  maskDataUrl: string,
  settings: ExportSettings
): ProcessingJob {
  return {
    id: uuidv4(),
    videoId: video.id,
    videoName: video.name,
    roi,
    maskDataUrl,
    settings,
    status: 'uploading',
    progress: {
      stage: 'uploading',
      percent: 0,
      currentFrame: 0,
      totalFrames: 0,
      fps: 0,
      eta: '--:--',
      message: 'Starting...',
    },
    createdAt: Date.now(),
  };
}

// =============================================================================
// STAGE LABELS
// =============================================================================

export const STAGE_LABELS: Record<ProcessingStage, string> = {
  idle: 'Ready',
  uploading: 'Uploading...',
  extracting: 'Extracting frames...',
  inpainting: 'AI Inpainting...',
  encoding: 'Encoding video...',
  complete: 'Complete!',
  error: 'Error',
};

export function getStageLabel(stage: ProcessingStage): string {
  return STAGE_LABELS[stage] || 'Processing...';
}

// =============================================================================
// HOOK
// =============================================================================

export function useProcessingJob({
  video,
  roi,
  maskDataUrl,
  settings,
  onJobCreated,
  onProgressUpdate,
  onComplete,
  onError,
}: UseProcessingJobOptions): UseProcessingJobReturn {
  const pollingRef = useRef<number | null>(null);
  const startedRef = useRef(false);
  const jobIdRef = useRef<string | null>(null);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, []);

  // Stop polling helper
  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  // Start status polling
  const startPolling = useCallback(
    (jobId: string) => {
      pollingRef.current = window.setInterval(async () => {
        try {
          const status = await api.getProcessingStatus(jobId);
          onProgressUpdate(status.progress);

          if (status.status === 'complete' && status.outputUrl) {
            stopPolling();
            onComplete(status.outputUrl);
          } else if (status.status === 'error') {
            stopPolling();
            onError(status.error || 'Processing failed');
          }
        } catch (err) {
          console.error('Status poll error:', err);
        }
      }, PROCESSING_CONFIG.JOB_POLL_INTERVAL);
    },
    [onProgressUpdate, onComplete, onError, stopPolling]
  );

  // Start processing job
  const startProcessing = useCallback(async () => {
    if (!video || !roi || !maskDataUrl || startedRef.current) return;
    startedRef.current = true;

    // Create initial job
    const job = createInitialJob(video, roi, maskDataUrl, settings);
    onJobCreated(job);

    try {
      // Start server-side processing
      const { jobId } = await api.startProcessing(video.id, roi, maskDataUrl, settings);
      jobIdRef.current = jobId;

      // Update job with server ID
      onJobCreated({ ...job, id: jobId });

      // Start polling for status updates
      startPolling(jobId);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to start processing');
    }
  }, [video, roi, maskDataUrl, settings, onJobCreated, onError, startPolling]);

  // Cancel processing job
  const cancelProcessing = useCallback(async () => {
    stopPolling();

    if (jobIdRef.current) {
      try {
        await api.cancelProcessing(jobIdRef.current);
      } catch {
        // Ignore cancel errors
      }
    }
  }, [stopPolling]);

  return {
    startProcessing,
    cancelProcessing,
    isStarted: startedRef.current,
  };
}
