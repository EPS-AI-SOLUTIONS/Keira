/**
 * Keira - Entry Point
 * Regis Architecture v2.9.0
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'rgba(17, 17, 17, 0.95)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            color: '#e5e5e5',
          },
        }}
      />
    </QueryClientProvider>
  </StrictMode>
);
