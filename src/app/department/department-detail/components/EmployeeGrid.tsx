'use client';

import React, { useState, useEffect } from 'react';
import { Employee } from '@/types/employee/employee';
import { Users, Briefcase, Hash } from 'lucide-react';
import Pagination from '@/app/components/ui/Pagination';

interface Props {
  employees: Employee[];
}

function EmployeeCard({ employee }: { employee: Employee }) {
  const fullName = `${employee.firstName ?? ''} ${employee.lastName ?? ''}`.trim();
  // Fallback propre et unifié avec ui-avatars
  const avatarUrl = employee.imageProfil?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.firstName ?? '')}+${encodeURIComponent(employee.lastName ?? '')}&background=f1f5f9&color=475569`;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:shadow-slate-100 hover:-translate-y-0.5 transition-all duration-200 cursor-default">
      {/* Avatar & Identité */}
      <div className="flex flex-col items-center text-center mb-4">
        <div className="relative mb-3">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md ring-2 ring-slate-100 group-hover:ring-indigo-100 transition-all duration-200">
            <img
              src={avatarUrl}
              alt={`Profile photo of ${fullName}`}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Online indicator */}
          <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
        </div>

        <h3 className="text-sm font-700 text-slate-900 leading-tight mb-0.5 group-hover:text-indigo-700 transition-colors duration-150">
          {fullName}
        </h3>

        {employee.function && (
          <p className="text-xs text-slate-500 font-500 leading-tight">
            {employee.function}
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-slate-100 my-3" />

      {/* Metadata */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Hash size={12} className="text-slate-400 flex-shrink-0" />
          <span className="text-xs text-slate-500 font-500">Matricule</span>
          <span className="ml-auto text-xs font-700 text-slate-700 font-mono tabular-nums bg-slate-50 px-1.5 py-0.5 rounded-md">
            {employee.matricule}
          </span>
        </div>
        {employee.function && (
          <div className="flex items-center gap-2">
            <Briefcase size={12} className="text-slate-400 flex-shrink-0" />
            <span className="text-xs text-slate-500 font-500 truncate">{employee.function}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyEmployees() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white rounded-2xl border border-slate-200 border-dashed">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <Users size={24} className="text-slate-400" />
      </div>
      <h3 className="text-base font-600 text-slate-700 mb-1">No employees assigned</h3>
      <p className="text-sm text-slate-400 max-w-xs">
        This department does not have any employees yet. Assign employees to this department to see them here.
      </p>
    </div>
  );
}

export default function EmployeeGrid({ employees }: Props) {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setCurrentPage(0);
  }, [employees.length]);

  if (employees.length === 0) {
    return <EmptyEmployees />;
  }

  const totalPages = Math.ceil(employees.length / pageSize);
  const startIndex = currentPage * pageSize;
  const paginatedEmployees = employees.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-3 w-full"> 
      {/* Grille responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {paginatedEmployees.map((emp, i) => (
          <EmployeeCard key={emp.id ?? `emp-card-${i + 1}`} employee={emp} />
        ))}
      </div>

      {/* Barre de pagination raccordée de manière fluide */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          size={pageSize}
          onPageChange={(newPage) => setCurrentPage(newPage)}
          onSizeChange={(newSize) => setPageSize(newSize)}
        />
      </div>
    </div>
  );
}