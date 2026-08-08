import React from 'react';

export default function DepartmentDetailSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Back button skeleton */}
      <div className="skeleton-pulse h-5 w-36 rounded mb-6" />
      {/* Header card skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-1.5 skeleton-pulse" />
        <div className="px-8 py-7">
          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
            <div className="skeleton-pulse w-16 h-16 rounded-2xl flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="flex gap-2">
                <div className="skeleton-pulse h-6 w-20 rounded-lg" />
                <div className="skeleton-pulse h-6 w-16 rounded-full" />
              </div>
              <div className="skeleton-pulse h-7 w-52 rounded" />
              <div className="skeleton-pulse h-4 w-32 rounded" />
            </div>
            <div className="flex gap-3">
              <div className="skeleton-pulse w-20 h-16 rounded-xl" />
              <div className="skeleton-pulse w-20 h-16 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
      {/* Section header skeleton */}
      <div className="mt-8 mb-5">
        <div className="skeleton-pulse h-5 w-32 rounded mb-1.5" />
        <div className="skeleton-pulse h-4 w-24 rounded" />
      </div>
      {/* Employee grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {Array.from({ length: 6 })?.map((_, i) => (
          <div key={`emp-skel-${i + 1}`} className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex flex-col items-center mb-4">
              <div className="skeleton-pulse w-16 h-16 rounded-full mb-3" />
              <div className="skeleton-pulse h-4 w-28 rounded mb-1.5" />
              <div className="skeleton-pulse h-3 w-20 rounded" />
            </div>
            <div className="border-t border-slate-100 my-3" />
            <div className="space-y-2">
              <div className="skeleton-pulse h-3 w-full rounded" />
              <div className="skeleton-pulse h-3 w-3/4 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}