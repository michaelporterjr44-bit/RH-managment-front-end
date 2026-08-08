"use client";

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
    const maxVisiblePages = 5; // Nombre maximum de boutons numériques visibles au milieu

    if (totalPages <= maxVisiblePages + 2) {
      // Si on a peu de pages, on les affiche toutes
      for (let i = 0; i < totalPages; i++) {
        items.push(i);
      }
    } else {
      // Toujours afficher la première page
      items.push(0);

      // Calculer le début et la fin de la plage centrale autour de la page active
      let start = Math.max(1, page - 1);
      let end = Math.min(totalPages - 2, page + 1);

      // Ajuster si on est proche du début ou de la fin
      if (page <= 2) {
        end = 3;
      } else if (page >= totalPages - 3) {
        start = totalPages - 4;
      }

      // Ajouter les points de suspension au début si nécessaire
      if (start > 1) {
        items.push("...");
      }

      // Ajouter les pages centrales
      for (let i = start; i <= end; i++) {
        items.push(i);
      }

      // Ajouter les points de suspension à la fin si nécessaire
      if (end < totalPages - 2) {
        items.push("...");
      }

      // Toujours afficher la dernière page
      items.push(totalPages - 1);
    }

    return items;
  };

  return (
    <div className="flex justify-between items-center bg-gray-50 rounded-b-lg p-3 w-full flex-wrap gap-4">
      {/* Partie Navigation GAUCHE */}
      <div className="flex items-center space-x-1 py-2">
        {/* Précédent */}
        <button
          disabled={page === 0}
          onClick={() => onPageChange(Math.max(page - 1, 0))}
          className="rounded-md border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm 
                    hover:shadow-lg text-slate-600 hover:text-white hover:bg-green-800 hover:border-slate-800 
                    disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2 flex items-center"
        >
          <i className="ri-arrow-left-s-line mr-1"></i>
          Prev
        </button>

        {/* Boutons Dynamiques ("..." inclus) */}
        {getPaginationItems().map((item, index) => (
          <button
            key={index}
            disabled={item === "..."}
            onClick={() => typeof item === "number" && onPageChange(item)}
            className={`w-9 h-9 rounded-md text-center text-sm font-medium transition-all border ${
              item === page
                ? "bg-green-800 border-green-800 text-white"
                : item === "..."
                ? "border-transparent text-gray-400 bg-transparent cursor-default"
                : "border-slate-300 bg-white text-slate-600 hover:bg-gray-100"
            }`}
          >
            {typeof item === "number" ? item + 1 : item}
          </button>
        ))}

        {/* Suivant */}
        <button
          disabled={page === totalPages - 1 || totalPages === 0}
          onClick={() => onPageChange(Math.min(page + 1, totalPages - 1))}
          className="rounded-md border border-slate-300 py-2 px-3 text-center text-sm transition-all shadow-sm 
                    hover:shadow-lg text-slate-600 hover:text-white hover:bg-green-800 hover:border-slate-800 
                    disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2 flex items-center"
        >
          Next
          <i className="ri-arrow-right-s-line ml-1"></i>
        </button>
      </div>

      {/* Partie Infos & Taille de Page DROITE */}
      <div className="flex items-center gap-4">
        <div className="text-sm text-slate-600">
          Page <b>{page + 1}</b> sur <b>{totalPages || 1}</b>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700">Afficher :</label>
          <select
            value={size}
            onChange={(e) => onSizeChange(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
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