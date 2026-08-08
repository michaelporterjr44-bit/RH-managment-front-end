import { AppUser } from "@/types/users/user";
import { getUserProfile } from "@/api/dashboard/employee-and-user/users";
import SettingsDropdown from "./SettingsDropdown";
import { useEffect, useState } from "react";
import logo from "../../../../public/logoMobileNIM.png";

interface DashboardHeaderProps {
    onSettingsClick: () => void;
    onOpenCanaux: () => void;
    onOpenAffectation: () => void;
}

export default function DashboardHeader({ onSettingsClick, onOpenCanaux, onOpenAffectation }: DashboardHeaderProps) {
    const [user, setUser] = useState<AppUser | null>(null);

    const getStatusColor = (status: string) =>
        status === "Agence Ambatolampy"
            ? "text-green-600 bg-green-50 py-2 px-4"
            : "text-red-800 bg-red-50 py-2 px-4";

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getUserProfile();
                setUser(data);
            } catch (error) {
                console.error("Erreur lors de la récupération du profil utilisateur", error);
            }
        };

        fetchProfile();
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 z-30 bg-white shadow-sm border-b border-gray-200 h-16">
            <div className="w-full px-[1vw] h-full">
                <div className="flex justify-between items-center h-full">
                    <div className="flex items-center space-x-4 ml-7 gap-5">
                        <img
                            src={logo.src}
                            alt="NIM Madagascar Logo"
                            className="h-10 w-auto"
                        />
                        <span
                            className={`inline-flex items-center
                                px-2.5 py-0.5 rounded-full text-xs
                                font-medium 
                                ${user ?
                                    getStatusColor(user.agence.name) : ""
                                }`}
                        >
                            {user?.agence?.name ?? "Aucune agence"}
                        </span>
                    </div>

                    <div className="flex items-center space-x-4 mr-7">
                        <div className="flex items-center justify-center space-x-3 gap-2">
                            <div className="flex justify-center items-center h-10 w-10">
                                {user?.imageProfil ? (
                                    <img
                                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
                                        src={user.imageProfil.url}
                                        alt={`${user.firstName} ${user.lastName}`}
                                    />
                                ) : (
                                    <div className="h-9 w-9 rounded-full bg-gray-300 flex items-center justify-center">
                                        <i className="ri-user-line text-lg text-gray-600"></i>
                                    </div>
                                )}
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-sm font-medium text-gray-900 uppercase">
                                    {user?.appRoles[0]?.roleName}
                                </p>
                                <p className="text-xs text-gray-500">{user?.email}</p>
                            </div>
                        </div>
                        <SettingsDropdown
                            userRole={user?.appRoles?.[0]?.roleName}
                            onSettingsClick={onSettingsClick}
                            onOpenCanaux={onOpenCanaux}
                            onOpenAffectation={onOpenAffectation}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
