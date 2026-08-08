import React from 'react';
import { CodeBank } from '@/types/pay/codeBank';

interface ListCodeBankProps {
    codeBanks: CodeBank[];
    selectedCodeBank: CodeBank | null;
    onSelectCodeBank: (codeBank: CodeBank) => void;
}

const ListCodeBank: React.FC<ListCodeBankProps> = ({
    codeBanks,
    selectedCodeBank,
    onSelectCodeBank,
}) => {
    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Banques</h3>
            <div className="space-y-3">
                {codeBanks.length > 0 ? (
                    codeBanks.map((bank) => (
                        <button
                            key={bank.id}
                            onClick={() => onSelectCodeBank(bank)}
                            className={`w-full text-left p-3 rounded-lg border transition-colors ${selectedCodeBank?.id === bank.id
                                    ? 'bg-green-50 border-green-500 text-green-700 font-medium'
                                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700'
                                }`}
                        >
                            <div className="font-medium">{bank.codeBank}</div>
                            <div className="text-sm text-gray-600">{bank.bankName}</div>
                        </button>
                    ))
                ) : (
                    <p className="text-sm text-gray-500">Aucune banque disponible</p>
                )}
            </div>
        </div>
    );
};

export default ListCodeBank;
