"use client"


import { useState, useEffect } from "react";
importPrimesFromExcel
import { importPrimesFromExcel } from "@/api/dashboard/pay/prime";

export function PrimeForm() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleImport = async () => {
        if (!url) return;
        setLoading(true);
        setError(null);
        try {
            const data = await importPrimesFromExcel(url);
            setResult(data);
        } catch (err) {
            setError("Impossible d'importer les primes");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-2xl bg-white p-6 shadow-md">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Importer les Primes via Excel</h3>

            <div className="flex gap-3">
                <input
                    type="text"
                    placeholder="Collez l’URL Google Sheets"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1 rounded-lg border border-slate-300 px-4 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                />
                <button
                    onClick={handleImport}
                    disabled={loading || !url}
                    className="rounded-lg bg-green-700 px-6 py-2 text-white hover:bg-green-800 disabled:opacity-50"
                >
                    {loading ? "Import..." : "Importer"}
                </button>
            </div>

            {error && <p className="mt-3 text-sm text-red-500">{error}</p>}


            {result.length > 0 && (
                <div className="mt-6 space-y-4">
                    {/* ✅ Bandeau de succès */}
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 border border-green-200">
                        <i className="ri-check-line text-green-600 text-xl"></i>
                        <p className="text-sm font-medium text-green-800">
                            Données importées avec succès !
                        </p>
                    </div>

                    {/* 👇 Liste des employés avec leurs primes */}
                    <div className="space-y-3">
                        {result.map((item, i) => {
                            const employee = item.employee;
                            return (
                                <div
                                    key={i}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                                >
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src={
                                                employee.imageProfil?.url ||
                                                `https://ui-avatars.com/api/?name=${employee.firstName}+${employee.lastName}`
                                            }
                                            alt={`${employee.lastName} ${employee.firstName}`}
                                            className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {employee.firstName} {employee.lastName}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {employee.matricule} • {employee.email}
                                            </p>
                                            <div className="flex items-center space-x-2 mt-1">
                                                {employee.agence?.name && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                        {employee.agence.name}
                                                    </span>
                                                )}
                                                {employee.department && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                                                        {employee.department}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-green-700">
                                            {item.prime.toLocaleString()} Ar
                                        </p>
                                        <p className="text-xs text-gray-500">Prime</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
