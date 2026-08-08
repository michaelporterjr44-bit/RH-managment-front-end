"use client"

import { useState, useEffect } from "react"
import { Cnaps } from "@/types/pay/cnaps"
import { getCnaps, fetchAndSaveCnaps } from "@/api/dashboard/pay/cnaps"

export function CnapsPanel() {
    const [cnapsData, setCnapsData] = useState<Cnaps | null>(null)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [errorModal, setErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        // Récupérer CNaPS au montage
        loadCnaps()
    }, [])

    const loadCnaps = async () => {
        try {
            const data = await getCnaps()
            setCnapsData(data)
        } catch (err) {
            console.error("Erreur lors du chargement du CNaPS", err)
        }
    }

    const handleRefresh = async () => {
        setIsRefreshing(true);

        try {
            const data = await fetchAndSaveCnaps();
            setCnapsData(data);

            // Clear previous errors
            setErrorModal(false);
            setErrorMessage("");
        } catch (err: any) {

            const backendMessage =
                err.response?.data?.message ?? "";

            switch (backendMessage) {

                case "Unable to connect securely to the CNAPS website.":

                    setErrorMessage(
                        "Impossible d'établir une connexion sécurisée avec le site officiel de la CNaPS.\n\nVeuillez réessayer dans quelques minutes."
                    );
                    break;

                case "Unable to retrieve data from the CNAPS website.":

                    setErrorMessage(
                        "Le site officiel de la CNaPS est momentanément indisponible.\n\nVeuillez réessayer plus tard."
                    );
                    break;

                default:

                    setErrorMessage(
                        "Une erreur inattendue est survenue."
                    );
            }

            setErrorModal(true);
        } finally {
            setIsRefreshing(false);
        }
    };

    return (
        <div className="rounded-xl bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Panel CNaPS</h3>
                <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <i className={`ri-refresh-line text-lg ${isRefreshing ? "animate-spin" : ""}`}></i>
                    Rafraîchir
                </button>
            </div>

            {cnapsData ? (
                <div className="space-y-4">
                    <div className="rounded-lg bg-slate-50 p-4">
                        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">Régime Non Agricole</p>
                        <p className="text-2xl font-bold text-slate-900">
                            {(cnapsData.regimeNonAgricole * 0.01).toFixed(2)} %
                        </p>
                    </div>


                    <div className="rounded-lg bg-slate-50 p-4">
                        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">Date d'Effet</p>
                        <p className="text-lg font-semibold text-slate-900">
                            {new Date(cnapsData.dateEffet).toLocaleDateString("fr-FR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>
                    </div>

                    <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                        <div className="flex items-start gap-2">
                            <i className="ri-information-line mt-0.5 text-green-600"></i>
                            <p className="text-sm text-green-900">
                                Les données CNaPS sont mises à jour automatiquement. Utilisez le bouton Rafraîchir pour vérifier les
                                dernières modifications.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-sm text-slate-500">Veuillez cliquer sur Rafraichir pour avoir le regime agricole actuelle s'il te plait ....</p>
            )}

            {errorModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">

                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                <i className="ri-error-warning-fill text-2xl text-red-600"></i>
                            </div>

                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Erreur CNaPS
                                </h2>

                                <p className="text-sm text-slate-500">
                                    Impossible de mettre à jour les informations.
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4">
                            <p className="whitespace-pre-line text-sm text-red-800">
                                {errorMessage}
                            </p>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setErrorModal(false)}
                                className="rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                            >
                                Fermer
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}
