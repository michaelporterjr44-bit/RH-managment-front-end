import React, { useState, useEffect } from 'react';
import EmployeeList from '../../components/EmployeeListPay';
import ListCodeBank from '../../codeBank/CodeBankList';
import AccountForm from './AccountForm';
import Toast from '@/app/components/ui/Toast';
import { Employee } from '@/types/employee/employee';
import { CodeBank } from '@/types/pay/codeBank';
import { Account } from '@/types/pay/account';
import { getCodeBanks } from '@/api/dashboard/pay/codeBank';
import { getAgencies } from '@/api/dashboard/employee-and-user/users';

function AccountPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [agencies, setAgencies] = useState<any[]>([]);
    const [codeBanks, setCodeBanks] = useState<CodeBank[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [selectedCodeBank, setSelectedCodeBank] = useState<CodeBank | null>(null);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [message, setMessage] = useState<string>('');
    const [showAlert, setShowAlert] = useState(false);
    const [success, setSuccess] = useState<boolean | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bankRes, agencyRes] = await Promise.all([
                    getCodeBanks(),
                    getAgencies()
                ]);
                setCodeBanks(bankRes);
                setAgencies(agencyRes);
            } catch (error) {
                console.error('Erreur lors du chargement des données :', error);
            }
        };
        fetchData();
    }, []);

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
        <div className="min-h-screen bg-gray-50 w-full">
            <div className="flex gap-6">
                <div className="w-[60%]">
                    <AccountForm
                        selectedEmployee={selectedEmployee}
                        selectedCodeBank={selectedCodeBank}
                        onSuccess={(newAccount) => {
                            console.log("Compte créé :", newAccount);
                        }}
                    />
                </div>
                <div className="w-[40%] space-y-6">
                    <ListCodeBank
                        codeBanks={codeBanks}
                        selectedCodeBank={selectedCodeBank}
                        onSelectCodeBank={setSelectedCodeBank}
                    />

                    <EmployeeList
                        selectedEmployee={selectedEmployee}
                        onSelectEmployee={setSelectedEmployee}
                    />
                </div>
            </div>
            <Toast message={message} success={success ?? false} show={showAlert} />
        </div>
    );
}

export default AccountPage;
