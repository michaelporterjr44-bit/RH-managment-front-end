"use client";

import React, { useState, useEffect } from "react";
import { Employee } from "@/types/employee/employee";
import { SalaireBase, CreateSalaireBaseDto } from "@/types/pay/pay";
import { createSalaireBase } from "@/api/dashboard/pay/salaireBase";
import Toast from "@/app/components/ui/Toast";

interface SalaireBaseFormProps {
    selectedEmployee: Employee | null;
    onSuccess?: (newSalaireBase: SalaireBase) => void;
}

const SalaireBaseForm: React.FC<SalaireBaseFormProps> = ({
    selectedEmployee,
    onSuccess,
}) => {
    const [formData, setFormData] = useState({
    baseSalaire: "",
    devise: "MGA",
});

    const [toastMessage, setToastMessage] = useState("");
    const [toastSuccess, setToastSuccess] = useState(true);
    const [showToast, setShowToast] = useState(false);

    const triggerToast = (message: string, success: boolean = true) => {
        setToastMessage(message);
        setToastSuccess(success);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };


    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedEmployee) {
            setFormData({
                baseSalaire: "",
                devise: "MGA",
            });
        }
    }, [selectedEmployee]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value, // toujours string
        }));
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedEmployee?.id) {
            triggerToast("Employé invalide", false);
            return;
        }

        const parsedSalaire = parseFloat(
            formData.baseSalaire.replace(",", ".")
        );

        if (isNaN(parsedSalaire)) {
            triggerToast("Salaire invalide", false);
            return;
        }

        setLoading(true);

        try {
            const salaireData: CreateSalaireBaseDto = {
                baseSalaire: parsedSalaire,
                devise: formData.devise,
                employeeId: selectedEmployee.id,
            };

            const newSalaireBase = await createSalaireBase(salaireData);

            onSuccess?.(newSalaireBase);
            triggerToast("Salaire de base ajouté avec succès !", true);

            // reset propre
            setFormData({
                baseSalaire: "",
                devise: "MGA",
            });

        } catch (error) {
            console.error(error);
            triggerToast("Erreur lors de la création", false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
                {selectedEmployee
                    ? `Créer un salaire de base pour ${selectedEmployee.lastName} ${selectedEmployee.firstName}`
                    : "Créer un salaire de base"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Montant du salaire */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Salaire de base
                        </label>
                        <input
                            type="number"
                            name="baseSalaire"
                            value={formData.baseSalaire}
                            onChange={handleChange}
                            placeholder="Ex: 500000"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        />
                    </div>

                    {/* Devise */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Devise
                        </label>
                        <select
                            name="devise"
                            value={formData.devise}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        >
                            <option value="MGA">Ariary (MGA)</option>
                            <option value="EUR">Euro (EUR)</option>
                            <option value="USD">Dollar (USD)</option>
                        </select>
                    </div>
                </div>

                {/* Submit */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium"
                    >
                        {loading ? "Création..." : "Créer le salaire de base"}
                    </button>
                </div>
            </form>

            <Toast message={toastMessage} success={toastSuccess} show={showToast} />

        </div>
    );
};

export default SalaireBaseForm;
