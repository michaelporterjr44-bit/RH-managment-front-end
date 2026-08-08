"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './components/SideBar';
import AccountPageTabs from './components/pay/PayAccount/PayAccount';
import PayCodeBank from './components/pay/codeBank/PayCodeBank';
import DashboardHeader from '../dashboard/components/DashboardHeader';
import CanauxNiveaux from './components/recruitment/canaux-niveaux/canauxNiveauxPage';
import BaseSalaryPageTabs from './components/pay/salaireDeBase/SalaireDeBase';
import HRModule from './components/pay/complements-salaire/complementsSalairePage';
import useAuthWatcher from '../hooks/useAuthWatcher';

function App() {
    const [activeItem, setActiveItem] = useState('recrutement-canaux');
    const [activeSection, setActiveSection] = useState("dashboard");
    const [selectedOption, setSelectedOption] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    const handleSettingsClick = () => {
        setActiveSection("management");
        setSelectedOption("settings_users");
        setSelectedOption("settings");
    };

    const handleOpenCanaux = () => {
        setActiveSection("management");
        setSelectedOption("canaux-niveaux");
    };

    const handleOpenAffectation = () => {
        setActiveSection("management");
        setSelectedOption("affectation");
    };
    useAuthWatcher();

    const renderActiveForm = () => {
        switch (activeItem) {
            case 'pay-account':
                return <AccountPageTabs />;
            case 'pay-codebank':
                return <PayCodeBank />;
            case 'base-salary':
                return <BaseSalaryPageTabs />;
            case 'recrutement-canaux':
                return <CanauxNiveaux />;
            case 'complements-salaire':
                return <HRModule />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardHeader onSettingsClick={handleSettingsClick} onOpenCanaux={handleOpenCanaux} onOpenAffectation={handleOpenAffectation} />
            <div className="min-h-screen bg-gray-50 flex pt-16">
                <Sidebar activeItem={activeItem} onItemSelect={setActiveItem} />
                <div className="ml-64 p-3 w-full">
                    {renderActiveForm()}
                </div>
            </div>
        </div>
    );
}

export default App;