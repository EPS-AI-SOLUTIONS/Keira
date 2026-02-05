
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock zustand middleware to bypass persistence
vi.mock('zustand/middleware', () => ({
  persist: (config: any) => config,
  createJSONStorage: () => ({}),
}));

import { useAppStore } from './useAppStore';

describe('useAppStore', () => {
  beforeEach(() => {
    // Reset state using built-in action to preserve methods
    const state = useAppStore.getState();
    state.reset();
    // Manually reset things that reset() might miss if needed (checked code: reset() handles most, but jobHistory might persist in real app)
    useAppStore.setState({ jobHistory: [] });
  });

  it('should have initial state', () => {
    const state = useAppStore.getState();
    expect(state.video).toBeNull();
    expect(state.currentView).toBe('upload');
    expect(state.jobHistory).toEqual([]);
  });

  it('setVideo should update video and change view to select-roi', () => {
    const mockVideo = {
      id: '123',
      name: 'test.mp4',
      path: '/tmp/test.mp4',
      duration: 10,
      fps: 30,
      width: 1920,
      height: 1080,
      size: 1000,
    };

    useAppStore.getState().setVideo(mockVideo);

    const state = useAppStore.getState();
    expect(state.video).toEqual(mockVideo);
    expect(state.currentView).toBe('select-roi');
  });

  it('setROI should update roi and change view to edit-mask', () => {
    const mockROI = { x: 0, y: 0, width: 100, height: 100 };
    
    useAppStore.getState().setROI(mockROI);
    
    const state = useAppStore.getState();
    expect(state.roi).toEqual(mockROI);
    expect(state.currentView).toBe('edit-mask');
  });

  it('completeJob should move job to history and set view to complete', () => {
    const mockJob = {
      id: 'job-1',
      videoId: 'v-1',
      status: 'processing',
      progress: { stage: 'processing', percent: 50, message: 'Working...' },
      createdAt: Date.now(),
    };

    // First set a job
    useAppStore.getState().setCurrentJob(mockJob as any);
    
    // Complete it
    useAppStore.getState().completeJob('output.mp4');

    const state = useAppStore.getState();
    expect(state.currentView).toBe('complete');
    expect(state.currentJob?.status).toBe('complete');
    expect(state.jobHistory).toHaveLength(1);
    expect(state.jobHistory[0].outputUrl).toBe('output.mp4');
  });
});
