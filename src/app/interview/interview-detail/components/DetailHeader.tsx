'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit3 } from 'lucide-react';
import { InterviewTestScheduling } from '@/types/recruitment/interview';
import StatusBadge from '@/components/interviews/StatusBadge';
import TypeBadge from '@/components/interviews/TypeBadge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DetailHeaderProps {
  interview: InterviewTestScheduling;
}

export default function DetailHeader({ interview }: DetailHeaderProps) {
  const router = useRouter();
  const startDate = new Date(interview.start);
  const endDate = new Date(interview.endInterview);

  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <button
            onClick={() => router.push('/interview/interview-calendar')}
            className="mt-1 w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all duration-150 active:scale-95 flex-shrink-0"
            aria-label="Retour au calendrier"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-700 text-slate-900">
                {interview.title ?? `Entretien — ${interview.postulant.prenom} ${interview.postulant.nom}`}
              </h1>
              <TypeBadge type={interview.interviewType} size="md" />
              <StatusBadge status={interview.status} size="md" />
            </div>
            <p className="text-sm text-slate-500 mt-1">
              {format(startDate, 'EEEE d MMMM yyyy', { locale: fr })} ·{' '}
              {format(startDate, 'HH:mm')} – {format(endDate, 'HH:mm')}
              {' · '}
              <span className="font-500 text-slate-600">{interview.campagne.ref}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            className="flex items-center gap-2 px-3 h-9 text-sm font-600 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all duration-150 active:scale-95"
            title="Modifier cet entretien — fonctionnalité à venir"
          >
            <Edit3 size={15} />
            Modifier
          </button>
        </div>
      </div>
    </div>
  );
}