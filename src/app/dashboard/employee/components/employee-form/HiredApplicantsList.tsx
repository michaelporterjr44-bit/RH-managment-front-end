import React, { useEffect, useState } from "react";
import { Postulant } from "@/types/recruitment/applicant";
import { getAllHiredPostulants } from "@/api/dashboard/recruitment/applicant";

interface Props {
    selectedPostulant: Postulant | null;
    onSelect: (postulant: Postulant) => void;
}

const HiredApplicantsList: React.FC<Props> = ({
    selectedPostulant,
    onSelect,
}) => {
    const [postulants, setPostulants] = useState<Postulant[]>([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const loadApplicants = async (currentPage: number, keyword: string = "") => {
        try {
            const data = await getAllHiredPostulants(currentPage, 10, keyword);
            setPostulants(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadApplicants(page);
    }, [page]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setPage(0);
            loadApplicants(0, search);
        }, 400);
        return () => clearTimeout(timeout);
    }, [search]);

    // Fonction helper pour générer les initiales de l'avatar
    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    return (
        <div className="bg-slate-50/50 rounded-lg border border-slate-200 shadow-xs overflow-hidden flex flex-col h-full">
            
            {/* Header section */}
            <div className="p-5 bg-white border-b border-slate-100">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                            <i className="ri-checkbox-circle-fill text-green-800 text-xl"></i>
                            Hired Applicants
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Select an applicant to pre-fill the form
                        </p>
                    </div>
                    <span className="bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full border border-green-100">
                        Hired
                    </span>
                </div>

                {/* Search Bar */}
                <div className="relative mt-4">
                    <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                    <input
                        type="text"
                        placeholder="Search by name, email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 transition-all outline-none"
                    />
                </div>
            </div>

            {/* List Body */}
            <div className="p-4 space-y-2.5 max-h-[600px] overflow-y-auto flex-1 custom-scrollbar">
                {postulants.length === 0 && (
                    <div className="text-center text-slate-400 py-12 flex flex-col items-center gap-2">
                        <i className="ri-user-search-line text-3xl text-slate-300"></i>
                        <span className="text-sm">No applicant found.</span>
                    </div>
                )}

                {postulants.map((postulant) => {
                    const isSelected = selectedPostulant?.id === postulant.id;
                    return (
                        <div
                            key={postulant.id}
                            onClick={() => onSelect(postulant)}
                            className={`group relative flex gap-3 p-3.5 rounded-xl cursor-pointer transition-all shadow-sm bg-white ${
                                isSelected
                                    ? "border-green-400 ring-2 ring-green-500/10 shadow-sm"
                                    : "border-slate-150 hover:border-slate-300 hover:shadow-sm"
                            }`}
                        >
                            {/* Ligne d'accentuation pour l'élément sélectionné */}
                            {isSelected && (
                                <div className="absolute left-0 top-3 bottom-3 w-1 bg-green-700 rounded-r-md"></div>
                            )}

                            {/* Avatar */}
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-xs shrink-0 transition-colors ${
                                isSelected 
                                    ? "bg-green-700 text-white" 
                                    : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                            }`}>
                                {getInitials(postulant.prenom, postulant.nom)}
                            </div>

                            {/* Main Content */}
                            <div className="flex-1 min-w-0 space-y-1">
                                <div className="flex items-center justify-between gap-2">
                                    <h4 className="font-medium text-sm text-slate-800 truncate">
                                        {postulant.prenom} {postulant.nom}
                                    </h4>
                                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                                        {postulant.note}
                                    </span>
                                </div>

                                <p className="text-xs text-slate-500 flex items-center gap-1.5 truncate">
                                    <i className="ri-mail-line text-slate-400"></i>
                                    {postulant.email}
                                </p>

                                <div className="flex items-center justify-between pt-1 gap-2">
                                    <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 truncate">
                                        <i className="ri-git-repository-line"></i>
                                        {postulant.campagne.ref}
                                    </span>
                                    <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500 bg-slate-100 group-hover:bg-slate-200/70 px-2 py-0.5 rounded transition-colors shrink-0">
                                        {postulant.niveau.nom}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modernized Pagination */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-white border-t border-slate-100">
                <button
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                    title="Previous page"
                >
                    <i className="ri-arrow-left-s-line text-lg"></i>
                </button>

                <span className="text-xs font-medium text-slate-600">
                    Page <span className="text-slate-900">{page + 1}</span> sur <span className="text-slate-900">{totalPages || 1}</span>
                </span>

                <button
                    disabled={page + 1 >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                    title="Next page"
                >
                    <i className="ri-arrow-right-s-line text-lg"></i>
                </button>
            </div>
        </div>
    );
};

export default HiredApplicantsList;