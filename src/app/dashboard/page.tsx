"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SideNavigation from "./components/sideNavigation";
import DashboardHeader from "./components/DashboardHeader";
import RecrutemenPage from "./recruitment/RecrutePage";
import EmployeePage from "./employee/employeePage";
import UserPageTabs from "./users-settings/users/UserPage";
import PayPage from "./pay/PayPage";
import AgencyManagement from "./agence/AgencyPage";
import useAuthWatcher from "../hooks/useAuthWatcher";
import HistoryList from "./historique/HistoryList";
import DashboardShell from "../../dash/dashboard-shell";

export default function Dashboard() {
    const [activeSection, setActiveSection] = useState("dashboard");
    const [selectedOption, setSelectedOption] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    const handleSettingsClick = () => {
        setActiveSection("management");
        setSelectedOption("settings_users");
        setSelectedOption("settings");
    };

    const handleOpenCanaux = () => {
        setActiveSection("management");
        setSelectedOption("canaux-niveaux");
        setSelectedOption("historique");
    };

    const handleOpenAffectation = () => {
        setActiveSection("management");
        setSelectedOption("affectation");
        setSelectedOption("historique");
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            router.push("/login");
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    useAuthWatcher();

    if (!isAuthenticated) return null;

    const renderContent = () => {
        if (activeSection === "dashboard") return <DashboardShell />;

        if (activeSection === "agence") {
            return <AgencyManagement />;
        }

        if (activeSection === "management") {
            switch (selectedOption) {
                case "campagne":
                    return <RecrutemenPage />;
                case "employee":
                    return <EmployeePage />;
                case "pay":
                    return <PayPage />;
                case "settings":
                    return <UserPageTabs />;
                case "historique":
                    return <HistoryList />;
            }
        }

        return null;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardHeader
                onSettingsClick={handleSettingsClick}
                onOpenCanaux={handleOpenCanaux}
                onOpenAffectation={handleOpenAffectation}
            />

            <div className="min-h-screen bg-gray-50 flex">
                <SideNavigation
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                />

                <div className="ml-68 pt-4 w-full">
                    <div className="p-8 mx-auto">
                        <header className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900"></h1>
                            <p className="text-gray-600 mt-2"></p>
                        </header>

                        <main>{renderContent()}</main>
                    </div>
                </div>
            </div>
        </div>
    );
}
