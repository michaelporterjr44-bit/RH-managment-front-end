"use client";

import React, { useEffect, useState, useCallback } from "react";
import { getPayrollPeriods, deleteCampagnePay } from "@/api/dashboard/pay/payroll";
import { getUserProfile } from "@/api/dashboard/employee-and-user/users";
import AddPayrollModal from "./AddPayrollModal";
import { 
    StatuCampagnePaye, 
    EtatCampagnePaye, 
    CampagnePay, 
    PayrollPeriod 
} from "@/types/pay/pay";

// Import du composant de pagination partagé
import Pagination from "@/app/components/ui/Pagination";

interface PayrollListProps {
    onSelectPeriod: (period: PayrollPeriod) => void;
}

const PayrollList: React.FC<PayrollListProps> = ({ onSelectPeriod }) => {
    const [payrollPeriods, setPayrollPeriods] = useState<PayrollPeriod[]>([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    
    // État de gestion de l'autorisation
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    // États pour les modales
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [periodToDelete, setPeriodToDelete] = useState<PayrollPeriod | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    // États pour les notifications / Toast
    const [message, setMessage] = useState<string>("");
    const [success, setSuccess] = useState<boolean | null>(null);
    const [showAlert, setShowAlert] = useState(false);

    // Vérification des droits utilisateur au chargement du composant
    useEffect(() => {
        const checkUserRole = async () => {
            try {
                const profile = await getUserProfile();
                const isAdmin = profile.appRoles?.some(
                    (r: { roleName: string }) => r.roleName === "SUPER ADMIN"
                );
                setIsSuperAdmin(isAdmin);
            } catch (error) {
                console.error("Erreur lors de la récupération du profil utilisateur :", error);
            }
        };

        checkUserRole();
    }, []);

    // Fonction de conversion CampagnePay -> PayrollPeriod
    const mapCampagneToPayrollPeriod = useCallback((cp: CampagnePay): PayrollPeriod => ({
        id: cp.id,
        month: cp.periode.split("-")[1],
        year: parseInt(cp.periode.split("-")[0], 10),
        status: cp.statu,
        sonEtat: cp.etat,
        dateGeneration: cp.dateCreation,
        generatedBy: cp.emailUser,
        employeeCount: 0,
        validatedCount: 0,
    }), []);

    // Chargement des données avec Debounce sur la recherche
    useEffect(() => {
        const timer = setTimeout(async () => {
            try {
                setLoading(true);
                const response = await getPayrollPeriods(page, size, search);
                const mappedPeriods = response.content.map(mapCampagneToPayrollPeriod);

                setPayrollPeriods(mappedPeriods);
                setTotalPages(response.totalPages);
            } catch (err) {
                console.error("Erreur lors du chargement des campagnes de paie", err);
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [page, size, search, mapCampagneToPayrollPeriod]);

    // Gestion de l'affichage du Toast
    useEffect(() => {
        if (!message) return;

        setShowAlert(true);
        const timeout = setTimeout(() => {
            setShowAlert(false);
            setTimeout(() => {
                setMessage("");
                setSuccess(null);
            }, 300);
        }, 2000);

        return () => clearTimeout(timeout);
    }, [message]);

    const confirmDelete = (period: PayrollPeriod) => {
        setPeriodToDelete(period);
        setIsConfirmModalOpen(true);
    };

    const handleDeleteConfirmed = async () => {
        if (!periodToDelete) return;
        
        try {
            await deleteCampagnePay(periodToDelete.id);
            setPayrollPeriods((prev) => prev.filter((p) => p.id !== periodToDelete.id));
            setMessage("Campagne supprimée avec succès !");
            setSuccess(true);
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
            setMessage("Une erreur est survenue lors de la suppression.");
            setSuccess(false);
        } finally {
            setIsConfirmModalOpen(false);
            setPeriodToDelete(null);
        }
    };

    const handleAddPayroll = (cp: CampagnePay) => {
        const newPeriod = mapCampagneToPayrollPeriod(cp);
        setPayrollPeriods((prev) => [newPeriod, ...prev]);
        setIsAddModalOpen(false);
    };

    const getMonthName = (monthNumber: string) => {
        const months = [
            "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
            "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
        ];
        const index = parseInt(monthNumber, 10) - 1;
        return months[index] || monthNumber;
    };

    const getStatusBadge = (status: StatuCampagnePaye) => {
        switch (status) {
            case StatuCampagnePaye.VALIDE:
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                        <i className="ri-check-double-line w-3.5 h-3.5 mr-1" />
                        Validé
                    </span>
                );
            case StatuCampagnePaye.EN_COURS:
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <i className="ri-time-line w-3.5 h-3.5 mr-1" />
                        En cours
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-700 border border-gray-200">
                        {status}
                    </span>
                );
        }
    };

    const getProgression = (etat: EtatCampagnePaye | undefined): number => {
        switch (etat) {
            case EtatCampagnePaye.VERIFICATION:
                return 0;
            case EtatCampagnePaye.VALIDATION:
                return 50;
            case EtatCampagnePaye.GENERATION:
                return 100;
            default:
                return 0;
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* En-tête / Barre d'actions */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-green-100 rounded-xl flex items-center justify-center">
                                <i className="ri-wallet-3-line text-xl text-green-700" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Gestion des Paies</h2>
                                <p className="text-xs text-gray-500">
                                    Année {payrollPeriods[0]?.year ?? new Date().getFullYear()}
                                </p>
                            </div>
                        </div>

                        {/* Recherche & Ajout */}
                        <div className="flex flex-1 items-center justify-end gap-3 w-full md:w-auto">
                            <div className="relative w-full max-w-xs">
                                <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="search"
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setPage(0);
                                    }}
                                    placeholder="Rechercher une campagne..."
                                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-green-600 focus:border-green-600 outline-none transition-all"
                                />
                            </div>

                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white font-medium text-sm rounded-xl shadow-sm transition-all flex items-center gap-2 whitespace-nowrap"
                            >
                                <i className="ri-add-line text-lg" />
                                Nouvelle période
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tableau */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50/75">
                            <tr>
                                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Période
                                </th>
                                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Statut
                                </th>
                                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Progression
                                </th>
                                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Date de génération
                                </th>
                                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Généré par
                                </th>
                                <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider pr-10">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-150">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center">
                                        <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-600 border-t-transparent" />
                                            <span className="text-sm">Chargement des périodes...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : payrollPeriods.length > 0 ? (
                                payrollPeriods.map((period) => {
                                    const progression = getProgression(period.sonEtat);
                                    return (
                                        <tr
                                            key={period.id}
                                            className="hover:bg-gray-50/50 cursor-pointer transition-colors duration-150"
                                            onClick={() => onSelectPeriod(period)}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                                                        <i className="ri-calendar-event-line text-lg" />
                                                    </div>
                                                    <span className="text-sm font-semibold text-gray-900">
                                                        {getMonthName(period.month)} {period.year}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(period.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap w-[20%]">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                                        <div
                                                            className="bg-green-600 h-2 rounded-full transition-all duration-500"
                                                            style={{ width: `${progression}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-medium text-gray-500 min-w-[30px] text-right">
                                                        {progression}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {period.dateGeneration
                                                    ? new Date(period.dateGeneration).toLocaleDateString("fr-FR")
                                                    : "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                                                        <i className="ri-user-3-line text-xs text-gray-500" />
                                                    </div>
                                                    <span className="text-sm text-gray-700 font-medium max-w-[150px] truncate">
                                                        {period.generatedBy || "-"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td 
                                                className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium pr-10" 
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <div className="flex items-center justify-end gap-2">
                                                    {/* Bouton Voir - Toujours visible pour tous les utilisateurs */}
                                                    <button
                                                        onClick={() => onSelectPeriod(period)}
                                                        className="inline-flex items-center justify-center w-8 h-8 rounded-xl border border-gray-200 text-gray-600 bg-white hover:bg-green-50 hover:text-green-600 hover:border-green-200 shadow-sm transition-all duration-150"
                                                        title="Voir les détails"
                                                    >
                                                        <i className="ri-eye-line text-md" />
                                                    </button>

                                                    {/* Bouton Supprimer - Accessible UNIQUEMENT si SUPER ADMIN */}
                                                    {isSuperAdmin && (
                                                        <button
                                                            onClick={() => confirmDelete(period)}
                                                            className="inline-flex items-center justify-center w-8 h-8 rounded-xl border border-gray-200 text-red-600 bg-white hover:bg-red-50 hover:text-red-700 hover:border-red-200 shadow-sm transition-all duration-150"
                                                            title="Supprimer la campagne"
                                                        >
                                                            <i className="ri-delete-bin-line text-md" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <i className="ri-inbox-archive-line text-3xl text-gray-300" />
                                            <span className="text-sm">Aucune campagne disponible</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Notification flottante (Toast) */}
            {message && (
                <div
                    className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3.5 rounded-xl text-sm shadow-xl transition-all duration-300 transform ${
                        showAlert 
                            ? "opacity-100 translate-y-0 scale-100" 
                            : "opacity-0 translate-y-2 scale-95 pointer-events-none"
                    } ${
                        success 
                            ? "bg-green-50 text-green-800 border border-green-200" 
                            : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                >
                    <i className={`ri-notification-3-line text-lg ${success ? "text-green-600" : "text-red-600"}`} />
                    <span className="font-medium">{message}</span>
                </div>
            )}

            {/* Modale de confirmation de suppression */}
            {isConfirmModalOpen && periodToDelete && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="bg-red-600 h-3" />
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-3 text-red-600">
                                <i className="ri-error-warning-line text-3xl animate-pulse" />
                                <h2 className="text-xl font-bold">Confirmer la suppression</h2>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Êtes-vous sûr de vouloir supprimer définitivement la campagne de paie de{" "}
                                <span className="font-semibold text-gray-900">
                                    {getMonthName(periodToDelete.month)} {periodToDelete.year}
                                </span>{" "}
                                ? Toutes les données associées seront perdues. Cette action est irréversible.
                            </p>
                        </div>
                        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
                            <button
                                onClick={() => setIsConfirmModalOpen(false)}
                                className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 text-sm font-medium transition-all"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleDeleteConfirmed}
                                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium shadow-sm transition-all"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modale d'ajout de période de paie */}
            <AddPayrollModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddPayroll}
            />

            {/* Section de Pagination intégrée */}
            {totalPages > 0 && !loading && (
                <div>
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
            )}
        </div>
    );
};

export default PayrollList;