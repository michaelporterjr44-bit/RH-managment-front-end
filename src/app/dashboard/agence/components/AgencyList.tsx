import React, { useState } from "react";
import { Agence } from "@/types/employee/employee";
import AgencyCard from "./AgencyCard";

interface AgencyListProps {
    agencies: Agence[];
    onEdit: (agency: Agence) => void;
}

export default function AgencyList({ agencies, onEdit }: AgencyListProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const agenciesPerPage = 6;

    const indexOfLast = currentPage * agenciesPerPage;
    const indexOfFirst = indexOfLast - agenciesPerPage;
    const currentAgencies = agencies.slice(indexOfFirst, indexOfLast);

    const totalPages = Math.ceil(agencies.length / agenciesPerPage);

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {currentAgencies.map((agency) => (
                    <AgencyCard key={agency.id} agency={agency} onEdit={onEdit} />
                ))}
            </div>

            <div className="flex justify-center items-center gap-3 mt-6">
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
        </div>
    );
}