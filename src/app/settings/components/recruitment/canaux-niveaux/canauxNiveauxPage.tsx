import React, { useState, useEffect } from 'react';
import { getNiveaux, createNiveau, deleteNiveau } from '@/api/dashboard/recruitment/niveaux';
import { getCanaux, deleteCanal, createCanal } from '@/api/dashboard/recruitment/channels';
import { Canal, Niveau } from '@/types/recruitment/canalNivau';
import { CanalCard } from './cards/CanalCard';
import { NiveauCard } from './cards/NiveauCard';
import { AddCanalForm } from './components/AddCanalForm';
import { AddNiveauForm } from './components/AddNiveauForm';

function CanauxNiveaux() {
    const [canaux, setCanaux] = useState<Canal[]>([]);
    const [niveaux, setNiveaux] = useState<Niveau[]>([]);

    useEffect(() => {
        const fetchCanaux = async () => {
            try {
                const data = await getCanaux();
                setCanaux(data);
            } catch (err) {
                console.error('Erreur lors du chargement des canaux', err);
            }
        };
        fetchCanaux();
    }, []);

    useEffect(() => {
        const fetchNiveaux = async () => {
            try {
                const data = await getNiveaux();
                setNiveaux(data);
            } catch (err) {
                console.error('Erreur lors du chargement des niveaux', err);
            }
        };
        fetchNiveaux();
    }, []);

    const handleAddCanal = async (nom: string) => {
        try {
            const newCanal = await createCanal({ nom });

            if (!newCanal?.id) {
                console.error("Canal créé invalide : pas d'id");
                return;
            }

            const canalWithIcon: Canal = {
                id: newCanal.id,
                nom: newCanal.nom,
                icon: nom.toLowerCase(),
            };

            setCanaux(prev => [...prev, canalWithIcon]);
        } catch (err) {
            console.error('Erreur lors de la création du canal', err);
        }
    };

    const handleDeleteCanal = async (id: number) => {
        try {
            await deleteCanal(id);
            setCanaux(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            console.error('Erreur lors de la suppression du canal', err);
        }
    };

    const handleAddNiveau = async (nom: string) => {
        try {
            const newNiveau = await createNiveau(nom);
            if (!newNiveau) return;

            setNiveaux(prev => [...prev, newNiveau]);
        } catch (err) {
            console.error('Erreur lors de la création du niveau', err);
        }
    };

    const handleDeleteNiveau = async (id: number) => {
        try {
            await deleteNiveau(id);
            setNiveaux(prev => prev.filter(n => n.id !== id));
        } catch (err) {
            console.error('Erreur lors de la suppression du niveau', err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <main className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="space-y-4">
                                {canaux.map((canal, index) => (
                                    <div
                                        key={canal.id}
                                        className="animate-in slide-in-from-left-2 duration-300"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <CanalCard canal={canal} onDelete={handleDeleteCanal} />
                                    </div>
                                ))}
                                <AddCanalForm onAdd={handleAddCanal} />
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="space-y-4">
                                {niveaux.map((niveau, index) => (
                                    <div
                                        key={niveau.id}
                                        className="animate-in slide-in-from-right-2 duration-300"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <NiveauCard niveau={niveau} onDelete={handleDeleteNiveau} />
                                    </div>
                                ))}
                                <AddNiveauForm onAdd={handleAddNiveau} />
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default CanauxNiveaux;