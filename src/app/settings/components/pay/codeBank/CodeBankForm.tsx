import React, { useState } from "react";
import { CodeBank } from "@/types/pay/codeBank";

interface CodeBankFormProps {
    onSubmit: (codeBankData: CodeBank) => void;
}

const CodeBankForm: React.FC<CodeBankFormProps> = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        codeBank: "",
        bankName: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            codeBank: formData.codeBank,
            bankName: formData.bankName,
        } as any);
        setFormData({ codeBank: "", bankName: "" });
    };

    return (
        <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-6">
                    <i className="ri-database-line w-6 h-6 text-green-600 mr-3"></i>
                    <h2 className="text-xl font-semibold text-gray-900">Ajouter Code Bank</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Code Bank
                        </label>
                        <input
                            type="text"
                            value={formData.codeBank}
                            onChange={(e) =>
                                setFormData({ ...formData, codeBank: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            placeholder="Ex: BNP001"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom de la banque
                        </label>
                        <input
                            type="text"
                            value={formData.bankName}
                            onChange={(e) =>
                                setFormData({ ...formData, bankName: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            placeholder="Ex: BNP Paribas"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors flex items-center justify-center"
                    >
                        <i className="ri-arrow-right-s-line w-4 h-4 mr-2"></i>
                        Ajouter code bank
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CodeBankForm;
