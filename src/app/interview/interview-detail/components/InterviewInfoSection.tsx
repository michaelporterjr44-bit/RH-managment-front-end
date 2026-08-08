import React from 'react';
import { InterviewTestScheduling } from '@/types/recruitment/interview';
import { Calendar, Clock, MapPin, Link2, FileText, Bell, CheckCircle2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface InterviewInfoSectionProps {
  interview: InterviewTestScheduling;
}

function ReminderStatus({ sent, label }: { sent: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-1.5 text-xs font-500 ${sent ? 'text-emerald-600' : 'text-slate-400'}`}>
      {sent ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
      {label}
    </div>
  );
}

export default function InterviewInfoSection({ interview }: InterviewInfoSectionProps) {
  const startDate = new Date(interview.start);
  const endDate = new Date(interview.endInterview);
  const durationMs = endDate.getTime() - startDate.getTime();
  const durationMin = Math.round(durationMs / 60000);

  const hasReminders =
    (interview.reminderDays ?? 0) > 0 ||
    (interview.reminderHours ?? 0) > 0 ||
    (interview.reminderMinutes ?? 0) > 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50">
        <h2 className="text-sm font-700 text-slate-700">Détails de l'entretien</h2>
      </div>
      <div className="p-5 space-y-5">
        {/* Date & Duration */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
              <Calendar size={15} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs font-600 text-slate-400 uppercase tracking-wide">Date</p>
              <p className="text-sm font-600 text-slate-800 capitalize mt-0.5">
                {format(startDate, 'EEEE d MMMM yyyy', { locale: fr })}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
              <Clock size={15} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs font-600 text-slate-400 uppercase tracking-wide">Horaire</p>
              <p className="text-sm font-600 text-slate-800 mt-0.5">
                {format(startDate, 'HH:mm')} – {format(endDate, 'HH:mm')}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{durationMin} minutes</p>
            </div>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Location */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
            <MapPin size={15} className="text-slate-500" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-600 text-slate-400 uppercase tracking-wide">Lieu</p>
            {interview.physicalLocation ? (
              <p className="text-sm text-slate-800 font-500 mt-0.5">{interview.physicalLocation}</p>
            ) : (
              <p className="text-sm text-slate-400 italic mt-0.5">Aucun lieu physique renseigné</p>
            )}
          </div>
        </div>

        {/* Meeting link */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
            <Link2 size={15} className="text-slate-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-600 text-slate-400 uppercase tracking-wide">Lien visioconférence</p>
            {interview.callLinkMeeting ? (
              <a
                href={interview.callLinkMeeting}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-green-600 font-500 hover:text-green-800 hover:underline truncate block mt-0.5 transition-colors"
              >
                {interview.callLinkMeeting}
              </a>
            ) : (
              <p className="text-sm text-slate-400 italic mt-0.5">Aucun lien de réunion</p>
            )}
          </div>
        </div>

        {/* Description */}
        {interview.description && (
          <>
            <hr className="border-slate-100" />
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                <FileText size={15} className="text-slate-500" />
              </div>
              <div>
                <p className="text-xs font-600 text-slate-400 uppercase tracking-wide">Description</p>
                <p className="text-sm text-slate-700 mt-1.5 leading-relaxed">{interview.description}</p>
              </div>
            </div>
          </>
        )}

        {/* Reminders */}
        {hasReminders && (
          <>
            <hr className="border-slate-100" />
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                <Bell size={15} className="text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-600 text-slate-400 uppercase tracking-wide mb-2">Rappels configurés</p>
                <div className="space-y-1.5">
                  {(interview.reminderDays ?? 0) > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">{interview.reminderDays} jour{(interview.reminderDays ?? 0) > 1 ? 's' : ''} avant</span>
                      <ReminderStatus sent={interview.reminderDaySent} label={interview.reminderDaySent ? 'Envoyé' : 'En attente'} />
                    </div>
                  )}
                  {(interview.reminderHours ?? 0) > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">{interview.reminderHours}h avant</span>
                      <ReminderStatus sent={interview.reminderHourSent} label={interview.reminderHourSent ? 'Envoyé' : 'En attente'} />
                    </div>
                  )}
                  {(interview.reminderMinutes ?? 0) > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">{interview.reminderMinutes} min avant</span>
                      <ReminderStatus sent={interview.reminderMinuteSent} label={interview.reminderMinuteSent ? 'Envoyé' : 'En attente'} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}