"use client";

import React, { useState, useEffect } from 'react';
import { Campagne, EtatCampagne } from '@/types/recruitment/campaign';
import { getCampagne, deleteCampagne } from '@/api/dashboard/recruitment/campaign';
import AddCampaignModal from './AddCampaignModal';
import { getUserProfile } from '@/api/dashboard/employee-and-user/users'; // Ajustez le chemin d'importation si nécessaire

/* ==========================================
   COMPOSANT PAGINATION (Votre code d'origine)
   ========================================== */
interface PaginationProps {
    page: number;
    totalPages: number;
    size: number;
    onPageChange: (page: number) => void;
    onSizeChange: (size: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    page,
    totalPages,
    size,
    onPageChange,
    onSizeChange,
}) => {
    // Génère les numéros de page avec des "..." pour éviter le débordement
    const getPaginationItems = () => {
        const items: (number | string)[] = [];
        const maxVisiblePages = 5; // Nombre maximum de boutons numériques visibles au milieu

        if (totalPages <= maxVisiblePages + 2) {
            // Si on a peu de pages, on les affiche toutes
            for (let i = 0; i < totalPages; i++) {
                items.push(i);
            }
        } else {
            // Toujours afficher la première page
            items.push(0);

            // Calculer le début et la fin de la plage centrale autour de la page active
            let start = Math.max(1, page - 1);
            let end = Math.min(totalPages - 2, page + 1);

            // Ajuster si on est proche du début ou de la fin
            if (page <= 2) {
                end = 3;
            } else if (page >= totalPages - 3) {
                start = totalPages - 4;
            }

            // Ajouter les points de suspension au début si nécessaire
            if (start > 1) {
                items.push("...");
            }

            // Ajouter les pages centrales
            for (let i = start; i <= end; i++) {
                items.push(i);
            }

            // Ajouter les points de suspension à la fin si nécessaire
            if (end < totalPages - 2) {
                items.push("...");
            }

            // Toujours afficher la dernière page
            items.push(totalPages - 1);
        }

        return items;
    };

    return (
        <div className="flex justify-between items-center bg-gray-50 rounded-b-lg p-3 w-full flex-wrap gap-4 border-t border-slate-100">
            {/* Partie Navigation GAUCHE */}
            <div className="flex items-center space-x-1 py-2">
                {/* Précédent */}
                <button
                    disabled={page === 0}
                    onClick={() => onPageChange(Math.max(page - 1, 0))}
                    className="rounded-md border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm 
                    hover:shadow-lg text-slate-600 hover:text-white hover:bg-green-800 hover:border-slate-800 
                    disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2 flex items-center bg-white"
                >
                    <i className="ri-arrow-left-s-line mr-1"></i>
                    Prev
                </button>

                {/* Boutons Dynamiques ("..." inclus) */}
                {getPaginationItems().map((item, index) => (
                    <button
                        key={index}
                        disabled={item === "..."}
                        onClick={() => typeof item === "number" && onPageChange(item)}
                        className={`w-9 h-9 rounded-md text-center text-sm font-medium transition-all border ${item === page
                                ? "bg-green-800 border-green-800 text-white"
                                : item === "..."
                                    ? "border-transparent text-gray-400 bg-transparent cursor-default"
                                    : "border-slate-300 bg-white text-slate-600 hover:bg-gray-100"
                            }`}
                    >
                        {typeof item === "number" ? item + 1 : item}
                    </button>
                ))}

                {/* Suivant */}
                <button
                    disabled={page === totalPages - 1 || totalPages === 0}
                    onClick={() => onPageChange(Math.min(page + 1, totalPages - 1))}
                    className="rounded-md border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm 
                    hover:shadow-lg text-slate-600 hover:text-white hover:bg-green-800 hover:border-slate-800 
                    disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2 flex items-center bg-white"
                >
                    Next
                    <i className="ri-arrow-right-s-line ml-1"></i>
                </button>
            </div>

            {/* Partie Infos & Taille de Page DROITE */}
            <div className="flex items-center gap-4">
                <div className="text-sm text-slate-600">
                    Page <b>{page + 1}</b> sur <b>{totalPages || 1}</b>
                </div>

                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700">Afficher :</label>
                    <select
                        value={size}
                        onChange={(e) => onSizeChange(Number(e.target.value))}
                        className="border border-gray-300 rounded px-2 py-1 text-sm bg-white outline-none focus:border-slate-400"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

/* ==========================================
   COMPOSANT PRINCIPAL (CampaignList)
   ========================================== */
interface CampaignListProps {
    onCampaignSelect: (campaign: Campagne) => void;
}

type ToastType = "success" | "error" | null;

const CampaignList: React.FC<CampaignListProps> = ({ onCampaignSelect }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [campaignList, setCampaignList] = useState<Campagne[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [search, setSearch] = useState("");
    const [totalPages, setTotalPages] = useState(0);

    const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState<Campagne | null>(null);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    // Vérification du rôle de l'utilisateur
    useEffect(() => {
        const checkUserRole = async () => {
            try {
                const profile = await getUserProfile();
                const isAdmin = profile?.appRoles?.some(
                    (r: { roleName: string }) => r.roleName === "SUPER ADMIN"
                );
                setIsSuperAdmin(!!isAdmin);
            } catch (err) {
                console.error("Erreur lors de la récupération du profil :", err);
            }
        };
        checkUserRole();
    }, []);

    useEffect(() => {
        const timer = setTimeout(async () => {
            try {
                setLoading(true);
                const res = await getCampagne(page, size, search);
                setCampaignList(res.content);
                setTotalPages(res.totalPages);
            } catch (err) {
                console.error(err);
                setError("Impossible de charger les campagnes.");
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [page, size, search]);

    const confirmDelete = async () => {
        if (!selectedCampaign) return;

        try {
            await deleteCampagne(selectedCampaign.id);
            setCampaignList((prev) => prev.filter((c) => c.id !== selectedCampaign.id));
            showToast("success", `Campagne ${selectedCampaign.ref} supprimée avec succès.`);
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
            showToast("error", "Impossible de supprimer la campagne.");
        } finally {
            setTimeout(() => {
                setShowConfirm(false);
                setSelectedCampaign(null);
            }, 1000);
        }
    };

    const showToast = (type: ToastType, message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 1000);
    };

    const handleAddCampaign = (newCampaign: Campagne) => {
        setCampaignList(prev => [newCampaign, ...prev]);
    };

    const getEtat = (status: EtatCampagne) => {
        const baseStyle = "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border";
        switch (status) {
            case EtatCampagne.NOUVEAU:
                return (
                    <span className={`${baseStyle} bg-blue-50 text-blue-700 border-blue-200`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                        Nouveau
                    </span>
                );
            case EtatCampagne.EN_COURS:
                return (
                    <span className={`${baseStyle} bg-amber-50 text-amber-700 border-amber-200`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        En cours
                    </span>
                );
            case EtatCampagne.CLOTURE:
                return (
                    <span className={`${baseStyle} bg-emerald-50 text-emerald-700 border-emerald-200`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Clôturé
                    </span>
                );
            default:
                return (
                    <span className={`${baseStyle} bg-slate-50 text-slate-700 border-slate-200`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        Inconnu
                    </span>
                );
        }
    };

    return (
        <div className="p-6 w-full relative min-h-screen bg-slate-50/50">
            {/* Loader de chargement */}
            {loading && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10">
                    <div className="flex flex-col items-center space-y-3 bg-white p-6 rounded-xl shadow-xl border border-slate-100">
                        <i className="ri-loader-4-line animate-spin text-3xl text-green-600"></i>
                        <span className="text-sm font-semibold text-slate-700">Chargement des données...</span>
                    </div>
                </div>
            )}

            {error && (
                <div className="p-4 mb-6 text-sm text-red-800 rounded-lg bg-red-50 border border-red-100 flex items-center gap-2">
                    <i className="ri-error-warning-line text-lg"></i>
                    <span className="font-medium">{error}</span>
                </div>
            )}

            {!error && (
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                    {/* Header moderne sans fond vert */}
                    <div className="px-6 py-5 border-b border-slate-200">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-lg font-bold text-slate-900">Campagnes de recrutement</h1>
                                <p className="text-xs text-slate-500 mt-0.5">Gérez et suivez vos différentes campagnes de recrutement en temps réel.</p>
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <div className="relative flex-1 md:w-80">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <i className="ri-search-line text-slate-400 text-sm"></i>
                                    </div>
                                    <input
                                        type="search"
                                        value={search}
                                        onChange={(e) => {
                                            setSearch(e.target.value);
                                            setPage(0);
                                        }}
                                        placeholder="Référence ou description..."
                                        className="w-full rounded-md border border-slate-200 py-2 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                    />
                                </div>

                                {/* Bouton Nouvelle Campagne épuré */}
                                <button
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white font-medium text-sm rounded-xl shadow-sm transition-all flex items-center gap-2 whitespace-nowrap"
                                >
                                    <i className="ri-add-line text-lg"></i>
                                    <span>Nouvelle Campagne</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tableau épuré */}
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/75">
                                    <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Canal</th>
                                    <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Référence</th>
                                    <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date Début</th>
                                    <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date Fin</th>
                                    <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">État</th>
                                    <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {campaignList.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">
                                            Aucune campagne trouvée
                                        </td>
                                    </tr>
                                ) : (
                                    campaignList.map((campaign) => (
                                        <tr
                                            key={campaign.id}
                                            className="hover:bg-slate-50/50 cursor-pointer transition-colors"
                                            onClick={() => onCampaignSelect(campaign)}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="p-1.5 rounded-md bg-green-50 text-green-600">
                                                        <i className="ri-price-tag-3-line text-sm"></i>
                                                    </span>
                                                    <span className="font-medium text-slate-800 text-sm">
                                                        {campaign.canal[0]?.nom || 'N/A'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-slate-900 text-sm">{campaign.ref}</td>
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                <div className="flex items-center gap-1.5">
                                                    <i className="ri-calendar-line text-slate-400"></i>
                                                    {new Date(campaign.dateDebut).toLocaleDateString('fr-FR')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                <div className="flex items-center gap-1.5">
                                                    <i className="ri-calendar-line text-slate-400"></i>
                                                    {new Date(campaign.dateFin).toLocaleDateString('fr-FR')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {getEtat(campaign.etat)}
                                            </td>
                                            <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => onCampaignSelect(campaign)}
                                                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                                                        title="Voir les détails"
                                                    >
                                                        <i className="ri-eye-line text-lg"></i>
                                                    </button>
                                                    <button
                                                        disabled={!isSuperAdmin}
                                                        onClick={() => {
                                                            setSelectedCampaign(campaign);
                                                            setShowConfirm(true);
                                                        }}
                                                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        title={isSuperAdmin ? "Supprimer" : "Action réservée aux Super Admins"}
                                                    >
                                                        <i className="ri-delete-bin-line text-lg"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {showConfirm && selectedCampaign && (
                <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-[4px] flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl border border-slate-100 max-w-sm w-full overflow-hidden transition-all">
                        <div className="p-6 text-center">
                            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-md flex items-center justify-center mx-auto mb-4 border border-rose-100">
                                <i className="ri-delete-bin-6-line text-xl"></i>
                            </div>
                            <h3 className="text-base font-bold text-slate-900">Supprimer la campagne ?</h3>
                            <p className="text-slate-500 text-xs mt-1 mb-6">
                                Êtes-vous sûr de vouloir supprimer la campagne <span className="font-semibold text-slate-800">{selectedCampaign.ref}</span> ? Cette action est irréversible.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-md text-sm font-semibold transition-all"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white px-4 py-2 rounded-md text-sm font-semibold transition-all shadow-sm"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </div>

                    {toast && (
                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-[60]">
                            {toast.type === "success" && (
                                <div className="flex items-center gap-2.5 px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md shadow-lg">
                                    <i className="ri-checkbox-circle-fill text-emerald-600 text-lg"></i>
                                    <span className="text-xs font-semibold">{toast.message}</span>
                                </div>
                            )}

                            {toast.type === "error" && (
                                <div className="flex items-center gap-2.5 px-4 py-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-md shadow-lg">
                                    <i className="ri-close-circle-fill text-rose-600 text-lg"></i>
                                    <span className="text-xs font-semibold">{toast.message}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            <AddCampaignModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddCampaign}
            />

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
    );
};

export default CampaignList;