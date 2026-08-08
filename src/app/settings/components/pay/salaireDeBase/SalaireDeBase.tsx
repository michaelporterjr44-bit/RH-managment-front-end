import React, { useState, useEffect } from 'react';
import SalaireDeBasePage from './components/SalaireDeBasePageForm';
import { SalaireDeBaseList } from './components/SalaireDeBaseList';
import Toast from '@/app/components/ui/Toast';

type TabType = 'management' | 'list';

export default function BaseSalaryPageTabs() {
    const [activeTab, setActiveTab] = useState<TabType>('management');
    const [message, setMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [success, setSuccess] = useState<boolean | null>(null);

    useEffect(() => {
        if (message) {
            setShowAlert(true);
            const timeout = setTimeout(() => {
                setShowAlert(false);
                setTimeout(() => {
                    setMessage('');
                    setSuccess(null);
                }, 300);
            }, 2000);
            return () => clearTimeout(timeout);
        }
    }, [message]);

    return (
        <div className="min-h-screen bg-gray-50 py-5 px-6">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-5">
                <nav className="flex space-x-0">
                    <button
                        onClick={() => setActiveTab('management')}
                        className={`flex items-center space-x-3 px-6 py-4 text-sm font-medium transition-all duration-200
              first:rounded-l-xl last:rounded-r-xl
              ${activeTab === 'management'
                                ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-gray-900 border-b-2 border-green-500'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <i className="ri-user-add-line h-5 w-5 text-gray-400"></i>
                        <span>Salaire de Base</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('list')}
                        className={`flex items-center space-x-3 px-6 py-4 text-sm font-medium transition-all duration-200
              first:rounded-l-xl last:rounded-r-xl
              ${activeTab === 'list'
                                ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-gray-900 border-b-2 border-green-500'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <i className="ri-team-line h-5 w-5 text-gray-400"></i>
                        <span>Liste Salaire de base Employee</span>
                    </button>
                </nav>
            </div>

            {/* Tab content */}
            {activeTab === 'management' && (
                <div className="flex gap-6">
                    <SalaireDeBasePage />
                </div>
            )}

            {activeTab === 'list' && (
                <SalaireDeBaseList />
            )}

            <Toast message={message} success={success ?? false} show={showAlert} />
        </div>
    );
}
