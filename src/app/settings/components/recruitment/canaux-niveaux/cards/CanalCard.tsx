import React from 'react';
import { Canal } from '@/types/recruitment/canalNivau';
import { getIconClass } from '../utils/iconUtils';

interface CanalCardProps {
    canal: Canal;
    onDelete: (id: number) => void;
}

export const CanalCard: React.FC<CanalCardProps> = ({ canal, onDelete }) => {
    const iconClass = getIconClass(canal.nom);

    return (
        <div className="group bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-green-800 flex items-center justify-center text-white shadow-sm">
                        <i className={`${iconClass} text-lg`}></i>
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-900">{canal.nom}</h3>
                        <p className="text-sm text-gray-500 capitalize">{canal.nom}</p>
                    </div>
                </div>
                <button
                    onClick={() => onDelete(canal.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                    title="Supprimer le canal"
                >
                    <i className="ri-delete-bin-line text-base"></i>
                </button>
            </div>
        </div>
    );
};
