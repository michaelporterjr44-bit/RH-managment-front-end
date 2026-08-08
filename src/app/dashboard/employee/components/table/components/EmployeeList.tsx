"use client";
import { useEffect, useState } from "react";
import { getEmployeesPage, getEmployeesInSameAgence, deleteEmployeeByMatricule } from "@/api/dashboard/employee-and-user/employees";
import { getUserProfile } from "@/api/dashboard/employee-and-user/users";
import { EmployeeResponse } from "@/types/employee/employee";
import Pagination from "@/app/components/ui/Pagination";

const EmployeeList: React.FC<{ onEmployeeClick: (employee: EmployeeResponse) => void }> = ({
    onEmployeeClick,
}) => {
    const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [message, setMessage] = useState<string>("");
    const [success, setSuccess] = useState<boolean | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("tous");
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [size, setSize] = useState(8);

    const [employeeToDelete, setEmployeeToDelete] = useState<EmployeeResponse | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [departmentFilter, setDepartmentFilter] = useState<number | "tous">("tous");

    const confirmDelete = (employee: EmployeeResponse) => {
        setEmployeeToDelete(employee);
        setIsConfirmModalOpen(true);
    };

    const loadEmployees = async () => {
        try {
            const profile = await getUserProfile();

            const isAdmin = profile.appRoles.some(
                r => r.roleName === "SUPER ADMIN"
            );

            setIsSuperAdmin(isAdmin);

            const response = await getEmployeesPage(page, size, searchTerm)

            /*const response = isAdmin
                ? await getEmployeesPage(page, size, searchTerm)
                : await getEmployeesInSameAgence(page, size, searchTerm);*/

            setEmployees(response.content ?? []);
            setTotalPages(response.totalPages ?? 0);

        } catch (error) {
            console.error("Erreur lors du chargement :", error);
        }
    };

    useEffect(() => {
        loadEmployees();
    }, [page, size, searchTerm]);
    
    useEffect(() => {
        const interval = setInterval(() => {
            loadEmployees();
        }, 5000);

        return () => clearInterval(interval);
    }, [page, size, searchTerm]);

    useEffect(() => {
        if (message) {
            setShowAlert(true);
            const timeout = setTimeout(() => {
                setShowAlert(false);
                setTimeout(() => {
                    setMessage("");
                    setSuccess(null);
                }, 300);
            }, 2000);
            return () => clearTimeout(timeout);
        }
    }, [message]);

    const handleDeleteConfirmed = async () => {
        if (!employeeToDelete) return;

        try {
            await deleteEmployeeByMatricule(employeeToDelete.matricule);
            setEmployees(prev =>
                prev.filter(emp => emp.matricule !== employeeToDelete.matricule)
            );
            setMessage("Employé supprimé avec succès !");
            setSuccess(true);
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
            setMessage("Une erreur est survenue lors de la suppression.");
            setSuccess(false);
        } finally {
            setIsConfirmModalOpen(false);
            setEmployeeToDelete(null);
        }
    };

    const filteredEmployees = employees.filter(emp => {
        const matchesStatus =
            statusFilter === "tous" ||
            emp.status === statusFilter;

        const matchesDepartment =
            departmentFilter === "tous" ||
            emp.department?.id === departmentFilter;

        return matchesStatus && matchesDepartment;
    });

    const getStatusColor = (status?: string) => {
        const normalized = status?.trim().toLowerCase();

        return normalized === "actif"
            ? "text-green-600 bg-green-100"
            : "text-red-600 bg-red-100";
    };

    const getStatusColorAgence = (name: string) =>
        name === "Agence TNR-Ambohidahy"
            ? "text-xs text-red-700 bg-red-50 py-2 px-4"
            : "text-xs text-red-700 bg-red-50 py-2 px-4";

    return (
        <div className="">
            <div className="w-full mx-auto space-y-6 pb-7">
                {/* Employee Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-3 border-b border-slate-200 bg-green-100/10 rounded-t-xl">
                        <div className="flex justify-between items-center w-full">
                            <div className="flex items-center gap-8 flex-1 max-w-[80%]">
                                <div className="flex items-center space-x-3 whitespace-nowrap">
                                    <i className="ri-user-fill text-green-800 text-2xl"></i>
                                    <h1 className="text-base font-bold text-green-800">Liste des Employés</h1>
                                </div>

                                <div className="relative w-[70%]">
                                    <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setPage(0);
                                        }}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 transition-all outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <table className="min-w-full table-auto">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Employé</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Matricule</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Département</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contact</th>
                                    <th className="px-10 py-4 text-left text-sm font-semibold text-gray-900">Statut</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Agence</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredEmployees.map((employee) => (
                                    <tr
                                        key={employee.id}
                                        className="hover:bg-gray-50 transition-colors duration-150"
                                        onClick={() => onEmployeeClick(employee)}
                                    >
                                        <td className="px-6 py-4 max-w-[400px]">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={
                                                        employee.imageProfilDto?.url ||
                                                        `https://ui-avatars.com/api/?name=${employee.firstName}+${employee.lastName}`
                                                    }
                                                    alt={`${employee.lastName} ${employee.firstName}`}
                                                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
                                                />

                                                <div>
                                                    <div className="font-semibold text-gray-800">
                                                        <h1 className="text-sm uppercase">{employee.firstName}</h1>
                                                        <h1 className="text-xm font-normal">{employee.lastName} </h1>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                                {employee.matricule}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <i className="ri-building-line w-4 h-4 text-gray-400"></i>
                                                <span className="text-gray-900">{employee.department?.libelle}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 max-w-[200px]">
                                            <div className="space-y-1">
                                                <div className="text-sm text-gray-900 truncate">{employee.email}</div>
                                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                                    <i className="ri-phone-line w-3 h-3"></i>
                                                    {employee.phoneNumber}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-medium ${getStatusColor(
                                                    employee.status || "inactif"
                                                )}`}
                                            >
                                                {employee.status || "inactif"}
                                            </span>
                                        </td>
                                        <td className="px-3 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${employee
                                                    ? getStatusColorAgence(employee.agence?.name ?? "")
                                                    : ""
                                                    }`}
                                            >
                                                {employee?.agence?.name ?? "Aucune agence"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {/* Bouton Modifier : Toujours cliquable */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onEmployeeClick(employee);
                                                    }}
                                                    className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-200 group"
                                                    title="Modifier"
                                                >
                                                    <i className="ri-edit-line w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                                                </button>

                                                {/* Bouton Supprimer : Visible pour tous, mais désactivé si pas SUPER ADMIN */}
                                                <button
                                                    disabled={!isSuperAdmin}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (isSuperAdmin) {
                                                            confirmDelete(employee);
                                                        }
                                                    }}
                                                    className={`p-2 rounded-lg transition-colors duration-200 group ${
                                                        isSuperAdmin
                                                            ? "text-red-600 hover:bg-red-100 cursor-pointer"
                                                            : "text-gray-400 opacity-40 cursor-not-allowed"
                                                    }`}
                                                    title={isSuperAdmin ? "Supprimer" : "Action réservée au Super Admin"}
                                                >
                                                    <i className={`ri-delete-bin-line w-4 h-4 ${isSuperAdmin ? "group-hover:scale-110" : ""} transition-transform duration-200`} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {isConfirmModalOpen && employeeToDelete && (
                        <div className="fixed inset-0 bg-gradient-to-br from-blue-100/30 via-white/20 to-purple-100/30 backdrop-blur-sm animate-flow flex items-center justify-center z-50 transition-all duration-300 shadow-xxl">
                            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    Confirmation de suppression
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    Êtes-vous sûr de vouloir supprimer l’employé(e){" "}
                                    <span className="font-semibold">
                                        {employeeToDelete.firstName} {employeeToDelete.lastName}
                                    </span>{" "}
                                    ?
                                </p>
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => setIsConfirmModalOpen(false)}
                                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        onClick={handleDeleteConfirmed}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {message && (
                <div
                    className={`flex items-center gap-2 px-4 py-3 rounded-md mb-4 text-sm shadow-md transition-all duration-300 transform ${showAlert
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-95 pointer-events-none"
                        } ${success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                >
                    <i
                        className={` transition-all duration-300 transform ri-notification-line text-lg ${success ? "text-green-600" : "text-red-600"
                            }`}
                    ></i>
                    <span>{message}</span>
                </div>
            )}
            <div className="flex justify-between items-center bg-gray-50 rounded-b-lg max-w-[60%]">
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    size={size}
                    onPageChange={(newPage) => setPage(newPage)}
                    onSizeChange={(newSize) => setSize(newSize)}
                />
            </div>
        </div>
    );
};

export default EmployeeList;