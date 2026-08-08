import React, { useState, useEffect } from 'react';
import AccountPage from './components/AccountPageForm';
import { AccountList } from './components/AccountList';
import { Employee } from '@/types/employee/employee';
import { CodeBank } from '@/types/pay/codeBank';
import { Account } from '@/types/pay/account';
import Toast from '@/app/components/ui/Toast';

type TabType = 'management' | 'list';

export default function AccountPageTabs() {
    const [activeTab, setActiveTab] = useState<TabType>('management');
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]); // si tu récupères depuis API
    const [codeBanks, setCodeBanks] = useState<CodeBank[]>([]); // si tu récupères depuis API
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [selectedCodeBank, setSelectedCodeBank] = useState<CodeBank | null>(null);
    const [message, setMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [success, setSuccess] = useState<boolean | null>(null);

    const handleCreateAccount = (accountData: Account) => {
        setAccounts(prev => [...prev, accountData]);
        setMessage('Compte créé avec succès');
        setSuccess(true);
    };

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
                        <span>Gestion des comptes</span>
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
                        <span>Liste des comptes</span>
                    </button>
                </nav>
            </div>

            {/* Tab content */}
            {activeTab === 'management' && (
                <div className="flex gap-6">
                 <AccountPage/>
                </div>
            )}

            {activeTab === 'list' && (
                <AccountList/>
            )}

            <Toast message={message} success={success ?? false} show={showAlert} />
        </div>
    );
}
