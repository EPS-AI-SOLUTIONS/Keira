import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import viteCompression from 'vite-plugin-compression';

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Gzip compression
    ...(isProduction
      ? [
          viteCompression({
            algorithm: 'gzip',
            ext: '.gz',
            threshold: 1024,
          }),
          // Brotli compression
          viteCompression({
            algorithm: 'brotliCompress',
            ext: '.br',
            threshold: 1024,
          }),
        ]
      : []),
  ],
  base: './',
  server: {
    port: 5175,
    host: '0.0.0.0',
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8002',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-ui': ['framer-motion', 'lucide-react', 'clsx', 'tailwind-merge'],
          'vendor-state': ['zustand', '@tanstack/react-query'],
          'vendor-utils': ['uuid', 'zod'],
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
});
