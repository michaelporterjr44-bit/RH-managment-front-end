"use client"

import { useState } from "react"
import { PrimeForm } from "./components/PrimeForm"
import { IndemniteForm } from "./components/IndemniteForm"
import { AvanceForm } from "./components/AvanceForm"
import { CnapsPanel } from "./components/CnapsPanel"

type TabType = "prime" | "indemnite" | "avance" | "cnaps"

export default function HRModule() {
    const [activeTab, setActiveTab] = useState<TabType>("prime")

    const tabs: { id: TabType; label: string }[] = [
        { id: "prime", label: "Prime" },
        { id: "indemnite", label: "Indemnité" },
        { id: "avance", label: "Avance" },
        { id: "cnaps", label: "CNaPS" },
    ]

    return (
        <div className="min-h-screen bg-gray-50 py-5 px-6">
            <div className="">
                {/* Tab Navigation */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4">
                    <nav className="flex space-x-0">
                        {tabs.map((tab) => {
                            // Définir une icône pour chaque tab (exemple)
                            const iconClass =
                                tab.id === "prime" ? "ri-money-dollar-circle-line" :
                                    tab.id === "indemnite" ? "ri-hand-heart-line" :
                                        tab.id === "avance" ? "ri-bank-line" :
                                            "ri-shield-user-line"; // cnaps

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-3 px-6 py-4 text-sm font-medium transition-all duration-200
            first:rounded-l-xl last:rounded-r-xl
            ${activeTab === tab.id
                                            ? "bg-gradient-to-r from-green-50 to-emerald-50 text-gray-900 border-b-2 border-green-500"
                                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    <i className={`${iconClass} h-5 w-5 text-gray-400`}></i>
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>
                <div className="flex gap-2">
                    <div className="w-full">
                        {activeTab === "prime" && <PrimeForm />}
                        {activeTab === "indemnite" && <IndemniteForm />}
                        {activeTab === "avance" && <AvanceForm />}
                        {activeTab === "cnaps" && (
                            <div className="rounded-2xl bg-white/90 p-6 shadow-md space-y-4">
                                <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                                    <i className="ri-information-line text-primary text-xl"></i>
                                    Informations CNaPS
                                </h2>

                                <p className="text-slate-700 leading-relaxed">
                                    Consultez les informations CNaPS dans le panneau de droite. Pour consulter
                                    le Salaire Minimum d'Embauche (S.M.E.) et le Plafond des Salaires Mensuels
                                    soumis à cotisation (SME x 8), cliquez sur le bouton ci-dessous.
                                </p>

                                <div>
                                    <a
                                        href="https://www.cnaps.mg/fr/historique-SME"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded-lg bg-green-700 text-white px-4 py-2 text-sm font-medium shadow-sm transition-all hover:bg-green-700 hover:shadow-md focus:ring-2 focus:ring-green-400"
                                    >
                                        Consulter le site CNaPS
                                        <i className="ri-external-link-line text-lg"></i>
                                    </a>
                                </div>
                            </div>

                        )}
                    </div>

                    <div className="">
                        <CnapsPanel />
                    </div>
                </div>
            </div>
        </div>
    )
}
