/**
 * Keira - Video State Slice
 * Regis Architecture v2.9.0
 */

import type { StateCreator } from 'zustand';
import type { VideoInfo } from '../../types';

// =============================================================================
// TYPES
// =============================================================================

export interface VideoSlice {
  video: VideoInfo | null;
  frameUrl: string | null;
  currentTime: number;

  setVideo: (video: VideoInfo | null) => void;
  setFrameUrl: (url: string | null) => void;
  setCurrentTime: (time: number) => void;
}

// =============================================================================
// INITIAL STATE
// =============================================================================

export const videoInitialState = {
  video: null as VideoInfo | null,
  frameUrl: null as string | null,
  currentTime: 0,
};

// =============================================================================
// SLICE
// =============================================================================

export const createVideoSlice: StateCreator<
  VideoSlice,
  [],
  [],
  VideoSlice
> = (set) => ({
  ...videoInitialState,

  setVideo: (video) =>
    set({
      video,
      currentTime: 0,
    }),

  setFrameUrl: (frameUrl) => set({ frameUrl }),

  setCurrentTime: (currentTime) => set({ currentTime }),
});
