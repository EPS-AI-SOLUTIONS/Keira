/**
 * Keira - Main Application
 * Regis Architecture v2.9.0
 */

import { Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from './store';
import { SuspenseFallback } from './components';

// Lazy-loaded views for code splitting (with named export wrapper)
const VideoUpload = lazy(() =>
  import('./components/VideoUpload').then((m) => ({ default: m.VideoUpload }))
);
const ROISelector = lazy(() =>
  import('./components/ROISelector').then((m) => ({ default: m.ROISelector }))
);
const MaskEditor = lazy(() =>
  import('./components/MaskEditor').then((m) => ({ default: m.MaskEditor }))
);
const ProcessingView = lazy(() =>
  import('./components/ProcessingView').then((m) => ({ default: m.ProcessingView }))
);

function App() {
  const currentView = useAppStore((s) => s.currentView);

  const renderView = () => {
    switch (currentView) {
      case 'upload':
        return <VideoUpload />;
      case 'select-roi':
        return <ROISelector />;
      case 'edit-mask':
        return <MaskEditor />;
      case 'processing':
      case 'complete':
        return <ProcessingView />;
      default:
        return <VideoUpload />;
    }
  };

  return (
    <div className="h-screen w-screen bg-keira-bg-primary overflow-hidden">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900/50 via-black to-gray-900/50 pointer-events-none" />

      {/* Main content */}
      <main className="relative h-full w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <Suspense fallback={<SuspenseFallback message="Loading view..." />}>
              {renderView()}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 flex items-center justify-between text-xs text-gray-600 pointer-events-none">
        <span>LAMA - FFMPEG - ONNX</span>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span>Keira v2.0 - System Online</span>
        </div>
      </footer>
    </div>
  );
}

export default App;