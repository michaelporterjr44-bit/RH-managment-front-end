'use client';

import { Toaster } from 'sonner';

export default function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '14px',
          borderRadius: '10px',
          border: '',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        },
        classNames: {
          success: 'border-green-200 bg-green-50 text-green-800',
          error: 'border-red-200 bg-red-50 text-red-800',
        },
      }}
      richColors
    />
  );
}