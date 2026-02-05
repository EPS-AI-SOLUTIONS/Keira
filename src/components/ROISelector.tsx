/**
 * Keira - ROI Selector Component
 * Regis Architecture v2.9.0
 */

import { useState, useCallback, useRef } from 'react';
import { Check, X, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store';
import { api } from '../services';
import { Button, GlassPanel, Slider, TimeDisplay, Badge } from './ui';
import type { ROI } from '../types';

export function ROISelector() {
  const video = useAppStore((s) => s.video);
  const frameUrl = useAppStore((s) => s.frameUrl);
  const currentTime = useAppStore((s) => s.currentTime);
  const setROI = useAppStore((s) => s.setROI);
  const setFrameUrl = useAppStore((s) => s.setFrameUrl);
  const setCurrentTime = useAppStore((s) => s.setCurrentTime);
  const reset = useAppStore((s) => s.reset);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [selection, setSelection] = useState<ROI | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  // Handle time slider change
  const handleTimeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!video) return;
    const time = parseFloat(e.target.value);
    setCurrentTime(time);

    try {
      const newFrameUrl = await api.getFrame(video.id, time);
      setFrameUrl(newFrameUrl);
    } catch (err) {
      console.error('Failed to get frame:', err);
    }
  };

  // Convert screen coords to image coords
  const screenToImage = useCallback(
    (screenX: number, screenY: number) => {
      if (!containerRef.current || !imageSize.width) return { x: 0, y: 0 };

      const img = containerRef.current.querySelector('img');
      if (!img) return { x: 0, y: 0 };

      const imgRect = img.getBoundingClientRect();
      const scaleX = video!.width / imgRect.width;
      const scaleY = video!.height / imgRect.height;

      const x = Math.round((screenX - imgRect.left) * scaleX);
      const y = Math.round((screenY - imgRect.top) * scaleY);

      return {
        x: Math.max(0, Math.min(x, video!.width)),
        y: Math.max(0, Math.min(y, video!.height)),
      };
    },
    [video, imageSize]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!video) return;
      const point = screenToImage(e.clientX, e.clientY);
      setStartPoint(point);
      setIsDrawing(true);
      setSelection(null);
    },
    [video, screenToImage]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDrawing || !video) return;

      const current = screenToImage(e.clientX, e.clientY);
      const x = Math.min(startPoint.x, current.x);
      const y = Math.min(startPoint.y, current.y);
      const width = Math.abs(current.x - startPoint.x);
      const height = Math.abs(current.y - startPoint.y);

      setSelection({ x, y, width, height });
    },
    [isDrawing, startPoint, video, screenToImage]
  );

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const handleConfirm = () => {
    if (selection && selection.width >= 5 && selection.height >= 5) {
      setROI(selection);
    }
  };

  const handleClear = () => {
    setSelection(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(2);
    return `${mins}:${secs.padStart(5, '0')}`;
  };

  const isValidSelection =
    selection && selection.width >= 5 && selection.height >= 5;

  // Calculate selection style for display
  const getSelectionStyle = () => {
    if (!selection || !containerRef.current || !video) return {};

    const img = containerRef.current.querySelector('img');
    if (!img) return {};

    const imgRect = img.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    const scaleX = imgRect.width / video.width;
    const scaleY = imgRect.height / video.height;

    return {
      left: `${imgRect.left - containerRect.left + selection.x * scaleX}px`,
      top: `${imgRect.top - containerRect.top + selection.y * scaleY}px`,
      width: `${selection.width * scaleX}px`,
      height: `${selection.height * scaleY}px`,
    };
  };

  if (!video) return null;

  return (
    <div className="flex flex-col h-full p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Select ROI</h2>
          <p className="text-gray-500 text-sm">
            Draw a rectangle around the watermark
          </p>
        </div>
        <Button variant="default" onClick={reset}>
          <RotateCcw className="w-4 h-4" />
          Start Over
        </Button>
      </div>

      {/* Frame Display */}
      <div className="flex-1 flex items-center justify-center min-h-0">
        <div
          ref={containerRef}
          className="relative max-w-full max-h-full cursor-crosshair select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {frameUrl && (
            <img
              src={frameUrl}
              alt="Video frame"
              className="max-w-full max-h-[60vh] object-contain rounded-lg"
              onLoad={(e) => {
                const img = e.currentTarget;
                setImageSize({
                  width: img.naturalWidth,
                  height: img.naturalHeight,
                });
              }}
              draggable={false}
            />
          )}

          {/* Selection overlay */}
          {selection && (
            <div
              className="absolute border-2 border-green-400 bg-green-400/10 pointer-events-none"
              style={{
                ...getSelectionStyle(),
                boxShadow: '0 0 10px rgba(74, 222, 128, 0.3)',
              }}
            >
              {isValidSelection && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/80 text-green-400 px-2 py-1 rounded text-xs font-mono whitespace-nowrap">
                  {selection.width} x {selection.height}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      <GlassPanel className="mt-4 p-4">
        <div className="flex items-center gap-4">
          <Slider
            min={0}
            max={video.duration}
            step={0.1}
            value={currentTime}
            onChange={handleTimeChange}
            className="flex-1"
          />
          <TimeDisplay>{formatTime(currentTime)}</TimeDisplay>
        </div>

        {/* Video info */}
        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
          <span>{video.name}</span>
          <span>
            {video.width}x{video.height} - {video.fps.toFixed(1)} FPS -{' '}
            {formatTime(video.duration)}
          </span>
        </div>
      </GlassPanel>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          {selection ? (
            isValidSelection ? (
              <Badge variant="success">
                Selection: {selection.width}x{selection.height} at (
                {selection.x}, {selection.y})
              </Badge>
            ) : (
              <Badge variant="warning">Selection too small (min 5x5)</Badge>
            )
          ) : (
            'Click and drag to select watermark area'
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="danger" onClick={handleClear} disabled={!selection}>
            <X className="w-4 h-4" />
            Clear
          </Button>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="primary"
              onClick={handleConfirm}
              disabled={!isValidSelection}
            >
              <Check className="w-4 h-4" />
              Confirm ROI
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
