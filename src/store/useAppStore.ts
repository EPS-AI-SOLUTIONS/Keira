/**
 * Keira - Global State Store
 * Regis Architecture v2.9.0 - Zustand 5
 *
 * Main store with all actions. Individual slices available in ./slices/
 * for modular extension and testing.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  VideoInfo,
  ROI,
  ProcessingJob,
  ExportSettings,
  ProcessingProgress,
  AppView,
} from '../types';

// =============================================================================
// STATE INTERFACE
// =============================================================================

interface AppState {
  // Current video
  video: VideoInfo | null;
  frameUrl: string | null;
  currentTime: number;

  // ROI selection
  roi: ROI | null;
  isSelectingROI: boolean;

  // Mask
  maskDataUrl: string | null;

  // Processing
  currentJob: ProcessingJob | null;
  jobHistory: ProcessingJob[];

  // Settings
  settings: ExportSettings;

  // UI state
  currentView: AppView;
  sidebarCollapsed: boolean;
}

interface AppActions {
  // Video actions
  setVideo: (video: VideoInfo | null) => void;
  setFrameUrl: (url: string | null) => void;
  setCurrentTime: (time: number) => void;

  // ROI actions
  setROI: (roi: ROI | null) => void;
  setIsSelectingROI: (selecting: boolean) => void;

  // Mask actions
  setMaskDataUrl: (dataUrl: string | null) => void;

  // Job actions
  setCurrentJob: (job: ProcessingJob | null) => void;
  updateJobProgress: (progress: ProcessingProgress) => void;
  completeJob: (outputUrl: string) => void;
  failJob: (error: string) => void;
  addToHistory: (job: ProcessingJob) => void;

  // Settings actions
  setSettings: (settings: Partial<ExportSettings>) => void;

  // UI actions
  setCurrentView: (view: AppView) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Reset
  reset: () => void;
}

// =============================================================================
// DEFAULTS
// =============================================================================

const defaultSettings: ExportSettings = {
  quality: 'high',
  batchSize: 8,
  ioWorkers: 4,
};

const initialState: AppState = {
  video: null,
  frameUrl: null,
  currentTime: 0,
  roi: null,
  isSelectingROI: false,
  maskDataUrl: null,
  currentJob: null,
  jobHistory: [],
  settings: defaultSettings,
  currentView: 'upload',
  sidebarCollapsed: false,
};

// =============================================================================
// STORE
// =============================================================================

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Video actions
      setVideo: (video) =>
        set({
          video,
          currentView: video ? 'select-roi' : 'upload',
          roi: null,
          maskDataUrl: null,
          currentTime: 0,
        }),

      setFrameUrl: (frameUrl) => set({ frameUrl }),

      setCurrentTime: (currentTime) => set({ currentTime }),

      // ROI actions
      setROI: (roi) =>
        set({
          roi,
          isSelectingROI: false,
          currentView: roi ? 'edit-mask' : get().currentView,
        }),

      setIsSelectingROI: (isSelectingROI) => set({ isSelectingROI }),

      // Mask actions
      setMaskDataUrl: (maskDataUrl) => set({ maskDataUrl }),

      // Job actions
      setCurrentJob: (currentJob) =>
        set({
          currentJob,
          currentView: currentJob ? 'processing' : get().currentView,
        }),

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
            jobHistory: [completedJob, ...jobHistory].slice(0, 20),
            currentView: 'complete',
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
          jobHistory: [job, ...state.jobHistory].slice(0, 20),
        })),

      // Settings actions
      setSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      // UI actions
      setCurrentView: (currentView) => set({ currentView }),

      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),

      // Reset
      reset: () =>
        set({
          video: null,
          frameUrl: null,
          currentTime: 0,
          roi: null,
          isSelectingROI: false,
          maskDataUrl: null,
          currentJob: null,
          currentView: 'upload',
        }),
    }),
    {
      name: 'keira-app-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        settings: state.settings,
        jobHistory: state.jobHistory,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);

// =============================================================================
// SELECTORS
// =============================================================================

export const useVideo = () => useAppStore((s) => s.video);
export const useROI = () => useAppStore((s) => s.roi);
export const useCurrentJob = () => useAppStore((s) => s.currentJob);
export const useSettings = () => useAppStore((s) => s.settings);
export const useCurrentView = () => useAppStore((s) => s.currentView);
export const useJobHistory = () => useAppStore((s) => s.jobHistory);
