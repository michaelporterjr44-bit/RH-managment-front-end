import React from "react";
import { ModelPay } from "@/types/pay/pay";
import logo from "../../../../../../public/logoNIM.jpg";

interface PayslipProps {
    employee: ModelPay;
}

const Payslip: React.FC<PayslipProps> = ({ employee }) => {
    const safeEmployee = {
        ...employee,
        salaireBase: employee.salaireBase ?? { baseSalaire: 0 },
        bruteSalaire: employee.bruteSalaire ?? { amount: 0 },
        irsa: employee.irsa ?? {
            irsaNet: 0,
            tranche1: 0,
            tranche2: 0,
            tranche3: 0,
            tranche4: 0
        },
        employee: {
            ...employee.employee,
            soldeConge: employee.employee?.soldeConge ?? { solde: 0 }
        }
    };

    const formatNumber = (num?: number) =>
        new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 0 }).format(num || 0);

    return (
        <div
            className="mx-auto bg-white p-8 text-black"
            style={{ width: "214mm", minHeight: "200mm" }}
        >
            <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="flex items-stretch">
                    <div className="flex flex-1 bg-gray-50 flex items-center justify-center">
                        <img
                            src={logo.src}
                            alt="NIM"
                            className="max-h-full max-w-full object-contain"
                        />
                    </div>
                </div>

                <div className="border-2 border-black p-4">
                    <textarea
                        value={
                            `Nom : ${employee.employee?.firstName ?? ""}\n\n` +
                            `Prenom : ${employee.employee?.lastName ?? ""}\n\n` +
                            `Adresse : ${employee.employee?.address ?? ""}`
                        }
                        className="h-full w-full resize-none border-none bg-transparent text-sm outline-none print:border-none"
                        rows={6}
                        readOnly
                    />
                </div>

            </div>
            {/* Administrative Info Section */}
            <div className="mb-6 grid grid-cols-2 gap-2 text-sm">
                {/* Left Column */}
                <div className="space-y-1">
                    <div className="flex gap-2">
                        <span className="font-semibold">NIF :</span>
                        <input
                            type="text"
                            value=""
                            className="flex-1 border-none bg-transparent outline-none print:border-none"
                            readOnly
                        />
                    </div>
                    <div className="flex gap-2">
                        <span className="font-semibold">Activité :</span>
                        <input
                            type="text"
                            value="Activity"
                            className="flex-1 border-none bg-transparent outline-none print:border-none"
                            readOnly
                        />
                    </div>
                    <div className="flex gap-2">
                        <span className="font-semibold">Date paiement :</span>
                        <input
                            type="text"
                            value={employee.campagnePay.dateCreation}
                            className="flex-1 border-none bg-transparent outline-none print:border-none"
                            readOnly
                        />
                    </div>
                </div>

                {/* Right Column */}
                <div className="">
                    <div className="flex gap-4">
                        <p className="font-semibold">Matricule : <span className="font-normal">{employee.employee.matricule}</span></p>
                        <p className="font-semibold">CIN : <span className="font-normal">{employee.employee.cin}</span></p>
                    </div>
                    <div className="flex gap-4">
                        <p className="font-semibold">Fonction : <span className="font-normal">{employee.employee.function}</span></p>
                    </div>
                    <div className="flex gap-4">
                        <p className="font-semibold">Type de contrat : <samp className="font-normal">{employee.employee.contractType}</samp></p>
                        <p className="font-semibold">Nombre d'enfants : <span className="font-normal">{employee.nombreEnfant}</span></p>
                    </div>
                </div>
            </div>

            {/* Main Salary Table */}
            {/* Main Salary Table */}
            <div className="mb-6">
                <table className="w-full border-collapse border-2 border-black text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-black p-2 text-left font-semibold">Rubriques</th>
                            <th className="border border-black p-2 text-center font-semibold">Taux</th>
                            <th className="border border-black p-2 text-center font-semibold">Base</th>
                            <th className="border border-black p-2 text-center font-semibold">Gains</th>
                            <th className="border border-black p-2 text-center font-semibold">Retenues</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Salaire de base */}
                        <tr>
                            <td className="border border-black p-2 font-medium">Salaire de base</td>
                            <td className="border border-black p-2"></td>
                            <td className="border border-black p-2"></td>
                            <td className="border border-black p-2 text-right">{formatNumber(safeEmployee.salaireBase.baseSalaire)}</td>
                            <td className="border border-black p-2"></td>
                        </tr>

                        {/* Salaire brut */}
                        <tr>
                            <td className="border border-black p-2 font-medium">Salaire brut</td>
                            <td className="border border-black p-2"></td>
                            <td className="border border-black p-2"></td>
                            <td className="border border-black p-2 text-right font-semibold">{formatNumber(safeEmployee.bruteSalaire.amount)}</td>
                            <td className="border border-black p-2"></td>
                        </tr>

                        {/* CNAPS */}
                        <tr>
                            <td className="border border-black p-2 font-medium">CNAPS</td>
                            <td className="border border-black p-2 text-center">0.01</td>
                            <td className="border border-black p-2 text-right">{formatNumber(employee.bruteSalaire.amount)}</td>
                            <td className="border border-black p-2"></td>
                            <td className="border border-black p-2 text-right">{formatNumber(employee.cnaps)}</td>
                        </tr>

                        {/* OSTIE */}
                        <tr>
                            <td className="border border-black p-2 font-medium">OSTIE</td>
                            <td className="border border-black p-2 text-center">0.01</td>
                            <td className="border border-black p-2 text-right">{formatNumber(employee.bruteSalaire.amount)}</td>
                            <td className="border border-black p-2"></td>
                            <td className="border border-black p-2 text-right">{formatNumber(employee.osie)}</td>
                        </tr>

                        {/* IRSA */}
                        <tr>
                            <td className="border border-black p-2 font-medium">IRSA</td>
                            <td className="border border-black p-2"></td>
                            <td className="border border-black p-2 text-right">{formatNumber(safeEmployee.irsa.irsaNet)}</td>
                            <td className="border border-black p-2"></td>
                            <td className="border border-black p-2"></td>
                        </tr>

                        {/* Tranche 1 */}
                        <tr>
                            <td className="border border-black p-2 pl-6">Tranche 1 : Inférieure à 350000</td>
                            <td className="border border-black p-2 text-center">0.00</td>
                            <td className="border border-black p-2"></td>
                            <td className="border border-black p-2"></td>
                            <td className="border border-black p-2 text-right">{formatNumber(0)}</td>
                        </tr>

                        {/* Tranche 2 */}
                        <tr>
                            <td className="border border-black p-2 pl-6">Tranche 2 : 350001 - 400000</td>
                            <td className="border border-black p-2 text-center">0.05</td>
                            <td className="border border-black p-2"></td>
                            <td className="border border-black p-2"></td>
                            <td className="border border-black p-2 text-right">{formatNumber(employee.irsa?.tranche1)}</td>
                        </tr>

                        {/* Tranche 3 */}
                        <tr>
                            <td className="border border-black p-2 pl-6">Tranche 3 : 400001 - 500000</td>
                            <td className="border border-black p-2 text-center">0.10</td>
                            <td className="border border-black p-2"></td>
                            <td className="border border-black p-2"></td>
                            <td className="border border-black p-2 text-right">{formatNumber(employee.irsa?.tranche2)}</td>
                        </tr>

                        {/* Tranche 4 */}
                        <tr>
                            <td className="border border-black p-2 pl-6">Tranche 4 : 500001 - 600000</td>
                            <td className="border border-black p-2 text-center">0.15</td>
                            <td className="border border-black p-2"></td>
                            <td className="border border-black p-2"></td>
                            <td className="border border-black p-2 text-right">{formatNumber(employee.irsa?.tranche3)}</td>
                        </tr>

                        {/* Tranche 5 (calculée) */}
                        <tr>
                            <td className="border border-black p-2 pl-6">Tranche 5 : Supérieure à 600001</td>
                            <td className="border border-black p-2 text-center">0.20</td>
                            <td className="border border-black p-2"></td>
                            <td className="border border-black p-2"></td>
                            <td className="border border-black p-2 text-right">
                                {formatNumber(employee.irsa?.tranche4)}
                            </td>
                        </tr>

                        {/* Total IRSA */}
                        <tr>
                            <td className="border border-black p-2 font-semibold">Total IRSA</td>
                            <td className="border border-black p-2"></td>
                            <td className="border border-black p-2"></td>
                            <td className="border border-black p-2"></td>
                            <td className="border border-black p-2 text-right font-bold">{formatNumber(employee.irsa?.irsaNet)}</td>
                        </tr>

                        {/* Salaire Net */}
                        <tr>
                            <td className="border border-black p-2 font-semibold">Salaire Net</td>
                            <td className="border border-black p-2"></td>
                            <td className="border border-black p-2"></td>
                            <td className="border border-black p-2 text-right font-bold">{formatNumber(employee.salaireNet)}</td>
                            <td className="border border-black p-2"></td>
                        </tr>

                        {/* Net à payer */}
                        <tr>
                            <td className="border border-black p-2 font-semibold">Net à payer</td>
                            <td className="border border-black p-2"></td>
                            <td className="border border-black p-2"></td>
                            <td className="border border-black p-2 text-right font-bold">{formatNumber(employee.netAPayer)}</td>
                            <td className="border border-black p-2"></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-4">
                {/* Left Summary */}
                <table className="w-full border-collapse border-2 border-black text-xs">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-black p-1 text-left font-semibold">Salaire Net</th>
                            <th className="border border-black p-1 text-left font-semibold">IRSA</th>
                            <th className="border border-black p-1 text-left font-semibold">Cotisations patronales</th>
                            <th className="border border-black p-1 text-left font-semibold">Solde Congés</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-black p-1 text-right">{formatNumber(employee.salaireNet)}</td>
                            <td className="border border-black p-1 text-right">{formatNumber(employee.irsa.irsaNet)}</td>
                            <td className="border border-black p-1 text-right">{formatNumber(employee.cnaps + employee.osie)}</td>
                            <td className="border border-black p-1 text-right">{formatNumber(safeEmployee.employee.soldeConge.solde)}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Right Summary */}
                <table className="w-full border-collapse border-2 border-black text-xs">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-black p-1 text-left font-semibold">Salaire net a payer</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-black p-1 text-right">{employee.netAPayer}</td>
                        </tr>
                    </tbody>
                </table>
            </div>



            {/* Signatures */}
            <div className="mt-18 grid grid-cols-2 gap-8 text-center text-sm">
                <div>
                    <p className="mb-12 font-semibold">L'employeur</p>
                    <p className="border-t border-black pt-2">
                        Monsieur Harizaka Rakoto
                    </p>
                </div>
                <div>
                    <p className="mb-12 font-semibold">L'employé(e)</p>
                    <p className="border-t border-black pt-2">
                        Monsieur {employee.employee.firstName} {employee.employee.lastName}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Payslip;
