"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getChannels } from "@/api/dashboard/recruitment/channels";
import { updateCampagne } from "@/api/dashboard/recruitment/campaign";
import { closeCampaignAndHired } from "@/api/dashboard/recruitment/campaign";
import { EtatCampagne } from "@/types/recruitment/campaign";
import { getPostulants } from "@/api/dashboard/recruitment/applicant";
import { getCampaignPostulants } from "@/api/dashboard/recruitment/applicant";
import { Campagne } from "@/types/recruitment/campaign";
import { Postulant } from "@/types/recruitment/applicant";
import { Canal } from "@/types/recruitment/channels";
import PostulantTable from "./PostulantTable";
import { patchCampagneEtat, patchCampagneStatu } from "@/api/dashboard/recruitment/campaign";
import { PostulantStatus } from "@/types/recruitment/postulant.enums";

interface CampaignDetailProps {
    campaign: Campagne;
    onBack: () => void;
}

const normalizeStatue = (raw?: string): "validate" | "rejected" => {
    if (!raw) return "validate";
    const s = raw
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .trim();

    if (["accepte", "accepté", "accepted", "validate", "valide"].includes(s))
        return "validate";
    if (["refuse", "refusé", "rejected"].includes(s))
        return "rejected";

    return "validate";
};



const statusOrder: Campagne['statuCampagne'][] = ['Test', 'Entretien', 'Validation', 'Recruté'];

const CampaignDetail: React.FC<CampaignDetailProps> = ({ campaign, onBack }) => {
    const router = useRouter();
    const [editedCampaign, setEditedCampaign] = useState<Campagne>(campaign);
    const [campaignPostulants, setCampaignPostulants] = useState<Postulant[]>([]);
    const [editMode, setEditMode] = useState(false);
    const [canaux, setCanaux] = useState<Canal[]>([]);

    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState("");
    const [decisionFilter, setDecisionFilter] = useState("validate");
    const [counts, setCounts] = useState({
        validate: 0,
        rejected: 0,
        hired: 0,
        all: 0,
    });
    const handleGoToInterview = () => {
        const newTab = window.open("/interview/interview-calendar", "_blank", "noopener,noreferrer");
        if (newTab) newTab.focus();
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

    const fetchPostulants = async (page = currentPage) => {
        try {
            const res = await getCampaignPostulants(
                campaign.id,
                page,
                pageSize,
                search,
                decisionFilter
            );

            setCampaignPostulants(res.content);

            setCounts({
                all: res.counts.all,
                validate: res.counts.validate,
                rejected: res.counts.rejected,
                hired: res.counts.hired,
            });

            setTotalPages(res.totalPages);
            setCurrentPage(page);

        } catch (error) {
            console.error(error);
        }
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        setCurrentPage(0);
    };

    useEffect(() => {
        if (editedCampaign.id) {
            fetchPostulants(currentPage);
        }
    }, [
        editedCampaign.id,
        currentPage,
        search,
        decisionFilter,
    ]);

    const validateCampaignStatus = async () => {
        const currentStatusIndex = statusOrder.indexOf(editedCampaign.statuCampagne);

        if (currentStatusIndex < statusOrder.length - 1) {
            const nextStatus = statusOrder[currentStatusIndex + 1];
            const newEtat = nextStatus === "Recruté" ? "CLOTURE" : "EN_COURS";

            try {
                // 1) PATCH le statut uniquement
                const updatedStatu = await patchCampagneStatu(editedCampaign.id, nextStatus);

                // 2) PATCH l'état uniquement
                const updatedEtat = await patchCampagneEtat(editedCampaign.id, newEtat);

                // Fusionner les deux
                setEditedCampaign(prev => ({
                    ...prev,
                    ...updatedStatu,
                    etat: updatedEtat.etat
                }));

                // 3) Si la campagne est Recrutée → cloture auto
                if (nextStatus === "Recruté") {
                    const msg = await closeCampaignAndHired(editedCampaign.id);
                    console.log("closeCampaignAndHired:", msg);
                }

                fetchPostulants();
            } catch (error) {
                console.error("Erreur lors de la mise à jour du statut :", error);
                alert("Erreur lors de la mise à jour du statut");
            }
        }
    };

    const getEtat = (status: EtatCampagne) => {
        switch (status) {
            case EtatCampagne.NOUVEAU:
                return (
                    <span className="flex items-center gap-1 px-3 py-2 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <i className="ri-time-line w-4 h-4 text-blue-800"></i>
                        <span>Nouveau</span>
                    </span>
                );
            case EtatCampagne.EN_COURS:
                return (
                    <span className="flex items-center gap-1 px-4 py-2 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <i className="ri-time-line w-4 h-4 text-yellow-800"></i>
                        <span>En cours</span>
                    </span>
                );
            case EtatCampagne.CLOTURE:
                return (
                    <span className="flex items-center gap-1 px-3 py-2 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <i className="ri-close-circle-line w-4 h-4 text-green-800"></i>
                        <span>Clôturé</span>
                    </span>
                );
            default:
                return (
                    <span className="flex items-center gap-1 px-2 py-2 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <i className="ri-question-line w-4 h-4 text-gray-500"></i>
                        <span>Inconnu</span>
                    </span>
                );
        }
    };

    const updateCampaignField = async (field: keyof Campagne, value: any) => {
        const payload: Partial<Campagne> = { [field]: value };

        try {
            const updated = await updateCampagne(editedCampaign.id, payload);
            setEditedCampaign(updated);
            fetchPostulants();
        } catch (error) {
            console.error(`Erreur lors de la mise à jour de ${field} :`, error);
            alert(`Impossible de mettre à jour ${field}`);
        }
    };


    const getStatusColor = (status: Campagne['statuCampagne']) => {
        switch (status) {
            case 'Test': return 'bg-yellow-100 text-yellow-800';
            case 'Entretien': return 'bg-yellow-100 text-yellow-800';
            case 'Validation': return 'bg-yellow-100 text-yellow-800';
            case 'Recruté': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const hasValidCandidates = campaignPostulants.filter(c => c.statue === PostulantStatus.VALIDATE)
    const canModify = campaign.etat != 'CLOTURE';

    const handleCancel = () => {
        setEditedCampaign(campaign);
        setEditMode(false);
    };

    const handlePostulantUpdate = async (updated: Postulant) => {

        setCampaignPostulants(prev => {

            const exists = prev.some(p => p.id === updated.id);

            let next = exists
                ? prev.map(p => p.id === updated.id ? updated : p)
                : [updated, ...prev];

            if (decisionFilter === "validate") {
                next = next.filter(p => p.statue === PostulantStatus.VALIDATE);
            }

            if (decisionFilter === "rejected") {
                next = next.filter(p => p.statue === PostulantStatus.REJECTED);
            }

            if (decisionFilter === "hired") {
                next = next.filter(p => p.statue === PostulantStatus.HIRED);
            }

            return next;
        });

        await fetchPostulants(currentPage);
    };

    const canalIcons: Record<string, string> = {
        facebook: "ri-facebook-circle-fill",
        linkedin: "ri-linkedin-box-fill",
        email: "ri-mail-fill",
        whatsapp: "ri-whatsapp-fill",
        instagram: "ri-instagram-fill",
        twitter: "ri-twitter-fill",
    };

    return (
        <div className="gap-9 p-6 flex flex-col gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="px-6 py-2 bg-green-800 rounded-t-xl">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={onBack}
                                className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                            >
                                <i className="ri-arrow-left-line"></i>
                            </button>
                            <div className="flex items-center justify-center space-x-3">
                                <i className="ri-calendar-fill text-white text-xl"></i>
                                <h1 className="text-base font-bold text-white">
                                    Campagne {editedCampaign.ref}
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 flex justify-between">
                            <span className="rounded-full text-sm font-semibold">
                                {getEtat(campaign.etat)}
                            </span>
                            <span className={`px-4 py-1 rounded-full text-sm font-semibold ${getStatusColor(editedCampaign.statuCampagne)}`}>
                                {editedCampaign.statuCampagne}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-5 flex flex-col gap-6">
                    <div className="flex flex-row gap-6">
                        <div className="flex items-center bg-gray-50 rounded-lg w-full px-4 py-2">
                            <div>
                                <div className="text-sm font-medium text-gray-500 mb-1">Référence</div>
                                <div
                                    className="text-base font-semibold text-gray-900"
                                >
                                    {editedCampaign.ref}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 bg-gray-50 p-4 rounded-lg w-full">
                            <div className="text-sm font-medium text-gray-500 w-full mb-1">Canaux</div>

                            {editedCampaign.canal.map((canal) => {
                                const iconClass = canalIcons[canal.nom.toLowerCase()];

                                return (
                                    <span
                                        key={canal.id}
                                        className="flex items-center gap-2
                                        bg-blue-100 text-blue-800 px-3
                                        py-1 rounded-full text-sm font-semibold"
                                    >
                                        <i className={iconClass}></i>
                                        {canal.nom}
                                    </span>
                                );
                            })}
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg w-full">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Date de début</label>
                            <input
                                type="date"
                                value={editedCampaign.dateDebut?.split("T")[0] || ""}
                                onChange={(e) => {
                                    const newDate = e.target.value;
                                    setEditedCampaign(prev => ({ ...prev, dateDebut: newDate }));
                                    updateCampaignField("dateDebut", newDate);
                                }}
                                disabled={editMode}
                                className={`w-full px-3 py-2 border rounded-lg text-sm 
                                    ${editMode
                                        ? "border-slate-300 bg-white"
                                        : "border-gray-300 bg-white"
                                    }`
                                }
                            />
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg w-full">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Date de fin</label>
                            <input
                                type="date"
                                value={editedCampaign.dateFin?.split("T")[0] || ""}
                                onChange={(e) => {
                                    const newDate = e.target.value;
                                    setEditedCampaign(prev => ({ ...prev, dateFin: newDate }));
                                    updateCampaignField("dateFin", newDate);
                                }}
                                disabled={editMode}
                                className={`w-full px-3 py-2
                                    border rounded-lg text-sm 
                                    ${editMode
                                        ? "border-slate-300 bg-white"
                                        : "border-gray-300 bg-white"
                                    }`
                                }
                            />

                        </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg w-full">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                        <div className="text-left flex flex-row justify-start items-center w-full">
                            <p className="bg-green-50 p-4 rounded-lg
                            mb-6 text-green-600 font-semibold
                            flex flex-col items-center justify-center
                            gap-2 w-1/2">
                                {editedCampaign.description}
                            </p>
                        </div>
                    </div>
                    {!canModify && (
                        <div className="text-center flex flex-row justify-center items-center w-full ">
                            <p className="bg-green-50 p-4 rounded-lg
                            mb-6 text-green-600 font-semibold
                            flex flex-col items-center justify-center
                            gap-2 w-1/2">
                                <i className="ri-checkbox-circle-line text-green text-sm"></i>
                                Campagne clôturée - Aucune modification possible
                                - Si vous souhaitez apporter des modifications, veuillez contacter un administrateur.
                            </p>
                        </div>
                    )}

                    {canModify && hasValidCandidates && editedCampaign.statuCampagne !== 'Recruté' && (
                        <div className="flex flex-col justify-center">
                            <div className="flex justify-center">
                                <button
                                    onClick={validateCampaignStatus}
                                    className="bg-green-800 hover:bg-green-900
                                text-white px-7 py-3 rounded-lg
                                font-semibold flex items-center
                                gap-3 transition-colors shadow-md
                                hover:shadow-lg"
                                >
                                    <i className="ri-calendar-check-fill"></i>
                                    Valider {editedCampaign.statuCampagne}
                                    <i className="ri-arrow-right-line"></i>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="">
                <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                        Progression du recrutement
                    </h3>
                    <div className="flex items-center justify-between">
                        {statusOrder.map((status, index) => (
                            <div
                                key={status}
                                onClick={() => {
                                    if (status === "Entretien")
                                        handleGoToInterview()
                                    if (status === "Test")
                                        handleGoToInterview()
                                            ;
                                }}
                                className="flex items-center cursor-pointer hover:opacity-80 transition"
                            >
                                <div
                                    className={`
                                    w-12 h-12 rounded-full flex items-center justify-center font-semibold   
                                    ${statusOrder.indexOf(editedCampaign.statuCampagne) >= index
                                            ? "bg-green-800 text-white"
                                            : "bg-gray-200 text-gray-500"
                                        }
                                `}
                                >
                                    {index + 1}
                                </div>
                                <div className="ml-3">
                                    <p
                                        className={`
                                        font-medium 
                                        ${statusOrder.indexOf(editedCampaign.statuCampagne) >= index
                                                ? "text-green-600"
                                                : "text-gray-500"
                                            }
                                    `}
                                    >
                                        {status}
                                    </p>
                                </div>
                                {index < statusOrder.length - 1 && (
                                    <div
                                        className={`
                                        w-16 h-1 mx-4 
                                        ${statusOrder.indexOf(editedCampaign.statuCampagne) > index
                                                ? "bg-green-600"
                                                : "bg-gray-200"
                                            }
                                    `}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <PostulantTable
                postulants={campaignPostulants}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={fetchPostulants}
                campaignId={editedCampaign.id}
                campaignState={editedCampaign.etat}
                onPostulantUpdate={handlePostulantUpdate}
                campaignStatuCampagne={editedCampaign.statuCampagne}
                search={search}
                setSearch={handleSearch}
                decisionFilter={decisionFilter}
                setDecisionFilter={setDecisionFilter}
                counts={counts}
            />
        </div>
    );
};

export default CampaignDetail;
