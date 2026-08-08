"use client"

import { useState, useEffect } from "react";
import { getEmployeesPage,getEmployeesEntity } from "@/api/dashboard/employee-and-user/employees";
import { getCodeBanks } from "@/api/dashboard/pay/codeBank";
import { getAgencies } from "@/api/dashboard/employee-and-user/users";
import { Employee } from "@/types/employee/employee";
import { Indemnite } from "@/types/pay/indemnite";
import { createIndemnite } from "@/api/dashboard/pay/indemnite";
import EmployeeList from "../../components/EmployeeListPay";

export function IndemniteForm() {
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
    const [amount, setAmount] = useState("")
    const [period, setPeriod] = useState("")
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [agencies, setAgencies] = useState<any[]>([]);
    const [message, setMessage] = useState<string>('');
    const [showAlert, setShowAlert] = useState(false);
    const [success, setSuccess] = useState<boolean | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [employeeRes, agencyRes] = await Promise.all([
                    getEmployeesEntity(0, 100),
                    getCodeBanks(),
                    getAgencies()
                ]);
                setEmployees(employeeRes.content);
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

    const handleEmployeeSelect = (employee: Employee) => {
        setSelectedEmployee(employee)
    }

    const handleSave = async () => {
        if (!selectedEmployee || !amount) return;

        try {
            const indemniteData: Partial<Indemnite> = {
                employee: selectedEmployee,
                amount: parseFloat(amount),
                periode: "",
            };

            const saved = await createIndemnite(indemniteData);

            setMessage(`Indemnité enregistrée avec succès pour ${selectedEmployee.firstName}`);
            setSuccess(true);

            setSelectedEmployee(null);
            setAmount("");
            setPeriod("");
        } catch (error) {
            console.error("Erreur lors de l'enregistrement :", error);
            setMessage("Erreur lors de l'enregistrement de l'indemnité");
            setSuccess(false);
        }
    };

    const handleCancel = () => {
        setSelectedEmployee(null)
        setAmount("")
        setPeriod("")
    }

    return (
        <div className="flex gap-2 w-full">
            {/* Employee List */}
            <div className="w-[70%]">
                <EmployeeList
                    selectedEmployee={selectedEmployee}
                    onSelectEmployee={setSelectedEmployee}
                />
            </div>
            {/* Form Card */}
            <div className="rounded-2xl bg-white p-6 shadow-md w-[90%]">
                <h2 className="mb-6 text-xl font-semibold text-slate-900">Attribution d'Indemnité</h2>

                <div className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Employé <span className="text-red-500">*</span>
                        </label>
                        {selectedEmployee ? (
                            <div className="flex items-center gap-3 rounded-lg border-2 border-green-700 bg-green-50 p-3">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-700 to-green-600 text-sm font-semibold text-white">
                                    {selectedEmployee.firstName
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-slate-900">{selectedEmployee.lastName}</p>
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
                        <label htmlFor="amount-indemnite" className="mb-2 block text-sm font-medium text-slate-700">
                            Montant <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="amount-indemnite"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-700/20"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="period-indemnite" className="mb-2 block text-sm font-medium text-slate-700">
                            Période
                        </label>
                        <input
                            id="period-indemnite"
                            type="month"
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-700/20"
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
                            className="flex items-center gap-2 rounded-lg bg-red-500 px-3 py-2.5 font-medium text-white transition-colors hover:bg-red-600"
                        >
                            <i className="ri-close-line text-lg"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
