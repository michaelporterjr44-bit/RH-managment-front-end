"use client";

import { useEffect, useState } from "react";
import { getActionHistory } from "@/api/dashboard/recruitment/historical";
import { ActionHistory } from "@/types/recruitment/historical";
import ActivityLog from "./ActionHistoryItem";

export default function HistoryList() {

    const [history, setHistory] = useState<ActionHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [showTypeList, setShowTypeList] = useState(false);

    const [filters, setFilters] = useState({
        userEmail: "",
        type: "",
        page: 0,
        size: 100,
    });

    const fetchHistory = async (silent = false) => {

        if (!silent) setLoading(true);

        try {
            const data = await getActionHistory({
                userEmail: filters.userEmail || undefined,
                type: filters.type || undefined,
                page: filters.page,
                size: filters.size,
            });

            setHistory(data.content);

        } finally {
            if (!silent) setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();

        const interval = setInterval(() => {
            fetchHistory(true);
        }, 5000);

        return () => clearInterval(interval);
    }, [filters]);


    return (
        <div>
            <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <i className="ri-search-line w-4 h-4"></i>
                        Recherche
                    </label>
                    <div className="relative">
                        <input
                            type="email"
                            className="w-full px-3 py-1.5 bg-white border border-gray-300 text-sm rounded-lg text-gray-950 placeholder-gray-400 focus:outline-none focus:border-blue-500 shadow-sm transition duration-200"
                            placeholder="Email utilisateur..."
                            onChange={(e) =>
                                setFilters(prev => ({
                                    ...prev,
                                    userEmail: e.target.value
                                }))
                            }
                        />
                    </div>
                </div>

                {/* Menu déroulant Type d'action (Façon Département) */}
                <div className="min-w-[200px]">
                    <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <i className="ri-filter-3-line w-4 h-4"></i>
                        Type d'action
                    </label>

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowTypeList(!showTypeList)}
                            className="w-full px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:border-blue-500 transition flex justify-between items-center shadow-sm"
                        >
                            <span className="text-gray-700">
                                {filters.type === "CREATE" && "Création (CREATE)"}
                                {filters.type === "UPDATE" && "Modification (UPDATE)"}
                                {filters.type === "DELETE" && "Suppression (DELETE)"}
                                {!filters.type && "Toutes les actions"}
                            </span>
                            <i className={`ri-arrow-down-s-line transition-transform duration-200 ${showTypeList ? 'rotate-180' : ''}`}></i>
                        </button>

                        {showTypeList && (
                            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto py-1">
                                {[
                                    { value: "", label: "Toutes les actions" },
                                    { value: "CREATE", label: "Création (CREATE)" },
                                    { value: "UPDATE", label: "Modification (UPDATE)" },
                                    { value: "DELETE", label: "Suppression (DELETE)" }
                                ].map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => {
                                            setFilters((prev) => ({
                                                ...prev,
                                                type: opt.value,
                                            }));
                                            setShowTypeList(false);
                                        }}
                                        className={`w-full px-3 py-2 text-left hover:bg-gray-50 text-sm transition-colors ${filters.type === opt.value ? "bg-blue-50/50 text-blue-600 font-medium" : "text-gray-700"
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                <ActivityLog activities={history} />
            </div>

        </div>
    );
}