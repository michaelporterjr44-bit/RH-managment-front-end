import React, { useState, useEffect } from 'react';
import EmployeeList from '../../components/EmployeeListPay';
import SalaireBaseForm from './SalaireDeBaseForm';
import Toast from '@/app/components/ui/Toast';
import { Employee } from '@/types/employee/employee';
import { getCodeBanks } from '@/api/dashboard/pay/codeBank';
import { getAgencies } from '@/api/dashboard/employee-and-user/users';

function SalaireDeBasePage() {
    const [agencies, setAgencies] = useState<any[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [message, setMessage] = useState<string>('');
    const [showAlert, setShowAlert] = useState(false);
    const [success, setSuccess] = useState<boolean | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [employeeRes, agencyRes] = await Promise.all([
                    getCodeBanks(),
                    getAgencies()
                ]);
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
                    <SalaireBaseForm
                        selectedEmployee={selectedEmployee}
                    />
                </div>
                <div className="w-[40%] space-y-6">
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

export default SalaireDeBasePage;
