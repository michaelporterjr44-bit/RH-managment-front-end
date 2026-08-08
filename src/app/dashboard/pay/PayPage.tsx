import React, { useState } from 'react';
import PayrollList from './components/PayrollList';
import { PayrollPeriod } from '@/types/pay/pay';
import PayrollDetail from './components/PayrollDetail';

function PayPage() {
    const [selectedPeriod, setSelectedPeriod] = useState<PayrollPeriod | null>(null);

    const handleSelectPeriod = (period: PayrollPeriod) => {
        setSelectedPeriod(period);
    };

    const handleBack = () => {
        setSelectedPeriod(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 w-full">
            <div className="mx-auto py-3">
                {selectedPeriod ? (
                    <PayrollDetail period={selectedPeriod} onBack={handleBack} />
                ) : (
                    <PayrollList onSelectPeriod={handleSelectPeriod} />
                )}
            </div>
        </div>
    );
}

export default PayPage;