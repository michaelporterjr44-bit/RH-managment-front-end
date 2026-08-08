import React, { useState, useEffect } from "react";
import { Employee } from "@/types/employee/employee";
import { Postulant } from "@/types/recruitment/applicant";
import { addEmployee } from "@/api/dashboard/employee-and-user/employees";
import axiosInstance from "@/api/axiosInstance";
import { validatePostulant } from "@/api/dashboard/recruitment/applicant";
import { getAllHiredPostulants } from "@/api/dashboard/recruitment/applicant";
import { ImageProfil } from "@/types/users/imageProfil";
import Toast from "../../../../components/ui/Toast";
import { getAgencies } from "@/api/dashboard/agency/agency";
import { getAllDepartments } from "@/api/dashboard/department/department";
import { CreateEmployeeDTO } from "@/types/employee/employee";
import HiredApplicantsList from "./HiredApplicantsList";
import ImportEmployeeModal from "@/app/dashboard/components/ImportEmployeeModal";
import { ContractType, EmployeeStatus, MaritalStatus } from "@/types/employee/employee.enums";
import {
    Gender
} from "@/types/employee/employee.enums";

interface AddEmployeeProps {
    onAddEmployee: (employee: Employee) => void;
}

const AddEmployee: React.FC<AddEmployeeProps> = ({ onAddEmployee }) => {
    const [agencies, setAgencies] = useState<any[]>([]);
    const [showAgencyList, setShowAgencyList] = useState(false);
    const [selectedPostulant, setSelectedPostulant] = useState<Postulant | null>(null);
    const [postulants, setPostulants] = useState<Postulant[]>([]);
    const [message, setMessage] = useState<string>("");
    const [showAlert, setShowAlert] = useState(false);
    const [success, setSuccess] = useState<boolean | null>(null);
    const [availableRoles, setAvailableRoles] = useState<{ id: string; roleName: string }[]>([]);
    const [roles, setRoles] = useState<{ id: string; roleName: string }[]>([]);
    const [showRoleList, setShowRoleList] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [departments, setDepartments] = useState<any[]>([]);
    const [showDepartmentList, setShowDepartmentList] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: Gender.Homme,
        address: "",
        cin: "",
        cinDate: "",
        cinLocation: "",
        function: "",
        contractType: ContractType.Cdd,
        maritalStatus: MaritalStatus.Celibataire,
        degree: "",
        educationLevel: "",
        experience: "",
        hireDate: "",
        email: "",
        phoneNumber: "",
        numberOfChildren: "0",

        agenceId: undefined as number | undefined,
        departmentId: undefined as number | undefined,

        matricule: "",
    });

    const [showContractTypeList, setShowContractTypeList] = useState(false);
    const [showGenderList, setShowGenderList] = useState(false);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const res = await getAllDepartments();
                setDepartments(res);
            } catch (error) {
                console.error("Erreur chargement departments", error);
            }
        };

        fetchDepartments();
    }, []);

    useEffect(() => {
        const fetchAgencies = async () => {
            try {
                const res = await getAgencies();
                setAgencies(res);
            } catch (error) {
                console.error("Erreur chargement agences", error);
            }
        };

        fetchAgencies();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllHiredPostulants(0, 10);
                setPostulants(data.content);
            } catch (error) {
                console.error("Erreur de récupération des postulants embauchés :", error);
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

    const handlePostulantSelect = (postulant: Postulant) => {
        setSelectedPostulant(postulant);
        setFormData({
            ...formData,
            lastName: postulant.nom,
            firstName: postulant.prenom,
            email: postulant.email || "",
            phoneNumber: postulant.tel || "",
        });
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const uploadImage = async (file: File): Promise<ImageProfil> => {
        const formDataImage = new FormData();
        formDataImage.append("file", file);

        const res = await axiosInstance.post("/api/image-profile", formDataImage);

        return res.data;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const employee: CreateEmployeeDTO = {
            firstName: formData.firstName!,
            lastName: formData.lastName!,
            dateOfBirth: formData.dateOfBirth!,
            address: formData.address!,
            phoneNumber: formData.phoneNumber || "",

            matricule: formData.matricule!,
            email: formData.email || "",

            departmentId: formData.departmentId!,
            agenceId: formData.agenceId!,

            hireDate: formData.hireDate!,
            function: formData.function || "",
            contractType: formData.contractType || "",

            cin: formData.cin || "",
            cinDate: formData.cinDate || "",
            cinLocation: formData.cinLocation || "",

            maritalStatus: formData.maritalStatus,
            gender: formData.gender || "",
            numberOfChildren: formData.numberOfChildren || "0",

            educationLevel: formData.educationLevel || "",
            degree: formData.degree || "",
            experience: formData.experience || "",
        };

        try {
            const savedEmployee = await addEmployee(employee);
            onAddEmployee(savedEmployee);
            if (selectedPostulant) {
                await validatePostulant(selectedPostulant.id);
                setMessage("Employee added and postulant validated!");
                setSuccess(true);
            } else {
                setMessage("Employee added successfully!");
                setSuccess(true);
            }
        } catch (error) {
            console.error("Erreur lors de l’ajout de l’employé :", error);
            setMessage("Failed to add employee.");
            setSuccess(false);
        }
        console.log("EMPLOYEE SENT:", employee);

        setSelectedPostulant(null);
    };

    const addRole = (role: { id: string; roleName: string }) => {
        if (!roles.find(r => r.id === role.id)) {
            setRoles(prev => [...prev, role]);
        }
        setShowRoleList(false);
    };

    const isFormValid = () => {
        return (
            formData.cin &&
            formData.function &&
            formData.dateOfBirth &&
            formData.address &&
            formData.departmentId &&
            formData.agenceId &&
            formData.hireDate
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex row gap-8">
                {/* Employee Form */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-fit p-3 w-[70%]">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <i className="ri-file-text-line h-5 w-5 mr-2 text-green-600"></i>
                            Employee Details
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Completer les informations du nouveau l'employé
                        </p>
                    </div>

                    {/* Formulaire existant */}
                    <form onSubmit={handleSubmit} className="p-4 space-y-4">
                        {/* ... le même contenu du formulaire que tu avais ... */}
                        <div className="space-y-3">
                            <h4 className="font-medium text-gray-900 border-b border-gray-200 pb-1 text-sm">
                                Personal Information
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName || ''}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        readOnly={!!selectedPostulant}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName || ''}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        readOnly={!!selectedPostulant}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Date of Birth *
                                    </label>
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth || ''}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Gender
                                    </label>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setShowGenderList(!showGenderList)}
                                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg hover:border-blue-500 transition flex justify-between items-center bg-white text-left"
                                        >
                                            <span>
                                                {formData.gender === Gender.Homme ? "Male" : "Female"}
                                            </span>
                                            <i className="ri-arrow-down-s-line"></i>
                                        </button>

                                        {showGenderList && (
                                            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                                {Object.values(Gender).map((g) => (
                                                    <button
                                                        key={g}
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                gender: g,
                                                            }));
                                                            setShowGenderList(false);
                                                        }}
                                                        className="w-full px-3 py-2 text-left hover:bg-gray-50 text-sm"
                                                    >
                                                        {g === Gender.Homme ? "Male" : "Female"}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Address *
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address || ''}
                                    onChange={handleInputChange}
                                    required
                                    rows={2}
                                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Identity Information */}
                        <div className="space-y-3">
                            <h4 className="font-medium text-gray-900 border-b border-gray-200 pb-1 text-sm">
                                Identity Information
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        CIN Number *
                                    </label>
                                    <input
                                        type="text"
                                        name="cin"
                                        value={formData.cin || ''}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        CIN Date
                                    </label>
                                    <input
                                        type="date"
                                        name="cinDate"
                                        value={formData.cinDate || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        CIN Location
                                    </label>
                                    <input
                                        type="text"
                                        name="cinLocation"
                                        value={formData.cinLocation || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-2">
                                        <i className="ri-building-line w-4 h-4"></i>
                                        Agence *
                                    </label>

                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setShowAgencyList(!showAgencyList)}
                                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg hover:border-blue-500 transition flex justify-between items-center"
                                        >
                                            <span>
                                                {Array.isArray(agencies) && formData.agenceId
                                                    ? agencies.find(a => a.id === formData.agenceId)?.name
                                                    : "Sélectionner une agence"}
                                            </span>
                                            <i className="ri-arrow-down-s-line"></i>
                                        </button>

                                        {showAgencyList && (
                                            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                                {agencies.map((a) => (
                                                    <button
                                                        key={a.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                agenceId: a.id,
                                                            }));
                                                            setShowAgencyList(false);
                                                        }}
                                                        className="w-full px-3 py-2 text-left hover:bg-gray-50 text-sm"
                                                    >
                                                        {a.name || "Sélectionner une agence"}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Nombre d'enfant
                                    </label>
                                    <input
                                        type="number"
                                        name="numberOfChildren"
                                        value={formData.numberOfChildren || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Professional Information */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900 border-b border-gray-200 pb-2 text-sm">
                                Professional Information
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Matricule *</label>
                                    <input
                                        type="text"
                                        name="matricule"
                                        value={formData.matricule || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Function *</label>
                                    <input
                                        type="text"
                                        name="function"
                                        value={formData.function || ''}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-2">
                                        <i className="ri-building-2-line w-4 h-4"></i>
                                        Department *
                                    </label>

                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setShowDepartmentList(!showDepartmentList)}
                                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg hover:border-blue-500 transition flex justify-between items-center"
                                        >
                                            <span >
                                                {departments.find(d => d.id === formData.departmentId)?.libelle || "Sélectionner un département"}
                                            </span>
                                            <i className="ri-arrow-down-s-line"></i>
                                        </button>

                                        {showDepartmentList && (
                                            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                                {departments.map((d) => (
                                                    <button
                                                        key={d.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                departmentId: d.id,
                                                            }));
                                                            setShowDepartmentList(false);
                                                        }}
                                                        className="w-full px-3 py-2 text-left hover:bg-gray-50 text-sm"
                                                    >
                                                        {d.libelle || "Sélectionner un département"}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Hire Date *</label>
                                    <input
                                        type="date"
                                        name="hireDate"
                                        value={formData.hireDate || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Custom Dropdown for Contract Type */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-2">
                                        <i className="ri-file-shield-2-line w-4 h-4"></i>
                                        Contract Type *
                                    </label>

                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setShowContractTypeList(!showContractTypeList)}
                                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg hover:border-blue-500 transition flex justify-between items-center bg-white text-left"
                                        >
                                            <span className="uppercase">
                                                {formData.contractType || "Sélectionner un contrat"}
                                            </span>
                                            <i className="ri-arrow-down-s-line"></i>
                                        </button>

                                        {showContractTypeList && (
                                            <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                                {Object.values(ContractType).map((type) => (
                                                    <button
                                                        key={type}
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                contractType: type,
                                                            }));
                                                            setShowContractTypeList(false);
                                                        }}
                                                        className="w-full px-3 py-2 text-left hover:bg-gray-50 text-sm uppercase"
                                                    >
                                                        {type}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 mb-4">
                                {previewImage && (
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        className="mt-2 w-32 h-32 rounded-full object-cover border-2 border-gray-200"
                                    />
                                )}
                            </div>


                            {availableRoles.length > 0 && (
                                <div className="mt-3">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Roles</label>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowRoleList(!showRoleList)}
                                            className="flex items-center gap-1 px-3 py-1 text-sm border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
                                        >
                                            <i className="ri-add-line text-xs"></i>
                                            <span>Ajouter un rôle</span>
                                        </button>
                                    </div>

                                    {showRoleList && (
                                        <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                            {availableRoles.map((role) => (
                                                <button
                                                    key={role.id}
                                                    type="button"
                                                    onClick={() => addRole(role)}
                                                    className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 transition-colors first:rounded-t-lg last:rounded-b-lg"
                                                >
                                                    <i className="ri-shield-user-line text-sm"></i>
                                                    <span className="text-sm text-gray-700">{role.roleName}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-3">
                            <h4 className="font-medium text-gray-900 border-b border-gray-200 pb-1 text-sm">
                                Contact Information
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        readOnly={!!selectedPostulant}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Submit Button */}
                        <div className="flex justify-end pt-4 border-gray-200">
                            <button
                                type="submit"
                                disabled={!isFormValid()}
                                className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg font-medium transition-colors ${isFormValid()
                                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                            >
                                <i className="ri-add-line h-3 w-3"></i>
                                Add Employee
                            </button>
                        </div>
                    </form>
                </div>

                <div className="flex flex-col w-[40%] gap-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-fit">
                        <HiredApplicantsList
                            selectedPostulant={selectedPostulant}
                            onSelect={handlePostulantSelect}
                        />
                    </div>
                    <div className="w-full">
                        <ImportEmployeeModal />
                    </div>
                </div>
            </div>
            <Toast message={message} success={success ?? false} show={showAlert} />
        </div>
    );
};

export default AddEmployee;
