import React, { useState } from 'react';
import CampaignList from './components/CampagneList';
import CampaignDetail from './components/CampaignDetail';
import { Campagne } from '@/types/recruitment/campaign';
import { Postulant } from '@/types/recruitment/applicant';

function RecrutemenPage() {
    const [currentView, setCurrentView] = useState<'list' | 'detail'>('list');
    const [selectedCampaign, setSelectedCampaign] = useState<Campagne | null>(null);

    const handleCampaignSelect = (campaign: Campagne) => {
        setSelectedCampaign(campaign);
        setCurrentView('detail');
    };

    const handleBackToList = () => {
        setCurrentView('list');
        setSelectedCampaign(null);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {currentView === 'list' ? (
                <CampaignList onCampaignSelect={handleCampaignSelect} />
            ) : (
                selectedCampaign && (
                    <CampaignDetail
                        campaign={selectedCampaign}
                        onBack={handleBackToList}
                    />
                )
            )}
        </div>
    );
}

export default RecrutemenPage;