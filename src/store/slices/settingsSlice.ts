/**
 * Keira - Settings State Slice
 * Regis Architecture v2.9.0
 */

import type { StateCreator } from 'zustand';
import type { ExportSettings } from '../../types';

// =============================================================================
// TYPES
// =============================================================================

export interface SettingsSlice {
  settings: ExportSettings;

  setSettings: (settings: Partial<ExportSettings>) => void;
}

// =============================================================================
// DEFAULTS
// =============================================================================

export const defaultSettings: ExportSettings = {
  quality: 'high',
  batchSize: 8,
  ioWorkers: 4,
};

// =============================================================================
// INITIAL STATE
// =============================================================================

export const settingsInitialState = {
  settings: defaultSettings,
};

// =============================================================================
// SLICE
// =============================================================================

export const createSettingsSlice: StateCreator<
  SettingsSlice,
  [],
  [],
  SettingsSlice
> = (set) => ({
  ...settingsInitialState,

  setSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),
});
