'use client';

import React, { useState, useMemo } from 'react';
import { Search, Users } from 'lucide-react';
import { Postulant } from '@/types/recruitment/applicant';
import CandidateCard from '@/components/interviews/CandidateCard';
import { getPostulants } from '@/api/dashboard/recruitment/applicant';
import { useEffect } from 'react';
import { PostulantStatus } from '@/types/recruitment/postulant.enums';

// Backend integration point: replace mockPostulants with getAllPostulants(page, size, search)

interface CandidateListPanelProps {
    selectedPostulantId: string | null;
    onSelect: (postulant: Postulant) => void;
}

const decisionFilterOptions = [
    { key: 'all', value: '', label: 'Tous' },
    { key: 'validate', value: PostulantStatus.VALIDATE, label: 'Validés' },
    { key: 'hired', value: PostulantStatus.HIRED, label: 'Recrutés' },
    { key: 'rejected', value: PostulantStatus.REJECTED, label: 'Refusés' },
];

export default function CandidateListPanel({ selectedPostulantId, onSelect }: CandidateListPanelProps) {
    const [search, setSearch] = useState('');
    const [decisionFilter, setDecisionFilter] = useState('');
    const [postulants, setPostulants] = useState<Postulant[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {

        const fetchData = async () => {

            const res = await getPostulants(
                page,
                20,
                search,
                decisionFilter
            );

            setPostulants(res.content);
            setTotalPages(res.totalPages);

        };

        const timeout = setTimeout(fetchData, 300);

        return () => clearTimeout(timeout);

    }, [page, search, decisionFilter]);

    return (
        <>
            {/* Panel header */}
            <div className="px-4 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                    <Users size={16} className="text-slate-500" />
                </div>

                {/* Search */}
                <div className="relative mb-3">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Nom, email, campagne..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-3 h-9 text-sm bg-slate-50 border border-slate-200 rounded-lg placeholder:text-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                    />
                </div>

                {/* Decision filter chips */}
                <div className="flex items-center gap-1.5 flex-wrap">
                    {decisionFilterOptions.map((opt) => (
                        <button
                            key={opt.key}
                            onClick={() => setDecisionFilter(opt.value)}
                            className={`px-2.5 h-6 text-[11px] font-600 rounded-full transition-all duration-150 ${decisionFilter === opt.value
                                ? 'bg-green-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Candidate list */}
            <div className="flex-1 overflow-y-auto scrollbar-thin px-3 py-3 space-y-2">
                {postulants.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Users size={32} className="text-slate-300 mb-3" />
                        <p className="text-sm font-600 text-slate-500">Aucun candidat trouvé</p>
                        <p className="text-xs text-slate-400 mt-1">Modifiez votre recherche ou les filtres</p>
                    </div>
                ) : (
                    postulants.map((postulant) => (
                        <CandidateCard
                            key={`candidate-${postulant.id}`}
                            postulant={postulant}
                            selected={selectedPostulantId === postulant.id}
                            onClick={() => onSelect(postulant)}
                            compact
                        />
                    ))
                )}
            </div>

            {/* Selected hint */}
            {selectedPostulantId && (
                <div className="px-4 py-3 border-t border-slate-100 bg-green-50">
                    <p className="text-xs text-green-700 font-600">
                        ✓ Candidat sélectionné — le formulaire a été pré-rempli
                    </p>
                </div>
            )}
        </>
    );
}