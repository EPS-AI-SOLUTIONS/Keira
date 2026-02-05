/**
 * Keira - Processing State Slice
 * Regis Architecture v2.9.0
 */

import type { StateCreator } from 'zustand';
import type { ProcessingJob, ProcessingProgress } from '../../types';

// =============================================================================
// TYPES
// =============================================================================

export interface ProcessingSlice {
  currentJob: ProcessingJob | null;
  jobHistory: ProcessingJob[];

  setCurrentJob: (job: ProcessingJob | null) => void;
  updateJobProgress: (progress: ProcessingProgress) => void;
  completeJob: (outputUrl: string) => void;
  failJob: (error: string) => void;
  addToHistory: (job: ProcessingJob) => void;
}

// =============================================================================
// INITIAL STATE
// =============================================================================

export const processingInitialState = {
  currentJob: null as ProcessingJob | null,
  jobHistory: [] as ProcessingJob[],
};

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_HISTORY_SIZE = 20;

// =============================================================================
// SLICE
// =============================================================================

export const createProcessingSlice: StateCreator<
  ProcessingSlice,
  [],
  [],
  ProcessingSlice
> = (set, get) => ({
  ...processingInitialState,

  setCurrentJob: (currentJob) => set({ currentJob }),

  updateJobProgress: (progress) => {
    const { currentJob } = get();
    if (currentJob) {
      set({
        currentJob: {
          ...currentJob,
          progress,
          status: progress.stage,
        },
      });
    }
  },

  completeJob: (outputUrl) => {
    const { currentJob, jobHistory } = get();
    if (currentJob) {
      const completedJob: ProcessingJob = {
        ...currentJob,
        status: 'complete',
        outputUrl,
        completedAt: Date.now(),
        progress: {
          ...currentJob.progress,
          stage: 'complete',
          percent: 100,
          message: 'Complete!',
        },
      };
      set({
        currentJob: completedJob,
        jobHistory: [completedJob, ...jobHistory].slice(0, MAX_HISTORY_SIZE),
      });
    }
  },

  failJob: (error) => {
    const { currentJob } = get();
    if (currentJob) {
      set({
        currentJob: {
          ...currentJob,
          status: 'error',
          error,
          progress: {
            ...currentJob.progress,
            stage: 'error',
            message: error,
          },
        },
      });
    }
  },

  addToHistory: (job) =>
    set((state) => ({
      jobHistory: [job, ...state.jobHistory].slice(0, MAX_HISTORY_SIZE),
    })),
});
