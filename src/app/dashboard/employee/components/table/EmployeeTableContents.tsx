import React, { useEffect, useState } from "react";
import EmployeeList from "./components/EmployeeList";
import EmployeeProfile from "./components/EmployeeProfile";
import type { Employee, Agence, EmployeeProfileResponse } from "@/types/employee/employee";
import { EmployeeResponse, UpdateEmployeeDTO } from "@/types/employee/employee";
import { fetchAgencies } from "@/api/dashboard/agency/agency";
import { getEmployeeByMatricule } from "@/api/dashboard/employee-and-user/employees";

const initialEmployees: EmployeeResponse[] = [];

function EmployeePageContent() {
    const [employees, setEmployees] = useState<EmployeeResponse[]>(initialEmployees);
    const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeProfileResponse | null>(null);
    const [view, setView] = useState<"list" | "profile">("list");
    const [agencies, setAgencies] = useState<Agence[]>([]);

    // Récupération des agences depuis l'API
    useEffect(() => {
        const getAgencies = async () => {
            try {
                const data = await fetchAgencies();
                setAgencies(data);
            } catch (err) {
                console.error("Erreur fetch agences:", err);
            }
        };
        getAgencies();
    }, []);

const handleEmployeeClick = async (
    employee: EmployeeResponse
) => {

    try {

        const profile = await getEmployeeByMatricule(
            employee.matricule
        );

        setSelectedEmployee(profile);

        setView("profile");

    } catch (error) {

        console.error(error);

    }
};

    const handleBackToList = () => {
        setView("list");
        setSelectedEmployee(null);
    };

    const handleUpdateEmployee = (updatedEmployee: EmployeeProfileResponse) => {
        setEmployees(prev =>
            prev.map(emp => (emp.id === updatedEmployee.id ? updatedEmployee : emp))
        );
        setSelectedEmployee(updatedEmployee);
    };

    return (
        <div className="bg-gray-50 w-full">
            {view === "list" ? (
                <EmployeeList onEmployeeClick={handleEmployeeClick} />
            ) : (
                <EmployeeProfile
                    employee={selectedEmployee!}
                    onBack={handleBackToList}
                    onUpdate={handleUpdateEmployee}
                    agencies={agencies} // ← on passe les agences récupérées
                />
            )}
        </div>
    );
}

export default EmployeePageContent;