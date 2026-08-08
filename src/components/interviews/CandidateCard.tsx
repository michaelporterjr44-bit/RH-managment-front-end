import React from 'react';
import { Postulant } from '@/types/recruitment/applicant';
import DecisionBadge from './DecisionBadge';
import { Mail, Phone, Star, GraduationCap } from 'lucide-react';

interface CandidateCardProps {
  postulant: Postulant;
  selected?: boolean;
  onClick?: () => void;
  compact?: boolean;
}

export default function CandidateCard({ postulant, selected, onClick, compact }: CandidateCardProps) {
  const initials = `${postulant.prenom[0]}${postulant.nom[0]}`.toUpperCase();
  const avatarColors = [
    'bg-green-100 text-green-700',
    'bg-purple-100 text-purple-700',
    'bg-emerald-100 text-emerald-700',
    'bg-amber-100 text-amber-700',
    'bg-rose-100 text-rose-700',
  ];
  const colorIndex = (postulant.prenom.charCodeAt(0) + postulant.nom.charCodeAt(0)) % avatarColors.length;
  const avatarColor = avatarColors[colorIndex];

  if (compact) {
    return (
      <button
        onClick={onClick}
        className={`w-full text-left flex items-center gap-3 px-3 py-3 rounded-lg border transition-all duration-150 ${
          selected
            ? 'border-green-400 bg-green-50 shadow-sm'
            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
        }`}
      >
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-700 flex-shrink-0 ${avatarColor}`}>
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-600 text-slate-900 truncate">
            {postulant.prenom} {postulant.nom}
          </p>
          <p className="text-xs text-slate-500 truncate">{postulant.email ?? 'Pas d\'email'}</p>
        </div>
        <div className="flex-shrink-0 flex flex-col items-end gap-1">
          <DecisionBadge decision={postulant.statue} />
          <span className="text-[10px] text-slate-400 font-500">{postulant.niveau.nom}</span>
        </div>
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-700 flex-shrink-0 ${avatarColor}`}>
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-700 text-slate-900">
                {postulant.prenom} {postulant.nom}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">{postulant.campagne.ref}</p>
            </div>
            <DecisionBadge decision={postulant.statue} />
          </div>
          <div className="mt-3 space-y-1.5">
            {postulant.email && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail size={14} className="text-slate-400 flex-shrink-0" />
                <span className="truncate">{postulant.email}</span>
              </div>
            )}
            {postulant.tel && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone size={14} className="text-slate-400 flex-shrink-0" />
                <span>{postulant.tel}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <GraduationCap size={14} className="text-slate-400 flex-shrink-0" />
              <span>{postulant.niveau.nom}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Star size={14} className="text-amber-400 flex-shrink-0" />
              <span className="font-600 text-slate-800">{postulant.note.toFixed(1)}</span>
              <span className="text-slate-400">/ 10</span>
            </div>
          </div>
          {postulant.observation && (
            <p className="mt-3 text-xs text-slate-500 leading-relaxed line-clamp-2">
              {postulant.observation}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}