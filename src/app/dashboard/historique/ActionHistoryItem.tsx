import React from "react";
import { ActionHistory } from "@/types/recruitment/historical";
import { actionTypeConfig } from "@/config/actionTypes";

interface ActivityLogProps {
    activities: ActionHistory[];
}

const iconMap: Record<string, string> = {
    READ: "ri-eye-line",
    CREATE: "ri-add-line",
    UPDATE: "ri-edit-2-line",
    DELETE: "ri-delete-bin-line",
    EXPORT: "ri-download-2-line",
    IMPORT: "ri-upload-2-line",
    DEFAULT: "ri-information-line",
};

const ActivityLog: React.FC<ActivityLogProps> = ({ activities }) => {

    const groupActivitiesByDate = (activities: ActionHistory[]) => {
        const groups: Record<string, ActionHistory[]> = {};

        activities.forEach((activity) => {
            const date = new Date(activity.date).toLocaleDateString("fr-FR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            });

            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(activity);
        });

        return Object.entries(groups).sort(
            ([a], [b]) => new Date(b).getTime() - new Date(a).getTime()
        );
    };

    const groupedActivities = groupActivitiesByDate(activities);

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getUserInitials = (fullName: string) => {
        if (!fullName) return "?";
        const parts = fullName.trim().split(/\s+/);
        if (parts.length >= 2) {
            return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
        }
        return parts[0].substring(0, 2).toUpperCase();
    };

    /**
     * Rendu intelligent de l'observation
     * Transforme les champs modifiés entre parenthèses ou après les deux-points en badges élégants
     */
    const renderObservation = (observation: string) => {
        if (!observation) return null;

        // Cas 1: Détection des parenthèses ex: "modifier CANDIDAT (email, telephone)"
        const parenMatch = observation.match(/^(.*?)\((.*?)\)$/);
        
        // Cas 2: Détection du format du backend "champs modifiés : email, telephone"
        const colonMatch = observation.split("champs modifiés :");

        let mainText = observation;
        let fieldsList: string[] = [];

        if (parenMatch) {
            mainText = parenMatch[1].trim();
            fieldsList = parenMatch[2].split(",").map((f) => f.trim()).filter(Boolean);
        } else if (colonMatch.length > 1) {
            mainText = colonMatch[0].trim();
            fieldsList = colonMatch[1].split(",").map((f) => f.trim()).filter(Boolean);
        }

        return (
            <div className="flex flex-col gap-2">
                <span className="text-gray-800 text-sm font-medium">
                    {mainText}
                </span>

                {/* Si on a des champs modifiés, on les affiche en badges/tags */}
                {fieldsList.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-xs text-gray-400 font-medium mr-1 flex items-center gap-1">
                            <i className="ri-quill-pen-line text-amber-500"></i>
                            Modifications :
                        </span>
                        {fieldsList.map((field, idx) => (
                            <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60 shadow-2xs"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                                {field}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="w-full mx-auto p-6 bg-white rounded-xl">
            {/* Header */}
            <div className="mb-8 pb-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Fil d'activité</h2>
                <p className="text-sm text-gray-500">Historique complet des actions effectuées</p>
            </div>

            {/* Timeline */}
            <div className="space-y-12">
                {groupedActivities.map(([dateGroup, items]) => (
                    <div key={dateGroup} className="space-y-6">
                        {/* Groupe de Date */}
                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg sticky top-0 z-10">
                            <span className="text-sm font-semibold text-gray-700 capitalize flex items-center gap-2">
                                <i className="ri-calendar-todo-line text-gray-400 text-base" />
                                {dateGroup}
                            </span>
                            <span className="text-xs font-medium bg-white border border-gray-200 text-gray-600 px-2.5 py-1 rounded-full shadow-xs">
                                {items.length} {items.length > 1 ? "actions" : "action"}
                            </span>
                        </div>

                        {/* Liste des actions du jour */}
                        <div className="relative pl-6 ml-4 border-l-2 border-gray-100 space-y-6">
                            {items.map((activity) => {
                                const config = actionTypeConfig[activity.type] || {
                                    label: activity.type,
                                    bgColor: "bg-gray-50",
                                    color: "text-gray-600",
                                };

                                const iconClass = iconMap[activity.type] || iconMap.DEFAULT;
                                const initials = getUserInitials(activity.userFullName);

                                return (
                                    <div key={activity.id} className="relative group">
                                        {/* Point/Icône sur la ligne de temps */}
                                        <div className={`absolute -left-[35px] top-4 w-6 h-6 rounded-full border-4 border-white shadow-xs flex items-center justify-center ${config.bgColor} ${config.color} z-10`}>
                                            <i className={`${iconClass} text-xs font-normal`} />
                                        </div>

                                        {/* Carte d'information stylisée */}
                                        <div className="p-5 bg-white border border-gray-100 rounded-xl shadow-xs hover:shadow-md transition-all duration-200">
                                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                                {/* Badge d'action */}
                                                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider ${config.bgColor} ${config.color}`}>
                                                    {config.label}
                                                </span>
                                                {/* Heure */}
                                                <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                                                    <i className="ri-time-line text-xs"></i>
                                                    {formatTime(activity.date)}
                                                </span>
                                            </div>

                                            {/* Description & Champs modifiés */}
                                            <div className="mb-4">
                                                {renderObservation(activity.observation)}
                                            </div>

                                            {/* Pied de carte avec l'avatar */}
                                            <div className="pt-3 border-t border-gray-50 flex items-center gap-3">
                                                <div className="w-7 h-7 bg-slate-400 text-white flex items-center justify-center rounded-full text-xs font-semibold tracking-wider shadow-inner">
                                                    {initials}
                                                </div>
                                                
                                                <div className="text-xs flex flex-wrap items-center gap-1.5 font-medium">
                                                    <span className="text-gray-400 hover:underline cursor-pointer font-semibold">
                                                        {activity.userFullName}
                                                    </span>
                                                    <span className="text-gray-300">•</span>
                                                    <span className="text-gray-400 font-normal">{activity.userEmail}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityLog;