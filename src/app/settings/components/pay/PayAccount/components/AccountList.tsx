import React, { useEffect, useState } from 'react';
import { AccountDTO } from '@/types/pay/account';
import {
    getAccounts,
    deleteAccount,
    updateAccount
} from '@/api/dashboard/pay/account';
import { CodeBank } from '@/types/pay/codeBank';
import { getCodeBanks } from '@/api/dashboard/pay/codeBank';

import Pagination from '@/app/components/ui/Pagination';
import Toast from '@/app/components/ui/Toast';

export function AccountList() {

    const [accounts, setAccounts] = useState<AccountDTO[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    // MODALE EDIT
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [accountToEdit, setAccountToEdit] =
        useState<AccountDTO | null>(null);

    const [accountNumber, setAccountNumber] = useState("");
    const [banks, setBanks] = useState<CodeBank[]>([]);
    const [selectedBankId, setSelectedBankId] = useState("");

    // MODALE DELETE
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [accountToDelete, setAccountToDelete] =
        useState<AccountDTO | null>(null);

    // TOAST
    const [toastMessage, setToastMessage] = useState("");
    const [isToastSuccess, setIsToastSuccess] = useState(true);
    const [showToast, setShowToast] = useState(false);

    // PAGINATION
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);


    const triggerToast = (message: string, success: boolean) => {

        setToastMessage(message);
        setIsToastSuccess(success);
        setShowToast(true);

        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };


    // =========================
    // GET ACCOUNTS
    // =========================

    const fetchAccounts = async () => {

        setLoading(true);

        try {

            const data = await getAccounts(
                currentPage,
                pageSize,
                searchTerm
            );

            console.log("========== GET ACCOUNTS ==========");
            console.log(JSON.stringify(data, null, 2));

            console.log("PREMIER ACCOUNT :", data.content?.[0]);

            console.log(
                "EMPLOYEE :",
                data.content?.[0]?.employee
            );

            console.log(
                "CODE BANK :",
                data.content?.[0]?.codeBank
            );

            console.log("==================================");

            setAccounts(data.content ?? []);

        } catch (error) {

            console.error(
                'Erreur lors du chargement des comptes',
                error
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        const timeout = setTimeout(() => {

            fetchAccounts();

        }, 100);

        return () => clearTimeout(timeout);

    }, [currentPage, pageSize, searchTerm]);


    // =========================
    // GET BANKS
    // =========================

    useEffect(() => {

        const loadBanks = async () => {

            try {

                const data = await getCodeBanks();

                setBanks(data ?? []);

            } catch (error) {

                console.error(
                    'Erreur lors du chargement des banques',
                    error
                );
            }
        };

        loadBanks();

    }, []);


    // =========================
    // SEARCH
    // =========================

    const handleSearchChange =
        (e: React.ChangeEvent<HTMLInputElement>) => {

            setSearchTerm(e.target.value);

            setCurrentPage(0);
        };


    // =========================
    // EDIT
    // =========================

    const openEditModal = (account: AccountDTO) => {

        setAccountToEdit(account);

        setAccountNumber(
            account.accountNumber ?? ""
        );

        // Protection si codeBank est null
        setSelectedBankId(
            account.codeBank?.id ?? ""
        );

        setIsEditModalOpen(true);
    };


    const handleUpdate = async () => {

        if (!accountToEdit) return;

        // Une banque doit être sélectionnée
        if (!selectedBankId) {

            triggerToast(
                "Veuillez sélectionner une banque.",
                false
            );

            return;
        }

        try {

            const updated = await updateAccount(
                accountToEdit.id,
                {
                    accountNumber,
                    codeBankId: selectedBankId
                }
            );

            if (updated) {

                setIsEditModalOpen(false);

                triggerToast(
                    "Compte modifié avec succès !",
                    true
                );

                await fetchAccounts();

            } else {

                triggerToast(
                    "Erreur lors de la modification du compte.",
                    false
                );
            }

        } catch (error) {

            console.error(
                "Erreur lors de la modification",
                error
            );

            triggerToast(
                "Une erreur inattendue est survenue.",
                false
            );
        }
    };


    // =========================
    // DELETE
    // =========================

    const openDeleteModal = (
        account: AccountDTO
    ) => {

        setAccountToDelete(account);

        setIsDeleteModalOpen(true);
    };


    const confirmDelete = async () => {

        if (!accountToDelete) return;

        try {

            const success =
                await deleteAccount(
                    accountToDelete.id
                );

            setIsDeleteModalOpen(false);

            setAccountToDelete(null);

            if (success) {

                triggerToast(
                    "Compte supprimé avec succès !",
                    true
                );

                await fetchAccounts();

            } else {

                triggerToast(
                    "Erreur lors de la suppression du compte.",
                    false
                );
            }

        } catch (error) {

            console.error(
                "Erreur lors de la suppression",
                error
            );

            setIsDeleteModalOpen(false);

            triggerToast(
                "Une erreur inattendue est survenue.",
                false
            );
        }
    };


    return (

        <div className="space-y-6">

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">

                {/* HEADER */}

                <div className="flex items-center justify-between mb-6">

                    <div className="flex items-center">

                        <i className="ri-wallet-line text-2xl text-green-600 mr-3"></i>

                        <h2 className="text-xl font-semibold text-gray-900">
                            Liste des comptes
                        </h2>

                    </div>


                    <div className="relative w-80">

                        <i className="ri-search-line text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"></i>

                        <input
                            type="text"
                            placeholder="Rechercher un compte..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />

                    </div>

                </div>


                <div>

                    <div className="overflow-hidden border border-gray-200 rounded-lg">

                        <table className="min-w-full divide-y divide-gray-200">

                            <thead className="bg-gray-50">

                                <tr>

                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Employé
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Banque
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Numéro de compte
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody className="bg-white divide-y divide-gray-200">

                                {accounts.map((acc) => {

                                    // Protection contre employee null
                                    const employee = acc.employee;

                                    // Protection contre codeBank null
                                    const bank = acc.codeBank;

                                    const employeeName = employee
                                        ? `${employee.firstName ?? ""} ${employee.lastName ?? ""}`
                                        : "Employé inconnu";

                                    const avatarUrl =
                                        employee?.imageProfil?.url ||
                                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                            employeeName
                                        )}`;


                                    return (

                                        <tr
                                            key={acc.id}
                                            className="hover:bg-gray-50"
                                        >

                                            {/* EMPLOYEE */}

                                            <td className="px-6 py-4 max-w-[400px]">

                                                <div className="flex items-center gap-3">

                                                    <div className="flex items-center">

                                                        <img
                                                            className="h-10 w-10 rounded-full object-cover"
                                                            src={avatarUrl}
                                                            alt={employeeName}
                                                        />

                                                    </div>


                                                    <div>

                                                        <div className="font-semibold text-gray-800">

                                                            <h1 className="text-sm uppercase">

                                                                {employee?.lastName ??
                                                                    "Employé inconnu"}

                                                            </h1>

                                                            <h1 className="text-xs font-normal text-gray-500">

                                                                {employee?.firstName ?? ""}

                                                            </h1>

                                                        </div>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* BANK */}

                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">

                                                {bank
                                                    ? `${bank.codeBank ?? "—"} - ${bank.bankName ?? "Banque non définie"}`
                                                    : "Banque non définie"
                                                }

                                            </td>


                                            {/* ACCOUNT NUMBER */}

                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">

                                                {acc.accountNumber ?? "—"}

                                            </td>


                                            {/* ACTIONS */}

                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex gap-3">

                                                <button
                                                    onClick={() =>
                                                        openEditModal(acc)
                                                    }
                                                    className="text-green-600 hover:text-green-800"
                                                >

                                                    <i className="ri-edit-2-line"></i>

                                                </button>


                                                <button
                                                    onClick={() =>
                                                        openDeleteModal(acc)
                                                    }
                                                    className="text-red-600 hover:text-red-800"
                                                >

                                                    <i className="ri-delete-bin-6-line"></i>

                                                </button>

                                            </td>

                                        </tr>
                                    );
                                })}

                            </tbody>

                        </table>


                        {accounts.length === 0 && !loading && (

                            <div className="p-6 text-center text-gray-500">

                                Aucun compte trouvé

                            </div>
                        )}

                    </div>


                    {/* MODALE DE MODIFICATION */}

                    {isEditModalOpen && (

                        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

                            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

                                <div className="bg-green-700 h-3"></div>


                                <div className="p-6 space-y-5">

                                    <h2 className="text-xl font-semibold">
                                        Modifier le compte
                                    </h2>


                                    <div>

                                        <label className="block text-sm font-medium mb-2">
                                            Banque
                                        </label>


                                        <select
                                            value={selectedBankId}
                                            onChange={(e) =>
                                                setSelectedBankId(
                                                    e.target.value
                                                )
                                            }
                                            className="w-full border rounded-xl px-4 py-3"
                                        >

                                            <option value="">
                                                Sélectionner une banque
                                            </option>


                                            {banks.map(bank => (

                                                <option
                                                    key={bank.id}
                                                    value={bank.id}
                                                >

                                                    {bank.codeBank} - {bank.bankName}

                                                </option>

                                            ))}

                                        </select>

                                    </div>


                                    <div>

                                        <label className="block text-sm font-medium mb-2">
                                            Numéro de compte
                                        </label>


                                        <input
                                            value={accountNumber}
                                            onChange={(e) =>
                                                setAccountNumber(
                                                    e.target.value
                                                )
                                            }
                                            className="w-full border rounded-xl px-4 py-3"
                                        />

                                    </div>


                                    <div className="bg-green-50 rounded-xl p-4">

                                        <p>

                                            Employé :

                                            <span className="font-semibold ml-1">

                                                {accountToEdit?.employee
                                                    ?.firstName ??
                                                    "Employé inconnu"
                                                }{" "}

                                                {accountToEdit?.employee
                                                    ?.lastName ??
                                                    ""
                                                }

                                            </span>

                                        </p>

                                    </div>

                                </div>


                                <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50">

                                    <button
                                        onClick={() =>
                                            setIsEditModalOpen(false)
                                        }
                                        className="px-5 py-2 rounded-xl border"
                                    >

                                        Annuler

                                    </button>


                                    <button
                                        onClick={handleUpdate}
                                        className="px-5 py-2 rounded-xl bg-green-700 text-white"
                                    >

                                        <i className="ri-save-line mr-2"></i>

                                        Enregistrer

                                    </button>

                                </div>

                            </div>

                        </div>
                    )}


                    {/* MODALE DE SUPPRESSION */}

                    {isDeleteModalOpen &&
                        accountToDelete && (

                            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

                                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

                                    <div className="bg-red-600 h-3"></div>


                                    <div className="p-6 space-y-4">

                                        <div className="flex items-center gap-3 text-red-600">

                                            <i className="ri-error-warning-line text-3xl"></i>

                                            <h2 className="text-xl font-semibold">
                                                Confirmer la suppression
                                            </h2>

                                        </div>


                                        <p className="text-gray-600">

                                            Êtes-vous sûr de vouloir supprimer définitivement le compte bancaire de cet employé ? Cette action est irréversible.

                                        </p>


                                        <div className="bg-red-50 border border-red-100 rounded-xl p-4 space-y-1">

                                            <p className="text-sm text-gray-700">

                                                <span className="font-medium text-gray-900">
                                                    Employé :
                                                </span>{" "}

                                                <span className="uppercase font-semibold">

                                                    {accountToDelete.employee
                                                        ?.lastName ??
                                                        "Employé inconnu"}

                                                </span>{" "}

                                                {accountToDelete.employee
                                                    ?.firstName ?? ""}

                                            </p>


                                            <p className="text-sm text-gray-700">

                                                <span className="font-medium text-gray-900">
                                                    Matricule :
                                                </span>{" "}

                                                <span className="font-mono bg-white px-2 py-0.5 rounded border text-red-700">

                                                    {accountToDelete.employee
                                                        ?.matricule ?? "—"}

                                                </span>

                                            </p>


                                            <p className="text-xs text-gray-500 pt-1">

                                                Numéro de compte :{" "}

                                                {accountToDelete.accountNumber ?? "—"}

                                            </p>

                                        </div>

                                    </div>


                                    <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50">

                                        <button
                                            onClick={() => {

                                                setIsDeleteModalOpen(false);

                                                setAccountToDelete(null);

                                            }}
                                            className="px-5 py-2 rounded-xl border text-gray-700 hover:bg-gray-100"
                                        >

                                            Annuler

                                        </button>


                                        <button
                                            onClick={confirmDelete}
                                            className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium"
                                        >

                                            Supprimer

                                        </button>

                                    </div>

                                </div>

                            </div>
                        )}

                </div>

            </div>


            {/* PAGINATION */}

            {totalPages > 0 && (

                <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">

                    <Pagination
                        page={currentPage}
                        totalPages={totalPages}
                        size={pageSize}
                        onPageChange={(page) =>
                            setCurrentPage(page)
                        }
                        onSizeChange={(size) => {

                            setPageSize(size);

                            setCurrentPage(0);

                        }}
                    />

                </div>
            )}


            {loading && (

                <div className="text-center text-gray-500">
                    Chargement...
                </div>
            )}


            <Toast
                message={toastMessage}
                success={isToastSuccess}
                show={showToast}
            />

        </div>
    );
}