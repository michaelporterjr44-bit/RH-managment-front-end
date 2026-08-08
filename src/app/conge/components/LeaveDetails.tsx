"use client";

import React, { useState, useEffect } from "react";
import { Leave } from "@/types/leave/leave.types";
import leaveApi from "@/api/dashboard/leave/leave";
import soldeCongeApi from "@/api/dashboard/leave/soldeConge";

interface LeaveDetailsProps {
    leave: Leave;
    onBack: () => void;
    onUpdate?: (updatedLeave: Leave) => void;
}

const LeaveDetails: React.FC<LeaveDetailsProps> = ({ leave, onBack, onUpdate }) => {
    const [currentLeave, setCurrentLeave] = useState<Leave>(leave);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const [soldeTotal, setSoldeTotal] = useState<number | null>(null);
    const [soldeRestant, setSoldeRestant] = useState<number | null>(null);

    useEffect(() => {
        const fetchSolde = async () => {
            try {
                const res = await soldeCongeApi.getAll(0, 100); // 🔹 récupère les soldes existants
                const soldeEmployee = res.content.find(
                    (s) => s.employee.id === currentLeave.employee.id
                );
                if (soldeEmployee) {
                    setSoldeTotal(soldeEmployee.solde);
                    const restant = soldeEmployee.solde - currentLeave.nbreDeJour;
                    setSoldeRestant(restant >= 0 ? restant : 0);
                } else {
                    setSoldeTotal(0);
                    setSoldeRestant(0);
                }
            } catch (err) {
                console.error("Erreur récupération solde :", err);
            }
        };
        fetchSolde();
    }, [currentLeave]);

    const handleValidate = async () => {
        setLoading(true);
        try {
            const updated = await leaveApi.validateLeave(currentLeave.id);
            setCurrentLeave(updated);
            setMessage("Congé validé !");
            if (onUpdate) onUpdate(updated);
        } finally {
            setLoading(false);
        }
    };

    const handleRefuse = async () => {
        setLoading(true);
        try {
            const updated = await leaveApi.refuseLeave(currentLeave.id);
            setCurrentLeave(updated);
            setMessage("Congé refusé !");
            if (onUpdate) onUpdate(updated);
        } catch (err) {
            console.error(err);
            setMessage("Erreur lors du refus !");
        } finally {
            setLoading(false);
        }
    };

    const getStateLabel = (state: string) => {
        switch (state) {
            case "VALIDE":
                return "Validé";
            case "REFUSE":
                return "Refusé";
            case "NEW":
                return "En attente";
            case "ANNULE":
                return "Annulé";
            default:
                return state;
        }
    };

    const getStateStyle = (state: string) => {
        switch (state) {
            case "VALIDE":
                return "bg-green-50 text-green-700";
            case "REFUSE":
                return "bg-red-50 text-red-700";
            case "NEW":
                return "bg-orange-50 text-orange-700";
            case "ANNULE":
                return "bg-gray-50 text-gray-700";
            default:
                return "";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="mb-4 inline-flex items-center gap-2 text-green-700 hover:text-green-900 font-medium"
                    >
                        <i className="ri-arrow-left-line text-xl"></i>
                        Retour
                    </button>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 sm:p-8">
                        {/* Header employé */}
                        <div className="flex items-center gap-4 pb-6 border-b border-gray-200 mb-6">
                            <img
                                src={currentLeave.employee.imageProfil?.url ||
                                    `https://ui-avatars.com/api/?name=${currentLeave.employee.firstName}+${currentLeave.employee.lastName}`}
                                alt={`${currentLeave.employee.firstName} ${currentLeave.employee.lastName}`}
                                className="w-20 h-20 rounded-full object-cover shadow-sm"
                            />
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">
                                    {currentLeave.employee.firstName} {currentLeave.employee.lastName}
                                </h1>
                                <p className="text-sm text-gray-500 mt-0.5">Matricule : {currentLeave.employee.matricule ?? "EMPXXX"}</p>
                            </div>
                        </div>

                        {/* Informations du congé & solde */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Colonne 1 : infos congé */}
                            <div className="space-y-5">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <i className="ri-calendar-line text-green-600"></i>
                                    Informations du congé
                                </h2>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                                            <i className="ri-file-list-3-line text-green-600"></i>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">Type de congé</p>
                                            <p className="text-base font-medium text-gray-900 mt-0.5">{currentLeave.motif}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                                            <i className="ri-calendar-check-line text-green-600"></i>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">Date de début</p>
                                            <p className="text-base font-medium text-gray-900 mt-0.5">
                                                {new Date(currentLeave.dateDebut).toLocaleDateString("fr-FR", {
                                                    weekday: "long",
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                                            <i className="ri-calendar-close-line text-green-600"></i>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">Date de fin</p>
                                            <p className="text-base font-medium text-gray-900 mt-0.5">
                                                {new Date(currentLeave.dateFin).toLocaleDateString("fr-FR", {
                                                    weekday: "long",
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                                            <i className="ri-time-line text-green-600"></i>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">Nombre de jours</p>
                                            <p className="text-base font-medium text-gray-900 mt-0.5">{currentLeave.nbreDeJour} jours</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                                            <i className="ri-checkbox-circle-line text-green-600"></i>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">Statut</p>
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium mt-1 ${getStateStyle(
                                                    currentLeave.state
                                                )}`}
                                            >
                                                {getStateLabel(currentLeave.state)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* COLONNE 2 : solde */}
                            <div className="space-y-6">
                                <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-6 border border-green-200">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                        <i className="ri-pie-chart-2-line text-green-600"></i>
                                        Solde
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-600">Solde total</p>
                                            <p className="text-xl font-bold text-gray-900">
                                                {soldeTotal !== null ? soldeTotal + " jours" : "--"}
                                            </p>
                                        </div>

                                        <div className="h-px bg-green-200"></div>

                                        <div>
                                            <p className="text-sm text-gray-600">Solde restant après ce congé</p>
                                            <p className="text-xl font-bold text-gray-900">
                                                {soldeRestant !== null ? soldeRestant + " jours" : "--"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* ACTIONS */}
                                {currentLeave.state === "NEW" && (
                                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 flex flex-col gap-3">
                                        <button
                                            onClick={handleValidate}
                                            disabled={loading}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm"
                                        >
                                            <i className="ri-check-line"></i>
                                            Valider
                                        </button>
                                        <button
                                            onClick={handleRefuse}
                                            disabled={loading}
                                            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm"
                                        >
                                            <i className="ri-close-circle-line"></i>
                                            Refuser
                                        </button>
                                    </div>
                                )}

                                {message && <p className="text-center text-sm text-gray-600">{message}</p>}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaveDetails;
