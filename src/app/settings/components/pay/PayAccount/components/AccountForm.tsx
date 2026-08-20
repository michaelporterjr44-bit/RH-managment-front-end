import React, { useState, useEffect } from 'react';

import { Employee } from '@/types/employee/employee';
import { CodeBank } from '@/types/pay/codeBank';

import {
    AccountDTO,
    CreateAccountDto
} from '@/types/pay/account';

import { createAccount } from '@/api/dashboard/pay/account';

import Toast from '@/app/components/ui/Toast';


interface AccountFormProps {
    selectedEmployee: Employee | null;
    selectedCodeBank: CodeBank | null;

    onSuccess?: (newAccount: AccountDTO) => void;
}


const AccountForm: React.FC<AccountFormProps> = ({
    selectedEmployee,
    selectedCodeBank,
    onSuccess
}) => {

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


    // Toast
    const [toastMessage, setToastMessage] = useState("");
    const [isToastSuccess, setIsToastSuccess] = useState(true);
    const [showToast, setShowToast] = useState(false);


    const triggerToast = (
        message: string,
        success: boolean
    ) => {

        setToastMessage(message);
        setIsToastSuccess(success);
        setShowToast(true);

        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };


    // Synchroniser l'employé et la banque sélectionnés
    useEffect(() => {

        setFormData(prev => ({
            ...prev,

            matricule:
                selectedEmployee?.matricule ?? '',

            codeBank:
                selectedCodeBank ?? null
        }));

    }, [
        selectedEmployee,
        selectedCodeBank
    ]);


    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        const {
            name,
            value
        } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


const handleSubmit = async (
    e: React.FormEvent
) => {

    e.preventDefault();

    if (!selectedEmployee?.id) {
        triggerToast(
            "Veuillez sélectionner un employé valide.",
            false
        );
        return;
    }

    if (!selectedCodeBank?.id) {
        triggerToast(
            "Veuillez sélectionner une banque valide.",
            false
        );
        return;
    }

    if (!formData.accountNumber.trim()) {
        triggerToast(
            "Veuillez saisir un numéro de compte.",
            false
        );
        return;
    }

    setLoading(true);

    try {

        const accountData: CreateAccountDto = {

            employeeId: selectedEmployee.id,

            codeBankId: selectedCodeBank.id,

            accountNumber:
                formData.accountNumber.trim()
        };

        console.log(
            "DONNEES ENVOYEES AU BACKEND :",
            accountData
        );

        const newAccount =
            await createAccount(accountData);

        if (!newAccount) {

            triggerToast(
                "Erreur lors de la création du compte.",
                false
            );

            return;
        }

        onSuccess?.(newAccount);

        setFormData({
            matricule: '',
            codeBank: null,
            accountNumber: ''
        });

        triggerToast(
            "Compte créé avec succès !",
            true
        );

    } catch (error) {

        console.error(
            "Erreur création compte :",
            error
        );

        triggerToast(
            "Une erreur inattendue est survenue.",
            false
        );

    } finally {

        setLoading(false);
    }
};


    return (

        <div className="space-y-6">

            <div className="bg-white rounded-lg shadow-md p-6">

                <h3 className="text-lg font-semibold text-gray-900 mb-6">

                    {selectedEmployee
                        ? `Créer un compte pour ${selectedEmployee.lastName} ${selectedEmployee.firstName}`
                        : 'Créer un nouveau compte'
                    }

                </h3>


                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                        {/* MATRICULE */}

                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-2">

                                Matricule employé

                            </label>

                            <input
                                type="text"
                                value={formData.matricule}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                                placeholder="Sélectionnez un employé"
                            />

                        </div>


                        {/* BANQUE */}

                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-2">

                                Code banque

                            </label>

                            <input
                                type="text"
                                value={
                                    formData.codeBank?.codeBank ?? ''
                                }
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                                placeholder="Sélectionnez une banque"
                            />

                        </div>


                        {/* NUMERO DE COMPTE */}

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
                                placeholder="Ex: 123456789"
                            />

                        </div>

                    </div>


                    <div className="pt-4">

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50"
                        >

                            {loading
                                ? 'Création...'
                                : 'Créer le compte'
                            }

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