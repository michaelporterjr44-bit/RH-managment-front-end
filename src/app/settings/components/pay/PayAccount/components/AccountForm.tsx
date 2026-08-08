import React, { useState, useEffect } from 'react';
import { Employee } from '@/types/employee/employee';
import { CodeBank } from '@/types/pay/codeBank';
import { Account } from '@/types/pay/account';
import { createAccount } from '@/api/dashboard/pay/account';

// Importation du composant Toast
import Toast from '@/app/components/ui/Toast'; // Ajustez le chemin si nécessaire

interface AccountFormProps {
    selectedEmployee: Employee | null;
    selectedCodeBank: CodeBank | null;
    onSuccess?: (newAccount: Account) => void; // callback après création réussie
}

const AccountForm: React.FC<AccountFormProps> = ({ selectedEmployee, selectedCodeBank, onSuccess }) => {
    const [formData, setFormData] = useState<{
        matricule: string;
        codeBank: CodeBank | null;
        accountNumber: string;
    }>({
        matricule: '',
        codeBank: null,
        accountNumber: ''
    });

    const [loading, setLoading] = useState(false);

    // États pour le Toast de notification
    const [toastMessage, setToastMessage] = useState("");
    const [isToastSuccess, setIsToastSuccess] = useState(true);
    const [showToast, setShowToast] = useState(false);

    // Fonction utilitaire pour déclencher le toast
    const triggerToast = (message: string, success: boolean) => {
        setToastMessage(message);
        setIsToastSuccess(success);
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            matricule: selectedEmployee?.matricule ?? '',
            codeBank: selectedCodeBank ?? null
        }));
    }, [selectedEmployee, selectedCodeBank]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'codeBank') {
            setFormData(prev => ({
                ...prev,
                codeBank: prev.codeBank
                    ? { ...prev.codeBank, codeBank: value }
                    : { id: '', codeBank: value, bankName: '' }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.codeBank || !selectedEmployee) {
            triggerToast("Veuillez sélectionner un employé et une banque.", false);
            return;
        }

        setLoading(true);

        try {
            const accountData: Partial<Account> = {
                accountNumber: formData.accountNumber,
                codeBank: formData.codeBank,
                employee: selectedEmployee
            };

            const newAccount = await createAccount(accountData);
            if (newAccount) {
                onSuccess?.(newAccount); // callback si nécessaire
                setFormData({
                    matricule: '',
                    codeBank: null,
                    accountNumber: ''
                });
                triggerToast("Compte créé avec succès !", true);
            } else {
                triggerToast("Erreur lors de la création du compte.", false);
            }
        } catch (error) {
            console.error(error);
            triggerToast("Une erreur inattendue est survenue.", false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    {selectedEmployee ? `Créer un compte pour ${selectedEmployee.lastName} ${selectedEmployee.firstName}` : 'Créer un nouveau compte'}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Matricule employé
                            </label>
                            <input
                                type="text"
                                name="matricule"
                                value={formData.matricule}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                placeholder="Ex: EMP001"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Code banque
                            </label>
                            <input
                                type="text"
                                name="codeBank"
                                value={formData.codeBank?.codeBank || ''}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                placeholder="Ex: BNP001"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Numéro de compte
                            </label>
                            <input
                                type="text"
                                name="accountNumber"
                                value={formData.accountNumber}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                placeholder="FR76 1234 5678 9012 3456 78"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium"
                        >
                            {loading ? 'Création...' : 'Créer le compte'}
                        </button>
                    </div>
                </form>
            </div>
            <Toast 
                message={toastMessage} 
                success={isToastSuccess} 
                show={showToast} 
            />
        </div>
    );
};

export default AccountForm;