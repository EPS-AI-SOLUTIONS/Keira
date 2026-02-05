/**
 * Keira - Mask Brush Hook
 * Regis Architecture v2.9.0
 *
 * Manages brush painting state and mouse interactions for mask editing
 */

import { useState, useCallback } from 'react';
import { BRUSH_CONFIG } from '../constants';

// =============================================================================
// TYPES
// =============================================================================

export interface BrushSize {
  width: number;
  height: number;
}

export type PaintMode = 'draw' | 'erase';

export interface UseMaskBrushOptions {
  maskRef: React.RefObject<HTMLCanvasElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onBrushApplied?: () => void;
}

export interface UseMaskBrushReturn {
  brushSize: BrushSize;
  setBrushSize: React.Dispatch<React.SetStateAction<BrushSize>>;
  paintMode: PaintMode;
  isPainting: boolean;
  lastPos: { x: number; y: number } | null;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseUp: () => void;
  handleContextMenu: (e: React.MouseEvent) => void;
  clearMask: () => void;
  fillMask: () => void;
}

// =============================================================================
// HOOK
// =============================================================================

export function useMaskBrush({
  maskRef,
  canvasRef,
  onBrushApplied,
}: UseMaskBrushOptions): UseMaskBrushReturn {
  const [isPainting, setIsPainting] = useState(false);
  const [brushSize, setBrushSize] = useState<BrushSize>({
    width: BRUSH_CONFIG.DEFAULT_WIDTH,
    height: BRUSH_CONFIG.DEFAULT_HEIGHT,
  });
  const [paintMode, setPaintMode] = useState<PaintMode>('draw');
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);

  // Apply brush stroke to mask
  const applyBrush = useCallback(
    (x: number, y: number, mode: PaintMode) => {
      if (!maskRef.current) return;

      const maskCtx = maskRef.current.getContext('2d')!;
      const color = mode === 'draw' ? 'white' : 'black';

      const brushX = x - brushSize.width / 2;
      const brushY = y - brushSize.height / 2;

      maskCtx.fillStyle = color;
      maskCtx.fillRect(brushX, brushY, brushSize.width, brushSize.height);

      onBrushApplied?.();
    },
    [maskRef, brushSize, onBrushApplied]
  );

  // Get mouse position relative to canvas
  const getMousePos = useCallback(
    (e: React.MouseEvent): { x: number; y: number } => {
      const rect = canvasRef.current!.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    },
    [canvasRef]
  );

  // Mouse event handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const mode: PaintMode = e.button === 2 ? 'erase' : 'draw';
      setPaintMode(mode);
      setIsPainting(true);

      const pos = getMousePos(e);
      setLastPos(pos);
      applyBrush(pos.x, pos.y, mode);
    },
    [getMousePos, applyBrush]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const pos = getMousePos(e);
      setLastPos(pos);

      if (isPainting) {
        applyBrush(pos.x, pos.y, paintMode);
      }
    },
    [getMousePos, isPainting, paintMode, applyBrush]
  );

  const handleMouseUp = useCallback(() => {
    setIsPainting(false);
  }, []);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  // Mask fill operations
  const clearMask = useCallback(() => {
    if (!maskRef.current) return;
    const maskCtx = maskRef.current.getContext('2d')!;
    maskCtx.fillStyle = 'black';
    maskCtx.fillRect(0, 0, maskRef.current.width, maskRef.current.height);
    onBrushApplied?.();
  }, [maskRef, onBrushApplied]);

  const fillMask = useCallback(() => {
    if (!maskRef.current) return;
    const maskCtx = maskRef.current.getContext('2d')!;
    maskCtx.fillStyle = 'white';
    maskCtx.fillRect(0, 0, maskRef.current.width, maskRef.current.height);
    onBrushApplied?.();
  }, [maskRef, onBrushApplied]);

  return {
    brushSize,
    setBrushSize,
    paintMode,
    isPainting,
    lastPos,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleContextMenu,
    clearMask,
    fillMask,
  };
}
