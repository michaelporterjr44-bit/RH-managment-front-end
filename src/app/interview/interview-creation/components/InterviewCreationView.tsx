'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Postulant } from '@/types/recruitment/applicant';
import CandidateListPanel from './CandidateListPanel';
import InterviewForm from './InterviewFormProps';

export default function InterviewCreationView() {
  const router = useRouter();
  const [selectedPostulant, setSelectedPostulant] = useState<Postulant | null>(null);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Page header */}
      <div className="flex items-center gap-4 px-6 py-4 bg-white border-b border-slate-200">
        <button
          onClick={() => router?.push('/interview/interview-calendar')}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all duration-150 active:scale-95"
          aria-label="Retour au calendrier"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-lg font-700 text-slate-900">Nouvel entretien</h1>
          <p className="text-sm text-slate-500">
            Sélectionnez un candidat et remplissez les informations de l'entretien
          </p>
        </div>
      </div>
      {/* Two-column layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Form (65%) */}
        <div className="flex-1 overflow-auto p-6">
          <InterviewForm
            selectedPostulant={selectedPostulant}
            onSuccess={() => router?.push('/interview/interview-calendar')}
          />
        </div>

        {/* Right: Candidate list (35%) */}
        <div className="w-[35%] flex-shrink-0 border-l border-slate-200 bg-white overflow-hidden flex flex-col">
          <CandidateListPanel
            selectedPostulantId={selectedPostulant?.id ?? null}
            onSelect={setSelectedPostulant}
          />
        </div>
      </div>
    </div>
  );
}