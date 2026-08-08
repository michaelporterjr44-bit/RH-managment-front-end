'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Calendar, Plus, LayoutGrid, Columns, AlignLeft } from 'lucide-react';
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';

type ViewType = 'month' | 'week' | 'day';

interface CalendarHeaderProps {
  currentDate: Date;
  view: ViewType;
  onNavigate: (date: Date) => void;
  onViewChange: (view: ViewType) => void;
  onToday: () => void;
  scheduledCount: number;
}

const viewOptions: { key: ViewType; label: string; icon: React.ReactNode }[] = [
  { key: 'month', label: 'Mois', icon: <LayoutGrid size={15} /> },
  { key: 'week', label: 'Semaine', icon: <Columns size={15} /> },
  { key: 'day', label: 'Jour', icon: <AlignLeft size={15} /> },
];

export default function CalendarHeader({
  currentDate,
  view,
  onNavigate,
  onViewChange,
  onToday,
  scheduledCount,
}: CalendarHeaderProps) {
  const router = useRouter();

  const handlePrev = () => {
    if (view === 'month') onNavigate(subMonths(currentDate, 1));
    else if (view === 'week') onNavigate(subWeeks(currentDate, 1));
    else onNavigate(subDays(currentDate, 1));
  };

  const handleNext = () => {
    if (view === 'month') onNavigate(addMonths(currentDate, 1));
    else if (view === 'week') onNavigate(addWeeks(currentDate, 1));
    else onNavigate(addDays(currentDate, 1));
  };

  const title =
    view === 'month'
      ? format(currentDate, 'MMMM yyyy', { locale: fr })
      : view === 'week'
      ? `Semaine du ${format(currentDate, 'd MMMM yyyy', { locale: fr })}`
      : format(currentDate, 'EEEE d MMMM yyyy', { locale: fr });

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
      <div className="flex items-center gap-4">
        {/* Logo area / title */}
        <div className="flex items-center gap-2">
          <Calendar size={20} className="text-green-600" />
          <h1 className="text-lg font-700 text-slate-900 capitalize">{title}</h1>
        </div>
        {scheduledCount > 0 && (
          <span className="text-xs font-600 text-green-700 bg-green-50 border border-green-200 rounded-full px-2.5 py-1">
            {scheduledCount} planifié{scheduledCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Navigation */}
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrev}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all duration-150 active:scale-95"
            aria-label="Période précédente"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={onToday}
            className="px-3 h-8 text-sm font-600 text-slate-600 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-150 active:scale-95"
          >
            Aujourd'hui
          </button>
          <button
            onClick={handleNext}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all duration-150 active:scale-95"
            aria-label="Période suivante"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* View toggle */}
        <div className="flex items-center bg-slate-100 rounded-lg p-0.5 gap-0.5">
          {viewOptions.map((opt) => (
            <button
              key={`view-${opt.key}`}
              onClick={() => onViewChange(opt.key)}
              className={`flex items-center gap-1.5 px-3 h-7 text-xs font-600 rounded-md transition-all duration-150 ${
                view === opt.key
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>

        {/* New interview */}
        <button
          onClick={() => router.push('/interview/interview-creation')}
          className="flex items-center gap-2 px-4 h-9 bg-green-700 hover:bg-green-800 text-white text-sm font-600 rounded-lg shadow-sm transition-all duration-150 active:scale-95"
        >
          <Plus size={16} />
          Nouvel entretien
        </button>
      </div>
    </div>
  );
}