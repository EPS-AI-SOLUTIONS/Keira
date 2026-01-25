import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import viteCompression from 'vite-plugin-compression';

const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        // Gzip compression for production
        isProd && viteCompression({
            algorithm: 'gzip',
            threshold: 1024,
            deleteOriginFile: false,
        }),
        // Brotli compression for production
        isProd && viteCompression({
            algorithm: 'brotliCompress',
            threshold: 1024,
            deleteOriginFile: false,
        }),
    ].filter(Boolean),
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
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: isProd,
                drop_debugger: isProd,
            },
        },
        cssCodeSplit: true,
        sourcemap: !isProd,
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
