"use client";

import React from 'react';

interface PaginationProps {
  page: number;
  totalPages: number;
  size: number;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  size,
  onPageChange,
  onSizeChange,
}) => {
  // Génère les numéros de page avec des "..." pour éviter le débordement
  const getPaginationItems = () => {
    const items: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages + 2) {
      for (let i = 0; i < totalPages; i++) {
        items.push(i);
      }
    } else {
      items.push(0);

      let start = Math.max(1, page - 1);
      let end = Math.min(totalPages - 2, page + 1);

      if (page <= 2) {
        end = 3;
      } else if (page >= totalPages - 3) {
        start = totalPages - 4;
      }

      if (start > 1) {
        items.push("...");
      }

      for (let i = start; i <= end; i++) {
        items.push(i);
      }

      if (end < totalPages - 2) {
        items.push("...");
      }

      items.push(totalPages - 1);
    }

    return items;
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4 border-t border-slate-100 bg-white w-full">
      {/* Partie Gauche : Navigation & Boutons */}
      <div className="flex items-center space-x-1.5 flex-wrap gap-y-2">
        {/* Précédent */}
        <button
          disabled={page === 0}
          onClick={() => onPageChange(Math.max(page - 1, 0))}
          className="rounded border border-slate-200 py-1.5 px-3 text-center text-xs font-medium transition-colors text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent flex items-center gap-1"
        >
          <i className="ri-arrow-left-s-line text-sm"></i>
          Précédent
        </button>

        {/* Boutons Dynamiques */}
        {getPaginationItems().map((item, index) => (
          <button
            key={index}
            disabled={item === "..."}
            onClick={() => typeof item === "number" && onPageChange(item)}
            className={`w-8 h-8 rounded text-center text-xs font-medium transition-all ${
              item === page
                ? "bg-slate-900 border border-slate-900 text-white shadow-sm"
                : item === "..."
                ? "text-slate-400 bg-transparent cursor-default"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {typeof item === "number" ? item + 1 : item}
          </button>
        ))}

        {/* Suivant */}
        <button
          disabled={page === totalPages - 1 || totalPages === 0}
          onClick={() => onPageChange(Math.min(page + 1, totalPages - 1))}
          className="rounded border border-slate-200 py-1.5 px-3 text-center text-xs font-medium transition-colors text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent flex items-center gap-1"
        >
          Suivant
          <i className="ri-arrow-right-s-line text-sm"></i>
        </button>
      </div>

      {/* Partie Droite : Infos & Sélecteur de taille */}
      <div className="flex items-center gap-5">
        <div className="text-xs text-slate-500">
          Page <span className="font-semibold text-slate-800">{page + 1}</span> sur <span className="font-semibold text-slate-800">{totalPages || 1}</span>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500">Afficher :</label>
          <select
            value={size}
            onChange={(e) => onSizeChange(Number(e.target.value))}
            className="border border-slate-200 rounded px-2 py-1 text-xs text-slate-700 outline-none focus:border-slate-400 bg-white transition-all cursor-pointer"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Pagination;