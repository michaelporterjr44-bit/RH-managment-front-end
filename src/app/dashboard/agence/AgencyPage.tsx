import { useState, useEffect } from 'react';
import { Agence } from '@/types/employee/employee';
import AgencyGrid from './components/AgencyGrid';
import AgencyFormModal from './components/AgencyFormModal';
import { AgencyFormData } from '@/types/agency/agency';

import { getAgencies, addAgency, updateAgency } from '@/api/dashboard/agency/agency';
export default function AgencyManagement() {
    const [agencies, setAgencies] = useState<Agence[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAgency, setSelectedAgency] = useState<Agence | null>(null);

    useEffect(() => {
        loadAgencies();
    }, []);

    const loadAgencies = async () => {
        try {
            setLoading(true);
            const data = await getAgencies();
            setAgencies(data);
        } catch (error) {
            console.error("Error loading agencies:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAgency = () => {
        setSelectedAgency(null);
        setIsModalOpen(true);
    };

    const handleEditAgency = (agency: Agence) => {
        setSelectedAgency(agency);
        setIsModalOpen(true);
    };

    const handleSubmit = async (formData: AgencyFormData) => {
        try {
            if (selectedAgency) {
                await updateAgency(selectedAgency.id, {
                    ...formData
                });
            } else {
                await addAgency({
                    ...formData
                } as Agence);
            }

            setIsModalOpen(false);
            await loadAgencies();
        } catch (error) {
            console.error("Error saving agency:", error);
        }
    };

    return (
        <div className="pt-4">
            <div className="">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Agence</h1>
                            <p className="text-gray-600">Tous les Agence de NIM Madagascar</p>
                        </div>
                        <button
                            onClick={() => {
                                console.log("click add agency");
                                handleAddAgency();
                            }}
                            className="flex items-center space-x-2 px-3 py-2 bg-green-700 text-white rounded-xl ... "
                        >
                            <i className="ri-add-line text-xl"></i>
                            <span>Add Agency</span>
                        </button>
                    </div>

                    <div className="mt-6 flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm">
                            <i className="ri-building-line text-green-600"></i>
                            <span className="text-gray-600">
                                Total Agencies: <span className="font-semibold text-gray-900">{agencies.length}</span>
                            </span>
                        </div>
                    </div>
                </div>

                <AgencyGrid
                    agencies={agencies}
                    loading={loading}
                    onEdit={handleEditAgency}
                />

                <AgencyFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSubmit}
                    agency={selectedAgency}
                />
            </div>
        </div>
    );
}