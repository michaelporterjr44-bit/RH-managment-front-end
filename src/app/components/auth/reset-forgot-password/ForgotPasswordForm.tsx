"use client";

import { forgotPassword } from "@/api/auth/password-config/forgotPassword";
import { useState } from "react";
import Link from "next/link";
import SuccessModal from "../../ui/SuccessModal";
import ErrorModal from "../../ui/ErrorModal";

interface Props {
    onEmailSent: () => void;
}

export default function ForgotPasswordForm({ onEmailSent }: Props) {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorModal, setErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [successModal, setSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await forgotPassword(email);
            onEmailSent();
        } catch (err: any) {

            setErrorMessage(
                err.response?.data?.message ??
                "Une erreur inattendue est survenue."
            );

            setErrorModal(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen justify-center p-4"
        >
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="mx-auto
                             w-16 h-16
                             bg-green-100
                             rounded-full flex items-center justify-center mb-4">
                            <i className="ri-lock-unlock-line text-2xl text-green-800"></i>
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 mb-2">
                            Mot de passe oublié
                        </h1>
                        <p className="text-sx text-gray-600">
                            Entrez votre adresse email pour recevoir un lien de
                            réinitialisation
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Adresse email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="ri-mail-line text-gray-400 text-lg"></i>
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10
                                    pr-4 py-3 border
                                    border-gray-300
                                    rounded-lg focus:ring-2
                                    focus:ring-green-500
                                    focus:border-green-500
                                    text-sm transition-colors"
                                    placeholder="votreemail@exemple.com"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-green-800
                            text-white py-3 px-4
                            rounded-lg font-medium
                            hover:bg-green-700
                            focus:outline-none
                            focus:ring-2 focus:ring-green-500
                            focus:ring-offset-2 transition-colors
                            whitespace-nowrap disabled:bg-green-700
                            disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <div
                                        className="animate-spin
                                        rounded-full h-4
                                        w-4 border-2 border-white
                                        border-t-transparent mr-2"
                                    ></div>
                                    Envoi en cours...
                                </>
                            ) : (
                                "Envoyer le lien de réinitialisation"
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <Link
                            href="/login"
                            className="inline-flex
                            items-center
                            text-sm text-green-700
                            hover:text-green-600
                            font-medium transition-colors"
                        >
                            <i className="ri-arrow-left-line mr-1"></i>
                            Retour à la connexion
                        </Link>
                    </div>
                </div>

                <div className="text-center mt-8">
                    <p className="text-sm text-gray-50">
                        Besoin d'aide ? Contactez notre{" "}
                        <Link
                            href="/support"
                            className="text-green-300 hover:text-green-500"
                        >
                            support client
                        </Link>
                    </p>
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
