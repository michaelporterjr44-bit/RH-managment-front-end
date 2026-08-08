import React, { useState } from "react";
import { createCampagnePay } from "@/api/dashboard/pay/payroll";

export interface AddPayrollModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (newPayroll: any) => void;
}

export default function AddPayrollModal({
    isOpen,
    onClose,
    onAdd,
}: AddPayrollModalProps) {
    const [periode, setPeriode] = useState("");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const showToast = (type: "success" | "error", message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!periode) {
            showToast("error", "Veuillez sélectionner une période.");
            return;
        }

        try {
            setLoading(true);

            const name = `PAY ${periode}`;
            const newPayroll = await createCampagnePay({ periode, name });
            console.log("NEW PAYROLL =", newPayroll);

            onAdd(newPayroll);
            showToast("success", `Période ${name} créée avec succès.`);

            setTimeout(() => {
                setPeriode("");
                onClose();
            }, 2000);
        } catch (err) {
            console.error("Erreur lors de la création de la période de paie :", err);
            showToast("error", "Impossible de créer la période.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-medium text-gray-900">Nouvelle période de paie</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <i className="ri-close-line w-5 h-5 text-gray-500"></i>
                    </button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700">
                            <i className="ri-calendar-line mr-2"></i>
                            Période
                        </label>
                        <input
                            type="month"
                            value={periode}
                            onChange={(e) => setPeriode(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl
                focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-green-50"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!periode || loading}
                        className="px-6 py-3 bg-green-800 text-white rounded-xl hover:bg-green-700 disabled:opacity-50"
                    >
                        {loading ? "Création..." : "Créer la période"}
                    </button>
                </div>
            </div>

            {/* Toast */}
            {toast && (
                <div className="absolute bottom-[2vh] left-1/2 transform -translate-x-1/2">
                    {toast.type === "success" && (
                        <div className="flex items-center w-full max-w-sm p-3 mt-3 text-green-800 bg-green-100 border border-green-300 rounded-lg shadow-sm">
                            <div className="inline-flex items-center justify-center w-8 h-8 text-green-600 bg-white/60 rounded-lg">
                                <i className="ri-checkbox-circle-line text-base"></i>
                            </div>
                            <div className="ms-3 text-xs font-medium">{toast.message}</div>
                        </div>
                    )}
                    {toast.type === "error" && (
                        <div className="flex items-center w-full max-w-sm p-3 mt-3 text-red-800 bg-red-100 border border-red-300 rounded-lg shadow-sm">
                            <div className="inline-flex items-center justify-center w-8 h-8 text-red-600 bg-white/60 rounded-lg">
                                <i className="ri-close-circle-line text-base"></i>
                            </div>
                            <div className="ms-3 text-xs font-medium">{toast.message}</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
