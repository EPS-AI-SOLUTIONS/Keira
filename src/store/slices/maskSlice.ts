/**
 * Keira - Mask State Slice
 * Regis Architecture v2.9.0
 */

import type { StateCreator } from 'zustand';

// =============================================================================
// TYPES
// =============================================================================

export interface MaskSlice {
  maskDataUrl: string | null;

  setMaskDataUrl: (dataUrl: string | null) => void;
}

// =============================================================================
// INITIAL STATE
// =============================================================================

export const maskInitialState = {
  maskDataUrl: null as string | null,
};

// =============================================================================
// SLICE
// =============================================================================

export const createMaskSlice: StateCreator<
  MaskSlice,
  [],
  [],
  MaskSlice
> = (set) => ({
  ...maskInitialState,

  setMaskDataUrl: (maskDataUrl) => set({ maskDataUrl }),
});
