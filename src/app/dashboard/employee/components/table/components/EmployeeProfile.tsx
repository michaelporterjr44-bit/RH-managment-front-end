import React, { useState, useEffect } from 'react';
import { uploadImage, updateImage } from '@/api/dashboard/employee-and-user/image';
import { updateEmployee, updateEmployeeImageAutoMatricule, getEmployeeByMatricule } from '@/api/dashboard/employee-and-user/employees';
import { EmployeeProfileResponse as EmployeeProfileType } from '@/types/employee/employee';
import { Agence } from '@/types/employee/employee';
import { UpdateEmployeeDTO } from '@/types/employee/employee';
import { getAllDepartments } from '@/api/dashboard/department/department';
import { EmployeeStatus, ContractType, MaritalStatus } from '@/types/employee/employee.enums';

interface EmployeeProfileProps {
    employee: EmployeeProfileType;
    onBack: () => void;
    onUpdate: (employee: EmployeeProfileType) => void;
    agencies: Agence[];
}

const EmployeeProfile: React.FC<EmployeeProfileProps> = ({ employee, onBack, onUpdate, agencies }) => {
    const [editedEmployee, setEditedEmployee] =
        useState<EmployeeProfileType>(employee);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [showAgencyList, setShowAgencyList] = useState(false);
    const [showContractList, setShowContractList] = useState(false);
    const [showStatusList, setShowStatusList] = useState(false);

    // stocke le fichier File et non l'URL
    const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null);
    const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
    const [departments, setDepartments] = useState<any[]>([]);
    const [showDepartmentList, setShowDepartmentList] = useState(false);

    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setNewPhotoFile(file);           // On garde le File pour l’upload
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewPhoto(e.target?.result as string); //On met à jour le preview
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const data = await getAllDepartments();
                setDepartments(data);
            } catch (error) {
                console.error("Erreur chargement départements :", error);
            }
        };

        fetchDepartments();
    }, []);
    const handleSave = async () => {
        try {
            setIsSaving(true);

            if (!editedEmployee.id || !editedEmployee.matricule) {
                console.log("ID ou matricule manquant");
                return;
            }

            const payload: UpdateEmployeeDTO = {
                lastName: editedEmployee.lastName,
                firstName: editedEmployee.firstName,
                email: editedEmployee.email,
                phoneNumber: editedEmployee.phoneNumber,
                address: editedEmployee.address,
                matricule: editedEmployee.matricule,
                contractType: editedEmployee.contractType,
                status: editedEmployee.status,
                hireDate: editedEmployee.hireDate,
                dateOfBirth: editedEmployee.dateOfBirth,
                educationLevel: editedEmployee.educationLevel,
                degree: editedEmployee.degree,
                experience: editedEmployee.experience,
                numberOfChildren: editedEmployee.numberOfChildren,
                exitDate: editedEmployee.exitDate,
                exitReason: editedEmployee.exitReason,
                departmentId: editedEmployee.departmentDto?.id ?? null,
                agenceId: editedEmployee.agence?.id ?? null,
            };
            console.log(payload);

            await updateEmployee(editedEmployee.id, payload);

            if (newPhotoFile) {
                await updateEmployeeImageAutoMatricule(
                    editedEmployee,
                    newPhotoFile
                );
            }

            const refreshed = await getEmployeeByMatricule(
                editedEmployee.matricule
            );

            setEditedEmployee(refreshed);
            onUpdate(refreshed);

            // sortir du mode édition après sauvegarde
            setIsEditing(false);

            // nettoyer la photo temporaire
            setNewPhotoFile(null);
            setPreviewPhoto(null);

        } catch (error) {
            console.error("ERROR:", error);
        } finally {
            setIsSaving(false);
        }
    };
    const handleCancel = () => {
        setEditedEmployee(employee);
        setNewPhotoFile(null);
        setPreviewPhoto(null);
        setIsEditing(false);
    };

    const safeValue = (value: any, placeholder = "Non renseigné") =>
        value && value !== "" ? value : placeholder;

    const formatDate = (dateString: string) => {
        if (!dateString || dateString === 'Non renseignée') return 'Non renseignée';
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    const normalizedStatus = editedEmployee.status?.trim().toLowerCase();
    const getStatusColor = (status?: string) => {
        const normalized = status?.trim().toLowerCase();

        if (normalized === "actif") {
            return "bg-green-100 text-green-800";
        }

        return "bg-red-100 text-red-800";
    };

    const getAdvancedStatusColor = (status?: string) => {
        const normalized = status?.trim().toLowerCase();

        if (normalized === "actif") {
            return "bg-green-100 text-green-800";
        }

        if (normalized === "en congé") {
            return "bg-yellow-100 text-yellow-800";
        }

        return "bg-red-100 text-red-800";
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="mx-auto px-6 py-4 w-full">
                    <div className="flex items-center justify-between">
                        <div className="flex gap-4">
                            <button
                                onClick={onBack}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
                            >
                                <i className="ri-arrow-left-line w-5 h-5 text-gray-600 group-hover:text-gray-900"></i>
                            </button>
                            <div className='flex flex-col justify-center gap-1'>
                                <h1 className="flex flex-row gap-2 justify-center items-center text-xl">
                                    <p className='font-medium text-gray-800 uppercase'>{employee.firstName}</p>
                                    <p className="text-xm">{employee.lastName}</p>
                                </h1>
                                <div className="flex flex-row justify-start items-center gap-2 text-gray-600">
                                    <h1>{employee.matricule} </h1>
                                    <h1 className='font-medium text-xs uppercase'> • {employee.departmentDto?.libelle}</h1>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleCancel}
                                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                                    >
                                        <span>Annuler</span>
                                    </button>

                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className={`py-2 rounded-lg transition-all duration-200 
                flex items-center justify-center gap-2 text-white min-w-[150px]
                ${isSaving
                                                ? "bg-green-700 cursor-not-allowed"
                                                : "bg-green-700 hover:bg-green-800"
                                            }`}
                                    >
                                        {isSaving ? (
                                            <>
                                                <i className="ri-loader-4-line animate-spin text-[16px] leading-none"></i>
                                                <span>Enregistrement...</span>
                                            </>
                                        ) : (
                                            <>
                                                <i className="ri-save-line text-[16px] leading-none"></i>
                                                <span>Enregistrer</span>
                                            </>
                                        )}
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="py-2 bg-green-700 text-white hover:bg-green-800 
            rounded-lg transition-colors duration-200 
            flex items-center justify-center gap-2 min-w-[150px]"
                                >
                                    <i className="ri-edit-line text-[16px] leading-none"></i>
                                    <span>Modifier</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-7">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Photo and Status */}
                    <div className="lg:col-span-1 flex column gap-9 flex-col">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="text-center">
                                <div className="relative inline-block">
                                    <img
                                        src={
                                            previewPhoto ||
                                            editedEmployee.imageProfil?.url ||
                                            `https://ui-avatars.com/api/?name=${editedEmployee.firstName}+${editedEmployee.lastName}`
                                        }
                                        alt={`${editedEmployee.lastName} ${editedEmployee.firstName}`}
                                        className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                                    />
                                    {isEditing && (
                                        <label className="absolute bottom-0 right-0 p-2 bg-green-700 rounded-full cursor-pointer hover:bg-green-700 transition-colors duration-200 group">
                                            <i className="ri-camera-line w-4 h-4 text-white group-hover:scale-110 transition-transform duration-200"></i>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handlePhotoChange}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                                <div className="px-3 py-2 rounded-lg">
                                    <span
                                        className={`inline-flex px-4 py-1 rounded-full text-[11px] font-bold ${getStatusColor(
                                            editedEmployee.status
                                        )}`}
                                    >
                                        {editedEmployee.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Parcours & formation */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                <i className="ri-graduation-cap-line text-purple-600 text-xl mr-2"></i>
                                Parcours & formation
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <i className="ri-building-line w-4 h-4"></i>
                                        Niveau d'études
                                    </label>
                                    {isEditing ? (
                                        <select
                                            value={editedEmployee.educationLevel || ""}
                                            onChange={(e) => setEditedEmployee({ ...editedEmployee, educationLevel: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        >
                                            <option value="">Sélectionner</option>
                                            <option value="Bac">Bac</option>
                                            <option value="Bac+2">Bac+2</option>
                                            <option value="Bac+3">Bac+3</option>
                                            <option value="Bac+5">Bac+5</option>
                                            <option value="Bac+8">Bac+8</option>
                                        </select>
                                    ) : (
                                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{editedEmployee.educationLevel}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <i className="ri-mail-line w-4 h-4"></i>
                                        Diplôme
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editedEmployee.degree}
                                            onChange={(e) => setEditedEmployee({ ...editedEmployee, degree: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{editedEmployee.degree}</p>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <i className="ri-map-pin-line w-4 h-4"></i>
                                        Expérience professionnelle
                                    </label>
                                    {isEditing ? (
                                        <textarea
                                            value={editedEmployee.experience}
                                            onChange={(e) => setEditedEmployee({ ...editedEmployee, experience: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            rows={2}
                                        />
                                    ) : (
                                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{editedEmployee.experience}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Fin de contrat */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                <i className="ri-calendar-line"></i>
                                Fin de contrat
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <i className="ri-building-line w-4 h-4"></i>
                                        Date de sortie
                                    </label>

                                    {isEditing ? (
                                        <input
                                            type="date"
                                            value={editedEmployee.exitDate || ""} // <-- valeur par défaut
                                            onChange={(e) =>
                                                setEditedEmployee({ ...editedEmployee, exitDate: e.target.value })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                                            {editedEmployee.exitDate ? formatDate(editedEmployee.exitDate) : "—"}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        Raison de sortie
                                    </label>
                                    {isEditing ? (
                                        <select
                                            value={editedEmployee.exitReason || ""}
                                            onChange={(e) => setEditedEmployee({ ...editedEmployee, exitReason: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        >
                                            <option value="">Sélectionner</option>
                                            <option value="Démission">Démission</option>
                                            <option value="Licenciement">Licenciement</option>
                                            <option value="Fin de contrat">Fin de contrat</option>
                                            <option value="Retraite">Retraite</option>
                                            <option value="Mutation">Mutation</option>
                                        </select>
                                    ) : (
                                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{editedEmployee.exitReason}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Information */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Personal Information */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <i className="ri-user-line w-5 h-5 text-green-600"></i>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Informations personnelles</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editedEmployee.lastName ?? ""}
                                            onChange={(e) => setEditedEmployee({ ...editedEmployee, lastName: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{editedEmployee.lastName}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editedEmployee.firstName ?? ""}
                                            onChange={(e) => setEditedEmployee({ ...editedEmployee, firstName: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{editedEmployee.firstName}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <i className="ri-mail-line w-4 h-4"></i>
                                        Email professionnel
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            value={editedEmployee.email ?? ""}
                                            onChange={(e) => setEditedEmployee({ ...editedEmployee, email: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{editedEmployee.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <i className="ri-phone-line w-4 h-4"></i>
                                        Téléphone
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            value={editedEmployee.phoneNumber ?? ""}
                                            onChange={(e) => setEditedEmployee({ ...editedEmployee, phoneNumber: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{editedEmployee.phoneNumber}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <i className="ri-calendar-line w-4 h-4"></i>
                                        Date de naissance
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="date"
                                            value={editedEmployee.dateOfBirth || ""} // <-- valeur par défaut
                                            onChange={(e) =>
                                                setEditedEmployee({ ...editedEmployee, dateOfBirth: e.target.value })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                                            {formatDate(editedEmployee.dateOfBirth)}
                                        </p>
                                    )}

                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        Nombre d'enfant
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="number"
                                            value={editedEmployee.numberOfChildren ?? ""}
                                            onChange={(e) => setEditedEmployee({ ...editedEmployee, numberOfChildren: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{editedEmployee.numberOfChildren}</p>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <i className="ri-map-pin-line w-4 h-4"></i>
                                        Adresse
                                    </label>
                                    {isEditing ? (
                                        <textarea
                                            value={editedEmployee.address ?? ""}
                                            onChange={(e) => setEditedEmployee({ ...editedEmployee, address: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            rows={2}
                                        />
                                    ) : (
                                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{editedEmployee.address}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Professional Information */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <i className="ri-briefcase-line w-5 h-5 text-green-600"></i>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Informations professionnelles</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Matricule</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editedEmployee.matricule ?? ""}
                                            onChange={(e) => setEditedEmployee({ ...editedEmployee, matricule: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono"
                                        />
                                    ) : (
                                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg font-mono">{editedEmployee.matricule}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <i className="ri-building-line w-4 h-4"></i>
                                        Département
                                    </label>
                                    {isEditing ? (
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setShowDepartmentList(!showDepartmentList)}
                                                className="flex items-center justify-between px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all w-full text-left"
                                            >
                                                <span className="text-gray-600">
                                                    {editedEmployee.departmentDto?.libelle
                                                        ? editedEmployee.departmentDto.libelle
                                                        : "Sélectionner un département"}
                                                </span>
                                                <i className="ri-arrow-down-s-line"></i>
                                            </button>

                                            {showDepartmentList && (
                                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                                                    {departments.map((d) => (
                                                        <button
                                                            key={d.id}
                                                            type="button"
                                                            onClick={() => {
                                                                setEditedEmployee({
                                                                    ...editedEmployee,
                                                                    departmentDto: d,
                                                                });
                                                                setShowDepartmentList(false);
                                                            }}
                                                            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl"
                                                        >
                                                            {d.libelle}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{editedEmployee.departmentDto?.libelle}</p>
                                    )}
                                </div>

                                {/* Type de contrat */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <i className="ri-file-text-line w-4 h-4"></i>
                                        Type de contrat
                                    </label>
                                    {isEditing ? (
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setShowContractList(!showContractList)}
                                                className="flex items-center justify-between px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all w-full text-left bg-white"
                                            >
                                                <span className="text-gray-600">
                                                    {editedEmployee.contractType ? editedEmployee.contractType : "Sélectionner un type de contrat"}
                                                </span>
                                                <i className={`ri-arrow-down-s-line transition-transform duration-200 ${showContractList ? 'rotate-180' : ''}`}></i>
                                            </button>

                                            {showContractList && (
                                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto p-1">
                                                    {Object.values(ContractType).map((type) => (
                                                        <button
                                                            key={type}
                                                            type="button"
                                                            onClick={() => {
                                                                setEditedEmployee({
                                                                    ...editedEmployee,
                                                                    contractType: type as ContractType,
                                                                });
                                                                setShowContractList(false);
                                                            }}
                                                            className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors font-medium"
                                                        >
                                                            {type}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg uppercase">{editedEmployee.contractType}</p>
                                    )}
                                </div>

                                {/* Statut */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                                    {isEditing ? (
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setShowStatusList(!showStatusList)}
                                                className="flex items-center justify-between px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all w-full text-left bg-white"
                                            >
                                                <span className="text-gray-600">
                                                    {editedEmployee.status ? editedEmployee.status : "Sélectionner un statut"}
                                                </span>
                                                <i className={`ri-arrow-down-s-line transition-transform duration-200 ${showStatusList ? 'rotate-180' : ''}`}></i>
                                            </button>

                                            {showStatusList && (
                                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto p-1">
                                                    {[
                                                        { value: EmployeeStatus.Actif, label: "Actif" },
                                                        { value: EmployeeStatus.Inactif, label: "Inactif" },
                                                        { value: EmployeeStatus.Conge, label: "En congé" }
                                                    ].map((item) => (
                                                        <button
                                                            key={item.value}
                                                            type="button"
                                                            onClick={() => {
                                                                setEditedEmployee({
                                                                    ...editedEmployee,
                                                                    status: item.value as EmployeeStatus
                                                                });
                                                                setShowStatusList(false);
                                                            }}
                                                            className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors font-medium"
                                                        >
                                                            {item.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="bg-gray-50 px-3 py-2 rounded-lg">
                                            <span
                                                className={`inline-flex px-4 py-1 rounded-full text-[11px] font-bold ${getAdvancedStatusColor(
                                                    editedEmployee.status
                                                )}`}
                                            >
                                                {editedEmployee.status}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <i className="ri-time-line w-4 h-4"></i>
                                        Date d'embauche
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="date"
                                            value={editedEmployee.hireDate}
                                            onChange={(e) => setEditedEmployee({ ...editedEmployee, hireDate: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{formatDate(editedEmployee.hireDate)}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <i className="ri-building-line w-4 h-4"></i>
                                        Agence
                                    </label>
                                    {isEditing ? (
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setShowAgencyList(!showAgencyList)}
                                                className="flex items-center justify-between px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all w-full text-left"
                                            >
                                                <span className="text-gray-600">
                                                    {editedEmployee.agence ? editedEmployee.agence.name : "Sélectionner une agence"}
                                                </span>
                                                <i className="ri-arrow-down-s-line"></i>
                                            </button>

                                            {showAgencyList && (
                                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                                                    {agencies.map((a) => (
                                                        <button
                                                            key={a.id}
                                                            type="button"
                                                            onClick={() => {
                                                                setEditedEmployee({ ...editedEmployee, agence: a });
                                                                setShowAgencyList(false);
                                                            }}
                                                            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl"
                                                        >
                                                            {a.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                                            {editedEmployee.agence?.name || "Non renseignée"}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeProfile;