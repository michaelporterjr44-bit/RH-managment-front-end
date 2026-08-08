import React from 'react';

export default function DepartmentTableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr className="border-b border-slate-100">
            {['Code', 'Department Name', 'Type', 'Employees', 'Actions']?.map((col) => (
              <th key={`skel-head-${col}`} className="px-5 py-3.5 text-left">
                <div className="skeleton-pulse h-3 w-16 rounded" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {Array.from({ length: 6 })?.map((_, i) => (
            <tr key={`skel-row-${i + 1}`} className="animate-pulse">
              {/* Code */}
              <td className="px-5 py-4">
                <div className="skeleton-pulse h-6 w-20 rounded-lg" />
              </td>
              {/* Name */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="skeleton-pulse w-8 h-8 rounded-lg flex-shrink-0" />
                  <div className="skeleton-pulse h-4 w-32 rounded" />
                </div>
              </td>
              {/* Type */}
              <td className="px-5 py-4">
                <div className="skeleton-pulse h-5 w-16 rounded-full" />
              </td>
              {/* Employees */}
              <td className="px-5 py-4">
                <div className="flex -space-x-2">
                  {Array.from({ length: 3 })?.map((_, j) => (
                    <div key={`skel-avatar-${i + 1}-${j + 1}`} className="skeleton-pulse w-8 h-8 rounded-full border-2 border-white" />
                  ))}
                </div>
              </td>
              {/* Actions */}
              <td className="px-5 py-4">
                <div className="flex items-center justify-end gap-2">
                  <div className="skeleton-pulse w-8 h-8 rounded-lg" />
                  <div className="skeleton-pulse w-8 h-8 rounded-lg" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}