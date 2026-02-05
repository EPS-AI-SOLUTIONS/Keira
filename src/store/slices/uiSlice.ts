/**
 * Keira - UI State Slice
 * Regis Architecture v2.9.0
 */

import type { StateCreator } from 'zustand';
import type { AppView } from '../../types';

// =============================================================================
// TYPES
// =============================================================================

export interface UISlice {
  currentView: AppView;
  sidebarCollapsed: boolean;

  setCurrentView: (view: AppView) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

// =============================================================================
// INITIAL STATE
// =============================================================================

export const uiInitialState = {
  currentView: 'upload' as AppView,
  sidebarCollapsed: false,
};

// =============================================================================
// SLICE
// =============================================================================

export const createUISlice: StateCreator<
  UISlice,
  [],
  [],
  UISlice
> = (set) => ({
  ...uiInitialState,

  setCurrentView: (currentView) => set({ currentView }),

  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
});
