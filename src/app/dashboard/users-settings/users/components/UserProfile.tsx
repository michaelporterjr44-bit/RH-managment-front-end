import React, { useState, useEffect } from "react";
import { AppUser, AppRole } from "@/types/users/user";
import { Agence } from "@/types/recruitment/agency";
import { uploadImage, updateImage } from "@/api/dashboard/employee-and-user/image";
import { updateUser } from "@/api/dashboard/employee-and-user/users";

interface UserProfileProps {
    user: AppUser;
    agencies: Agence[];
    appRoles: AppRole[];
    onBack: () => void;
    onUpdate: (user: AppUser) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
    user,
    agencies,
    appRoles,
    onBack,
    onUpdate,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState<AppUser>(user);

    const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null);
    const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
    const [showAgencyList, setShowAgencyList] = useState(false);

    useEffect(() => {
        setEditedUser(user);
        setPreviewPhoto(null);
        setNewPhotoFile(null);
    }, [user]);

    const handleAgencySelect = (agence: Agence) => {
        setEditedUser({
            ...editedUser,
            agence: agence,
        });
        setShowAgencyList(false);
    };

    const handleSave = async () => {
        try{
            let imageProfil = editedUser.imageProfil;

            if (newPhotoFile) {
                const fileMatricule = editedUser.matricule;
                if (!fileMatricule) {
                    console.error("Impossible d'uploader l'image : aucun matricule d'Employee trouvé");
                    return;
                }

                const extension = newPhotoFile.name.split(".").pop();
                const newFileName = `${fileMatricule}.${extension}`;

                const renamedFile = new File([newPhotoFile], newFileName, {
                    type: newPhotoFile.type,
                });

                if (imageProfil?.id) {
                    imageProfil = await updateImage(imageProfil.id, renamedFile);
                } else {
                    imageProfil = await uploadImage(renamedFile);
                }
            }

            const updatedUser: AppUser = {
                ...editedUser,
                imageProfil: imageProfil ? { ...imageProfil } : null,
            };
            const response = await updateUser(editedUser.id, updatedUser);
            onUpdate(response);
            setIsEditing(false);
            setNewPhotoFile(null);
            setPreviewPhoto(null);
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
        }
    };

    
    const handleCancel = () => {
        setEditedUser(user);
        setIsEditing(false);
        setNewPhotoFile(null);
        setPreviewPhoto(null);
    };

    const isRoleSelected = (roleId: number) => {
        return editedUser.appRoles.some((r) => r.id === roleId);
    };

    const handleRoleChange = (role: AppRole, checked: boolean) => {
        if (checked) {
            setEditedUser({
                ...editedUser,
                appRoles: [...editedUser.appRoles, role],
            });
        } else {
            setEditedUser({
                ...editedUser,
                appRoles: editedUser.appRoles.filter((r) => r.id !== role.id),
            });
        }
    };

    const safeValue = (value: any, placeholder = "Non renseigné") =>
        value ? value : placeholder;

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex gap-4 items-center">
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-gray-100 rounded-lg transition group"
                        >
                            <i className="ri-arrow-left-line text-gray-600 group-hover:text-gray-900"></i>
                        </button>

                        <div className="flex flex-col">
                            <h1 className="flex gap-2 items-center text-xl">
                                <span className="font-medium uppercase text-gray-800">
                                    {user.lastName}
                                </span>
                                <span>{user.firstName}</span>
                            </h1>
                            <span className="text-sm text-gray-500">
                                {user.matricule}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                                >
                                    Annuler
                                </button>

                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-green-700 text-white hover:bg-green-800 rounded-lg transition flex items-center gap-2"
                                >
                                    <i className="ri-save-line"></i>
                                    Enregistrer
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-green-700 text-white hover:bg-green-800 rounded-lg transition flex items-center gap-2"
                            >
                                <i className="ri-edit-line"></i>
                                Modifier
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 bg-white rounded-xl border border-gray-200 py-6 px-8">
                {/* Left Column - Photo */}
                <div className="flex flex-col gap-6 pt-5">
                    <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 text-center">
                        <div className="relative inline-block">
                            {previewPhoto || editedUser.imageProfil?.url ? (
                                <img
                                    src={previewPhoto || editedUser.imageProfil?.url}
                                    className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full mx-auto border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center">
                                    <i className="ri-user-line text-4xl text-gray-400"></i>
                                </div>
                            )}
                        </div>
                        <h3 className="mt-4 text-xl font-bold">
                            {editedUser.lastName} {editedUser.firstName}
                        </h3>
                        <p className="text-gray-600">{editedUser.matricule}</p>
                    </div>
                </div>

                {/* Right Column - Infos */}
                <div className="lg:col-span-2 flex flex-col gap-6 pt-5">
                    {/* Personal Info */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <i className="ri-user-line text-green-600"></i> Informations
                            personnelles
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    Prénom
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editedUser.lastName}
                                        onChange={(e) =>
                                            setEditedUser({ ...editedUser, lastName: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                ) : (
                                    <p>{safeValue(editedUser.lastName)}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    Nom
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editedUser.firstName}
                                        onChange={(e) =>
                                            setEditedUser({
                                                ...editedUser,
                                                firstName: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                ) : (
                                    <p>{safeValue(editedUser.firstName)}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    Email
                                </label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={editedUser.email}
                                        onChange={(e) =>
                                            setEditedUser({ ...editedUser, email: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                ) : (
                                    <p>{safeValue(editedUser.email)}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Professional Info */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <i className="ri-briefcase-line text-green-600"></i> Informations
                            professionnelles
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    Matricule
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editedUser.matricule}
                                        onChange={(e) =>
                                            setEditedUser({
                                                ...editedUser,
                                                matricule: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                ) : (
                                    <p>{safeValue(editedUser.matricule)}</p>
                                )}
                            </div>
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                                {editedUser.agence
                                                    ? editedUser.agence.name
                                                    : "Sélectionner une agence"}
                                            </span>
                                            <i className="ri-arrow-down-s-line"></i>
                                        </button>

                                        {showAgencyList && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                                                {agencies.map((a) => (
                                                    <button
                                                        key={a.id}
                                                        type="button"
                                                        onClick={() => handleAgencySelect(a)}
                                                        className={`w-full px-4 py-3 text-left transition-colors ${editedUser.agence?.id === a.id
                                                            ? "bg-green-50 text-green-700"
                                                            : "hover:bg-gray-50"
                                                            } first:rounded-t-xl last:rounded-b-xl`}
                                                    >
                                                        {a.name}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p>{safeValue(editedUser.agence?.name)}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Rôles
                                </label>

                                {isEditing ? (
                                    <div className="space-y-3">
                                        {appRoles.map((role) => {
                                            const selected = isRoleSelected(role.id);

                                            return (
                                                <label
                                                    key={role.id}
                                                    className={`flex items-start space-x-3 p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 ${selected
                                                        ? "border-green-500 bg-green-50"
                                                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selected}
                                                        onChange={(e) =>
                                                            handleRoleChange(role, e.target.checked)
                                                        }
                                                        className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                                    />

                                                    <div className="flex-1">
                                                        <p
                                                            className={`text-sm font-medium ${selected ? "text-green-900" : "text-gray-900"
                                                                }`}
                                                        >
                                                            {role.roleName}
                                                        </p>
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {editedUser.appRoles.map((r) => (
                                            <span
                                                key={r.id}
                                                className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                                            >
                                                {r.roleName}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
