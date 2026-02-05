/**
 * Keira - Video Upload Component
 * Regis Architecture v2.9.0
 */

import { useState, useCallback, useRef } from 'react';
import { Upload, Film, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store';
import { api } from '../services';
import { DropZone, GlassCard, ProgressBar } from './ui';

export function VideoUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setVideo = useAppStore((s) => s.setVideo);
  const setFrameUrl = useAppStore((s) => s.setFrameUrl);

  const handleFile = useCallback(
    async (file: File) => {
      // Validate file type
      const validTypes = [
        'video/mp4',
        'video/webm',
        'video/quicktime',
        'video/x-msvideo',
      ];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a valid video file (MP4, WebM, MOV, AVI)');
        return;
      }

      // Validate file size (max 2GB)
      if (file.size > 2 * 1024 * 1024 * 1024) {
        setError('File size must be less than 2GB');
        return;
      }

      setError(null);
      setIsUploading(true);
      setUploadProgress(0);

      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress((p) => Math.min(p + 10, 90));
        }, 200);

        const videoInfo = await api.uploadVideo(file);

        clearInterval(progressInterval);
        setUploadProgress(100);

        // Get first frame
        const frameUrl = await api.getFrame(videoInfo.id, 0);

        setVideo(videoInfo);
        setFrameUrl(frameUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed');
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [setVideo, setFrameUrl]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white tracking-wider mb-2">
            KEIRA
          </h1>
          <p className="text-gray-500 text-sm tracking-widest uppercase">
            AI Video Inpainting
          </p>
        </div>

        {/* Upload Zone */}
        <DropZone
          isDragging={isDragging}
          disabled={isUploading}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <AnimatePresence mode="wait">
            {isUploading ? (
              <motion.div
                key="uploading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full border-4 border-gray-600 border-t-gray-300 animate-spin mb-4" />
                <p className="text-gray-400 mb-2">Uploading...</p>
                <ProgressBar value={uploadProgress} className="w-48" />
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center"
              >
                <div className="w-20 h-20 rounded-full bg-gray-800/50 flex items-center justify-center mb-4">
                  {isDragging ? (
                    <Film className="w-10 h-10 text-gray-400" />
                  ) : (
                    <Upload className="w-10 h-10 text-gray-500" />
                  )}
                </div>
                <p className="text-gray-300 text-lg mb-2">
                  {isDragging
                    ? 'Drop video here'
                    : 'Drop video or click to browse'}
                </p>
                <p className="text-gray-500 text-sm">
                  MP4, WebM, MOV, AVI - Max 2GB
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </DropZone>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-4 bg-red-900/20 border border-red-800/30 rounded-xl flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          {[
            { icon: 'crosshair', title: 'Select ROI', desc: 'Mark watermark area' },
            { icon: 'paintbrush', title: 'Paint Mask', desc: 'Fine-tune selection' },
            { icon: 'sparkles', title: 'AI Remove', desc: 'LAMA inpainting' },
          ].map((feature, i) => (
            <motion.div key={feature.title}>
              <GlassCard className="p-4 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                >
                  <div className="text-2xl mb-2">
                    {feature.icon === 'crosshair' && '🎯'}
                    {feature.icon === 'paintbrush' && '🖌️'}
                    {feature.icon === 'sparkles' && '✨'}
                  </div>
                  <h3 className="text-gray-300 text-sm font-semibold mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 text-xs">{feature.desc}</p>
                </motion.div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
