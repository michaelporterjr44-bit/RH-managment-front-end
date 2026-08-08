'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Employee } from '@/types/employee/employee';
import { DepartmentUI as Department } from '@/types/department/department.types';
import { Pencil, Trash2, Building2 } from 'lucide-react';
import AppImage from '../../components/ui/AppImage';
import { getDepartmentById } from '@/api/dashboard/department/department';
import Pagination from '@/app/components/ui/Pagination'; 

interface DepartmentTableProps {
    departments: Department[];
    searchQuery: string;
    highlightedId: number | null;
    onEdit: (dept: Department) => void;
    onDelete: (dept: Department) => void;
}

function TypeBadge({ type }: { type: string }) {
    const styles =
        type === 'Salarié' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-slate-100 text-slate-600 border border-slate-200';
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-[600] ${styles}`}>
            {type}
        </span>
    );
}

function EmployeeAvatarStack({ employees }: { employees: Employee[] }) {
    const MAX_VISIBLE = 3;
    const visible = employees.slice(0, MAX_VISIBLE);
    const overflow = employees.length - MAX_VISIBLE;

    if (employees.length === 0) {
        return <span className="text-xs italic text-slate-400">No employees</span>;
    }

    return (
        <div className="flex items-center gap-1.5">
            <div className="flex -space-x-2 avatar-stack group">
                {visible.map((emp, i) => {
                    const fullName = `${emp.firstName} ${emp.lastName}`;
                    const avatarFallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.firstName)}+${encodeURIComponent(emp.lastName)}&background=f1f5f9&color=475569`;
                    
                    return (
                        <div
                            key={emp.id ?? `avatar-${i}`}
                            className="avatar-item relative w-8 h-8 rounded-full border-2 border-white overflow-hidden cursor-default"
                            style={{ zIndex: MAX_VISIBLE - i }}
                            title={fullName}
                        >
                            <AppImage
                                src={emp.imageProfil?.url || avatarFallbackUrl}
                                alt={`Profile photo of ${fullName}`}
                                width={32}
                                height={32}
                                className="w-full h-full object-cover"
                                unoptimized
                            />
                            <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap bg-slate-900 text-white text-[11px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-lg">
                                {fullName}
                            </span>
                        </div>
                    );
                })}
            </div>
            {overflow > 0 && (
                <span className="w-8 h-8 rounded-full border-2 border-white bg-green-100 text-green-600 text-[11px] font-[700] flex items-center justify-center tabular-nums shadow-sm">
                    +{overflow}
                </span>
            )}
            <span className="text-xs text-green-400 ml-1 tabular-nums">
                {employees.length}
            </span>
        </div>
    );
}

function EmptyState({ hasSearch }: { hasSearch: boolean }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white rounded-lg border border-slate-100 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mb-4">
                <Building2 size={24} className="text-green-700" />
            </div>
            <h3 className="text-base font-[600] mb-1">
                {hasSearch ? 'No departments found' : 'No departments yet'}
            </h3>
            <p className="text-sm text-slate-500 max-w-xs italic">
                {hasSearch
                    ? 'Try adjusting your search query — no departments match your current filter.' 
                    : 'Your organization has no departments configured. Create your first department to get started.'}
            </p>
        </div>
    );
}

export default function DepartmentTable({
    departments,
    searchQuery,
    highlightedId,
    onEdit,
    onDelete,
}: DepartmentTableProps) {
    const router = useRouter();
    const [deptEmployees, setDeptEmployees] = useState<Record<number, Employee[]>>({});
    
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        setCurrentPage(0);
    }, [departments.length, searchQuery]);

    useEffect(() => {
        const loadEmployees = async () => {
            const map: Record<number, Employee[]> = {};

            await Promise.all(
                departments.map(async (d) => {
                    try {
                        const res = await getDepartmentById(d.id);
                        map[d.id] = res.employees ?? [];
                    } catch (error) {
                        console.error(`Failed to fetch employees for dept ${d.id}:`, error);
                        map[d.id] = [];
                    }
                })
            );

            setDeptEmployees(map);
        };

        if (departments.length > 0) loadEmployees();
    }, [departments]);

    if (departments.length === 0) {
        return <EmptyState hasSearch={!!searchQuery} />;
    }

    const handleRowClick = (dept: Department, e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest('[data-action]')) return;
        if (!dept?.id) return;

        router.push(`/department/department-detail?id=${dept.id}`);
    };

    const totalPages = Math.ceil(departments.length / pageSize);
    const startIndex = currentPage * pageSize;
    const paginatedDepartments = departments.slice(startIndex, startIndex + pageSize);

    return (
        <div className="space-y-3 w-full">   
            {/* Conteneur de la Table uniquement */}
            <div className="w-full bg-white rounded-lg shadow-sm border border-slate-100">
                <div className="overflow-x-auto scrollbar-thin">
                    <table className="w-full min-w-[640px]">
                        <thead>
                            <tr className="border-b border-green-100">
                                <th className="px-5 py-3.5 text-left text-[11px] font-[600] uppercase tracking-wider text-slate-400">
                                    Code
                                </th>
                                <th className="px-5 py-3.5 text-left text-[11px] font-[600] uppercase tracking-wider text-slate-400">
                                    Department Name
                                </th>
                                <th className="px-5 py-3.5 text-left text-[11px] font-[600] uppercase tracking-wider text-slate-400">
                                    Type
                                </th>
                                <th className="px-5 py-3.5 text-left text-[11px] font-[600] uppercase tracking-wider text-slate-400">
                                    Employees
                                </th>
                                <th className="px-5 py-3.5 text-right text-[11px] font-[600] uppercase tracking-wider text-slate-400">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {paginatedDepartments.map((dept) => {
                                const isHighlighted = highlightedId === dept.id;
                                return (
                                    <tr
                                        key={`dept-row-${dept.id}`}
                                        onClick={(e) => handleRowClick(dept, e)}
                                        className={`
                                            group cursor-pointer transition-all duration-200
                                            ${isHighlighted ? 'bg-green-50/60' : 'hover:bg-slate-50/80'}
                                        `}
                                    >
                                        <td className="px-5 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-[700] rounded-lg tracking-wide tabular-nums font-mono">
                                                {dept.code}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                                                    <Building2 size={14} className="text-green-700" />
                                                </div>
                                                <span className="text-sm font-[600] text-slate-800 group-hover:text-green-700 transition-colors duration-150">
                                                    {dept.libelle}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <TypeBadge type={dept.type} />
                                        </td>

                                        <td className="px-5 py-4">
                                            <EmployeeAvatarStack employees={deptEmployees[dept.id] ?? []} />
                                        </td>

                                        <td className="px-5 py-4">
                                            {/* L'opacité 0 au survol a été retirée pour laisser les icônes visibles en permanence */}
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    data-action="edit"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onEdit(dept);
                                                    }}
                                                    title={`Edit ${dept.libelle}`}
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-green-600 hover:bg-green-50 transition-all duration-150 active:scale-90"
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                                <button
                                                    data-action="delete"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDelete(dept);
                                                    }}
                                                    title={`Delete ${dept.libelle} — this cannot be undone`}
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all duration-150 active:scale-90"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/**/}
            <div>
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