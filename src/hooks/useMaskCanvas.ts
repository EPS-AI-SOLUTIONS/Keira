/**
 * Keira - Mask Canvas Hook
 * Regis Architecture v2.9.0
 *
 * Manages canvas initialization, ROI extraction, and mask overlay rendering
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import type { ROI } from '../types';
import { MASK_OVERLAY_COLOR } from '../constants';

// =============================================================================
// TYPES
// =============================================================================

export interface UseMaskCanvasOptions {
  frameUrl: string | null;
  roi: ROI | null;
}

export interface UseMaskCanvasReturn {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  maskRef: React.RefObject<HTMLCanvasElement | null>;
  roiImage: HTMLImageElement | null;
  isInitialized: boolean;
  renderOverlay: () => void;
  getMaskDataUrl: () => string | null;
}

// =============================================================================
// HOOK
// =============================================================================

export function useMaskCanvas({
  frameUrl,
  roi,
}: UseMaskCanvasOptions): UseMaskCanvasReturn {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskRef = useRef<HTMLCanvasElement>(null);
  const [roiImage, setRoiImage] = useState<HTMLImageElement | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Extract ROI from frame and initialize canvases
  useEffect(() => {
    if (!frameUrl || !roi) {
      setIsInitialized(false);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      // Create temp canvas to extract ROI region
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = roi.width;
      tempCanvas.height = roi.height;
      const tempCtx = tempCanvas.getContext('2d')!;

      tempCtx.drawImage(
        img,
        roi.x,
        roi.y,
        roi.width,
        roi.height,
        0,
        0,
        roi.width,
        roi.height
      );

      // Create ROI image from extracted region
      const roiImg = new Image();
      roiImg.onload = () => {
        setRoiImage(roiImg);

        // Initialize display and mask canvases
        if (canvasRef.current && maskRef.current) {
          // Set dimensions
          canvasRef.current.width = roi.width;
          canvasRef.current.height = roi.height;
          maskRef.current.width = roi.width;
          maskRef.current.height = roi.height;

          // Draw base image on display canvas
          const ctx = canvasRef.current.getContext('2d')!;
          ctx.drawImage(roiImg, 0, 0);

          // Initialize mask as black (empty/no selection)
          const maskCtx = maskRef.current.getContext('2d')!;
          maskCtx.fillStyle = 'black';
          maskCtx.fillRect(0, 0, roi.width, roi.height);

          setIsInitialized(true);
        }
      };
      roiImg.src = tempCanvas.toDataURL();
    };

    img.src = frameUrl;
  }, [frameUrl, roi]);

  // Render mask overlay on display canvas
  const renderOverlay = useCallback(() => {
    if (!canvasRef.current || !maskRef.current || !roiImage) return;

    const ctx = canvasRef.current.getContext('2d')!;
    const maskCtx = maskRef.current.getContext('2d')!;

    // Clear and draw base image
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.drawImage(roiImage, 0, 0);

    // Get mask pixel data
    const maskData = maskCtx.getImageData(
      0,
      0,
      maskRef.current.width,
      maskRef.current.height
    );

    // Create colored overlay from mask
    const overlay = ctx.createImageData(
      canvasRef.current.width,
      canvasRef.current.height
    );

    for (let i = 0; i < maskData.data.length; i += 4) {
      const maskValue = maskData.data[i]; // R channel (grayscale)
      if (maskValue > 127) {
        overlay.data[i] = MASK_OVERLAY_COLOR.r;
        overlay.data[i + 1] = MASK_OVERLAY_COLOR.g;
        overlay.data[i + 2] = MASK_OVERLAY_COLOR.b;
        overlay.data[i + 3] = MASK_OVERLAY_COLOR.alpha;
      }
    }

    ctx.putImageData(overlay, 0, 0);

    // Blend overlay with base image
    ctx.globalCompositeOperation = 'destination-over';
    ctx.drawImage(roiImage, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
  }, [roiImage]);

  // Re-render overlay when roiImage changes
  useEffect(() => {
    if (isInitialized) {
      renderOverlay();
    }
  }, [isInitialized, renderOverlay]);

  // Export mask as data URL
  const getMaskDataUrl = useCallback((): string | null => {
    if (!maskRef.current) return null;
    return maskRef.current.toDataURL('image/png');
  }, []);

  return {
    canvasRef,
    maskRef,
    roiImage,
    isInitialized,
    renderOverlay,
    getMaskDataUrl,
  };
}
