"use client";

import { useState, useEffect } from "react";
import { getUserProfile } from "@/api/dashboard/employee-and-user/users";
import { AppUser } from "@/types/users/user";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, Users, BarChart3, FileText } from "lucide-react";


interface SideNavigationProps {
    activeSection: string;
    setActiveSection: (section: string) => void;
    selectedOption: string;
    setSelectedOption: (option: string) => void;
}

export default function SideNavigation({
    activeSection,
    setActiveSection,
    selectedOption,
    setSelectedOption,
}: SideNavigationProps) {
    const [isGestionExpanded, setIsGestionExpanded] = useState(false);
    const [userProfile, setUserProfile] = useState<AppUser | null>(null);
    const router = useRouter();


    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const profile = await getUserProfile();
                setUserProfile(profile);
            } catch (error) {
                console.error("Erreur lors de la récupération du profil :", error);
            }
        };
        fetchUserProfile();
    }, []);

    const isUserOnly =
        userProfile?.appRoles.length === 1 &&
        userProfile.appRoles[0].roleName === "USER";

    const isSuperAdmin =
        userProfile?.appRoles.some(
            (role) => role.roleName === "SUPER ADMIN"
        );

    const handleSectionClick = (section: string) => {
        setActiveSection(section);
    };

    const handleGestionClick = () => {
        setIsGestionExpanded(!isGestionExpanded);
        setActiveSection("management");
    };

    const handleOptionSelect = (option: string) => {
        setSelectedOption(option);
        setActiveSection("management");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
    };


    return (
        <div className="w-64 h-screen fixed top-0
                left-0 bg-white shadow-lg border-r
                border-gray-200 flex flex-col justify-between z-20">
            <div>
                <div className="p-6 border-b border-gray-200"></div>
                <nav className="p-4 space-y-2 pt-7">
                    <button
                        onClick={() => handleSectionClick("dashboard")}
                        className={`w-full text-left
                            px-4 py-3 rounded-lg
                            transition-colors
                            whitespace-nowrap
                            cursor-pointer flex
                            items-center gap-3
                            ${activeSection === "dashboard"
                                ? "bg-green-50 text-green-700 border-l-4 border-green-700"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                    >
                        <div className="w-5 h-5 flex items-center justify-center">
                            <i className="ri-dashboard-line"></i>
                        </div>
                        Dashboard
                    </button>

                    <button
                        onClick={() => handleSectionClick("agence")}
                        className={`w-full text-left
                            px-4 py-3 rounded-lg
                            transition-colors
                            whitespace-nowrap 
                            cursor-pointer flex 
                            items-center gap-3 ${activeSection === "agence"
                                ? "bg-green-50 text-green-700 border-l-4 border-green-700"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                    >
                        <div className="w-5 h-5 flex items-center justify-center">
                            <i className="ri-file-text-line"></i>
                        </div>
                        Agence
                    </button>

                    <div className="space-y-2">
                        <button
                            onClick={handleGestionClick}
                            className={`w-full text-left
                                px-4 py-3 rounded-lg 
                                transition-colors whitespace-nowrap
                                cursor-pointer flex items-center
                                justify-between ${activeSection === "management"
                                    ? "bg-green-50 text-green-700 border-l-4 border-green-700"
                                    : "text-gray-700 hover:bg-gray-50"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 flex items-center justify-center">
                                    <i className="ri-settings-line"></i>
                                </div>
                                Gestion
                            </div>
                            <div className="w-5 h-5 flex items-center justify-center">
                                <i
                                    className={`ri-arrow-${isGestionExpanded ? "up" : "down"
                                        }-s-line transition-transform`}
                                ></i>
                            </div>
                        </button>

                        {isGestionExpanded && (
                            <div className="ml-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
                                {!isUserOnly && (
                                    <div className="flex flex-col gap-1">
                                        <button
                                            onClick={() => handleOptionSelect("campagne")}
                                            className={`w-full text-left
                                                px-4 py-2 rounded-lg
                                                text-sm transition-colors
                                                whitespace-nowrap cursor-pointer
                                                flex items-center gap-2 ${selectedOption === "campagne"
                                                    ? "bg-green-100 text-green-700"
                                                    : "text-gray-600 hover:bg-gray-50"
                                                }`}
                                        >
                                            <div className="w-4 h-4 flex items-center justify-center">
                                                <i className="ri-megaphone-line"></i>
                                            </div>
                                            Recrutement
                                        </button>
                                    </div>
                                )}

                                <button
                                    onClick={() => handleOptionSelect("employee")}
                                    className={`w-full text-left
                                        px-4 py-2 rounded-lg text-sm
                                        transition-colors whitespace-nowrap
                                        cursor-pointer flex items-center gap-2 ${selectedOption === "employee"
                                            ? "bg-green-100 text-green-700"
                                            : "text-gray-600 hover:bg-gray-50"
                                        }`}
                                >
                                    <div className="w-4 h-4 flex items-center justify-center">
                                        <Users className="w-4 h-4" />
                                    </div>
                                    Employé
                                </button>

                                <button
                                    onClick={() => handleOptionSelect("pay")}
                                    className={`w-full text-left
                                        px-4 py-2 rounded-lg text-sm
                                        transition-colors whitespace-nowrap
                                        cursor-pointer flex items-center gap-2 ${selectedOption === "pay"
                                            ? "bg-green-100 text-green-700"
                                            : "text-gray-600 hover:bg-gray-50"
                                        }`}
                                >
                                    <div className="w-4 h-4 flex items-center justify-center">
                                        <BarChart3 className="w-4 h-4" />
                                    </div>
                                    Pay
                                </button>
                                <button
                                    onClick={() => {
                                        handleOptionSelect("pay");
                                        window.open('/conge', '_blank');
                                    }}
                                    className="w-full text-left
        px-4 py-2 rounded-lg text-sm
        transition-colors whitespace-nowrap
        cursor-pointer flex items-center gap-2"
                                >
                                    <div className="w-4 h-4 flex items-center justify-center">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    Congé
                                </button>

                                <Link
                                    href="/department/department-list"
                                    target="_blank"
                                    onClick={() => handleOptionSelect("departement")}
                                    className="w-full text-left px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap cursor-pointer flex items-center gap-2 text-gray-600 hover:bg-gray-50"
                                >
                                    <div className="w-5 h-5 flex items-center justify-center">
                                        <Building2 className="w-4 h-5" />
                                    </div>
                                    Departement
                                </Link>

                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => handleSectionClick("profil")}
                        className={`w-full text-left
                            px-4 py-3 rounded-lg transition-colors
                            whitespace-nowrap cursor-pointer flex
                            items-center gap-3 ${activeSection === "profil"
                                ? "bg-green-50 text-green-700 border-l-4 border-green-700"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                    >
                        <div className="w-5 h-5 flex items-center justify-center">
                            <i className="ri-file-text-line"></i>
                        </div>
                        Profile
                    </button>
                </nav>
            </div >

            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 rounded-lg
                        transition-colors whitespace-nowrap cursor-pointer flex
                        items-center gap-3 text-red-700 hover:bg-red-50"
                >
                    <div className="w-5 h-5 flex items-center justify-center">
                        <i className="ri-logout-box-line"></i>
                    </div>
                    Déconnexion
                </button>
            </div>
        </div >
    );
}
