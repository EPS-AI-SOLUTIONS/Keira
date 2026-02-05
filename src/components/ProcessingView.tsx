/**
 * Keira - Processing View Component
 * Regis Architecture v2.9.0 - Modular Version
 */

import { useEffect } from 'react';
import { Loader2, XCircle, Download, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store';
import { useProcessingJob, getStageLabel } from '../hooks';
import { api } from '../services';
import { Button, GlassPanel, ProgressBar, StatsCard } from './ui';

export function ProcessingView() {
  // Store state
  const video = useAppStore((s) => s.video);
  const roi = useAppStore((s) => s.roi);
  const maskDataUrl = useAppStore((s) => s.maskDataUrl);
  const settings = useAppStore((s) => s.settings);
  const currentJob = useAppStore((s) => s.currentJob);
  const setCurrentJob = useAppStore((s) => s.setCurrentJob);
  const updateJobProgress = useAppStore((s) => s.updateJobProgress);
  const completeJob = useAppStore((s) => s.completeJob);
  const failJob = useAppStore((s) => s.failJob);
  const reset = useAppStore((s) => s.reset);

  // Processing job management
  const { startProcessing, cancelProcessing } = useProcessingJob({
    video,
    roi,
    maskDataUrl,
    settings,
    onJobCreated: setCurrentJob,
    onProgressUpdate: updateJobProgress,
    onComplete: completeJob,
    onError: failJob,
  });

  // Start processing on mount
  useEffect(() => {
    startProcessing();
  }, [startProcessing]);

  // Event handlers
  const handleCancel = async () => {
    await cancelProcessing();
    reset();
  };

  const handleDownload = () => {
    if (currentJob?.outputUrl) {
      window.open(api.getOutputUrl(currentJob.id), '_blank');
    }
  };

  const handleStartOver = () => {
    reset();
  };

  if (!currentJob) return null;

  const { progress, status } = currentJob;
  const isComplete = status === 'complete';
  const isError = status === 'error';
  const isProcessing = !isComplete && !isError;

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg"
      >
        <GlassPanel className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <AnimatePresence mode="wait">
              {isComplete ? (
                <motion.div
                  key="complete"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4"
                >
                  <span className="text-4xl">✓</span>
                </motion.div>
              ) : isError ? (
                <motion.div
                  key="error"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4"
                >
                  <XCircle className="w-10 h-10 text-red-400" />
                </motion.div>
              ) : (
                <motion.div
                  key="processing"
                  className="w-20 h-20 rounded-full bg-gray-700/50 flex items-center justify-center mx-auto mb-4"
                >
                  <Loader2 className="w-10 h-10 text-gray-400 animate-spin" />
                </motion.div>
              )}
            </AnimatePresence>

            <h2 className="text-2xl font-bold text-white mb-2">
              {isComplete
                ? 'Processing Complete!'
                : isError
                  ? 'Processing Failed'
                  : 'Processing Video'}
            </h2>
            <p className="text-gray-400">
              {isError ? currentJob.error : getStageLabel(progress.stage)}
            </p>
          </div>

          {/* Progress Bar */}
          {isProcessing && (
            <div className="mb-6">
              <ProgressBar value={progress.percent} className="mb-2" />
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{progress.percent}%</span>
                <span className="text-gray-500">{progress.message}</span>
              </div>
            </div>
          )}

          {/* Stats */}
          {isProcessing && progress.stage === 'inpainting' && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              <StatsCard
                label="Frames"
                value={`${progress.currentFrame} / ${progress.totalFrames}`}
              />
              <StatsCard
                label="Speed"
                value={`${progress.fps.toFixed(1)} fps`}
              />
              <StatsCard label="ETA" value={progress.eta} />
            </div>
          )}

          {/* Video Info */}
          <div className="text-center text-sm text-gray-500 mb-6">
            {currentJob.videoName}
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-4">
            {isProcessing && (
              <Button variant="danger" onClick={handleCancel}>
                Cancel
              </Button>
            )}

            {isComplete && (
              <>
                <Button variant="default" onClick={handleStartOver}>
                  <RotateCcw className="w-4 h-4" />
                  Process Another
                </Button>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button variant="primary" onClick={handleDownload}>
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </motion.div>
              </>
            )}

            {isError && (
              <Button variant="default" onClick={handleStartOver}>
                <RotateCcw className="w-4 h-4" />
                Try Again
              </Button>
            )}
          </div>
        </GlassPanel>
      </motion.div>
    </div>
  );
}
