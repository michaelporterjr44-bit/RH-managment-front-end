"use client";

import { useState, useEffect } from "react";
import { getEmployeesPage } from "@/api/dashboard/employee-and-user/employees";
import soldeCongeApi from "@/api/dashboard/leave/soldeConge";
import { Employee, EmployeeResponse } from "@/types/employee/employee";
import EmployeeList from "@/app/dashboard/users-settings/users/components/EmployeeList";

export function LeaveBalanceForm() {
    const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeResponse | null>(null);
    const [jours, setJours] = useState<string>("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchEmployees = async () => {
            const res = await getEmployeesPage(0, 100);
            setEmployees(res.content);
        };
        fetchEmployees();
    }, []);

    const handleSubmit = async () => {
        if (!selectedEmployee) {
            alert("Veuillez sélectionner un employé");
            return;
        }

        if (!jours) {
            alert("Veuillez entrer un nombre de jours");
            return;
        }

        const parsedJours = parseFloat(jours.replace(",", "."));

        if (isNaN(parsedJours)) {
            alert("Valeur invalide");
            return;
        }

        try {
            await soldeCongeApi.addSoldeToEmployee(
                selectedEmployee.id!,
                parsedJours // ✅ correction ici
            );

            setMessage("Solde de congé attribué avec succès");
            setJours(""); // reset

        } catch (error) {
            console.error(error);
            setMessage("Erreur lors de l'attribution");
        }
    };

    return (
        <div className="flex gap-6">
            {/* Liste des employés */}
            <div className="w-[40%]">
                <EmployeeList
                    selectedEmployee={selectedEmployee}
                    onSelectEmployee={setSelectedEmployee}
                />
            </div>

            {/* Formulaire d'attribution */}
            <div className="flex flex-col rounded-2xl bg-white p-6 shadow-md w-[60%]">
                <h2 className="text-lg font-semibold mb-4">Attribution des jours de congé</h2>

                {selectedEmployee ? (
                    <div className="mb-4 p-3 bg-green-50 border border-green-400 rounded">
                        <p className="font-medium text-slate-900">
                            {selectedEmployee.firstName} {selectedEmployee.lastName}
                        </p>
                        <p className="text-xs text-slate-500">
                            - {selectedEmployee.department?.libelle}
                        </p>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 border border-dashed p-4 bg-slate-50 text-slate-500">
                        <i className="ri-arrow-left-line"></i>
                        <span>Sélectionnez un employé</span>
                    </div>
                )}

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Nombre de jours</label>
                    <input
                        type="number"
                        value={jours}
                        onChange={(e) => setJours(e.target.value)}
                        placeholder="0.00"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    className="mt-2 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                    Attribuer
                </button>

                {message && (
                    <p className="mt-3 text-sm text-green-600">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}