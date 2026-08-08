import React from "react";
import { EtatCampagnePaye } from "@/types/pay/pay";

interface StepperComponentProps {
    currentStep: number;
}

const steps = [
    { number: 1, title: "Vérification", description: "Vérification des données", etat: EtatCampagnePaye.VERIFICATION },
    { number: 2, title: "Validation", description: "Validation paiement", etat: EtatCampagnePaye.VALIDATION },
    { number: 3, title: "Génération", description: "Génération fiches de paie", etat: EtatCampagnePaye.GENERATION },
];

const StepperComponent: React.FC<StepperComponentProps> = ({ currentStep }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4 flex flex-col">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                    <React.Fragment key={step.number}>
                        <div className="flex items-center space-x-3">
                            <div
                                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${step.number < currentStep
                                        ? "bg-green-700 text-white"
                                        : step.number === currentStep
                                            ? "bg-green-700 text-white"
                                            : "bg-gray-200 text-gray-500"
                                    }`}
                            >
                                {step.number < currentStep ? (
                                    <i className="ri-check-fill w-5 h-5"></i>
                                ) : (
                                    <i className="ri-circle-line w-5 h-5"></i>
                                )}
                            </div>
                            <div>
                                <h3
                                    className={`text-sm font-medium transition-colors duration-300 ${step.number <= currentStep ? "text-gray-900" : "text-gray-500"
                                        }`}
                                >
                                    {step.title}
                                </h3>
                                <p
                                    className={`text-xs transition-colors duration-300 ${step.number <= currentStep ? "text-gray-600" : "text-gray-400"
                                        }`}
                                >
                                    {step.description}
                                </p>
                            </div>
                        </div>
                        {index < steps.length - 1 && (
                            <div
                                className={`flex-1 mx-4 h-0.5 transition-colors duration-300 ${step.number < currentStep ? "bg-green-700" : "bg-gray-200"
                                    }`}
                            >
                                <i
                                    className={`ri-arrow-right-s-line w-4 h-4 mx-auto -mt-2 transition-colors duration-300 ${step.number < currentStep ? "text-green-700" : "text-gray-400"
                                        }`}
                                ></i>
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default StepperComponent;
