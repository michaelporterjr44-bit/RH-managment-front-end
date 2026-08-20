    "use client";
    import React, { useState, useEffect } from 'react';
    import { Employee } from '@/types/employee/employee';
    import { getEmployeesEntity } from '@/api/dashboard/employee-and-user/employees';

    interface EmployeeListProps {
        selectedEmployee: Employee| null;
        onSelectEmployee: (
            employee: Employee | null
        ) => void;
    }

    const EmployeeList: React.FC<EmployeeListProps> = ({
        selectedEmployee,
        onSelectEmployee
    }) => {

        const [employees, setEmployees] = useState<Employee[]>([]);
        const [searchTerm, setSearchTerm] = useState("");
        const [page, setPage] = useState(0);
        const [totalPages, setTotalPages] = useState(0);
        const [loading, setLoading] = useState(false);

        useEffect(() => {

            const loadEmployees = async () => {

                setLoading(true);

                try {

                    const res = await getEmployeesEntity(
                        page,
                        10,
                        searchTerm
                    );

                    setEmployees(res.content);
                    setTotalPages(res.totalPages);

                } finally {

                    setLoading(false);

                }

            };

            loadEmployees();

        }, [page, searchTerm]);

        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                        <div className="relative">
                            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => {
                                    setPage(0);
                                    setSearchTerm(e.target.value);
                                }}
                                placeholder="Rechercher..."
                                className="w-full rounded-lg border border-slate-200 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>
                    </div>

                    {selectedEmployee && (
                        <button
                            onClick={() => onSelectEmployee(null)}
                            className="text-sm text-green-600 hover:text-green-800 transition-colors ml-4"
                        >
                            Effacer la sélection
                        </button>
                    )}
                </div>

                {/* Employé sélectionné */}
                {selectedEmployee && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                        <p className="text-sm text-green-800">
                            <strong>Employé sélectionné :</strong> {selectedEmployee.firstName} {selectedEmployee.lastName}
                        </p>
                    </div>
                )}

                {/* Liste des employés */}
                <div className="space-y-3 max-h-150 overflow-y-auto">
                    {employees.map(employee => (
                        <div
                            key={employee.id}
                            onClick={() => onSelectEmployee(employee)}
                            className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${selectedEmployee?.id === employee.id
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-center space-x-3">
                                <img
                                    src={
                                        employee.imageProfil?.url ||
                                        `https://ui-avatars.com/api/?name=${employee.firstName}+${employee.lastName}`
                                    }
                                    alt={`${employee.lastName} ${employee.firstName}`}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {employee.firstName} {employee.lastName}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {employee.matricule} • {employee.email}
                                    </p>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                            {employee.agence?.name}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {employees.length === 0 && (
                    <div className="text-center py-8">
                        <i className="ri-team-line text-5xl text-gray-300 mb-4"></i>
                        <p className="text-gray-500">Aucun employé disponible</p>
                    </div>
                )}
            </div>
        );
    };

    export default EmployeeList;