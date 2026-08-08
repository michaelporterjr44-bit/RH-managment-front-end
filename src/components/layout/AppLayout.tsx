"use client";

import React from 'react';
import Sidebar from './Sidebar';
import useAuthWatcher from '@/app/hooks/useAuthWatcher';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  useAuthWatcher();
  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}