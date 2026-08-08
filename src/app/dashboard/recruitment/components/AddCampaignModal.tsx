import React, { useState, useEffect } from "react";
import { createCampagne } from "@/api/dashboard/recruitment/campaign";
import { getChannels } from "@/api/dashboard/recruitment/channels";
import { getCampagneByRef } from "@/api/dashboard/recruitment/campaign";
import { Campagne, CampagneAdded } from "@/types/recruitment/campaign";
import { Canal } from "@/types/recruitment/channels";

export interface AddCampagneModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (newCampaign: Campagne) => void;
}

export default function AddCampaignModal({ isOpen, onClose, onAdd }: AddCampagneModalProps) {
    const [formData, setFormData] = useState<CampagneAdded>({
        ref: "",
        dateDebut: "",
        dateFin: "",
        etat: "NOUVEAU",
        agenceCode: "",
        description: "",
        canal: [{ id: 0 }],
    });

    const [canaux, setCanaux] = useState<Canal[]>([]);
    const [selectedCanaux, setSelectedCanaux] = useState<Canal[]>([]);
    const [showChannelList, setShowChannelList] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const showToast = (type: "success" | "error", message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };


    useEffect(() => {
        const fetchCanaux = async () => {
            try {
                const response = await getChannels();
                setCanaux(response);
            } catch (error) {
                console.error("Erreur de récupération des canaux :", error);
            }
        };
        fetchCanaux();
    }, []);

    if (!isOpen) return null;

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const canalIcons: Record<string, string> = {
        facebook: "ri-facebook-circle-fill",
        linkedin: "ri-linkedin-box-fill",
        email: "ri-mail-fill",
        whatsapp: "ri-whatsapp-fill",
        instagram: "ri-instagram-fill",
        twitter: "ri-twitter-fill",
    };


    const addCanal = (canal: Canal) => {
        if (!selectedCanaux.find((c) => c.id === canal.id)) {
            setSelectedCanaux((prev) => [...prev, canal]);
        }
        setShowChannelList(false);
    };

    const removeCanal = (canalId: number) => {
        setSelectedCanaux((prev) => prev.filter((c) => c.id !== canalId));
    };

    const handleSave = async () => {
        if (!formData.ref || !formData.dateDebut || !formData.dateFin || selectedCanaux.length === 0) {
            showToast("error", "Veuillez remplir tous les champs et sélectionner au moins un canal.");
            return;
        }

        try {
            setLoading(true);

            const existing = await getCampagneByRef(formData.ref);
            if (existing) {
                showToast("error", "Une campagne avec cette référence existe déjà.");
                return;
            }

            const campaignToSave: CampagneAdded = {
                ...formData,
                canal: selectedCanaux.map(c => ({ id: c.id }))
            };

            const newCampaign = await createCampagne(campaignToSave);
            const newCampaignWithCanaux = { ...newCampaign, canal: selectedCanaux };

            onAdd(newCampaignWithCanaux);
            setFormData({ ref: "", dateDebut: "", dateFin: "", etat: "NOUVEAU", agenceCode: "10002", description: "", canal: [{ id: 0 }] });
            setSelectedCanaux([]);
            showToast("success", `Campagne ${newCampaign.ref} ajoutée avec succès.`);
            setTimeout(() => {
                onClose();
            }, 2000);

        } catch (err) {
            console.error("Erreur lors de l'ajout de la campagne", err);
            showToast("error", "Impossible d’ajouter la campagne.");
        } finally {
            setLoading(false);
        }
    };

    const availableToAdd = canaux.filter(
        (canal) => !selectedCanaux.find((selected) => selected.id === canal.id)
    );

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <h2 className="text-2xl font-medium text-gray-900">Nouvelle Campagne</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <i className="ri-close-line w-5 h-5 text-gray-500"></i>
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="flex items-center text-sm font-semibold text-gray-700">
                            <i className="ri-hashtag"></i>
                            Référence de campagne
                        </label>
                        <input
                            type="text"
                            name="ref"
                            value={formData.ref}
                            onChange={handleInputChange}
                            placeholder="Ex: CAMP-2025-001"
                            className="w-full px-4 py-3 border
                            border-gray-300 rounded-xl
                            focus:ring-2 focus:ring-green-500 
                            focus:border-transparent transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-semibold text-gray-700">
                                <i className="ri-calendar-fill"></i>
                                Date de début
                            </label>
                            <input
                                type="date"
                                name="dateDebut"
                                value={formData.dateDebut}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3
                                border border-gray-300 rounded-xl
                                focus:ring-2 focus:ring-green-500
                                focus:border-transparent transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center text-sm font-semibold text-gray-700">
                                <i className="ri-calendar-fill"></i>
                                Date de fin
                            </label>
                            <input
                                type="date"
                                name="dateFin"
                                value={formData.dateFin}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3
                                border border-gray-300
                                rounded-xl focus:ring-2
                                focus:ring-green-500
                                focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                    <div className="grid">
                        <div>
                            <label className="block text-sm font-600 text-slate-700 mb-1.5">
                                Description
                            </label>
                            <p className="text-xs text-slate-400 mb-2">Description du campagne </p>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                                placeholder="Décrivez le type du campagne..."
                                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all placeholder:text-slate-400 resize-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="flex items-center text-sm font-semibold text-gray-700">
                            <i className="ri-focus-2-line"></i>
                            Canaux de diffusion
                        </label>

                        {selectedCanaux.map((canal) => {
                            const iconClass = canalIcons[canal.nom.toLowerCase()];
                            return (
                                <div
                                    key={canal.id}
                                    className="w-1/3 bg-green-700
                                    text-white px-3 py-2
                                    rounded-lg flex items-center
                                    justify-between text-sm font-medium"
                                >
                                    <div className="flex flex-row justify-center items-center gap-2">
                                        <i className={iconClass}></i>
                                        <span>{canal.nom}</span>
                                    </div>
                                    <button
                                        onClick={() => removeCanal(canal.id)}
                                        className=" hover:bg-opacity-20 p-0.5 transition-colors"
                                    >
                                        <i className="ri-close-line w-5 h-5 text-gray-200"></i>
                                    </button>
                                </div>
                            );
                        })}

                        {availableToAdd.length > 0 && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowChannelList(!showChannelList)}
                                    className="flex items-center
                                    space-x-2 px-4 py-3 border-2
                                    border-dashed border-gray-300
                                    rounded-xl hover:border-green-500
                                    hover:bg-green-50 transition-all
                                    w-full text-left"
                                >
                                    <i className="ri-add-line"></i>
                                    <span className="text-gray-600">Ajouter des canaux</span>
                                </button>

                                {showChannelList && (
                                    <div className="absolute top-full
                                    left-0 right-0 mt-2 bg-white border
                                    border-gray-200 rounded-xl shadow-lg
                                    z-10 max-h-48 overflow-y-auto">

                                        {availableToAdd.map((canal) => {
                                            const iconClass = canalIcons[canal.nom.toLowerCase()] || "ri-global-line";
                                            return (
                                                <button
                                                    key={canal.id}
                                                    onClick={() => addCanal(canal)}
                                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors first:rounded-t-xl last:rounded-b-xl"
                                                >
                                                    <i className={iconClass}></i>
                                                    <span className="font-medium text-gray-700">{canal.nom}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>

                <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 text-gray-700
                        bg-white border border-gray-300 rounded-xl
                        hover:bg-green-50"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={
                            !formData.ref || !formData.dateDebut || !formData.dateFin || selectedCanaux.length === 0 || loading
                        }
                        className="px-6 py-3 bg-green-800
                        text-white rounded-xl
                        hover:bg-green-700"

                    >
                        {loading ? "Ajout..." : "Créer la campagne"}
                    </button>
                </div>
            </div>

            {toast && (
                <div className="absolute bottom-[2vh] left-1/2 transform -translate-x-1/2">
                    {toast.type === "success" && (
                        <div className="flex items-center w-full max-w-sm p-3 mt-3 text-green-800 bg-green-100 border border-green-300 rounded-lg shadow-sm backdrop-blur-sm">
                            <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 text-green-600 bg-white/60 rounded-lg">
                                <i className="ri-checkbox-circle-line text-base"></i>
                            </div>
                            <div className="ms-3 text-xs font-medium">{toast.message}</div>
                        </div>
                    )}
                    {toast.type === "error" && (
                        <div className="flex items-center w-full max-w-sm p-3 mt-3 text-red-800 bg-red-100 border border-red-300 rounded-lg shadow-sm backdrop-blur-sm">
                            <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 text-red-600 bg-white/60 rounded-lg">
                                <i className="ri-close-circle-line text-base"></i>
                            </div>
                            <div className="ms-3 text-xs font-medium">{toast.message}</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
