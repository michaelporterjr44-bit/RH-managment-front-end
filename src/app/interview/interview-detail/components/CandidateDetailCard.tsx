import React from 'react';
import { Postulant } from '@/types/recruitment/applicant';
import { Campagne } from '@/types/recruitment/campaign';
import DecisionBadge from '@/components/interviews/DecisionBadge';
import { Mail, Phone, Star, GraduationCap, Briefcase, FileText, ExternalLink } from 'lucide-react';

interface CandidateDetailCardProps {
    postulant: Postulant;
    campagne: Campagne;
}

function ScoreBar({ score }: { score: number }) {
    const pct = (score / 10) * 100;
    const color = score >= 8 ? 'bg-emerald-500' : score >= 6 ? 'bg-amber-500' : 'bg-red-400';
    return (
        <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
            </div>
            <span className="text-sm font-700 text-slate-800 tabular-nums w-8 text-right">{score.toFixed(1)}</span>
            <span className="text-xs text-slate-400">/ 10</span>
        </div>
    );
}

const statuCampagneConfig: Record<string, { label: string; className: string }> = {
    Test: { label: 'Test', className: 'bg-purple-50 text-purple-700 border-purple-200' },
    Entretien: { label: 'Entretien', className: 'bg-blue-50 text-blue-700 border-blue-200' },
    Validation: { label: 'Validation', className: 'bg-amber-50 text-amber-700 border-amber-200' },
    Recruté: { label: 'Recruté', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
};

export default function CandidateDetailCard({ postulant, campagne }: CandidateDetailCardProps) {
    const initials = `${postulant.prenom[0]}${postulant.nom[0]}`.toUpperCase();
    const avatarColors = [
        'bg-blue-100 text-blue-700',
        'bg-purple-100 text-purple-700',
        'bg-emerald-100 text-emerald-700',
        'bg-amber-100 text-amber-700',
        'bg-rose-100 text-rose-700',
    ];
    const colorIndex = (postulant.prenom.charCodeAt(0) + postulant.nom.charCodeAt(0)) % avatarColors.length;
    const avatarColor = avatarColors[colorIndex];
    const statuConf = statuCampagneConfig[campagne.statuCampagne] ?? statuCampagneConfig['Entretien'];

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50">
                <h2 className="text-sm font-700 text-slate-700">Candidat</h2>
            </div>
            <div className="p-5">
                {/* Avatar + Name */}
                <div className="flex items-start gap-4 mb-5">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-base font-700 flex-shrink-0 ${avatarColor}`}>
                        {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-700 text-slate-900">
                                {postulant.prenom} {postulant.nom}
                            </h3>
                            <DecisionBadge decision={postulant.statue} />
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{postulant.niveau.nom} · {postulant.statue}</p>
                    </div>
                </div>

                {/* Contact */}
                <div className="space-y-2.5 mb-5">
                    {postulant.email && (
                        <div className="flex items-center gap-2.5">
                            <Mail size={14} className="text-slate-400 flex-shrink-0" />
                            <a
                                href={`mailto:${postulant.email}`}
                                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                            >
                                {postulant.email}
                            </a>
                        </div>
                    )}
                    {postulant.tel && (
                        <div className="flex items-center gap-2.5">
                            <Phone size={14} className="text-slate-400 flex-shrink-0" />
                            <a
                                href={`tel:${postulant.tel}`}
                                className="text-sm text-slate-700 hover:text-slate-900 transition-colors"
                            >
                                {postulant.tel}
                            </a>
                        </div>
                    )}
                    <div className="flex items-center gap-2.5">
                        <GraduationCap size={14} className="text-slate-400 flex-shrink-0" />
                        <span className="text-sm text-slate-700">Niveau {postulant.niveau.nom}</span>
                    </div>
                </div>

                {/* Score */}
                <div className="mb-5">
                    <div className="flex items-center gap-2 mb-2">
                        <Star size={14} className="text-amber-400" />
                        <span className="text-xs font-600 text-slate-500 uppercase tracking-wide">Note</span>
                    </div>
                    <ScoreBar score={postulant.note} />
                </div>

                {/* Observation */}
                {postulant.observation && (
                    <div className="mb-5 p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <p className="text-xs font-600 text-slate-400 uppercase tracking-wide mb-1.5">Observation</p>
                        <p className="text-sm text-slate-700 leading-relaxed">{postulant.observation}</p>
                    </div>
                )}

                {/* Campaign */}
                <div className="border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Briefcase size={14} className="text-slate-400" />
                        <span className="text-xs font-600 text-slate-500 uppercase tracking-wide">Campagne</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-700 text-slate-800">{campagne.ref}</p>
                            <p className="text-xs text-slate-400 mt-0.5">
                                {campagne.dateDebut} → {campagne.dateFin}
                            </p>
                        </div>
                        <span className={`text-xs font-600 px-2 py-1 rounded-full border ${statuConf.className}`}>
                            {statuConf.label}
                        </span>
                    </div>
                </div>

                {/* CV */}
                {postulant.cv && (
                    <div className="mt-4 border-t border-slate-100 pt-4">
                        <a
                            href={postulant.cv.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-500 transition-colors"
                        >
                            <FileText size={14} />
                            Consulter le CV
                            <ExternalLink size={12} />
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}