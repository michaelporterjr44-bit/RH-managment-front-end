import React from 'react';
import { DepartmentDetail } from '@/types/department/department.types';
import { Building2, Users, Tag } from 'lucide-react';

interface Props {
  department: DepartmentDetail;
}

function TypeBadge({ type }: { type: string }) {
  const styles =
    type === 'Salarié' ? 'bg-green-100 text-black-700 border border-green-100' : 'bg-green-100 text-black-600 border border-green-200';
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-600 ${styles}`}>
      <Tag size={11} />
      {type}
    </span>
  );
}

export default function DepartmentDetailHeader({ department }: Props) {
  const employees = department.employees ?? [];
  return (
    <div className="bg-white rounded-2xl border-black-200 shadow-sm overflow-hidden">
      {/* Color strip */}
      <div className="h-1.5 bg-green-700 to-cyan-400" />

      <div className="px-8 py-7">
        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          {/* Department icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center flex-shrink-0 shadow-sm">
            <Building2 size={28} className="text-green-700" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5 mb-2">
              <span className="inline-flex items-center px-2.5 py-1 bg-green-100 text-black-500 text-xs font-700 rounded-lg tracking-wide font-mono">
                {department.code}
              </span>
              <TypeBadge type={department.type} />
            </div>
            <h1 className="text-2xl font-700 text-black-900 tracking-tight mb-1">
              {department.libelle}
            </h1>
            <div className="flex items-center gap-1.5 text-sm text-black-500">
              <Users size={14} className="text-black-400" />
              <span>
                {(department?.employees ?? []).length} team member{(department?.employees ?? []).length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Stats pills */}
          <div className="flex gap-3 flex-shrink-0">
            <div className="text-center px-4 py-3 bg-green-100 rounded-xl border border-green-100">
              <p className="text-xl font-700 text-black-900 tabular-nums">{(department?.employees ?? []).length}</p>
              <p className="text-xs text-black-400 font-500 mt-0.5">Employees</p>
            </div>
            <div className="text-center px-4 py-3 bg-green-100 rounded-xl border border-green-100">
              <p className="text-xl font-700 text-black-700 tabular-nums">
                {
                  new Set(employees.map((e) => e.function).filter(Boolean)).size
                }
              </p>
              <p className="text-xs text-black-400 font-500 mt-0.5">Roles</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}