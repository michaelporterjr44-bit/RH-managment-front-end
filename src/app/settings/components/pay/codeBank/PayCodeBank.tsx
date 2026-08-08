"use client";

import React, { useState, useEffect } from "react";
import CodeBankForm from "./CodeBankForm"; // ton formulaire
import ListCodeBank from "./CodeBankList"; // ta liste
import { CodeBank } from "@/types/pay/codeBank";
import { getCodeBanks, createCodeBank, deleteCodeBank } from "@/api/dashboard/pay/codeBank";
import { CreateCodeBankDto } from "@/types/pay/codeBank";

const PayCodeBank: React.FC = () => {
    const [codeBanks, setCodeBanks] = useState<CodeBank[]>([]);
    const [selectedCodeBank, setSelectedCodeBank] = useState<CodeBank | null>(null);

    // Charger les banques depuis l'API
    const fetchCodeBanks = async () => {
        const banks = await getCodeBanks();
        setCodeBanks(banks);
    };

    useEffect(() => {
        fetchCodeBanks();
    }, []);

    // Ajouter une banque
    const handleAddCodeBank = async (newBank: CreateCodeBankDto) => {
        const created = await createCodeBank(newBank);
        if (created) {
            setCodeBanks(prev => [...prev, created]);
        }
    };

    // Supprimer une banque
    const handleDeleteCodeBank = async (id: string) => {
        const confirmed = window.confirm("Voulez-vous vraiment supprimer cette banque ?");
        if (!confirmed) return;

        const success = await deleteCodeBank(id);
        if (success) {
            setCodeBanks(prev => prev.filter(bank => bank.id !== id));
        }
    };

    return (
        <div className="flex gap-6 p-3">
            {/* Formulaire à gauche */}
            <div className="flex-1">
                <CodeBankForm onSubmit={handleAddCodeBank} />
            </div>

            {/* Liste des banques à droite */}
            <div className="flex-1">
                <ListCodeBank
                    codeBanks={codeBanks}
                    selectedCodeBank={selectedCodeBank}
                    onSelectCodeBank={setSelectedCodeBank}
                />
                {selectedCodeBank && (
                    <button
                        onClick={() => handleDeleteCodeBank(selectedCodeBank.id)}
                        className="mt-4 w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Supprimer la banque sélectionnée
                    </button>
                )}
            </div>
        </div>
    );
};

export default PayCodeBank;
