'use client';

import { Toaster } from 'sonner';

export default function Toast() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '14px',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)',
        },
        classNames: {
          success: 'bg-white text-slate-900',
          error: 'bg-white text-slate-900',
        },
      }}
      richColors
    />
  );
}