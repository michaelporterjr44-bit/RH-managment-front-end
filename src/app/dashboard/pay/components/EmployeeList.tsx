"use client";
import React, { useState, useMemo } from 'react';
import { ModelPay, StatusModelPaye } from '@/types/pay/pay';
import SearchInput from '@/app/components/ui/SearchInput';
import Pagination from '@/app/components/ui/Pagination';
import DownloadAllPayslipButton from './fiche-de-pay/LoadAllFilesButton';

interface EmployeeListProps {

    employees: ModelPay[];

    searchTerm: string;

    onSearchChange: (value: string) => void;

    page: number;

    totalPages: number;

    size: number;

    onPageChange: (page: number) => void;

    onSizeChange: (size: number) => void;

    onSelectEmployee: (employee: ModelPay) => void;

    onUpdateEmployee: (
        employee: ModelPay,
        openDetail?: boolean
    ) => void;
    searchLoading: boolean;
}

const EmployeeList = ({
    employees,
    searchTerm,
    onSearchChange,
    page,
    totalPages,
    size,
    onPageChange,
    onSizeChange,
    onSelectEmployee,
    onUpdateEmployee,
    searchLoading
}: EmployeeListProps) => {
    const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
    const [calculatingEmployees, setCalculatingEmployees] = useState<string[]>([]);

    const SkeletonLoader = () => (
        <div className="animate-pulse flex items-center">
            <div className="h-4 bg-gray-300 rounded w-20"></div>
            <i className="ri-loader-4-line w-4 h-4 ml-2 animate-spin text-green-600"></i>
        </div>
    );

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MGA', minimumFractionDigits: 0 }).format(amount);

    const getStatusBadge = (status: string) => {
        if (status === StatusModelPaye.VALIDE) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <i className="ri-check-line w-3 h-3 mr-1"></i> Validé
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <i className="ri-time-line w-3 h-3 mr-1"></i> En cours
                </span>
            );
        }
    };
    return (
        <div>
            <div className="rounded-xl shadow-sm border border-gray-200 p-4 space-y-4">
                {/* Header + Recherche + Sélection */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Liste des employés</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {employees.filter(emp => emp.status === StatusModelPaye.VALIDE).length} sur {employees.length} employés validés
                        </p>
                    </div>

                    <div className="flex items-center space-x-4">
                        <SearchInput
                            value={searchTerm}
                            onChange={onSearchChange}
                            placeholder="Rechercher un employé..."
                        />
                    </div>
                </div>

                {/* Tableau */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employé</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agence</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Salaire de base</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net à payer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {employees.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="py-10 text-center text-gray-500"
                                    >
                                        Aucun employé trouvé.
                                    </td>
                                </tr>
                            ) :
                                (employees.map(emp => (
                                    <tr key={emp.id} className="hover:bg-gray-50 transition-colors duration-200">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <img
                                                    className="h-10 w-10 rounded-full object-cover"
                                                    src={emp.employee.imageProfil?.url ||
                                                        `https://ui-avatars.com/api/?name=${emp.employee.firstName}+${emp.employee.lastName}`}
                                                    alt=""
                                                />
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {emp.employee.firstName} {emp.employee.lastName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">{emp.employee.function || '-'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {emp.employee.agence?.name || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                                            {emp.salaireBase?.baseSalaire ?? 0} MGA
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium">
                                            {calculatingEmployees.includes(emp.id) ? <SkeletonLoader /> :
                                                emp.netAPayer > 0 ? <span className="text-green-600">{formatCurrency(emp.netAPayer)}</span> :
                                                    <span className="text-gray-400">—</span>
                                            }
                                        </td>
                                        <td className="px-6 py-4">{getStatusBadge(emp.status)}</td>
                                        <td className="px-6 py-4 text-sm font-medium space-x-2">
                                            <button
                                                onClick={() => onSelectEmployee(emp)}
                                                className="inline-flex items-center p-1.5 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                                title="Voir détail"
                                            >
                                                <i className="ri-eye-line w-4 h-4"></i>
                                            </button>
                                            <button
                                                className="inline-flex items-center p-1.5 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                                title="Imprimer"
                                            >
                                                <i className="ri-printer-line w-4 h-4"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                                )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="mt-4">
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    size={size}
                    onPageChange={onPageChange}
                    onSizeChange={onSizeChange}
                />
            </div>
        </div>
    );
};

export default EmployeeList;