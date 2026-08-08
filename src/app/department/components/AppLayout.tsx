'use client';

import React from 'react';
import Sidebar from './Sidebar';
import useAuthWatcher from '@/app/hooks/useAuthWatcher';

interface AppLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
      useAuthWatcher();
    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <main className="flex-1 min-w-0 overflow-auto">
                <div className="px-6 lg:px-8 xl:px-10 py-8">
                    {children}
                </div>
            </main>
        </div>
    );
}