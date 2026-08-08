'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Building2, Loader2 } from 'lucide-react';
import { DepartmentUI as Department, CreateDepartmentRequest, DEPARTMENT_TYPES } from '@/types/department/department.types';

interface DepartmentModalProps {
    isOpen: boolean;
    department: Department | null;
    onSave: (data: CreateDepartmentRequest) => void;
    onClose: () => void;
}

interface FormValues {
    code: string;
    libelle: string;
    type: string;
}

export default function DepartmentModal({
    isOpen,
    department,
    onSave,
    onClose,
}: DepartmentModalProps) {
    const isEditing = !!department;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        defaultValues: {
            code: '',
            libelle: '',
            type: 'Salarié',
        },
    });

    useEffect(() => {
        if (isOpen) {
            if (department) {
                reset({ code: department.code, libelle: department.libelle, type: department.type });
            } else {
                reset({ code: '', libelle: '', type: 'Salarié' });
            }
        }
    }, [isOpen, department, reset]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const onSubmit = (data: FormValues) => {
        onSave(data);
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
            style={{ backgroundColor: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(3px)' }}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="modal-content bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-100 overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
                    <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                        <Building2 size={17} className="text-green-600" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-base font-700 text-slate-900">
                            {isEditing ? 'Edit Department' : 'Create Department'}
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                            {isEditing
                                ? `Editing "${department?.libelle}"`
                                : 'Add a new department to your organization'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors duration-150 active:scale-90"
                        aria-label="Close modal"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="px-6 py-5 space-y-5">
                        {/* Code field */}
                        <div>
                            <label htmlFor="dept-code" className="block text-sm font-600 text-slate-700 mb-1.5">
                                Department Code
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <p className="text-xs text-slate-400 mb-2">
                                A short unique identifier (e.g., ENG-001, HR-002)
                            </p>
                            <input
                                id="dept-code"
                                type="text"
                                placeholder="e.g. ENG-001"
                                {...register('code', {
                                    required: 'Department code is required',
                                    minLength: { value: 2, message: 'Code must be at least 2 characters' },
                                    maxLength: { value: 20, message: 'Code cannot exceed 20 characters' },
                                    pattern: {
                                        value: /^[A-Za-z0-9\-_]+$/,
                                        message: 'Only letters, numbers, hyphens and underscores allowed',
                                    },
                                })}
                                className={`w-full px-3.5 py-2.5 text-sm border rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all duration-150 font-mono ${errors.code
                                    ? 'border-red-300 bg-red-50/30 focus:ring-red-200 focus:border-red-400' : 'border-slate-200 bg-white focus:ring-green-500/20 focus:border-green-400'
                                    }`}
                            />
                            {errors.code && (
                                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                    <span>⚠</span> {errors.code.message}
                                </p>
                            )}
                        </div>

                        {/* Libelle field */}
                        <div>
                            <label htmlFor="dept-libelle" className="block text-sm font-600 text-slate-700 mb-1.5">
                                Department Name
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <p className="text-xs text-slate-400 mb-2">
                                The full display name of this department
                            </p>
                            <input
                                id="dept-libelle"
                                type="text"
                                placeholder="e.g. Engineering, Human Resources"
                                {...register('libelle', {
                                    required: 'Department name is required',
                                    minLength: { value: 2, message: 'Name must be at least 2 characters' },
                                    maxLength: { value: 80, message: 'Name cannot exceed 80 characters' },
                                })}
                                className={`w-full px-3.5 py-2.5 text-sm border rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all duration-150 ${errors.libelle
                                    ? 'border-red-300 bg-red-50/30 focus:ring-red-200 focus:border-red-400' : 'border-slate-200 bg-white focus:ring-green-500/20 focus:border-green-400'
                                    }`}
                            />
                            {errors.libelle && (
                                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                    {DEPARTMENT_TYPES.map((t) => (
                                        <option key={`type-opt-${t}`} value={t}>
                                            {t}
                                        </option>
                                    ))}
                                    <span>⚠</span> {errors.libelle.message}
                                </p>
                            )}
                        </div>

                        {/* Type field */}
                        <div>
                            <label htmlFor="dept-type" className="block text-sm font-600 text-slate-700 mb-1.5">
                                Department Type
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <p className="text-xs text-slate-400 mb-2">
                            
                            </p>
                            <select
                                id="dept-type"
                                {...register('type', { required: 'Please select a department type' })}
                                className={`w-full px-3.5 py-2.5 text-sm rounded-xl text-slate-800 focus:outline-none focus:ring-2 transition-all duration-150 appearance-none bg-white cursor-pointer ${errors.type
                                    ? 'border-red-300 bg-red-50/30 focus:ring-red-200 focus:border-red-400' : 'border-slate-200 focus:ring-green-500/20 focus:border-green-400'
                                    }`}
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 12px center',
                                    paddingRight: '36px',
                                }}
                            >
                                <option value="">-- Select type --</option>

                                {DEPARTMENT_TYPES.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                            {errors.type && (
                                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                    <span>⚠</span> {errors.type.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2.5 text-sm font-600 text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-all duration-150 disabled:opacity-50 active:scale-95"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2.5 text-sm font-600 text-white bg-green-800 hover:bg-green-900 rounded-xl shadow-sm shadow-green-200 transition-all duration-150 disabled:opacity-60 active:scale-95 flex items-center justify-center gap-2 min-w-0"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={14} className="animate-spin flex-shrink-0" />
                                    <span>{isEditing ? 'Saving...' : 'Creating...'}</span>
                                </>
                            ) : (
                                <span>{isEditing ? 'Save Changes' : 'Create Department'}</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}