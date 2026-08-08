import React from 'react';


interface LegendItem {
  key: string;
  color: string;
  label: string;
}

const legendItems: LegendItem[] = [
  { key: 'legend-interview', color: 'bg-blue-500', label: 'Entretien' },
  { key: 'legend-test', color: 'bg-purple-500', label: 'Test' },
  { key: 'legend-scheduled', color: 'bg-blue-100 border border-blue-300', label: 'Planifié' },
  { key: 'legend-completed', color: 'bg-emerald-100 border border-emerald-300', label: 'Terminé' },
  { key: 'legend-cancelled', color: 'bg-red-100 border border-red-300', label: 'Annulé' },
];

export default function CalendarLegend() {
  return (
    <div className="flex items-center gap-4 px-6 py-2 bg-white border-b border-slate-100">
      {legendItems.map((item) => (
        <div key={item.key} className="flex items-center gap-1.5">
          <div className={`w-3 h-3 rounded-sm ${item.color}`} />
          <span className="text-xs text-slate-500 font-500">{item.label}</span>
        </div>
      ))}
    </div>
  );
}