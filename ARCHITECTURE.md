# Keira Architecture (Regis Specification)

**Version 2.9.0**

This document outlines the architecture of Keira, designed for high throughput video inpainting.

## High Level Overview

```mermaid
graph TD
    User[User] <--> UI[React 19 Frontend]
    UI <-->|HTTP/REST| API[FastAPI Backend]
    
    subgraph "Processing Pipeline"
        API -->|Subprocess| FFmpeg[FFmpeg (Extract Frames)]
        API -->|Subprocess| Worker[Inpaint Worker (Python)]
        Worker -->|ONNX| LaMa[LaMa Model]
        API -->|Subprocess| FFmpeg2[FFmpeg (Stitch Video)]
    end
```

## Layers

### 1. Presentation Layer (React 19)
- **State:** `src/store/useAppStore.ts` (Zustand) holds the current processing state (idle, extracting, processing, done).
- **Communication:** `src/services/api.ts` handles communication with FastAPI endpoints (`/api/upload`, `/api/process`).
- **Feedback:** Real-time progress bars using Server-Sent Events (SSE) or Polling (implementation specific).
- **Lazy Loading:** Components are code-split using `React.lazy()` via `src/components/LazyComponents.tsx`.
- **Suspense Boundaries:** Unified loading states via `SuspenseFallback` component.
- **Keyboard Shortcuts:** Global hotkey management through `useHotkey` and `useKeyboardShortcuts` hooks.

### 2. Service Layer (FastAPI)
- **Router:** `api/routes/` delegates requests.
- **State:** `api/state.py` manages job queues and temporary file paths.
- **Process Manager:** Spawns `inpaint_worker.py` as a detached process to bypass GIL limitations for heavy IO/Compute.

### 3. Compute Layer (Worker)
- **File:** `worker/inpaint_worker.py`
- **Logic:**
  1. Loads ONNX model.
  2. Reads frames from disk (ThreadPoolExecutor).
  3. Creates mask from ROI.
  4. Runs Inference (LaMa).
  5. Blends result.
  6. Writes output (ThreadPoolExecutor).
- **Optimization:** ROI-based processing significantly speeds up inference by only masking relevant areas, although LaMa expects 512x512 inputs (internal resizing handled).

## Directory Structure

```
Keira/
├── api/                    # Backend Source
│   ├── routes/             # API Endpoints
│   ├── services/           # Business Logic
│   └── main.py             # Entry Point
├── src/                    # Frontend Source
│   ├── components/         # React Components
│   └── store/              # Global State
├── worker/                 # Independent Compute Units
│   └── inpaint_worker.py   # The heavy lifter
└── launchers/              # VBS Scripts for Windows Desktop usage
```

## Data Flow

1.  **Upload:** User uploads video -> Saved to `temp/input.mp4`.
2.  **Config:** User selects ROI on the first frame.
3.  **Process:** User clicks "Start".
    - API runs `ffmpeg -i input.mp4 frames/%06d.png`.
    - API runs `python worker/inpaint_worker.py --frames ... --roi ...`.
    - API monitors stdout of worker for `PROGRESS:XX:YY:ZZ`.
    - API runs `ffmpeg -i processed/%06d.png -i input.mp4 (audio) output.mp4`.
4.  **Download:** User downloads `output.mp4`.

## Lazy Loading Architecture

### React.lazy Code Splitting

The application uses `React.lazy()` for route-based code splitting:

```typescript
// src/components/LazyComponents.tsx
export const VideoUploadLazy = lazy(() =>
  import('./VideoUpload').then((m) => ({ default: m.VideoUpload }))
);
export const ROISelectorLazy = lazy(() =>
  import('./ROISelector').then((m) => ({ default: m.ROISelector }))
);
export const MaskEditorLazy = lazy(() =>
  import('./MaskEditor').then((m) => ({ default: m.MaskEditor }))
);
export const ProcessingViewLazy = lazy(() =>
  import('./ProcessingView').then((m) => ({ default: m.ProcessingView }))
);
```

### SuspenseFallback Component

Unified loading fallback for Suspense boundaries:

- Animated spinner using Lucide `Loader2` icon
- Configurable size (`sm`, `md`, `lg`)
- Custom message support
- Memoized for performance

### Hooks Layer

#### useHotkey

Single hotkey listener with automatic cleanup:
- Supports modifier combinations (`ctrl+enter`, `meta+n`)
- Configurable `preventDefault` and `stopPropagation`
- Enable/disable toggle

#### useKeyboardShortcuts

Multiple shortcuts manager:
- Object mapping of hotkeys to callbacks
- Dynamic registration/unregistration
- Shared options for all shortcuts

## Vite Compression

Production builds include gzip and brotli compression via `vite-plugin-compression`:

```typescript
// vite.config.ts
import compression from 'vite-plugin-compression';

plugins: [
  compression({ algorithm: 'gzip' }),
  compression({ algorithm: 'brotliCompress', ext: '.br' }),
]
```

This reduces bundle size by ~70% for production deployments.
