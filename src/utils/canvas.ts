/**
 * Keira - Canvas Utilities
 * Regis Architecture v2.9.0
 */

import type { ROI } from '../types';

// =============================================================================
// TYPES
// =============================================================================

export interface BrushSize {
  width: number;
  height: number;
}

export interface MaskOverlayConfig {
  color: { r: number; g: number; b: number };
  alpha: number;
  threshold: number;
}

// =============================================================================
// DEFAULT CONFIG
// =============================================================================

export const DEFAULT_MASK_OVERLAY: MaskOverlayConfig = {
  color: { r: 0, g: 255, b: 65 },
  alpha: 100,
  threshold: 127,
};

// =============================================================================
// IMAGE EXTRACTION
// =============================================================================

/**
 * Extract ROI region from source image
 */
export function extractROIFromImage(
  sourceImage: HTMLImageElement,
  roi: ROI
): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = roi.width;
    tempCanvas.height = roi.height;
    const tempCtx = tempCanvas.getContext('2d')!;

    tempCtx.drawImage(
      sourceImage,
      roi.x,
      roi.y,
      roi.width,
      roi.height,
      0,
      0,
      roi.width,
      roi.height
    );

    const roiImg = new Image();
    roiImg.onload = () => resolve(roiImg);
    roiImg.src = tempCanvas.toDataURL();
  });
}

// =============================================================================
// MASK OPERATIONS
// =============================================================================

/**
 * Initialize canvas with dimensions
 */
export function initializeCanvas(
  canvas: HTMLCanvasElement,
  width: number,
  height: number
): CanvasRenderingContext2D {
  canvas.width = width;
  canvas.height = height;
  return canvas.getContext('2d')!;
}

/**
 * Fill canvas with solid color
 */
export function fillCanvas(
  canvas: HTMLCanvasElement,
  color: string
): void {
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * Apply brush stroke to mask canvas
 */
export function applyBrushToMask(
  maskCanvas: HTMLCanvasElement,
  x: number,
  y: number,
  brushSize: BrushSize,
  mode: 'draw' | 'erase'
): void {
  const ctx = maskCanvas.getContext('2d')!;
  const color = mode === 'draw' ? 'white' : 'black';

  const brushX = x - brushSize.width / 2;
  const brushY = y - brushSize.height / 2;

  ctx.fillStyle = color;
  ctx.fillRect(brushX, brushY, brushSize.width, brushSize.height);
}

/**
 * Render mask overlay on display canvas
 */
export function renderMaskOverlay(
  displayCanvas: HTMLCanvasElement,
  maskCanvas: HTMLCanvasElement,
  baseImage: HTMLImageElement,
  config: MaskOverlayConfig = DEFAULT_MASK_OVERLAY
): void {
  const ctx = displayCanvas.getContext('2d')!;
  const maskCtx = maskCanvas.getContext('2d')!;

  // Clear and draw base
  ctx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);
  ctx.drawImage(baseImage, 0, 0);

  // Get mask data
  const maskData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);

  // Create overlay
  const overlay = ctx.createImageData(displayCanvas.width, displayCanvas.height);

  for (let i = 0; i < maskData.data.length; i += 4) {
    const maskValue = maskData.data[i]; // R channel (grayscale)
    if (maskValue > config.threshold) {
      overlay.data[i] = config.color.r;
      overlay.data[i + 1] = config.color.g;
      overlay.data[i + 2] = config.color.b;
      overlay.data[i + 3] = config.alpha;
    }
  }

  ctx.putImageData(overlay, 0, 0);

  // Redraw base with overlay blend
  ctx.globalCompositeOperation = 'destination-over';
  ctx.drawImage(baseImage, 0, 0);
  ctx.globalCompositeOperation = 'source-over';
}

/**
 * Export mask canvas to data URL
 */
export function exportMaskToDataUrl(
  maskCanvas: HTMLCanvasElement,
  format: 'image/png' | 'image/jpeg' = 'image/png'
): string {
  return maskCanvas.toDataURL(format);
}

// =============================================================================
// COORDINATE HELPERS
// =============================================================================

/**
 * Get mouse position relative to canvas
 */
export function getCanvasMousePosition(
  event: React.MouseEvent | MouseEvent,
  canvas: HTMLCanvasElement
): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

/**
 * Clamp value to canvas bounds
 */
export function clampToCanvas(
  value: number,
  max: number
): number {
  return Math.max(0, Math.min(value, max));
}
