import React, { useState } from 'react';
import { getIconClass, availableIcons } from '../utils/iconUtils';

interface AddCanalFormProps {
    onAdd: (nom: string, icon: string) => void;
}

export const AddCanalForm: React.FC<AddCanalFormProps> = ({ onAdd }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [nom, setNom] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('linkedin');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (nom.trim()) {
            onAdd(nom.trim(), selectedIcon);
            setNom('');
            setSelectedIcon('linkedin');
            setIsOpen(false);
        }
    };

    const handleCancel = () => {
        setIsOpen(false);
        setNom('');
        setSelectedIcon('linkedin');
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="w-full bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-green-400 hover:bg-green-50 transition-all duration-300 group"
            >
                <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-green-100 flex items-center justify-center transition-colors duration-300">
                        <i className="ri-add-line text-2xl text-gray-400 group-hover:text-green-500 transition-colors duration-300"></i>
                    </div>
                    <span className="text-gray-600 group-hover:text-green-600 font-medium transition-colors duration-300">
                        Ajouter un canal
                    </span>
                </div>
            </button>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-in slide-in-from-top-2 duration-300">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Nouveau canal</h3>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <i className="ri-close-line text-lg"></i>
                    </button>
                </div>

                <div>
                    <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                        Nom du canal
                    </label>
                    <input
                        type="text"
                        id="nom"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        placeholder="Ex: LinkedIn, Twitter..."
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Icône du canal
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                        {availableIcons.map((iconName) => {
                            const iconClass = getIconClass(iconName);
                            return (
                                <button
                                    key={iconName}
                                    type="button"
                                    onClick={() => setSelectedIcon(iconName)}
                                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${selectedIcon === iconName
                                            ? 'border-green-500 bg-green-50 text-green-600'
                                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                        }`}
                                >
                                    <i className={`${iconClass} text-lg`}></i>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex space-x-3 pt-4">
                    <button
                        type="submit"
                        className="flex-1 bg-green-700 text-white py-2 px-4 rounded-lg hover:bg-green-800 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 font-medium"
                    >
                        Ajouter
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
                    >
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
};
