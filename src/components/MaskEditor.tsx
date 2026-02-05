/**
 * Keira - Mask Editor Component
 * Regis Architecture v2.9.0 - Modular Version
 */

import { Check, X, Eraser, PaintBucket, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store';
import { useMaskCanvas, useMaskBrush } from '../hooks';
import { Button, GlassPanel, Slider, Badge } from './ui';

export function MaskEditor() {
  // Store state
  const frameUrl = useAppStore((s) => s.frameUrl);
  const roi = useAppStore((s) => s.roi);
  const setMaskDataUrl = useAppStore((s) => s.setMaskDataUrl);
  const setCurrentView = useAppStore((s) => s.setCurrentView);
  const setROI = useAppStore((s) => s.setROI);

  // Canvas management
  const { canvasRef, maskRef, renderOverlay, getMaskDataUrl } = useMaskCanvas({
    frameUrl,
    roi,
  });

  // Brush management
  const {
    brushSize,
    setBrushSize,
    lastPos,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleContextMenu,
    clearMask,
    fillMask,
  } = useMaskBrush({
    maskRef,
    canvasRef,
    onBrushApplied: renderOverlay,
  });

  // Navigation handlers
  const handleBack = () => {
    setROI(null);
    setCurrentView('select-roi');
  };

  const handleConfirm = () => {
    const dataUrl = getMaskDataUrl();
    if (dataUrl) {
      setMaskDataUrl(dataUrl);
      setCurrentView('processing');
    }
  };

  if (!roi) return null;

  return (
    <div className="flex flex-col h-full p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-white">Edit Mask</h2>
            <p className="text-gray-500 text-sm">Paint the area to remove</p>
          </div>
        </div>

        <div className="text-sm text-gray-500">LMB = Paint - RMB = Erase</div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center min-h-0">
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="rounded-lg shadow-2xl cursor-crosshair"
            style={{ touchAction: 'none' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onContextMenu={handleContextMenu}
          />

          {/* Hidden mask canvas */}
          <canvas ref={maskRef} className="hidden" />

          {/* Brush cursor preview */}
          {lastPos && (
            <div
              className="absolute border-2 border-cyan-400 border-dashed pointer-events-none"
              style={{
                left: lastPos.x - brushSize.width / 2,
                top: lastPos.y - brushSize.height / 2,
                width: brushSize.width,
                height: brushSize.height,
              }}
            />
          )}
        </div>
      </div>

      {/* Controls */}
      <GlassPanel className="mt-4 p-4">
        <div className="flex items-center gap-6">
          {/* Brush Size */}
          <div className="flex items-center gap-4">
            <Slider
              label="Width"
              min={1}
              max={256}
              value={brushSize.width}
              onChange={(e) =>
                setBrushSize((s) => ({ ...s, width: parseInt(e.target.value) }))
              }
              className="w-36"
            />
            <span className="text-gray-300 font-mono text-sm w-12">
              {brushSize.width}px
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Slider
              label="Height"
              min={1}
              max={256}
              value={brushSize.height}
              onChange={(e) =>
                setBrushSize((s) => ({
                  ...s,
                  height: parseInt(e.target.value),
                }))
              }
              className="w-36"
            />
            <span className="text-gray-300 font-mono text-sm w-12">
              {brushSize.height}px
            </span>
          </div>

          <div className="flex-1" />

          {/* Quick Actions */}
          <Button variant="default" onClick={fillMask}>
            <PaintBucket className="w-4 h-4" />
            Fill All
          </Button>

          <Button variant="danger" onClick={clearMask}>
            <Eraser className="w-4 h-4" />
            Clear All
          </Button>
        </div>
      </GlassPanel>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-4">
        <Badge variant="default">
          ROI: {roi.width}x{roi.height} at ({roi.x}, {roi.y})
        </Badge>

        <div className="flex gap-3">
          <Button variant="danger" onClick={handleBack}>
            <X className="w-4 h-4" />
            Cancel
          </Button>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button variant="primary" onClick={handleConfirm}>
              <Check className="w-4 h-4" />
              Start Processing
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
