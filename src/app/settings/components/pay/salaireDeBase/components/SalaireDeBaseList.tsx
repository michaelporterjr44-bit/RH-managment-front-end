"use client";

import React, { useEffect, useState } from "react";
import { SalaireBase } from "@/types/pay/pay";
import { getSalaireBases, deleteSalaireBase } from "@/api/dashboard/pay/salaireBase";
import Pagination from "@/app/components/ui/Pagination";
import Toast from "@/app/components/ui/Toast";
import { updateSalaireBase } from "@/api/dashboard/pay/salaireBase";

export function SalaireDeBaseList() {
    const [salaireBases, setSalaireBases] = useState<SalaireBase[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [salaireToDelete, setSalaireToDelete] = useState<SalaireBase | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [salaireToEdit, setSalaireToEdit] = useState<SalaireBase | null>(null);

    const [editAmount, setEditAmount] = useState<number>(0);
    const [editDevise, setEditDevise] = useState("");

    // Charger les salaires de base
    const fetchSalaireBases = async () => {
        setLoading(true);
        try {
            const data = await getSalaireBases(
                page,
                size,
                searchTerm
            );

            setSalaireBases(data?.content ?? []);
            setTotalPages(data?.totalPages ?? 0);

        } catch (error) {
            console.error("Erreur chargement salaires", error);
            setSalaireBases([]); // 🔥 important
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (salaire: SalaireBase) => {
        setSalaireToDelete(salaire);
        setIsConfirmModalOpen(true);
    };

    const openEditModal = (salaire: SalaireBase) => {
        setSalaireToEdit(salaire);
        setEditAmount(salaire.baseSalaire);
        setEditDevise(salaire.devise);
        setIsEditModalOpen(true);
    };

    const handleUpdateSalaire = async () => {
        if (!salaireToEdit) return;

        try {

            const updated = await updateSalaireBase(
                salaireToEdit.id,
                {
                    baseSalaire: Number(editAmount),
                    devise: editDevise
                }
            );

            setSalaireBases(prev =>
                prev.map(s =>
                    s.id === updated.id ? updated : s
                )
            );

            setMessage("Salaire de base mis à jour avec succès");
            setSuccess(true);
            setShowToast(true);

            setIsEditModalOpen(false);

        } catch (error) {

            console.error(error);

            setMessage("Erreur lors de la mise à jour");
            setSuccess(false);
            setShowToast(true);

        }

        setTimeout(() => {
            setShowToast(false);
            setTimeout(() => setMessage(""), 300);
        }, 2500);
    };

    useEffect(() => {

        const timeout = setTimeout(() => {
            fetchSalaireBases();
        }, 400);


        return () => clearTimeout(timeout);

    }, [page, size, searchTerm]);

    // Supprimer un salaire de base
    const handleDeleteConfirmed = async () => {
        if (!salaireToDelete) return;

        const successDelete = await deleteSalaireBase(salaireToDelete.id);

        if (successDelete) {
            setSalaireBases((prev) =>
                prev.filter((s) => s.id !== salaireToDelete.id)
            );

            setMessage("Salaire de base supprimé avec succès");
            setSuccess(true);
        } else {
            setMessage("Erreur lors de la suppression du salaire de base");
            setSuccess(false);
        }

        setShowToast(true);

        setTimeout(() => {
            setShowToast(false);
            setTimeout(() => setMessage(""), 300);
        }, 2000);

        setIsConfirmModalOpen(false);
        setSalaireToDelete(null);
    };


    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <i className="ri-money-dollar-circle-line text-2xl text-green-600 mr-3"></i>
                        <h2 className="text-xl font-semibold text-gray-900">Liste des salaires de base</h2>
                    </div>

                    <div className="relative w-80">
                        <i className="ri-search-line text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"></i>
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                </div>

                <div className="overflow-hidden border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Employé
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Matricule
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Salaire de base
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Devise
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                            {salaireBases.map((s) => (
                                <tr key={s.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 max-w-[400px]">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={s.employee.imageProfil?.url ||
                                                    `https://ui-avatars.com/api/?name=${s.employee.firstName}+${s.employee.lastName}`}
                                                alt={`${s.employee.lastName} ${s.employee.firstName}`}
                                                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
                                            />
                                            <div>
                                                <div className="font-semibold text-gray-800">
                                                    <h1 className="text-sm uppercase">{s.employee.lastName}</h1>
                                                    <h1 className="text-xm font-normal">{s.employee.firstName}</h1>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {s.employee.matricule.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {s.baseSalaire.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {s.devise}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex gap-3">
                                        <button
                                            onClick={() => openEditModal(s)}
                                            className="text-green-600 hover:text-green-800 transition-colors"
                                        >
                                            <i className="ri-edit-2-line text-lg"></i>
                                        </button>
                                        <button
                                            onClick={() => confirmDelete(s)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <i className="ri-delete-bin-line"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {salaireBases.length === 0 && (
                        <div className="p-6 text-center text-gray-500">Aucun salaire de base trouvé</div>
                    )}
                </div>
            </div>

            <div className="">

                <Pagination
                    page={page}
                    totalPages={totalPages}
                    size={size}
                    onPageChange={(newPage) => setPage(newPage)}
                    onSizeChange={(newSize) => {
                        setSize(newSize);
                        setPage(0);
                    }}
                />

            </div>

            {isConfirmModalOpen && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">

                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Confirmation de suppression
                        </h2>

                        <p className="text-gray-600 mb-6">
                            Voulez-vous vraiment supprimer le salaire de base de
                            <span className="font-semibold">
                                {" "}
                                {salaireToDelete?.employee.firstName} {salaireToDelete?.employee.lastName}
                            </span>
                            ?
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsConfirmModalOpen(false)}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                            >
                                Annuler
                            </button>

                            <button
                                onClick={handleDeleteConfirmed}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                            >
                                Supprimer
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

                        <div className="bg-green-700 px-5 py-2">
                        </div>

                        <div className="p-6 space-y-5">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Salaire de base
                                </label>

                                <input
                                    type="number"
                                    value={editAmount}
                                    onChange={(e) =>
                                        setEditAmount(Number(e.target.value))
                                    }
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Devise
                                </label>
                                <input
                                    type="text"
                                    value={editDevise}
                                    onChange={(e) =>
                                        setEditDevise(e.target.value)
                                    }
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                />
                            </div>

                            <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                                <p className="text-sm text-green-700">
                                    Employé :
                                    <span className="font-semibold ml-1">
                                        {salaireToEdit?.employee.firstName}{" "}
                                        {salaireToEdit?.employee.lastName}
                                    </span>
                                </p>
                            </div>

                        </div>

                        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50">

                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-5 py-2.5 rounded-xl bg-white border border-gray-300 hover:bg-gray-100 transition"
                            >
                                Annuler
                            </button>

                            <button
                                onClick={handleUpdateSalaire}
                                className="px-5 py-2.5 rounded-xl bg-green-700 text-white hover:bg-green-800 transition flex items-center gap-2"
                            >
                                <i className="ri-save-line"></i>
                                Enregistrer
                            </button>

                        </div>

                    </div>

                </div>
            )}

            <Toast message={message} success={success} show={showToast} />

            {loading && <div className="text-center text-gray-500">Chargement...</div>}
        </div>
    );
}
