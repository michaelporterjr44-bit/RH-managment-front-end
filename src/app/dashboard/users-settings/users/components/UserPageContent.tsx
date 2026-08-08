import React, { useEffect, useState } from "react";
import UserList from "./UserList";
import UserProfile from "./UserProfile";
import type { AppRole, AppUser } from "@/types/users/user";
import { Agence } from "@/types/recruitment/agency";
import { getUsersPage, getAgencies } from "@/api/dashboard/employee-and-user/users";
import { deleteUserByEmail } from "@/api/dashboard/users/users";
import { getRoles } from "@/api/dashboard/employee-and-user/users";

const UserPageContent: React.FC = () => {
    const [users, setUsers] = useState<AppUser[]>([]);
    const [agencies, setAgencies] = useState<Agence[]>([]);
    const [appRoles, setAppRoles] = useState<AppRole[]>([]);
    const [message, setMessage] = useState<string>("");

    const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
    const [view, setView] = useState<'list' | 'profile'>('list');

    const [userToDelete, setUserToDelete] = useState<AppUser | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [success, setSuccess] = useState<boolean | null>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, agenciesRes, rolesRes] = await Promise.all([
                    getUsersPage(0, 50),
                    getAgencies(),
                    getRoles(),
                ]);

                setUsers(usersRes.content || []);
                setAgencies(agenciesRes || []);
                setAppRoles(rolesRes || []);
            } catch (err) {
                console.error("Erreur lors du chargement des données :", err);
            }
        };
        fetchData();
    }, []);

    const handleUserClick = (user: AppUser) => {
        setSelectedUser(user);
        setView('profile');
    };

    const handleBackToList = () => {
        setSelectedUser(null);
        setView('list');
    };

    const handleUpdateUser = (updatedUser: AppUser) => {
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
        setSelectedUser(updatedUser);
    };

    const confirmDeleteUser = (user: AppUser) => {
        setUserToDelete(user);
        setIsConfirmModalOpen(true);
    };

    // ⚡️ Supprime après confirmation
    const handleDeleteUserConfirmed = async () => {
        if (!userToDelete) return;

        try {
            await deleteUserByEmail(userToDelete.email);
            setUsers(prev => prev.filter(u => u.matricule !== userToDelete.matricule));
            if (selectedUser?.matricule === userToDelete.matricule) handleBackToList();

            setMessage("Utilisateur supprimé avec succès !");
            setSuccess(true);
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
            setMessage("Une erreur est survenue lors de la suppression.");
            setSuccess(false);
        } finally {
            setIsConfirmModalOpen(false);
            setUserToDelete(null);
        }
    };


    return (
        <div>
            <div className="bg-gray-50 w-full min-h-screen mb-5">
                {view === 'list' ? (
                    <UserList
                        users={users}
                        agencies={agencies}
                        onDeleteUser={confirmDeleteUser}
                        onUserClick={handleUserClick}
                    />

                ) : selectedUser ? (
                    <UserProfile
                        user={selectedUser}
                        agencies={agencies}
                        appRoles={appRoles}
                        onBack={handleBackToList}
                        onUpdate={handleUpdateUser}
                    />
                ) : null}

                {message && (
                    <div
                        className={`flex items-center gap-2 px-4 py-3 rounded-md mb-4 text-sm shadow-md transition-all duration-300 transform ${showAlert
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-95 pointer-events-none"
                            } ${success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                    >
                        <i
                            className={` transition-all duration-300 transform ri-notification-line text-lg ${success ? "text-green-600" : "text-red-600"
                                }`}
                        ></i>
                        <span>{message}</span>
                    </div>
                )}
            </div>
            {isConfirmModalOpen && userToDelete && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Confirmation de suppression
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Êtes-vous sûr de vouloir supprimer l’utilisateur{" "}
                            <span className="font-semibold">
                                {userToDelete.firstName} {userToDelete.lastName}
                            </span>{" "}
                            ?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsConfirmModalOpen(false)}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleDeleteUserConfirmed}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserPageContent;
