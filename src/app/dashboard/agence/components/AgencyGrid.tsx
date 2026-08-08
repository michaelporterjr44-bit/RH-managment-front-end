import { useState } from 'react';
import AgencyCard from './AgencyCard';
import { Agence } from '@/types/employee/employee';

interface AgencyGridProps {
    agencies: Agence[];
    loading: boolean;
    onEdit: (agency: Agence) => void;
}

function SkeletonCard() {
    return (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 animate-pulse">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    <div className="space-y-2">
                        <div className="h-5 bg-gray-200 rounded w-32"></div>
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </div>
                </div>
                <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
            </div>

            <div className="space-y-3">
                <div className="flex items-start space-x-2">
                    <div className="w-4 h-4 bg-gray-200 rounded mt-0.5"></div>
                    <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>

                <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                </div>
            </div>
        </div>
    );
}

export default function AgencyGrid({ agencies, loading, onEdit }: AgencyGridProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const agenciesPerPage = 6;

    // Calcul des agences à afficher
    const indexOfLast = currentPage * agenciesPerPage;
    const indexOfFirst = indexOfLast - agenciesPerPage;
    const currentAgencies = agencies.slice(indexOfFirst, indexOfLast);

    const totalPages = Math.ceil(agencies.length / agenciesPerPage);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                    <SkeletonCard key={index} />
                ))}
            </div>
        );
    }

    if (agencies.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                    <i className="ri-building-line text-4xl text-gray-400"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No agencies yet</h3>
                <p className="text-gray-500">Get started by adding your first agency</p>
            </div>
        );
    }

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentAgencies.map((agency) => (
                    <AgencyCard key={agency.id} agency={agency} onEdit={onEdit} />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center gap-3 mt-8">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>

                    <span className="text-sm font-medium">
                        Page {currentPage} / {totalPages}
                    </span>

                    <button
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}