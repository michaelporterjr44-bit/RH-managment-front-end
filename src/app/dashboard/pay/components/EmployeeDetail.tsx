import React, { useState, useEffect, useRef } from 'react';
import { ModelPay, StatusModelPaye } from '@/types/pay/pay';
import { generatePayslipForEmployee, resetModelPay, getEmployeeByMatricule } from '@/api/dashboard/pay/payroll';
import { useReactToPrint } from "react-to-print";
import Payslip from './fiche-de-pay/Payslip';

interface EmployeeDetailProps {
    employee: ModelPay;
    onBack: () => void;
    onUpdate: (updatedEmployee: ModelPay, openDetail?: boolean) => void;
}

const EmployeeDetail: React.FC<EmployeeDetailProps> = ({ employee, onBack, onUpdate }) => {
    const [calculatingField, setCalculatingField] = useState<string | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const payslipRef = useRef(null);
    const handlePrint = useReactToPrint({
        contentRef: payslipRef,
        documentTitle: `Fiche-${employee.employee.matricule}`,
    });

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'MGA', minimumFractionDigits: 0 }).format(amount);

    const allEmployeesValidated = () => {
        return (employee?.status == StatusModelPaye.VALIDE);
    };


    const SkeletonLoader = () => (
        <div className="animate-pulse flex items-center">
            <div className="h-4 bg-gray-300 rounded w-20"></div>
            <i className="ri-loader-4-line w-4 h-4 ml-2 animate-spin text-green-600"></i>
        </div>
    );

    const SalaryField = ({ label, field, value }: { label: string; field: string; value: number }) => (
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-sm text-gray-600">{label}</span>
            <div className="font-medium text-gray-900">
                {calculatingField === field ? <SkeletonLoader /> : <span className={value > 0 ? 'text-gray-900' : 'text-gray-400'}>{value > 0 ? formatCurrency(value) : '0 MGA'}</span>}
            </div>
        </div>
    );

    const handleSimulateLoad = async () => {
        const fields = ['bruteSalaire', 'cnaps', 'osie', 'baseImposable', 'irsa', 'salaireNet', 'avance', 'netAPayer'];
        for (const f of fields) {
            setCalculatingField(f);
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        setCalculatingField(null);
    };

    useEffect(() => {
        handleSimulateLoad();
    }, []);

    const handleRecalculate = async () => {
        try {
            setIsCalculating(true);

            // 🚀 Recalculer la fiche via l'endpoint existant
            await generatePayslipForEmployee(employee.employee.matricule, employee.campagnePay.id);

            // 🔹 Récupérer les données à jour
            const employeeData = await getEmployeeByMatricule(employee.employee.matricule, employee.campagnePay.id);
            if (!employeeData) throw new Error("Impossible de récupérer les données mises à jour");

            // 🔹 Champs à recalculer avec petit loader
            const fields: (keyof ModelPay)[] = [
                "bruteSalaire",
                "cnaps",
                "osie",
                "baseImposable",
                "irsa",
                "salaireNet",
                "prime",
                "indemnite",
                "avance",
                "netAPayer"
            ];

            const tempEmployee = { ...employee };

            // 🔹 Boucle pour animation champ par champ
            for (const f of fields) {
                setCalculatingField(f); // active le skeleton loader sur ce champ
                (tempEmployee as any)[f] = (employeeData as any)[f];
                onUpdate({ ...tempEmployee }, true); // met à jour le front
                await new Promise(resolve => setTimeout(resolve, 200)); // petit délai pour voir l'animation
            }

            setCalculatingField(null); // fin du loader
        } catch (error) {
            console.error("Erreur lors du recalcul :", error);
            alert("Erreur lors du recalcul !");
        } finally {
            setIsCalculating(false);
        }
    };

    const handleCalculate = async () => {
        try {
            setIsCalculating(true);
            setCalculatingField("bruteSalaire");
            await generatePayslipForEmployee(employee.employee.matricule, employee.campagnePay.id);

            const updatedEmployee = await getEmployeeByMatricule(employee.employee.matricule, employee.campagnePay.id);
            if (!updatedEmployee) throw new Error("Impossible de récupérer les données mises à jour");

            const fields: (keyof ModelPay)[] = [
                "bruteSalaire", "cnaps", "osie", "baseImposable", "irsa", "salaireNet", "avance", "netAPayer"
            ];

            const tempEmployee = { ...employee };
            for (const f of fields) {
                setCalculatingField(f);
                (tempEmployee as any)[f] = (updatedEmployee as any)[f];
                onUpdate({ ...tempEmployee }, true);
                await new Promise(resolve => setTimeout(resolve, 300));
            }

            setCalculatingField(null);

        } catch (error) {
            console.error("Erreur lors du calcul :", error);
            alert("Erreur lors du calcul !");
        } finally {
            setIsCalculating(false);
        }
    };

    const getStatusBadge = (status: string) => {
        if (status === StatusModelPaye.VALIDE) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <i className="ri-check-line w-3 h-3 mr-1"></i> Validé
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <i className="ri-time-line w-3 h-3 mr-1"></i> En cours
                </span>
            );
        }
    };

    return (
        <div className="space-y-6">
            {/* En-tête */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={onBack}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                            >
                                <i className="ri-arrow-left-line w-4 h-4 mr-2"></i>
                                Retour
                            </button>
                            <h1 className="text-xl font-semibold text-gray-900">
                                Détail de paie - {employee.employee.firstName} {employee.employee.lastName}
                            </h1>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span>
                                {getStatusBadge(employee.status)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Informations personnelles */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Informations personnelles</h2>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center space-x-4 mb-6">
                            <img
                                className="h-16 w-16 rounded-full object-cover"
                                src={employee.employee.imageProfil?.url ||
                                    `https://ui-avatars.com/api/?name=${employee.employee.firstName}+${employee.employee.lastName}`}
                                alt="Profil"
                            />
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">
                                    {employee.employee.firstName} {employee.employee.lastName}
                                </h3>
                                <p className="text-sm text-gray-600">{employee.employee.function || "-"}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Matricule</span>
                                <span className="text-sm font-medium text-gray-900">{employee.employee.matricule}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Agence</span>
                                <span className="text-sm font-medium text-gray-900">
                                    {employee.employee.agence?.name || "-"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Salaire de base </span>
                                <span className="text-sm font-medium text-gray-900">{formatCurrency(employee.salaireBase?.baseSalaire ?? 0)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Numéro de compte</span>
                                <span className="text-sm font-medium text-gray-900">
                                    {employee.account?.accountNumber || "-"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Nombre d'enfant</span>
                                <span className="text-sm font-medium text-gray-900">
                                    {employee.employee.numberOfChildren || "-"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Solde Congé</span>
                                <span className="text-sm font-medium text-gray-900">
                                    {employee.employee.soldeConge?.solde ?? 0}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Calculs de salaire */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200 flex flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Calculs de salaire</h2>
                        <button
                            onClick={handleCalculate}
                            disabled={isCalculating}
                            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white transition-colors duration-200 ${isCalculating
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                                }`}
                        >
                            <i className="ri-calculator-line w-4 h-4 mr-2"></i>
                            {isCalculating ? 'Calcul en cours...' : 'Calculer'}
                        </button>
                    </div>
                    <div className="p-6">
                        <div className="space-y-1">
                            <SalaryField label="Salaire brut du mois" field="bruteSalaire" value={employee.bruteSalaire?.amount || 0} />
                            <SalaryField label="CNAPS (1%)" field="cnaps" value={employee.cnaps || 0} />
                            <SalaryField label="OSIE (1%)" field="osie" value={employee.osie || 0} />
                            <SalaryField label="Base imposable" field="baseImposable" value={employee.baseImposable || 0} />
                            <SalaryField label="IRSA" field="irsa" value={employee.irsa?.irsaNet || 0} />
                            <SalaryField label="Salaire net" field="salaireNet" value={employee.salaireNet || 0} />
                            <SalaryField label="Prime" field="avance" value={employee.prime?.amount || 0} />
                            <SalaryField label="Indemnite" field="avance" value={employee.indemnite?.amount || 0} />
                            <SalaryField label="Avances" field="avance" value={employee.avance?.amount || 0} />

                            <div className="flex justify-between items-center py-4 border-t-2 border-gray-200 mt-4">
                                <span className="text-base font-semibold text-gray-900">NET À PAYER</span>
                                <div className="font-bold text-lg text-green-600">
                                    {calculatingField === "netAPayer" ? (
                                        <SkeletonLoader />
                                    ) : (
                                        <span>
                                            {employee.netAPayer && employee.netAPayer > 0
                                                ? formatCurrency(employee.netAPayer)
                                                : "0 MGA"}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Actions</h3>
                    <div className="flex space-x-3">
                        <button onClick={handleRecalculate} className="inline-flex items-center px-4 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            <i className="ri-refresh-line w-4 h-4 mr-2"></i>
                            Recalculer
                        </button>
                        <button
                            onClick={handlePrint}
                            disabled={!allEmployeesValidated()}
                            className={`inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md transition-colors duration-200 ${allEmployeesValidated()
                                ? "text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                }`}
                        >
                            <i className="ri-printer-line w-4 h-4 mr-2"></i>
                            Imprimer
                        </button>

                        <button
                            onClick={handlePrint}
                            disabled={!allEmployeesValidated()}
                            className={`inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md transition-colors duration-200 ${allEmployeesValidated()
                                ? "text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                }`}
                        >
                            <i className="ri-download-line w-4 h-4 mr-2"></i>
                            Exporter PDF
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ display: "none" }}>
                <div ref={payslipRef}>
                    <Payslip employee={employee} />
                </div>
            </div>
        </div>
    );
};

export default EmployeeDetail;
