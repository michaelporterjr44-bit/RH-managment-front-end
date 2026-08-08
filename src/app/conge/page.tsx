"use client";

import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import { useRouter } from 'next/navigation';
import DashboardHeader from '../dashboard/components/DashboardHeader';
import { LeaveBalanceForm } from './components/LeavePageContent';
import useAuthWatcher from '../hooks/useAuthWatcher';
import { LeaveForm } from './components/leaveFom';
import { useLeaveStore } from './store/useLeaveStore';
import { Leave } from '@/types/leave/leave.types';
import CalendarPageContent from './components/Calendar';
import axiosInstance from '@/api/axiosInstance';
import SoldeCongeTable from './components/Statistics';

function App() {
    const [currentView, setCurrentView] = useState('calendar');
    const { leaves, setLeaves, openModal, setSelectedLeave, selectedLeave } = useLeaveStore();
    const [detailLeave, setDetailLeave] = useState<Leave | null>(null);
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

    useEffect(() => {
        loadLeaves();
    }, []);

    useAuthWatcher();

    const loadLeaves = async () => {
        try {
            const response = await axiosInstance.get('/api/demande-conges/demande_page', {
                params: { page: 0, size: 100 }
            });

            const data = response.data.content.map((leave: any) => ({
                ...leave,
                employee: leave.employee ?? { firstName: "Inconnu", lastName: "", id: "" },
            }));

            setLeaves(data);
        }        catch (error) {
            console.error('Error loading leaves:', error);
        }
    };

    const handleViewChange = (view: string) => setCurrentView(view);
    const handleEditLeave = (leave: Leave) => setDetailLeave(leave);
    const handleSelectLeave = (leave: Leave) => setDetailLeave(leave);
    const handleSaveDetail = (leave: Leave) => {
        setLeaves(leaves.map(l => l.id === leave.id ? leave : l));
        setDetailLeave(null);
        loadLeaves();
    };
    const handleCloseDetail = () => setDetailLeave(null);
    const handleAddLeave = (newLeave: Leave) => {
        setLeaves([...leaves, newLeave]);
        setCurrentView("calendar");
    };


    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar currentView={currentView} onViewChange={handleViewChange} />

            <div className="transition-all duration-300 ml-64">
                <DashboardHeader onSettingsClick={handleSettingsClick} onOpenCanaux={handleOpenCanaux} onOpenAffectation={handleOpenAffectation} />

                <main className="p-6 pt-19">
                    {currentView === 'calendar' && (
                        <CalendarPageContent
                        />
                    )}
                    {currentView === 'new' && <LeaveForm onSuccess={handleAddLeave} />}
                    {currentView === 'stats' && <SoldeCongeTable />}
                    {currentView === 'balance' && <LeaveBalanceForm />}
                </main>
            </div>
        </div>
    );
}

export default App;
