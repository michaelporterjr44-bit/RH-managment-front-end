import React, { useState, useEffect } from 'react';
import UserForm from './components/UserForm';
import EmployeeList from './components/EmployeeList';
import UserPageContent from './components/UserPageContent';
import { AppUser, TabType } from '@/types/users/user';
import { EmployeeResponse } from '@/types/employee/employee';
import { getUsersPage, getAgencies, getRoles, updateUser } from '@/api/dashboard/employee-and-user/users';
import { addUser } from '@/api/dashboard/users/users';
import Toast from '../../../components/ui/Toast';

function UserPageTabs() {
    const [activeTab, setActiveTab] = useState<TabType>('management');
    const [users, setUsers] = useState<AppUser[]>([]);
    const [message, setMessage] = useState<string>("");
    const [showAlert, setShowAlert] = useState(false);
    const [success, setSuccess] = useState<boolean | null>(null);
    const [agencies, setAgencies] = useState<any[]>([]);
    const [appRoles, setAppRoles] = useState<any[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeResponse | null>(null);
    const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
    const [showUserProfile, setShowUserProfile] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, agencyRes, roleRes] = await Promise.all([
                    getUsersPage(0, 20),
                    getAgencies(),
                    getRoles(),
                ]);

                setUsers(userRes.content);
                setAgencies(agencyRes);
                setAppRoles(roleRes);
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
                    setMessage("");
                    setSuccess(null);
                }, 300);
            }, 2000);
            return () => clearTimeout(timeout);
        }
    }, [message]);


    const handleCreateUser = async (userData: any) => {
        try {
            const newUser = await addUser(userData);
            setUsers(prev => [...prev, newUser]);
            setSelectedEmployee(null);
            setMessage("User created successfuffy");
            setSuccess(true);
        } catch (error) {
            console.error(error);
            setMessage("failed to create user");
            setSuccess(false);
        }
    };

    const handleDeleteUser = (userId: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            setUsers(prev => prev.filter(user => user.id !== userId));
        }
    };

    const handleViewProfile = (user: AppUser) => {
        setSelectedUser(user);
        setShowUserProfile(true);
    };

    const handleUpdateUser = async (updatedUser: AppUser) => {
        try {
            const res = await updateUser(updatedUser.id, updatedUser);
            setUsers(prev => prev.map(u => (u.id === res.id ? res : u)));
            setSelectedUser(res);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-5">
            <div className="">
                <div className="">
                    <div className="">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-7">
                            <nav className="flex space-x-0">
                                <button
                                    onClick={() => setActiveTab('management')}
                                    className={`
                                    flex items-center space-x-3 px-6 py-4 text-sm font-medium transition-all duration-200
                                    first:rounded-l-xl last:rounded-r-xl
                                    ${activeTab === 'management'
                                            ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-gray-900 border-b-2 border-green-500'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                        }
        `}
                                >
                                    <i className="ri-user-add-line h-5 w-5 text-gray-400"></i>
                                    <span>Gestion des utilisateurs</span>
                                </button>

                                <button
                                    onClick={() => setActiveTab('users')}
                                    className={`
                                    flex items-center space-x-3 px-6 py-4 text-sm font-medium transition-all duration-200
                                    first:rounded-l-xl last:rounded-r-xl
                                    ${activeTab === 'users'
                                            ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-gray-900 border-b-2 border-green-500'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                        }
        `}
                                >
                                    <i className="ri-team-line h-5 w-5 text-gray-400"></i>
                                    <span>Liste des utilisateurs</span>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>

                {activeTab === 'management' && (
                    <div className="flex gap-6">
                        <div className='w-[60%]'>
                            <UserForm
                                agencies={agencies}
                                appRoles={appRoles}
                                selectedEmployee={selectedEmployee}
                                onSubmit={handleCreateUser}
                            />
                        </div>
                        <div className='w-[40%]'>
                            <EmployeeList
                                selectedEmployee={selectedEmployee}
                                onSelectEmployee={setSelectedEmployee}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <UserPageContent />
                )}
            </div>
            <Toast message={message} success={success ?? false} show={showAlert} />
        </div>
    );
}

export default UserPageTabs;
