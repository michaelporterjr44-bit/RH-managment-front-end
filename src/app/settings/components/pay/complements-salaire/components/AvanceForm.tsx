"use client"

import { useState, useEffect } from "react";
import { getEmployeesPage } from "@/api/dashboard/employee-and-user/employees";
import { getCodeBanks } from "@/api/dashboard/pay/codeBank";
import { getAgencies } from "@/api/dashboard/employee-and-user/users";
import { Employee } from "@/types/employee/employee";
import { getEmployeesEntity } from "@/api/dashboard/employee-and-user/employees";
import { Avance } from "@/types/pay/avence";
import { createAvance } from "@/api/dashboard/pay/avance";
import EmployeeList from "../../components/EmployeeListPay";

export function AvanceForm() {
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
    const [amount, setAmount] = useState("")
    const [period, setPeriod] = useState("")
    const [agencies, setAgencies] = useState<any[]>([]);
    const [message, setMessage] = useState<string>('');
    const [showAlert, setShowAlert] = useState(false);
    const [success, setSuccess] = useState<boolean | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [agencyRes] = await Promise.all([
                     getEmployeesEntity(),
                    getCodeBanks(),
                    getAgencies()
                ]);
                setAgencies(agencyRes);
            } catch (error) {
                console.error('Erreur lors du chargement des données :', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (message) {
            setShowAlert(true);
            const timeout = setTimeout(() => {
                setShowAlert(false);
                setTimeout(() => {
                    setMessage('');
                    setSuccess(null);
                }, 300);
            }, 2000);
            return () => clearTimeout(timeout);
        }
    }, [message]);

    const handleSave = async () => {
        if (!selectedEmployee || !amount) return;

        const newAvance: Avance = {
            id: "",
            employee: selectedEmployee,
            amount: Number(amount),
            periode: period || new Date().toISOString().slice(0, 7),
        };


        try {
            const saved = await createAvance(newAvance);
            setMessage("Avance enregistrée avec succès !");
            setSuccess(true);
            // Réinitialisation du formulaire
            setSelectedEmployee(null);
            setAmount("");
            setPeriod("");
            console.log("Avance saved:", saved);
        } catch (error) {
            console.error("Erreur lors de l'enregistrement de l'avance :", error);
            setMessage("Erreur lors de l'enregistrement de l'avance !");
            setSuccess(false);
        }
    };

    const handleCancel = () => {
        setSelectedEmployee(null)
        setAmount("")
        setPeriod("")
    }

    return (
        <div className="flex row gap-2">
            <div className="w-[70%]">
                <EmployeeList
                    selectedEmployee={selectedEmployee}
                    onSelectEmployee={setSelectedEmployee}
                />
            </div>
            {/* Form Card */}
            <div className="rounded-2xl bg-white p-6 shadow-md w-[90%]">
                <h2 className="mb-6 text-xl font-semibold text-slate-900">Attribution d'Avance</h2>

                <div className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Employé <span className="text-red-500">*</span>
                        </label>
                        {selectedEmployee ? (
                            <div className="flex items-center gap-3 rounded-lg border-2 border-green-500 bg-green-50 p-3">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 text-sm font-semibold text-white">
                                    <img src={selectedEmployee.imageProfil?.url}
                                        alt={`${selectedEmployee.lastName} ${selectedEmployee.firstName}`}
                                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-slate-900">{selectedEmployee.firstName}</p>
                                    <p className="text-xs text-slate-500">
                                        {selectedEmployee.function} - {selectedEmployee.department?.libelle}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedEmployee(null)}
                                    className="flex-shrink-0 text-slate-400 hover:text-slate-600"
                                >
                                    <i className="ri-close-line text-xl"></i>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-slate-500">
                                <i className="ri-arrow-left-line"></i>
                                <span className="text-sm">Sélectionnez un employé dans la liste</span>
                            </div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="amount-avance" className="mb-2 block text-sm font-medium text-slate-700">
                            Montant <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="amount-avance"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="period-avance" className="mb-2 block text-sm font-medium text-slate-700">
                            Période
                        </label>
                        <input
                            id="period-avance"
                            type="month"
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={handleSave}
                            disabled={!selectedEmployee || !amount}
                            className="flex items-center gap-2 rounded-lg bg-green-700 px-6 py-2.5 font-medium text-white transition-colors hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <i className="ri-check-line text-lg"></i>
                            Enregistrer
                        </button>
                        <button
                            onClick={handleCancel}
                            className="flex items-center gap-2 rounded-lg bg-red-500 px-6 py-2.5 font-medium text-white transition-colors hover:bg-red-600"
                        >
                            <i className="ri-close-line text-lg"></i>
                            Annuler
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
