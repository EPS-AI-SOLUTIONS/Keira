# Keira - Watermark Remover (Regis Architecture)

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Stack](https://img.shields.io/badge/stack-React_19_+_FastAPI_+_ONNX-green)
![License](https://img.shields.io/badge/license-MIT-purple)

**Keira** is a high-performance, local AI tool designed to remove static watermarks from videos using the LaMa (Large Mask Inpainting) model. It features a modern, glassmorphic UI ("Regis Design") and a robust Python backend orchestrated by agents.

## New in v2.0

- **Lazy Loading:** Code-split components with `React.lazy()` for faster initial load
- **Sonner Toasts:** Modern toast notifications replacing console logs
- **Keyboard Shortcuts:** Global hotkeys via `useHotkey` and `useKeyboardShortcuts` hooks
- **Vite Compression:** Gzip + Brotli compression via `vite-plugin-compression`
- **SuspenseFallback:** Unified loading states with animated spinner
- **Framer Motion:** Smooth animations and transitions

## Features

- **AI Inpainting:** Uses `LaMa` model via ONNX Runtime (CPU/CUDA support).
- **Smart Processing:**
  - Automated frame extraction (FFmpeg).
  - ROI (Region of Interest) based masking.
  - Multi-threaded IO operations.
- **Modern UI:** React 19 + Tailwind 4 (Glassmorphism).
- **Privacy First:** All processing happens locally. No cloud uploads.
- **Performance:** Lazy loading, code splitting, and bundle compression.

## 🛠️ Architecture

### Frontend (`src/`)
- **React 19.2**: Latest concurrent features with Suspense.
- **Zustand 5.0**: Atomic state management.
- **Tailwind 4.1**: CSS-first styling engine.
- **Vite 7.3**: Next-gen bundler with compression plugins.
- **Sonner 2.0**: Toast notification system.
- **Framer Motion 12**: Animation library.
- **TanStack Query 5**: Server state management.

### Backend (`api/`)
- **FastAPI**: High-performance Async Python web server.
- **Uvicorn**: ASGI Server.
- **OpenCV + ONNX**: Image processing pipeline.

### Worker (`worker/`)
- **Independent Process**: The actual inpainting logic runs in a separate process (`inpaint_worker.py`) to avoid blocking the API main loop.
- **IPC**: Communication via stdout parsing (Progress reporting).

## 📦 Installation

### Prerequisites
- Node.js 20+
- Python 3.10+
- FFmpeg (in PATH)
- pnpm

### Setup

1.  **Clone & Install Frontend:**
    ```bash
    git clone https://github.com/your-repo/keira.git
    cd keira
    pnpm install
    ```

2.  **Install Backend:**
    ```bash
    pip install -r api/requirements.txt
    pip install -r worker/requirements.txt
    ```

3.  **Model Setup:**
    Download `lama_fp32.onnx` and place it in `models/`.

## 🏃‍♂️ Usage

```bash
# Start both Frontend & Backend
pnpm start
```

Access the UI at `http://localhost:5175`.

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the "Regis" code standards.

---
**Author:** Pawel Serkowski
**Architecture:** Regis v2.9.0
