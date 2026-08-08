"use client";

import { useState, useEffect } from "react";
import { getEmployeesPage } from "@/api/dashboard/employee-and-user/employees";
import { createLeave } from "@/api/dashboard/leave/leave";
import { getSoldeCongeByEmployee } from "@/api/dashboard/leave/soldeConge";
import { Employee, EmployeeResponse } from "@/types/employee/employee";
import { CreateLeavePayload } from "@/types/leave/leave.types";
import EmployeeList from "@/app/dashboard/users-settings/users/components/EmployeeList";
import { Agence } from "@/types/employee/employee";
import { Leave } from "@/types/leave/leave.types";

export function LeaveForm({ onSuccess }: { onSuccess?: (newLeave: Leave) => void }) {
    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeResponse | null>(null);
    const [motif, setMotif] = useState("");
    const [dateDebut, setDateDebut] = useState("");
    const [dateFin, setDateFin] = useState("");
    const [dateDeReprise, setDateDeReprise] = useState("");
    const [remarque, setRemarque] = useState("");
    const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState<boolean | null>(null);
    const [agencies, setAgencies] = useState<Agence[]>([]);
    const [soldeConge, setSoldeConge] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchSolde = async () => {
            if (!selectedEmployee?.id) return;

            try {
                const data = await getSoldeCongeByEmployee(selectedEmployee.id);
                setSoldeConge(data.solde);
            } catch (e) {
                setSoldeConge(null);
            }
        };

        fetchSolde();
    }, [selectedEmployee]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const employeeRes = await getEmployeesPage(0, 100);
                setEmployees(employeeRes.content);
            } catch (err) {
                console.error("Erreur chargement employés", err);
            }
        };
        fetchData();
    }, []);

    const calculateDays = () => {
        if (!dateDebut || !dateFin) return 0;

        const start = new Date(dateDebut);
        const end = new Date(dateFin);

        const diff = end.getTime() - start.getTime();
        return diff / (1000 * 3600 * 24) + 1;
    };

    const handleSubmit = async () => {
        if (!selectedEmployee) {
            alert("Veuillez sélectionner un employé");
            return;
        }

        if (!motif || !dateDebut || !dateFin) {
            alert("Veuillez remplir tous les champs obligatoires");
            return;
        }

        const joursDemandes = calculateDays();

        if (soldeConge !== null && joursDemandes > soldeConge) {
            setSuccess(false);
            setErrorMessage(
                `Solde insuffisant. Disponible : ${soldeConge} jour(s)`
            );
            return;
        }

        try {
            const payload: CreateLeavePayload = {
                employee: { id: selectedEmployee.id! },
                motif,
                dateDebut,
                dateFin,
                dateDeReprise,
                interieur: null,
                remarque,
            };

            const saved = await createLeave(payload);

            onSuccess?.(saved);

            setSuccess(true);
            setMessage("Congé enregistré avec succès !");

            // reset
            setSelectedEmployee(null);
            setMotif("");
            setDateDebut("");
            setDateFin("");
            setDateDeReprise("");
            setRemarque("");
            setSoldeConge(null);

        } catch (error) {
            console.error(error);
            setSuccess(false);
            setMessage("Erreur lors de l'enregistrement !");
        }
    };


    return (
        <div className="flex row gap-2">
            <div className="w-[70%]">
                <EmployeeList
                    selectedEmployee={selectedEmployee}
                    onSelectEmployee={setSelectedEmployee}
                />
            </div>

            <div className="flex flex-col rounded-2xl bg-white p-6 shadow-md w-[90%]">
                <div className="flex flex-col gap-5">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Employé <span className="text-red-500">*</span>
                        </label>

                        {selectedEmployee ? (
                            <div className="flex items-center gap-3 rounded-lg border-2 border-green-500 bg-green-50 p-3">
                                <div className="flex-1">
                                    <p className="font-medium text-slate-900">
                                        {selectedEmployee.firstName} {selectedEmployee.lastName}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        - {selectedEmployee.department?.libelle}
                                    </p>
                                </div>

                                <button
                                    onClick={() => setSelectedEmployee(null)}
                                    className="text-slate-500 hover:text-slate-700"
                                >
                                    <i className="ri-close-line text-xl"></i>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 border border-dashed p-4 bg-slate-50 text-slate-500">
                                <i className="ri-arrow-left-line"></i>
                                <span>Sélectionnez un employé</span>
                            </div>
                        )}
                    </div>

                    {selectedEmployee && soldeConge !== null && (
                        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                            <p className="text-sm text-blue-700">
                                Solde disponible : <strong>{soldeConge} jours</strong>
                            </p>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Motif / Type de congé
                        </label>
                        <input
                            type="text"
                            value={motif}
                            onChange={(e) => setMotif(e.target.value)}
                            placeholder="Ex: Congés annuels"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Date de début
                            </label>
                            <input
                                type="date"
                                value={dateDebut}
                                onChange={(e) => setDateDebut(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Date de fin
                            </label>
                            <input
                                type="date"
                                value={dateFin}
                                onChange={(e) => setDateFin(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Remarque
                        </label>
                        <textarea
                            rows={3}
                            value={remarque}
                            onChange={(e) => setRemarque(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg resize-none"
                            placeholder="Ajoutez une remarque (optionnel)"
                        ></textarea>
                    </div>
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        onClick={handleSubmit}
                        className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
                    >
                        Enregistrer le congé
                    </button>
                </div>
                {errorMessage && (
                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm">

                        <div className="flex items-start justify-between gap-3">

                            {/* Left content */}
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                                    <i className="ri-error-warning-line text-red-600 text-xl"></i>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-red-700">
                                        Solde insuffisant
                                    </h4>
                                    <p className="text-sm text-red-600 mt-1">
                                        {errorMessage}
                                    </p>
                                </div>
                            </div>

                            {/* Close button */}
                            <button
                                onClick={() => setErrorMessage("")}
                                className="text-red-400 hover:text-red-600 transition"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>

                        </div>
                    </div>
                )}
                {message && (
                    <p className={`mt-4 text-sm ${success ? "text-green-600" : "text-red-600"}`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}
