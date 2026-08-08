import React from 'react';
import { Niveau } from '@/types/recruitment/canalNivau';

interface NiveauCardProps {
    niveau: Niveau;
    onDelete: (id: number) => void;
}

export const NiveauCard: React.FC<NiveauCardProps> = ({ niveau, onDelete }) => {
    return (
        <div className="group bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-green-800 flex items-center justify-center text-white shadow-sm">
                        <i className="ri-user-line text-lg"></i>
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-900">{niveau.nom}</h3>
                        <p className="text-sm text-gray-500">Niveau d'expérience</p>
                    </div>
                </div>
                <button
                    onClick={() => onDelete(niveau.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                    title="Supprimer le niveau"
                >
                    <i className="ri-delete-bin-line text-base"></i>
                </button>
            </div>
        </div>
    );
};
