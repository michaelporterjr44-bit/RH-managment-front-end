'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DepartmentUI } from '@/types/department/department.types';
import DepartmentDetailHeader from './DepartmentDetailHeader';
import EmployeeGrid from './EmployeeGrid';
import DepartmentDetailSkeleton from './DepartmentDetailSkeleton';
import { getDepartmentById } from '@/api/dashboard/department/department';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export default function DepartmentDetailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams?.get('id');

    const [department, setDepartment] = useState<DepartmentUI | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    function normalizeDepartment(data: any): DepartmentUI {
        return {
            id: data.id,
            code: data.code,
            libelle: data.libelle,
            type: data.type,
            employees: Array.isArray(data.employees) ? data.employees : []
        };
    }

    useEffect(() => {
        if (!id) {
            setError('No department ID provided.');
            setIsLoading(false);
            return;
        }

        const fetchDepartment = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const data = await getDepartmentById(Number(id));
                setDepartment(normalizeDepartment(data));

            } catch (err: any) {
                setError(
                    err?.response?.data?.message ||
                    `Department with ID "${id}" was not found.`
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchDepartment();
    }, [id]);

    if (isLoading) {
        return <DepartmentDetailSkeleton />;
    }

    if (error) {
        return (
            <div className="slide-up">
                <button
                    onClick={() => router.push('/department/department-list')}
                    className="flex items-center gap-2 text-sm font-500 text-black-500 hover:text-black-800 transition-colors mb-6 group"
                >
                    <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
                    Back to Departments
                </button>

                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                        <AlertCircle size={18} className="text-red-500" />
                    </div>

                    <div>
                        <h3 className="text-sm font-700 text-red-800 mb-1">
                            Failed to load department
                        </h3>
                        <p className="text-sm text-red-600">{error}</p>

                        <button
                            onClick={() => router.push('/department/department-list')}
                            className="mt-3 text-sm font-600 text-red-700 hover:text-red-900 underline"
                        >
                            Return to department list
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!department) return null;

    const employees = department.employees ?? [];

    return (
        <div className="slide-up">

            {/* Back button */}
            <button
                onClick={() => router.push('/department/department-list')}
                className="flex items-center gap-2 text-sm font-500 text-black-500 hover:text-black-800 mb-6 group"
            >
                <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
                Back to Departments
            </button>

            {/* Header */}
            <DepartmentDetailHeader department={department} />

            {/* Employees section */}
            <div className="mt-8">

                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-lg font-700 text-black-900">
                            Team Members
                        </h2>

                        <p className="text-sm text-black-500 mt-0.5">
                            {employees.length} employee{employees.length !== 1 ? 's' : ''} in this department
                        </p>
                    </div>
                </div>

                {/* 🔥 SAFE GRID */}
                <EmployeeGrid employees={employees} />

            </div>
        </div>
    );
}