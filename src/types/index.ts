/**
 * Keira - Video Processing Types
 * Regis Architecture v2.9.0
 */

// =============================================================================
// VIDEO TYPES
// =============================================================================

export interface VideoInfo {
  id: string;
  name: string;
  path: string;
  duration: number;
  fps: number;
  width: number;
  height: number;
  size: number;
  thumbnailUrl?: string;
}

export interface ROI {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface MaskData {
  dataUrl: string;
  width: number;
  height: number;
}

// =============================================================================
// PROCESSING TYPES
// =============================================================================

export type ProcessingStage =
  | 'idle'
  | 'uploading'
  | 'extracting'
  | 'inpainting'
  | 'encoding'
  | 'complete'
  | 'error';

export interface ProcessingProgress {
  stage: ProcessingStage;
  percent: number;
  currentFrame: number;
  totalFrames: number;
  fps: number;
  eta: string;
  message: string;
}

export type ExportQuality = 'draft' | 'standard' | 'high' | 'lossless';

export interface ExportSettings {
  quality: ExportQuality;
  batchSize: number;
  ioWorkers: number;
}

export interface ProcessingJob {
  id: string;
  videoId: string;
  videoName: string;
  roi: ROI;
  maskDataUrl: string;
  settings: ExportSettings;
  status: ProcessingStage;
  progress: ProcessingProgress;
  outputUrl?: string;
  error?: string;
  createdAt: number;
  completedAt?: number;
}

// =============================================================================
// API TYPES
// =============================================================================

export interface UploadResponse {
  video: VideoInfo;
  thumbnailUrl: string;
}

export interface FrameResponse {
  frameUrl: string;
  time: number;
}

export interface StartProcessingRequest {
  videoId: string;
  roi: ROI;
  maskDataUrl: string;
  settings: ExportSettings;
}

export interface ProcessingStatusResponse {
  jobId: string;
  status: ProcessingStage;
  progress: ProcessingProgress;
  outputUrl?: string;
  error?: string;
}

// =============================================================================
// UI TYPES
// =============================================================================

export type AppView = 'upload' | 'select-roi' | 'edit-mask' | 'processing' | 'complete';
