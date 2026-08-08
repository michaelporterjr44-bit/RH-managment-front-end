"use client";

import { useState } from "react";
import { resetPassword } from "@/api/auth/password-config/resetPassword";
import ErrorModal from "../../ui/ErrorModal";
import SuccessModal from "../../ui/SuccessModal";

interface Props {
    onSuccess: () => void;
}

export default function ResetPasswordForm({ onSuccess }: Props) {
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorModal, setErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [successModal, setSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirm) {
            alert("Les mots de passe ne correspondent pas");
            return;
        }
        setLoading(true);
        try {
            await resetPassword(code, password);
            onSuccess();
        } catch (err: any) {

            setErrorMessage(
                err.response?.data?.message ??
                "Une erreur inattendue est survenue."
            );

            setErrorModal(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <i className="ri-key-2-line text-2xl text-green-800"></i>
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 mb-2">
                            Nouveau mot de passe
                        </h1>
                        <p className="text-sx text-gray-600">
                            Entrez le code reçu par email et votre nouveau mot de passe
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="verificationCode"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Code de vérification
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="ri-shield-check-line text-gray-400 text-lg"></i>
                                </div>
                                <input
                                    type="text"
                                    id="verificationCode"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="w-full pl-10
                                    pr-4 py-3 border
                                    border-gray-300 rounded-lg
                                    focus:ring-2 focus:ring-green-500
                                    focus:border-green-500 text-sm transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="newPassword"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Nouveau mot de passe
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="ri-lock-line text-gray-400 text-lg"></i>
                                </div>
                                <input
                                    type="password"
                                    id="newPassword"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10
                                    pr-4 py-3 border
                                    border-gray-300
                                    rounded-lg focus:ring-2
                                    focus:ring-green-500
                                    focus:border-green-500
                                    text-sm transition-colors"
                                    placeholder="Nouveau mot de passe"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Confirmer le mot de passe
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="ri-lock-line text-gray-400 text-lg"></i>
                                </div>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                    className="w-full pl-10 pr-4
                                    py-3 border border-gray-300
                                    rounded-lg focus:ring-2
                                    focus:ring-green-500
                                    focus:border-green-500
                                    text-sm transition-colors"
                                    placeholder="Confirmer le mot de passe"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {password && (
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <div
                                        className={`h-2 w-full rounded ${password.length >= 6 ? "bg-green-200" : "bg-gray-200"
                                            }`}
                                    >
                                        <div
                                            className={`h-full rounded transition-all ${password.length < 6
                                                ? "w-1/4 bg-red-400"
                                                : password.length < 8
                                                    ? "w-2/4 bg-yellow-400"
                                                    : "w-full bg-green-400"
                                                }`}
                                        ></div>
                                    </div>
                                </div>
                                <p
                                    className={`text-xs ${password.length < 6
                                        ? "text-red-600"
                                        : password.length < 8
                                            ? "text-yellow-600"
                                            : "text-green-600"
                                        }`}
                                >
                                    {password.length < 6
                                        ? "Faible"
                                        : password.length < 8
                                            ? "Moyen"
                                            : "Fort"}
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-800
                            text-white py-3 px-4
                            rounded-lg font-medium
                            hover:bg-green-700 focus:outline-none
                            focus:ring-2 focus:ring-green-500
                            focus:ring-offset-2 transition-colors
                            disabled:bg-green-400
                            disabled:cursor-not-allowed
                            flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                    Modification...
                                </>
                            ) : (
                                "Modifier le mot de passe"
                            )}
                        </button>
                    </form>
                </div>
            </div>
            <ErrorModal
                open={errorModal}
                message={errorMessage}
                onClose={() => setErrorModal(false)}
            />

            <SuccessModal
                open={successModal}
                message={successMessage}
                onClose={() => setSuccessModal(false)}
            />
        </div>
    );
}
