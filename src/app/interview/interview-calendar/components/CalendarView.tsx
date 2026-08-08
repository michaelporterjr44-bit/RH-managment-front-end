'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, startOfMonth, endOfMonth, startOfWeek as sow, endOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { InterviewTestScheduling, InterviewStatus } from '@/types/recruitment/interview';
import { getAllInterviews } from '@/api/dashboard/recruitment/interview';

import CalendarHeader from './CalendarHeader';
import CalendarLegend from './CalendarLegend';
import CalendarEventBubble from './CalendarEventBubble';
import "../../../globals.css";

const locales = { fr };
type CalendarView = 'month' | 'week' | 'day';

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: (date: Date) => startOfWeek(date, { locale: fr }),
    getDay,
    locales,
});

interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    resource: InterviewTestScheduling;
}

function interviewsToEvents(interviews: InterviewTestScheduling[]): CalendarEvent[] {
    return interviews.map((i) => ({
        id: i.id,
        title: `${i.postulant.prenom} ${i.postulant.nom}`,
        start: new Date(i.start),
        end: new Date(i.endInterview),
        resource: i,
    }));
}

export default function CalendarView() {
    const router = useRouter();

    const [currentDate, setCurrentDate] = useState(new Date());
    const [interviews, setInterviews] = useState<InterviewTestScheduling[]>([]);
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState<CalendarView>('month');

    const getRange = () => {
        if (view === 'month') {
            return {
                start: startOfMonth(currentDate),
                end: endOfMonth(currentDate),
            };
        }

        if (view === 'week') {
            return {
                start: sow(currentDate, { locale: fr }),
                end: endOfWeek(currentDate, { locale: fr }),
            };
        }

        return {
            start: currentDate,
            end: currentDate,
        };
    };

    useEffect(() => {
        const load = async () => {
            const data = await getAllInterviews(0, 1000);
            console.log("INTERVIEWS API =>", data.content);
            setInterviews(data.content);
        };
        load();
    }, []);

    const events = useMemo(() => interviewsToEvents(interviews), [interviews]);

    const scheduledCount = useMemo(
        () => interviews.filter((i) => i.status === InterviewStatus.SCHEDULED).length,
        [interviews]
    );

    const handleSelectEvent = useCallback(
        (event: CalendarEvent) => {
            router.push(`/interview/interview-detail?id=${event.id}`);
        },
        [router]
    );

    const messages = {
        today: "Aujourd’hui",
        previous: "Précédent",
        next: "Suivant",
        month: "Mois",
        week: "Semaine",
        day: "Jour",
        agenda: "Agenda",
        date: "Date",
        time: "Heure",
        event: "Événement",
        noEventsInRange: "Aucun événement",
    };

    const rbcView =
        view === 'month' ? Views.MONTH :
            view === 'week' ? Views.WEEK :
                Views.DAY;
    const formats = {
        weekdayFormat: (date: Date) =>
            format(date, 'EEEE', { locale: fr }),
    };

    return (
        <div className="flex flex-col h-full bg-slate-50">
            <CalendarHeader
                currentDate={currentDate}
                view={view}
                onNavigate={setCurrentDate}
                onViewChange={setView}
                onToday={() => setCurrentDate(new Date())}
                scheduledCount={scheduledCount}
            />

            <CalendarLegend />

            <div className="flex-1 overflow-auto p-6">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full min-h-[600px] p-2">
                    <Calendar
                        culture="fr"
                        messages={messages}
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        view={rbcView}
                        date={currentDate}
                        onNavigate={setCurrentDate}
                        onView={(v: string) => {
                            if (v === 'month' || v === 'week' || v === 'day') {
                                setView(v);
                            }
                        }}
                        onSelectEvent={handleSelectEvent}
                        style={{ height: '100%' }}
                        components={{
                            event: CalendarEventBubble as any,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}