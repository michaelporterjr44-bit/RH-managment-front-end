'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { Calendar, MapPin, Link2, FileText, Bell, Loader2, CheckCircle2, AlertCircle, } from 'lucide-react';
import { Postulant } from '@/types/recruitment/applicant';
import { createInterview } from '@/api/dashboard/recruitment/interview';
import { InterviewStatus } from '@/types/recruitment/interview';

const schema = z.object({
    title: z.string().min(2, 'Le titre est requis (minimum 2 caractères)'),
    interviewType: z.enum(['INTERVIEW', 'TEST'], {
        message: "Type invalide"
    }),
    start: z.string().min(1, 'La date de début est requise'),
    endInterview: z.string().min(1, 'La date de fin est requise'),
    physicalLocation: z.string().optional(),
    callLinkMeeting: z.string().url('Lien invalide').optional().or(z.literal('')),
    description: z.string().optional(),
    reminderDays: z.coerce.number().min(0).max(30).optional().default(0),
    reminderHours: z.coerce.number().min(0).max(23).optional().default(0),
    reminderMinutes: z.coerce.number().min(0).max(59).optional().default(0),
    postulantId: z.string().min(1, 'Veuillez sélectionner un candidat'),
    campagneId: z.string().min(1, 'La campagne est requise'),
});

type FormValues = z.infer<typeof schema>;

interface InterviewFormProps {
    selectedPostulant: Postulant | null;
    onSuccess: () => void;
}

const typeOptions = [
    { value: 'INTERVIEW', label: 'Entretien', color: 'text-blue-700 bg-blue-50 border-blue-200' },
    { value: 'TEST', label: 'Test', color: 'text-purple-700 bg-purple-50 border-purple-200' },
];

export default function InterviewForm({ selectedPostulant, onSuccess }: InterviewFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors, isDirty },
    } = useForm<FormValues>({
        resolver: zodResolver(schema) as any,
        defaultValues: {
            title: '',
            interviewType: 'INTERVIEW',
            start: '',
            endInterview: '',
            physicalLocation: '',
            callLinkMeeting: '',
            description: '',
            reminderDays: 1,
            reminderHours: 2,
            reminderMinutes: 0,
            postulantId: '',
            campagneId: '',
        },
    });

    const watchedType = watch('interviewType');

    // Pre-fill when postulant is selected
    useEffect(() => {
        if (selectedPostulant) {
            setValue('postulantId', selectedPostulant.id, { shouldDirty: true });
            setValue('campagneId', selectedPostulant.campagne.id, { shouldDirty: true });
            if (!watch('title')) {
                setValue(
                    'title',
                    `Entretien — ${selectedPostulant.prenom} ${selectedPostulant.nom}`,
                    { shouldDirty: true }
                );
            }
        }
    }, [selectedPostulant, setValue, watch]);

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setIsSubmitting(true);

        try {
            const payload = {
                title: data.title,
                interviewType: data.interviewType,
                start: data.start,
                endInterview: data.endInterview,

                physicalLocation: data.physicalLocation || undefined,
                callLinkMeeting: data.callLinkMeeting || undefined,
                description: data.description || undefined,

                reminderDays: data.reminderDays ?? 0,
                reminderHours: data.reminderHours ?? 0,
                reminderMinutes: data.reminderMinutes ?? 0,

                postulant: { id: data.postulantId },
                campagne: { id: data.campagneId },

                status: InterviewStatus.SCHEDULED,

                reminderDaySent: false,
                reminderHourSent: false,
                reminderMinuteSent: false,
            };

            await createInterview(payload);

            toast.success("Entretien créé avec succès", {
                description: `${data.title} a été ajouté au calendrier.`,
            });

            onSuccess();

        } catch (error: any) {
            console.error(error);

            toast.error("Erreur lors de la création", {
                description:
                    error?.response?.data?.message ||
                    "Une erreur est survenue côté serveur.",
            });

        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Candidate pre-fill indicator */}
            {selectedPostulant ? (
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-700 text-green-800">
                            {selectedPostulant.prenom[0]}{selectedPostulant.nom[0]}
                        </span>
                    </div>
                    <div>
                        <p className="text-sm font-700 text-green-900">
                            {selectedPostulant.prenom} {selectedPostulant.nom}
                        </p>
                        <p className="text-xs text-green-700">
                            {selectedPostulant.email ?? 'Pas d\'email'} · {selectedPostulant.campagne.ref}
                        </p>
                    </div>
                    <CheckCircle2 size={18} className="text-green-600 ml-auto flex-shrink-0" />
                </div>
            ) : (
                <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <AlertCircle size={18} className="text-amber-600 flex-shrink-0" />
                    <p className="text-sm text-amber-700">
                        Sélectionnez un candidat dans le panneau de droite pour pré-remplir le formulaire.
                    </p>
                </div>
            )}

            {/* Hidden fields */}
            <input type="hidden" {...register('postulantId')} />
            <input type="hidden" {...register('campagneId')} />
            {errors.postulantId && (
                <p className="text-xs text-red-600 -mt-4">{errors.postulantId.message}</p>
            )}

            {/* Section: General info */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
                    <h2 className="text-sm font-700 text-slate-700 flex items-center gap-2">
                        <FileText size={15} className="text-slate-500" />
                        Informations générales
                    </h2>
                </div>
                <div className="p-5 space-y-5">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-600 text-slate-700 mb-1.5">
                            Titre de l'entretien <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register('title')}
                            type="text"
                            placeholder="ex. Entretien technique React — Rakoto B."
                            className={`w-full h-10 px-3 text-sm border rounded-lg focus:border-transparent transition-all placeholder:text-slate-400 ${errors.title ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
                                }`}
                        />
                        {errors.title && (
                            <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
                        )}
                    </div>

                    {/* Interview type */}
                    <div>
                        <label className="block text-sm font-600 text-slate-700 mb-1.5">
                            Type d'entretien <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-3">
                            {typeOptions.map((opt) => (
                                <label
                                    key={`type-opt-${opt.value}`}
                                    className={`flex-1 flex items-center gap-2.5 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all duration-150 ${watchedType === opt.value
                                        ? opt.color + 'border-current' : 'border-slate-200 text-slate-600 bg-white hover:border-slate-300'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        value={opt.value}
                                        {...register('interviewType')}
                                        className="sr-only"
                                    />
                                    <span className="text-sm font-600">{opt.label}</span>
                                </label>
                            ))}
                        </div>
                        {errors.interviewType && (
                            <p className="mt-1 text-xs text-red-600">{errors.interviewType.message}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Section: Date & Time */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
                    <h2 className="text-sm font-700 text-slate-700 flex items-center gap-2">
                        <Calendar size={15} className="text-slate-500" />
                        Date et heure
                    </h2>
                </div>
                <div className="p-5 grid grid-cols-2 gap-5">
                    {/* Start */}
                    <div>
                        <label className="block text-sm font-600 text-slate-700 mb-1.5">
                            Début <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register('start')}
                            type="datetime-local"
                            className={`w-full h-10 px-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent transition-all ${errors.start ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
                                }`}
                        />
                        {errors.start && (
                            <p className="mt-1 text-xs text-red-600">{errors.start.message}</p>
                        )}
                    </div>

                    {/* End */}
                    <div>
                        <label className="block text-sm font-600 text-slate-700 mb-1.5">
                            Fin <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register('endInterview')}
                            type="datetime-local"
                            className={`w-full h-10 px-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent transition-all ${errors.endInterview ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
                                }`}
                        />
                        {errors.endInterview && (
                            <p className="mt-1 text-xs text-red-600">{errors.endInterview.message}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Section: Location */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
                    <h2 className="text-sm font-700 text-slate-700 flex items-center gap-2">
                        <MapPin size={15} className="text-slate-500" />
                        Lieu et lien
                    </h2>
                </div>
                <div className="p-5 space-y-5">
                    <div>
                        <label className="block text-sm font-600 text-slate-700 mb-1.5">
                            Lieu physique
                        </label>
                        <p className="text-xs text-slate-400 mb-2">Salle, bureau, adresse — laissez vide si 100% distanciel</p>
                        <div className="relative">
                            <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                {...register('physicalLocation')}
                                type="text"
                                placeholder="ex. Salle de conférence B2, 12 rue Rivoli Paris"
                                className="w-full h-10 pl-9 pr-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-600 text-slate-700 mb-1.5">
                            Lien visioconférence
                        </label>
                        <p className="text-xs text-slate-400 mb-2">Google Meet, Teams, Zoom — URL complète</p>
                        <div className="relative">
                            <Link2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                {...register('callLinkMeeting')}
                                type="url"
                                placeholder="https://meet.google.com/abc-defg-hij"
                                className={`w-full h-10 pl-9 pr-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all placeholder:text-slate-400 ${errors.callLinkMeeting ? 'border-red-300 bg-red-50' : 'border-slate-200'
                                    }`}
                            />
                        </div>
                        {errors.callLinkMeeting && (
                            <p className="mt-1 text-xs text-red-600">{errors.callLinkMeeting.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-600 text-slate-700 mb-1.5">
                            Description / Notes
                        </label>
                        <p className="text-xs text-slate-400 mb-2">Instructions pour le candidat, points à aborder, contexte</p>
                        <textarea
                            {...register('description')}
                            rows={4}
                            placeholder="Décrivez le déroulé de l'entretien, les compétences à évaluer..."
                            className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all placeholder:text-slate-400 resize-none"
                        />
                    </div>
                </div>
            </div>

            {/* Section: Reminders */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
                    <h2 className="text-sm font-700 text-slate-700 flex items-center gap-2">
                        <Bell size={15} className="text-slate-500" />
                        Rappels automatiques
                    </h2>
                </div>
                <div className="p-5">
                    <p className="text-xs text-slate-400 mb-4">
                        Des rappels seront envoyés automatiquement au candidat avant l'entretien. Mettez 0 pour désactiver.
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-600 text-slate-700 mb-1.5">
                                Jours avant
                            </label>
                            <div className="relative">
                                <input
                                    {...register('reminderDays')}
                                    type="number"
                                    min={0}
                                    max={30}
                                    className="w-full h-10 px-3 pr-10 text-sm border border-slate-200 rounded-lg focus:outline-nonetransition-all tabular-nums"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">j</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-600 text-slate-700 mb-1.5">
                                Heures avant
                            </label>
                            <div className="relative">
                                <input
                                    {...register('reminderHours')}
                                    type="number"
                                    min={0}
                                    max={23}
                                    className="w-full h-10 px-3 pr-10 text-sm border border-slate-200 rounded-lg transition-all tabular-nums"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">h</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-600 text-slate-700 mb-1.5">
                                Minutes avant
                            </label>
                            <div className="relative">
                                <input
                                    {...register('reminderMinutes')}
                                    type="number"
                                    min={0}
                                    max={59}
                                    className="w-full h-10 px-3 pr-10 text-sm border border-slate-200 rounded-lg transition-all tabular-nums"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">min</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit */}
            <div className="flex items-center gap-3 pb-6">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 h-11 bg-green-700 hover:bg-green-800 disabled:bg-green-700 text-white text-sm font-700 rounded-lg shadow-sm transition-all duration-150 active:scale-95 disabled:cursor-not-allowed min-w-[180px] justify-center"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            Création en cours...
                        </>
                    ) : (
                        <>
                            <CheckCircle2 size={16} />
                            Créer l'entretien
                        </>
                    )}
                </button>
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="px-5 h-11 text-sm font-600 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all duration-150 active:scale-95"
                >
                    Annuler
                </button>
                {isDirty && !isSubmitting && (
                    <span className="text-xs text-amber-600 font-500">
                        Modifications non sauvegardées
                    </span>
                )}
            </div>
        </form>
    );
}