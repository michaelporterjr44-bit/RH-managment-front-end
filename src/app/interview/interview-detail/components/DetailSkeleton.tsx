import React from 'react';

export default function DetailSkeleton() {
  return (
    <div className="flex flex-col h-full bg-slate-50 animate-pulse">
      {/* Header skeleton */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 bg-slate-200 rounded-lg flex-shrink-0" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 w-56 bg-slate-200 rounded-md" />
              <div className="h-6 w-20 bg-slate-200 rounded-full" />
              <div className="h-6 w-20 bg-slate-200 rounded-full" />
            </div>
            <div className="h-4 w-80 bg-slate-100 rounded-md" />
          </div>
        </div>
      </div>
      {/* Content skeleton */}
      <div className="flex-1 p-6">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Info card skeleton */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <div className="h-4 w-40 bg-slate-200 rounded-md" />
              <div className="grid grid-cols-2 gap-4">
                {['sk-info-1', 'sk-info-2']?.map((k) => (
                  <div key={k} className="flex gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex-shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-3 w-16 bg-slate-100 rounded" />
                      <div className="h-4 w-32 bg-slate-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="h-px bg-slate-100" />
              {['sk-loc', 'sk-link', 'sk-desc']?.map((k) => (
                <div key={k} className="flex gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex-shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3 w-12 bg-slate-100 rounded" />
                    <div className="h-4 w-48 bg-slate-200 rounded" />
                  </div>
                </div>
              ))}
            </div>

            {/* Candidate card skeleton */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <div className="h-4 w-24 bg-slate-200 rounded-md" />
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-slate-200 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-40 bg-slate-200 rounded-md" />
                  <div className="h-3 w-24 bg-slate-100 rounded" />
                </div>
              </div>
              {['sk-c1', 'sk-c2', 'sk-c3']?.map((k) => (
                <div key={k} className="h-4 w-full bg-slate-100 rounded" />
              ))}
            </div>
          </div>

          {/* Actions skeleton */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
              <div className="h-4 w-20 bg-slate-200 rounded-md" />
              <div className="h-10 w-full bg-slate-100 rounded-lg" />
              <div className="h-10 w-full bg-slate-100 rounded-lg" />
              <div className="h-10 w-full bg-slate-100 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}