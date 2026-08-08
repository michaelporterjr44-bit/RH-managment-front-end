import React, { useState, useEffect } from 'react';
import { EmployeeResponse } from '@/types/employee/employee';
import { AppRole } from '@/types/users/user';
import { ImageProfilDto } from '@/types/employee/employee';
import { AgenceDto } from '@/types/employee/employee';
import { CreateUserDto } from '@/types/users/user';

interface UserFormProps {
    agencies: AgenceDto[];
    appRoles: AppRole[];
    selectedEmployee: EmployeeResponse | null;
    onSubmit: (userData: any) => void;
}

const UserForm: React.FC<UserFormProps> = ({ agencies, appRoles, selectedEmployee, onSubmit }) => {
    const [formData, setFormData] = useState<{
        matricule: string;
        email: string;
        password: string;
        lastName: string;
        firstName: string;
        agence: AgenceDto | null;
        appRoles: AppRole[];
        imageProfil: ImageProfilDto | null;
    }>({
        matricule: '',
        email: '',
        password: '',
        lastName: '',
        firstName: '',
        agence: null,
        appRoles: [],
        imageProfil: null
    });


    const [showAgencyList, setShowAgencyList] = useState(false);

    useEffect(() => {
        if (selectedEmployee) {
            setFormData({
                matricule: selectedEmployee.matricule,
                email: selectedEmployee.email || '',
                password: '',
                lastName: selectedEmployee.lastName,
                firstName: selectedEmployee.firstName,
                agence: selectedEmployee.agence || null,
                appRoles: selectedEmployee?.id ? [] : [],
                imageProfil: selectedEmployee.imageProfilDto || null
            });
        }
    }, [selectedEmployee]);



    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAgencySelect = (agency: AgenceDto) => {
        setFormData(prev => ({ ...prev, agence: agency }));
        setShowAgencyList(false);
    };

    const handleRoleChange = (role: AppRole, checked: boolean) => {
        setFormData(prev => ({
            ...prev,
            appRoles: checked
                ? [...prev.appRoles, role]
                : prev.appRoles.filter(r => r.id !== role.id)
        }));
    };

    const isRoleSelected = (roleId: number) => formData.appRoles.some(r => r.id === roleId);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.agence) {
            alert("Veuillez sélectionner une agence valide");
            return;
        }

        const userData: CreateUserDto = {
            matricule: formData.matricule,
            email: formData.email,
            password: formData.password,
            lastName: formData.lastName,
            firstName: formData.firstName,

            employeeId: selectedEmployee?.id ?? null,

            agenceId: formData.agence.id,

            roleIds: formData.appRoles.map(role => role.id),

            imageProfilUrl: formData.imageProfil?.url ?? null
        };
        console.log("Employee ID =");

        onSubmit(userData);

        setFormData({
            matricule: '',
            email: '',
            password: '',
            lastName: '',
            firstName: '',
            agence: null,
            appRoles: [],
            imageProfil: null
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
                {selectedEmployee ? `Créer un utilisateur à partir de l\'employé ${selectedEmployee.firstName} ${selectedEmployee.lastName}`
                    : 'Créer un nouvel utilisateur'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Matricule
                        </label>
                        <input
                            type="text"
                            name="matricule"
                            value={formData.matricule}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                            placeholder="Entrez le matricule"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                            placeholder="email@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                            placeholder="Nom de famille"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Prénom
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                            placeholder="Prénom"
                        />
                    </div>

                    {/* Dropdown agence */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Agence</label>
                        <button
                            type="button"
                            onClick={() => setShowAgencyList(!showAgencyList)}
                            className="flex items-center justify-between px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all w-full text-left"
                        >
                            <span className="text-gray-600">
                                {formData.agence ? `${formData.agence.name}` : "Sélectionner une agence"}
                            </span>
                            <i className="ri-arrow-down-s-line"></i>
                        </button>

                        {formData.imageProfil && (
                            <div className="mb-4 flex justify-center">
                                <img
                                    src={formData.imageProfil.url}
                                    alt="Photo employé"
                                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                                />
                            </div>
                        )}
                        {showAgencyList && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                                {agencies.map(a => (
                                    <button
                                        key={a.id}
                                        type="button"
                                        onClick={() => handleAgencySelect(a)}
                                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl"
                                    >
                                        {a.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sélection multiple Rôles */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-4">Rôles d'application</label>
                    <div className="space-y-3">
                        {appRoles.map(role => {
                            const selected = isRoleSelected(role.id);
                            return (
                                <label
                                    key={role.id}
                                    className={`flex items-start space-x-3 p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 ${selected
                                        ? "border-green-500 bg-green-50"
                                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                        }`}
                                >
                                    <div className="flex items-center h-6">
                                        <input
                                            type="checkbox"
                                            checked={selected}
                                            onChange={(e) => handleRoleChange(role, e.target.checked)}
                                            className="w-3 h-3 text-green-600 bg-white border-2 border-gray-300 rounded-md focus:ring-green-500 focus:ring-2 transition-colors"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className={`font-medium text-sm ${selected ? "text-green-900" : "text-gray-900"}`}>
                                            {role.roleName}
                                        </div>
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                </div>

                {/* Résumé de la sélection */}
                {(formData.agence || formData.appRoles.length > 0) && (
                    <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-3">Résumé de la sélection</h3>

                        {formData.agence && (
                            <div className="mb-2">
                                <span className="text-sm font-medium text-gray-600">Agence sélectionnée : </span>
                                <span className="text-sm text-gray-900">
                                    {formData.agence.name} ({formData.agence.code})
                                </span>
                            </div>
                        )}

                        {formData.appRoles.length > 0 && (
                            <div>
                                <span className="text-sm font-medium text-gray-600">
                                    Rôles sélectionnés ({formData.appRoles.length}) :
                                </span>
                                <div className="mt-1 flex flex-wrap gap-2">
                                    {formData.appRoles.map(role => (
                                        <span
                                            key={role.id}
                                            className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-md"
                                        >
                                            {role.roleName}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium"
                    >
                        Créer l'utilisateur
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserForm;
