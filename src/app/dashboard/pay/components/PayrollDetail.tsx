import React, { useState, useEffect } from "react";
import StepperComponent from "./StepperComponent";
import EmployeeList from "./EmployeeList";
import EmployeeDetail from "./EmployeeDetail";
import { updateEtatCampaignPay } from "@/api/dashboard/pay/payroll";
import { ModelPay, StatuCampagnePaye, EtatCampagnePaye, StatusModelPaye } from "@/types/pay/pay";
import { getEmployeesByPayroll, generatePayslipsForAllEmployees, validateAllEmployeesInCampaign, patchCampaignStatus } from "@/api/dashboard/pay/payroll";
import { PayrollPeriod } from "@/types/pay/pay";
import { exportPayrollExcel } from "@/api/dashboard/pay/payroll";
import { useRef } from "react";
import DownloadAllPayslipButton from "./fiche-de-pay/LoadAllFilesButton";

interface PayrollDetailProps {
    period: PayrollPeriod;
    onBack: () => void;
}

const etatToStep = (etat: EtatCampagnePaye): number => {
    switch (etat) {
        case EtatCampagnePaye.VERIFICATION:
            return 1;
        case EtatCampagnePaye.VALIDATION:
            return 2;
        case EtatCampagnePaye.GENERATION:
            return 3;
        default:
            return 1;
    }
};

const PayrollDetail: React.FC<PayrollDetailProps> = ({ period, onBack }) => {
    const [selectedEmployee, setSelectedEmployee] = useState<ModelPay | null>(null);
    const [employees, setEmployees] = useState<ModelPay[]>([]);
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState("");
    const [selectedPeriod, setSelectedPeriod] = useState<PayrollPeriod | null>(null);
    const [currentStep, setCurrentStep] = useState(() => etatToStep(period.sonEtat));
    const allEmployeesValidated = () => {
        return employees.every(emp => emp.status === StatusModelPaye.VALIDE);
    };
    const [searchLoading, setSearchLoading] = useState(false);
    const firstLoad = useRef(true);

    const fetchEmployees = async (initial = false) => {
        if (initial) {
            setLoading(true);
        } else {
            setSearchLoading(true);
        }

        try {

            const data = await getEmployeesByPayroll(
                period.id,
                page,
                size,
                searchTerm
            );
            console.log("BACKEND RESPONSE =", data);

            setEmployees(data.content);
            setTotalPages(data.totalPages);
            setEmployees(data.content);
            setTotalPages(data.totalPages);
            setTotalEmployees(data.totalElements);

        } finally {

            if (initial) {
                setLoading(false);
            } else {
                setSearchLoading(false);
            }

        }
    };

    useEffect(() => {
        fetchEmployees(true);
    }, []);

    useEffect(() => {
        if (firstLoad.current) {
            firstLoad.current = false;
            return;
        }

        fetchEmployees(false);
    }, [page, size, searchTerm]);

    useEffect(() => {
        setSelectedPeriod({ ...period });
    }, [period]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSearchTerm(keyword);
            setPage(0);
        }, 100);

        return () => clearTimeout(timeout);
    }, [keyword]);

    const handleExportExcel = async () => {
        try {
            const blob = await exportPayrollExcel(period.id);

            const url = window.URL.createObjectURL(new Blob([blob]));

            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "model_paie.xlsx");

            document.body.appendChild(link);
            link.click();
            link.remove();

        } catch (error) {
            console.error("Erreur téléchargement Excel :", error);
        }
    };

    const handleNextStep = async () => {
        if (!canProceedToNextStep() || currentStep >= 3) return;

        let newStep = currentStep + 1;
        let newEtat: EtatCampagnePaye;

        switch (newStep) {
            case 2:
                newEtat = EtatCampagnePaye.VALIDATION;
                break;
            case 3:
                if (!allEmployeesValidated()) {
                    alert("Tous les employés doivent être validés avant de générer les fiches de paie.");
                    return;
                }
                newEtat = EtatCampagnePaye.GENERATION;
                break;
            default:
                newEtat = EtatCampagnePaye.VERIFICATION;
        }

        try {
            const updatedCampaign = await updateEtatCampaignPay(period.id, newEtat);

            if (newEtat === EtatCampagnePaye.VALIDATION) {
                const res = await validateAllEmployeesInCampaign(period.id);
                console.log("VALIDATION RESPONSE =", res);
                await fetchEmployees();
            }

            if (newEtat === EtatCampagnePaye.GENERATION) {
                await patchCampaignStatus(period.id, StatuCampagnePaye.VALIDE);
            }

            setCurrentStep(newStep);

            setSelectedPeriod(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    sonEtat: updatedCampaign.etat,
                    status: newEtat === EtatCampagnePaye.GENERATION ? StatuCampagnePaye.VALIDE : prev.status
                };
            });

        } catch (err) {
            console.error("Erreur lors de la mise à jour de l'état de la campagne :", err);
        }
    };

    const getStatusBadge = (status: string) => {
        if (status === StatuCampagnePaye.VALIDE) {
            return (
                <span className="flex justify-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <i className="ri-check-line w-3 h-3 mr-1"></i>
                    <p>Validé</p>
                </span>
            );
        } else {
            return (
                <div className="flex justify-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <i className="ri-time-line w-3 h-3 mr-1"></i>
                    <p>En cours</p>
                </div>
            );
        }
    };

    const getEtat = (status: string) => {
        if (status === EtatCampagnePaye.VERIFICATION) {
            return (
                <span className="flex justify-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <i className="ri-check-line w-3 h-3 mr-1"></i>
                    <p>Vérification</p>
                </span>
            );
        } else if (status === EtatCampagnePaye.VALIDATION) {
            return (
                <div className="flex justify-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <i className="ri-time-line w-3 h-3 mr-1"></i>
                    <p>Validation</p>
                </div>
            );
        } else {
            return (
                <div className="flex justify-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <i className="ri-time-line w-3 h-3 mr-1"></i>
                    <p>Génération</p>
                </div>
            );
        }
    };

    const canProceedToNextStep = () => {
        if (currentStep === 1) return true;
        if (currentStep === 2) return true;
        return false;
    };

    const hasSearch = searchTerm.trim().length > 0;


    const handleEmployeeUpdate = (updatedEmployee: ModelPay, openDetail: boolean = false) => {
        setEmployees(prev => prev.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp));
        if (openDetail) setSelectedEmployee(updatedEmployee);
    };

    if (selectedEmployee) {
        return (
            <EmployeeDetail
                employee={selectedEmployee}
                onBack={() => setSelectedEmployee(null)}
                onUpdate={handleEmployeeUpdate}
            />
        );
    }

    const getMonthName = (monthNumber: string) => {
        const months = [
            "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
            "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
        ];
        const index = parseInt(monthNumber, 10) - 1;
        return months[index] || monthNumber;
    };

    console.log({
        keyword,
        searchTerm,
        employeesLength: employees.length,
        hasSearch,
        loading,
        searchLoading,
    });

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-6 py-2 flex items-center justify-between">
                    <div className="flex justify-center items-center gap-4">
                        <button
                            onClick={onBack}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                        >
                            <i className="ri-arrow-left-line w-4 h-4 mr-2"></i>
                            Retour
                        </button>
                        <div className="flex flex-col justify-start gap-2">
                            <h1 className="text-xl font-bold text-gray-900">
                                Paie {getMonthName(period.month)} {period.year}
                            </h1>
                            <div className="flex items-center space-x-6 text-sm text-gray-600">
                                <div className="flex items-center">
                                    <i className="ri-team-line w-4 h-4 mr-1"></i>
                                    {employees.length} employés
                                </div>
                                <div className="flex items-center">
                                    <i className="ri-calendar-line w-4 h-4 mr-1"></i>
                                    Généré le {new Date(period.dateGeneration).toLocaleDateString("fr-FR")}
                                </div>
                                <div className="flex items-center">
                                    <i className="ri-user-3-line w-4 h-4 mr-1"></i>
                                    {period.generatedBy}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-start">
                        <div className="flex items-center w-full justify-center">
                            <span
                                className="px-2"
                            >
                                {getStatusBadge(period.status)}
                            </span>

                            <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium`}
                            >
                                {getEtat(period.sonEtat)}
                            </span>
                        </div>

                        <div className="text-center">
                            <div className="text-center flex gap-3">
                                <button
                                    onClick={handleExportExcel}
                                    disabled={currentStep < 3}
                                    className={`mt-2 ml-2 px-4 py-2 text-white rounded-md transition-colors duration-200
    ${currentStep < 3
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-blue-600 hover:bg-blue-700"}`}
                                >
                                    <i className="ri-file-excel-2-line mr-2"></i>
                                    Exporter Excel
                                </button>
                                {currentStep >= 3 && (
                                    <DownloadAllPayslipButton campagneId={period.id} />
                                )}
                                <button
                                    onClick={handleNextStep}
                                    disabled={!canProceedToNextStep()}
                                    className={`mt-2 px-4 py-2 text-white rounded-md transition-colors duration-200
        ${!canProceedToNextStep()
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-green-700 hover:bg-green-800"}`}
                                >
                                    {currentStep === 1 ? "Passer à la Validation" :
                                        currentStep === 2 ? "Générer les fiches de paie" :
                                            "Processus terminé"}
                                    {currentStep < 3 && <i className="ri-arrow-right-s-line w-4 h-4 ml-2"></i>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <StepperComponent currentStep={currentStep} />


            <EmployeeList
                employees={employees}
                searchTerm={keyword}
                onSearchChange={setKeyword}
                page={page}
                totalPages={totalPages}
                size={size}
                onPageChange={setPage}
                onSizeChange={(newSize) => {
                    setSize(newSize);
                    setPage(0);
                }}
                onSelectEmployee={setSelectedEmployee}
                onUpdateEmployee={handleEmployeeUpdate}
                searchLoading={searchLoading}
            />

        </div>
    );
};

export default PayrollDetail;
