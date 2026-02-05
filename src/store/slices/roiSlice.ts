/**
 * Keira - ROI State Slice
 * Regis Architecture v2.9.0
 */

import type { StateCreator } from 'zustand';
import type { ROI } from '../../types';

// =============================================================================
// TYPES
// =============================================================================

export interface ROISlice {
  roi: ROI | null;
  isSelectingROI: boolean;

  setROI: (roi: ROI | null) => void;
  setIsSelectingROI: (selecting: boolean) => void;
}

// =============================================================================
// INITIAL STATE
// =============================================================================

export const roiInitialState = {
  roi: null as ROI | null,
  isSelectingROI: false,
};

// =============================================================================
// SLICE
// =============================================================================

export const createROISlice: StateCreator<
  ROISlice,
  [],
  [],
  ROISlice
> = (set) => ({
  ...roiInitialState,

  setROI: (roi) =>
    set({
      roi,
      isSelectingROI: false,
    }),

  setIsSelectingROI: (isSelectingROI) => set({ isSelectingROI }),
});
