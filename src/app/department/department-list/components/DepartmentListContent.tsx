'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Plus, Search, Building2 } from 'lucide-react';
import { DepartmentUI as Department } from '@/types/department/department.types';
import DepartmentTable from './DepartmentTable';
import DepartmentModal from './DepartmentModal';
import DepartmentTableSkeleton from './DepartmentTableSkeleton';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import {
    getAllDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment
} from '@/api/dashboard/department/department';

export const extractDepartments = (response: any) => {
    return response?._embedded?.departments ?? [];
};

export default function DepartmentListContent() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
    const [deletingDepartment, setDeletingDepartment] = useState<Department | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [highlightedId, setHighlightedId] = useState<number | null>(null);

    useEffect(() => {

    const timeout = setTimeout(async () => {

        try {

            setIsLoading(true);

            const data = await getAllDepartments(searchQuery);

            setDepartments(data);

        } catch (error) {

            toast.error("Failed to load departments");
            console.error(error);

        } finally {

            setIsLoading(false);

        }

    }, 300);

    return () => clearTimeout(timeout);

}, [searchQuery]);

    const handleCreateDepartment = useCallback(() => {
        setEditingDepartment(null);
        setIsModalOpen(true);
    }, []);

    const handleEditDepartment = useCallback((dept: Department) => {
        setEditingDepartment(dept);
        setIsModalOpen(true);
    }, []);

    const handleDeleteRequest = useCallback((dept: Department) => {
        setDeletingDepartment(dept);
    }, []);

    const handleModalSave = useCallback(
        async (data: { code: string; libelle: string; type: string }) => {
            try {
                if (editingDepartment?.id) {

                    const updated = await updateDepartment(editingDepartment.id, data);

                    setDepartments((prev) =>
                        prev.map((d) =>
                            d.id === editingDepartment.id ? updated : d
                        )
                    );

                    toast.success("Department updated");

                } else {

                    const created = await createDepartment(data);

                    setDepartments((prev) => [created, ...prev]);

                    toast.success("Department created");
                }

                setIsModalOpen(false);
                setEditingDepartment(null);

            } catch (error) {
                toast.error("Operation failed");
                console.error(error);
            }
        },
        [editingDepartment]
    );

    const handleConfirmDelete = useCallback(async () => {
        if (!deletingDepartment?.id) return;

        try {
            setIsDeleting(true);

            await deleteDepartment(deletingDepartment.id);

            setDepartments((prev) =>
                prev.filter((d) => d.id !== deletingDepartment.id)
            );

            toast.success(`Department deleted`);

        } catch (error) {
            toast.error("Failed to delete department");
            console.error(error);
        } finally {
            setIsDeleting(false);
            setDeletingDepartment(null);
        }
    }, [deletingDepartment]);

    return (
        <div className="slide-up">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2.5 mb-1">
                        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                            <Building2 size={16} className="text-green-600" />
                        </div>
                        <h1 className="text-2xl font-700 text-slate-900 tracking-tight">Departments</h1>
                    </div>
                    <p className="text-sm text-slate-500 pl-10">
                        {isLoading ? 'Loading...' : `${departments.length} department${departments.length !== 1 ? 's' : ''} in your organization`}
                    </p>
                </div>
                <button
                    onClick={handleCreateDepartment}
                    className="flex items-center gap-2 px-4 py-2.5 bg-green-700 hover:bg-green-800 text-white text-sm font-600 rounded-xl shadow-sm shadow-green-200 transition-all duration-150 active:scale-95 whitespace-nowrap"
                >
                    <Plus size={16} />
                    Create Department
                </button>
            </div>

            {/* Search + filter bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <div className="relative flex-1 max-w-sm">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search by code or name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-green-800 transition-all duration-150"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-500">
                        {departments.length} result{departments.length !== 1 ? 's' : ''}
                    </span>
                </div>
            </div>

            {/* Table */}
            <div className="">
                {isLoading ? (
                    <DepartmentTableSkeleton />
                ) : (
                    <DepartmentTable
                        departments={departments}
                        searchQuery={searchQuery}
                        highlightedId={highlightedId}
                        onEdit={handleEditDepartment}
                        onDelete={handleDeleteRequest}
                    />
                )}
            </div>

            {/* Create / Edit Modal */}
            <DepartmentModal
                isOpen={isModalOpen}
                department={editingDepartment}
                onSave={handleModalSave}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingDepartment(null);
                }}
            />

            {/**/}
            <ConfirmDialog
                isOpen={!!deletingDepartment}
                title={`Delete "${deletingDepartment?.libelle}"?`}
                description={`This will permanently remove the department "${deletingDepartment?.libelle}" (${deletingDepartment?.code}) and all its associations. This action cannot be undone.`}
                confirmLabel="Delete Department"
                cancelLabel="Keep Department"
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeletingDepartment(null)}
                isLoading={isDeleting}
                variant="danger"
            />
        </div>
    );
}