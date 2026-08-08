'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  XCircle,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { InterviewTestScheduling, InterviewStatus } from '@/types/recruitment/interview';
import StatusBadge from '@/components/interviews/StatusBadge';
import { cancelInterview, completedInterview } from '@/api/dashboard/recruitment/interview';

// Backend integration point: import { cancelInterview, completeInterview } from '../../../types/recruitment/interview';

interface ActionPanelProps {
  interview: InterviewTestScheduling;
  onStatusUpdate: (updated: InterviewTestScheduling) => void;
}

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  confirmClassName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

function ConfirmModal({
  isOpen,
  title,
  description,
  confirmLabel,
  confirmClassName,
  onConfirm,
  onCancel,
  isLoading,
}: ConfirmModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={18} className="text-red-600" />
          </div>
          <div>
            <h3 className="text-base font-700 text-slate-900">{title}</h3>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">{description}</p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 h-9 text-sm font-600 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 h-9 text-sm font-700 text-white rounded-lg transition-all active:scale-95 disabled:opacity-70 ${confirmClassName}`}
          >
            {isLoading && <Loader2 size={14} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ActionPanel({ interview, onStatusUpdate }: ActionPanelProps) {
  const router = useRouter();
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const isScheduled = interview.status === InterviewStatus.SCHEDULED;
  const isCompleted = interview.status === InterviewStatus.COMPLETED;
  const isCancelled = interview.status === InterviewStatus.CANCELLED;

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      await cancelInterview(interview.id);

      const updated: InterviewTestScheduling = {
        ...interview,
        status: InterviewStatus.CANCELLED,
      };

      onStatusUpdate(updated);

      setCancelModalOpen(false);

      toast.success("Entretien annulé");
    } catch (e) {
      toast.error("Erreur API cancel");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      await completedInterview(interview.id);

      const updated: InterviewTestScheduling = {
        ...interview,
        status: InterviewStatus.COMPLETED,
      };

      onStatusUpdate(updated);
      setCompleteModalOpen(false);
      toast.success("Entretien terminé", {
        description: "L'entretien a été marqué comme terminé.",
      });
    } catch {
      toast.error("Erreur lors de la mise à jour", {
        description: "Vérifiez votre connexion et réessayez.",
      });
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50">
          <h2 className="text-sm font-700 text-slate-700">Actions</h2>
        </div>
        <div className="p-5 space-y-3">
          {/* Current status */}
          <div className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-xs font-600 text-slate-500">Statut actuel</span>
            <StatusBadge status={interview.status} size="sm" />
          </div>

          {isScheduled && (
            <>
              <button
                onClick={() => setCompleteModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 h-10 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-700 rounded-lg shadow-sm transition-all duration-150 active:scale-95"
              >
                <CheckCircle2 size={16} />
                Marquer comme terminé
              </button>
              <button
                onClick={() => setCancelModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 h-10 bg-white hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-300 text-sm font-700 rounded-lg transition-all duration-150 active:scale-95"
              >
                <XCircle size={16} />
                Annuler l'entretien
              </button>
            </>
          )}

          {(isCompleted || isCancelled) && (
            <div className="space-y-3">
              <div className={`flex items-start gap-2.5 p-3 rounded-lg text-sm ${isCompleted
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                }`}>
                {isCompleted ? (
                  <CheckCircle2 size={15} className="flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle size={15} className="flex-shrink-0 mt-0.5" />
                )}
                <p className="text-xs font-500 leading-relaxed">
                  {isCompleted
                    ? 'Cet entretien est terminé. Les informations sont en lecture seule.'
                    : 'Cet entretien a été annulé. Les informations sont en lecture seule.'}
                </p>
              </div>
              <button
                onClick={() => router.push('/interview/interview-calendar')}
                className="w-full flex items-center justify-center gap-2 h-10 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 text-sm font-600 rounded-lg transition-all duration-150 active:scale-95"
              >
                <ArrowLeft size={15} />
                Retour au calendrier
              </button>
            </div>
          )}

          <button
            onClick={() => router.push('/interview/interview-calendar')}
            className="w-full flex items-center justify-center gap-2 h-9 text-sm font-500 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-all duration-150"
          >
            <ArrowLeft size={14} />
            Retour au calendrier
          </button>
        </div>
      </div>

      {/* Timeline info */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50">
          <h2 className="text-sm font-700 text-slate-700">Rappels</h2>
        </div>
        <div className="p-5 space-y-2">
          {[
            { key: 'reminder-day', sent: interview.reminderDaySent, label: `${interview.reminderDays ?? 0}j avant`, active: (interview.reminderDays ?? 0) > 0 },
            { key: 'reminder-hour', sent: interview.reminderHourSent, label: `${interview.reminderHours ?? 0}h avant`, active: (interview.reminderHours ?? 0) > 0 },
            { key: 'reminder-min', sent: interview.reminderMinuteSent, label: `${interview.reminderMinutes ?? 0}min avant`, active: (interview.reminderMinutes ?? 0) > 0 },
          ].filter((r) => r.active).map((reminder) => (
            <div key={reminder.key} className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-slate-50">
              <div className="flex items-center gap-2">
                <Clock size={12} className="text-slate-400" />
                <span className="text-xs text-slate-600 font-500">{reminder.label}</span>
              </div>
              {reminder.sent ? (
                <span className="text-[10px] font-700 text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">
                  Envoyé
                </span>
              ) : (
                <span className="text-[10px] font-700 text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-full">
                  En attente
                </span>
              )}
            </div>
          ))}
          {!(interview.reminderDays ?? 0) && !(interview.reminderHours ?? 0) && !(interview.reminderMinutes ?? 0) && (
            <p className="text-xs text-slate-400 text-center py-2">Aucun rappel configuré</p>
          )}
        </div>
      </div>

      {/* Modals */}
      <ConfirmModal
        isOpen={cancelModalOpen}
        title="Annuler l'entretien ?"
        description="Cette action est irréversible. L'entretien sera marqué comme annulé et le candidat sera notifié."
        confirmLabel="Confirmer l'annulation"
        confirmClassName="bg-red-600 hover:bg-red-700"
        onConfirm={handleCancel}
        onCancel={() => setCancelModalOpen(false)}
        isLoading={isCancelling}
      />
      <ConfirmModal
        isOpen={completeModalOpen}
        title="Marquer comme terminé ?"
        description="L'entretien sera marqué comme terminé. Assurez-vous d'avoir renseigné vos notes avant de continuer."
        confirmLabel="Confirmer"
        confirmClassName="bg-emerald-600 hover:bg-emerald-700"
        onConfirm={handleComplete}
        onCancel={() => setCompleteModalOpen(false)}
        isLoading={isCompleting}
      />
    </>
  );
}