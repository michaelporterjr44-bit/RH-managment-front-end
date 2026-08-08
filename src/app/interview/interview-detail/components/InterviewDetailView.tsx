'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { getInterviewById } from '@/api/dashboard/recruitment/interview';
import { InterviewTestScheduling } from '@/types/recruitment/interview';
import DetailHeader from './DetailHeader';
import InterviewInfoSection from './InterviewInfoSection';
import CandidateDetailCard from './CandidateDetailCard';
import ActionPanel from './ActionPanel';
import DetailSkeleton from './DetailSkeleton';

function InterviewDetailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const [interview, setInterview] = useState<InterviewTestScheduling | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!id) {
            setNotFound(true);
            setLoading(false);
            return;
        }

        const fetchInterview = async () => {
            try {
                const data = await getInterviewById(id);

                if (!data) {
                    setNotFound(true);
                } else {
                    setInterview(data);
                }
            } catch (error) {
                console.error(error);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };

        fetchInterview();
    }, [id]);

    const handleStatusUpdate = (updatedInterview: InterviewTestScheduling) => {
        setInterview(updatedInterview);
    };

    if (loading) return <DetailSkeleton />;

    if (notFound || !interview) {
        return (
            <div className="flex flex-col items-center justify-center h-full py-24">
                <p className="text-lg font-700 text-slate-700">Entretien introuvable</p>
                <p className="text-sm text-slate-400 mt-1">L'identifiant fourni ne correspond à aucun entretien.</p>
                <button
                    onClick={() => router.push('/interview/interview-calendar')}
                    className="mt-6 px-5 h-10 bg-green-600 text-white text-sm font-600 rounded-lg hover:bg-green-700 transition-all"
                >
                    Retour au calendrier
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-slate-50">
            <DetailHeader interview={interview} />
            <div className="flex-1 overflow-auto">
                <div className="mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main content */}
                    <div className="lg:col-span-2 space-y-6">
                        <InterviewInfoSection interview={interview} />
                        <CandidateDetailCard postulant={interview.postulant} campagne={interview.campagne} />
                    </div>
                    {/* Sidebar: actions */}
                    <div className="space-y-6">
                        <ActionPanel interview={interview} onStatusUpdate={handleStatusUpdate} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function InterviewDetailView() {
    return (
        <Suspense fallback={<DetailSkeleton />}>
            <InterviewDetailContent />
        </Suspense>
    );
}