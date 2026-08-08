import React from 'react';
import { AppUser } from '@/types/users/user';
import { Agence } from '@/types/recruitment/agency';

interface UserListProps {
    users: AppUser[];
    agencies: Agence[];
    onDeleteUser: (user: AppUser) => void;
    onUserClick: (user: AppUser) => void;
}

const UserList: React.FC<UserListProps> = ({ users, agencies, onDeleteUser, onUserClick }) => {
    const getAgencyName = (agenceId: number) => {
        const agency = agencies.find(a => a.id === agenceId);
        return agency ? agency.name : "Agence inconnue";
    };

    const getStatusColor = (status: string) =>
        status === "actif"
            ? "text-green-600 bg-green-100"
            : "text-red-600 bg-red-100";

    const getStatusColorAgence = (name: string) =>
        name === "Agence TNR-Ambohidahy"
            ? "text-xs text-green-600 bg-green-100 py-2 px-4"
            : "text-xs text-green-600 bg-green-100 py-2 px-4";

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-7">
            {/* header */}
            <div className="px-6 py-2 border-b border-slate-200 bg-green-800 rounded-t-xl">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <i className="ri-user-fill text-white text-2xl"></i>
                        <h1 className="text-base font-bold text-white">Liste des utilisateurs</h1>
                    </div>
                    <p className="text-sm text-white">{users.length} utilisateur(s) au total</p>
                </div>
            </div>

            {users.length === 0 ? (
                <div className="text-center py-12">
                    <i className="ri-user-line text-4xl mx-auto text-gray-300 mb-4"></i>
                    <p className="text-gray-500 text-lg">Aucun utilisateur créé</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Utilisateur
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Agence
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map(user => (
                                <tr
                                    key={user.id}
                                    onClick={() => onUserClick(user)}
                                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                {user.imageProfil ? (
                                                    <img
                                                        className="h-10 w-10 rounded-full object-cover"
                                                        src={user.imageProfil.url}
                                                        alt={`${user.firstName} ${user.lastName}`}
                                                    />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                        <i className="ri-user-line text-lg text-gray-600"></i>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {user.firstName} {user.lastName}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {user.matricule}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ${user
                                                ? getStatusColorAgence(user.agence?.name ?? "")
                                                : ""
                                                }`}>
                                            {getAgencyName(user.agence?.id ?? -1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={e => {
                                                e.stopPropagation();
                                                onDeleteUser(user);
                                            }}
                                            className="text-red-600 hover:text-red-900 transition-colors p-2 hover:bg-red-50 rounded-full"
                                            title="Supprimer l'utilisateur"
                                        >
                                            <i className="ri-delete-bin-line text-lg"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UserList;
