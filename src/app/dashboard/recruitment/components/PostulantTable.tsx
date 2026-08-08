"use client";

import React, { useState, useEffect } from "react";
import { Postulant } from "@/types/recruitment/applicant";
import axiosInstance from "@/api/axiosInstance";
import { EtatCampagne } from "@/types/recruitment/campaign";
import { Search } from "lucide-react";
import { validatePostulant, rejectPostulant, updatePostulant } from "@/api/dashboard/recruitment/applicant";
import { PostulantStatus } from "@/types/recruitment/postulant.enums";

interface PostulantTableProps {
    postulants: Postulant[];
    onPostulantUpdate: (postulant: Postulant) => void;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    campaignId: string;
    campaignState?: EtatCampagne;
    campaignStatuCampagne?: string;
    search: string;
    setSearch: (value: string) => void;

    decisionFilter: string;
    setDecisionFilter: React.Dispatch<React.SetStateAction<string>>;

    counts: {
        validate: number;
        rejected: number;
        hired: number;
        all: number;
    };
}

const decisionFilterOptions = [
    { key: 'validate', value: 'validate', label: 'Validés' },
    { key: 'hired', value: 'hired', label: 'Recrutés' },
    { key: 'rejected', value: 'rejected', label: 'Refusés' },
];


const PostulantTable: React.FC<PostulantTableProps> = ({
    postulants,
    onPostulantUpdate,
    currentPage,
    campaignId,
    totalPages,
    onPageChange,
    campaignState,
    campaignStatuCampagne,

    search,
    setSearch,

    decisionFilter,
    setDecisionFilter,

    counts,
}: PostulantTableProps) => {

    const [editingField, setEditingField] = useState<{ postulantId: string; field: string } | null>(null);
    const [editingValue, setEditingValue] = useState<string>("");
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState<Postulant | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newPostulant, setNewPostulant] = useState({
        nom: "",
        prenom: "",
        email: "",
        observation: "",
        decision: "",
        statue:"",
        cv:"",
        niveau_id: 1,
        note: 0,
    });
    const [showReject, setShowReject] = useState(true);

    const addPostulant = async () => {
        try {
            if (!newPostulant.nom || !newPostulant.prenom) {
                alert("Le nom et prénom sont obligatoires");
                return;
            }

            const res = await axiosInstance.post(`/api/postulants`, {
                nom: newPostulant.nom,
                prenom: newPostulant.prenom,
                email: newPostulant.email,
                observation: newPostulant.observation,
                note: newPostulant.note,
                decision: newPostulant.decision,
                niveau: { id: newPostulant.niveau_id },
                campagne: { id: campaignId },
            });

            const created: Postulant = res.data;

            await onPostulantUpdate(created);

            setShowReject(false);
            setShowAddForm(false);
            setNewPostulant({
                nom: "",
                prenom: "",
                email: "",
                observation: "",
                decision: "",
                statue:"",
                cv:"",
                niveau_id: 1,
                note: 0,
            });
        } catch (error) {
            console.error("Erreur lors de l'ajout du postulant :", error);
        }
    };

    const startEditing = (postulant: Postulant, field: string) => {
        if (campaignState === EtatCampagne.CLOTURE) return;
        setEditingField({ postulantId: postulant.id, field });
        const currentValue =
            field === "niveau_id"
                ? postulant.niveau_id.toString()
                : field === "decision"
                    ? postulant.decision
                    : (postulant[field as keyof Postulant]?.toString() as string) || "";
        setEditingValue(currentValue);
    };

    const cancelEditing = () => {
        setEditingField(null);
        setEditingValue("");
    };

    const saveEditing = async (postulant: Postulant, field: string) => {
        const value =
            field === "note" || field === "niveau_id"
                ? Number(editingValue)
                : editingValue;

        try {
            const updated = await updatePostulant(postulant.id, {
                [field]: value,
            });

            await onPostulantUpdate(updated);
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
        }

        cancelEditing();
    };

    const handleRejectPostulant = async (id: string) => {
        try {
            const updated = await rejectPostulant(id);
            await onPostulantUpdate(updated);
        } catch (error) {
            console.error(error);
        }
    };

    const handleRevalidateClick = (postulant: Postulant) => {
        setSelectedPerson(postulant);
        setShowConfirmation(true);
    };

    const handleCancel = () => {
        setShowConfirmation(false);
        setSelectedPerson(null);
    };

    const handleConfirm = async () => {
        if (!selectedPerson) return;

        try {
            const updated = await validatePostulant(selectedPerson.id);
            await onPostulantUpdate(updated);
        } catch (error) {
            console.error(error);
        }

        handleCancel();
    };


    const renderEditableField = (
        postulant: Postulant,
        field: string,
        value: any,
        type = "text"
    ) => {
        const isEditing =
            editingField?.postulantId === postulant.id &&
            editingField?.field === field;

        if (isEditing) {
            return (
                <input
                    type={type}
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    onBlur={() => saveEditing(postulant, field)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") saveEditing(postulant, field);
                        if (e.key === "Escape") cancelEditing();
                    }}
                    className="w-full px-2 py-1 text-sm border border-green-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                    autoFocus
                />
            );
        }

        const displayValue =
            field === "niveau_id"
                ? postulant.niveau?.nom ?? postulant.niveau_id
                : field === "decision"
                    ? postulant.decision === "en_attente"
                        ? "En attente"
                        : postulant.decision === "accepte"
                            ? "Accepté"
                            : "Refusé"
                    : value;

        return (
            <div
                onClick={() => startEditing(postulant, field)}
                className="cursor-pointer hover:bg-green-50 px-2 py-1 rounded transition-colors min-h-[24px] flex items-center"
            >
                {displayValue ?? "-"}
            </div>
        );
    };



    const getCount = (status: string) =>
        counts?.[status as keyof typeof counts] ?? 0;

    return (

        <div>
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Postulants de la Campagne
                        </h2>
                        <button
                            onClick={() => {
                                if (campaignState === EtatCampagne.CLOTURE) return;
                                setShowAddForm(!showAddForm);
                            }}
                            disabled={campaignState === EtatCampagne.CLOTURE}
                            className={`bg-green-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors
                                ${campaignState === EtatCampagne.CLOTURE
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-green-700"
                                }`
                            }
                        >
                            <i className="ri-file-add-line"></i>
                            Ajouter Postulant
                        </button>

                    </div>


                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
                        {/* Groupe des boutons de filtre */}
                        <div className="flex flex-wrap gap-2">
                            {decisionFilterOptions.map((option) => (
                                <button
                                    key={option.key}
                                    onClick={() => setDecisionFilter(option.value)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border
                                                       ${decisionFilter === option.value
                                            ? option.value === "rejected"
                                                ? "bg-red-100 text-red-800 border-red-300"
                                                : "bg-green-100 text-green-800 border-green-300" // Simplifié ici
                                            : "text-gray-500 hover:text-gray-700 border-transparent"
                                        }`}
                                >
                                    {option.label} ({getCount(option.value)})
                                </button>
                            ))}
                        </div>

                        {/* Barre de recherche */}
                        <div className="relative w-full sm:w-[65%]">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Nom, email, campagne..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-3 h-9 text-sm bg-slate-50 border border-slate-200 rounded-lg placeholder:text-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prénom</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observation</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {showAddForm && campaignState !== EtatCampagne.CLOTURE && (
                                <tr key="new-form" className="bg-green-50 border-2 border-green-200">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                            type="text"
                                            value={newPostulant.nom}
                                            onChange={(e) => setNewPostulant({ ...newPostulant, nom: e.target.value })}
                                            placeholder="Nom *"
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                            type="text"
                                            value={newPostulant.prenom}
                                            onChange={(e) => setNewPostulant({ ...newPostulant, prenom: e.target.value })}
                                            placeholder="Prénom *"
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                            type="email"
                                            value={newPostulant.email}
                                            onChange={(e) => setNewPostulant({ ...newPostulant, email: e.target.value })}
                                            placeholder="email"
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                            type="text"
                                            value={newPostulant.statue}
                                            placeholder="Statut"
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                                            disabled
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                            type="number"
                                            value={newPostulant.note}
                                            onChange={(e) => setNewPostulant({ ...newPostulant, note: Number(e.target.value) })}
                                            placeholder="Note"
                                            min={0}
                                            max={100}
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                            type="text"
                                            value={newPostulant.observation}
                                            onChange={(e) => setNewPostulant({ ...newPostulant, observation: e.target.value })}
                                            placeholder="Observation"
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap" colSpan={2}>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={addPostulant}
                                                className="bg-green-600 hover:bg-green-700 text-white p-1 rounded transition-colors"
                                                title="Sauvegarder"
                                            >
                                                <i className="ri-save-line w-4 h-4"></i>
                                            </button>
                                            <button
                                                onClick={() => setShowAddForm(false)}
                                                className="bg-gray-600 hover:bg-gray-700 text-white p-1 rounded transition-colors"
                                                title="Annuler"
                                            >
                                                <i className="ri-close-line w-4 h-4"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {postulants.map((postulant) => (
                                <tr key={postulant.id || `temp-${Math.random()}`} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {renderEditableField(postulant, "nom", postulant.nom)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {renderEditableField(postulant, "prenom", postulant.prenom)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {renderEditableField(postulant, "email", postulant.email)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {postulant.statue}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div className="flex items-center gap-2">
                                            <i className="ri-star-fill w-4 h-4 text-yellow-500"></i>
                                            {renderEditableField(postulant, "note", postulant.note, "number")}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <div className="max-w-xs">
                                            {renderEditableField(postulant, "observation", postulant.observation)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {postulant.statue === PostulantStatus.REJECTED ? (
                                            <button
                                                onClick={() => campaignState !== EtatCampagne.CLOTURE && handleRevalidateClick(postulant)}
                                                disabled={campaignState === EtatCampagne.CLOTURE}
                                                className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition-colors
                                                    ${campaignState === EtatCampagne.CLOTURE
                                                        ? "bg-gray-400 cursor-not-allowed text-white"
                                                        : "bg-green-700 hover:bg-green-800 text-white"
                                                    }`
                                                }
                                            >
                                                <i className="ri-refresh-line"></i> Revalider
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => campaignState !== EtatCampagne.CLOTURE && handleRejectPostulant(postulant.id)}
                                                disabled={campaignState === EtatCampagne.CLOTURE}
                                                className={`px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition-colors
                                                   ${campaignState === EtatCampagne.CLOTURE
                                                        ? "bg-gray-400 cursor-not-allowed text-white"
                                                        : "bg-red-600 hover:bg-red-700 text-white"
                                                    }`
                                                }
                                            >
                                                <i className="ri-close-circle-line"></i> Rejeter
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showConfirmation && (
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
                            <div className="p-6 rounded-t-2xl">
                                <div className="flex items-center justify-start space-x-3 text-gray">
                                    <i className="ri-refresh-line w-6 h-6"></i>
                                    <h3 className="text-xl font-semibold">Confirmation de Revalidation</h3>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="text-center mb-6">
                                    <div className="w-18 h-18 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <i className="ri-user-line text-green-600"></i>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                        <p className="text-xl font-bold text-gray-800">
                                            {selectedPerson?.nom} {selectedPerson?.prenom}
                                        </p>
                                    </div>
                                    <p className="text-gray-700 text-lg">
                                        Cette action va mettre à jour le statut de validation du profil.
                                    </p>
                                    <p className="text-gray-700 text-lg mb-2">
                                        Êtes-vous sûr de vouloir revalider ce profil de
                                    </p>
                                </div>

                                <div className="flex space-x-3">
                                    <button
                                        onClick={handleCancel}
                                        className="flex-1 flex items-center
                                        justify-center space-x-2 bg-gray-100
                                        hover:bg-gray-200 text-gray-700 px-4
                                        py-3 rounded-lg font-medium
                                        transition-all duration-200"
                                    >
                                        <i className="ri-close-line w-5 h-5"></i>
                                        <span>Annuler</span>
                                    </button>
                                    <button
                                        onClick={handleConfirm}
                                        className="flex-1 flex items-center
                                        justify-center space-x-2 bg-green-800
                                        hover:to-green-800 text-white px-4 py-3 rounded-lg
                                        font-medium transition-all duration-200 transform
                                        hover:scale-105 shadow-lg"
                                    >
                                        <i className="ri-check-line w-5 h-5"></i>
                                        <span>Valider</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div >

            <div>
                <div className="flex justify-between items-center mt-4 px-6 py-3 bg-gray-50 rounded-b-lg">
                    <div className="flex space-x-1">
                        <button
                            disabled={currentPage === 0}
                            onClick={() => onPageChange(currentPage - 1)}
                            className="flex items-center rounded-md
                            border border-slate-300 py-2
                            px-3 text-center text-sm shadow-sm
                            text-slate-600 hover:text-white
                            hover:bg-slate-800 hover:border-slate-800
                            disabled:opacity-50"
                        >
                            <i className="ri-arrow-left-s-line h-4 w-4 mr-1"></i>
                            Prev
                        </button>

                        {Array.from({ length: totalPages }).map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => onPageChange(idx)}
                                className={`min-w-9 rounded-md py-2 px-3 text-center text-sm shadow-md border 
                                    ${currentPage === idx
                                        ? "bg-green-800 text-white border-transparent"
                                        : "border-slate-300 text-slate-600 hover:text-white hover:bg-green-800 hover:border-green-800"
                                    }`
                                }
                            >
                                {idx + 1}
                            </button>
                        ))}

                        <button
                            disabled={currentPage + 1 >= totalPages}
                            onClick={() => onPageChange(currentPage + 1)}
                            className="flex items-center rounded-md
                            border border-slate-300 py-2
                            px-3 text-center text-sm shadow-sm
                            text-slate-600 hover:text-white
                            hover:bg-green-800 hover:border-slate-800 disabled:opacity-50"
                        >
                            Next
                            <i className="ri-arrow-right-s-line h-4 w-4 ml-1"></i>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PostulantTable;