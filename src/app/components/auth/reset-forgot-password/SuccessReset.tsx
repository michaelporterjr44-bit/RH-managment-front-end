"use client";
import Link from "next/link";

export default function SuccessReset() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl">
                <div className="rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                            <i className="ri-check-line text-4xl text-green-600"></i>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            Mot de passe modifié
                        </h1>
                        <p className="text-gray-600 leading-relaxed">
                            Votre mot de passe a été modifié avec succès. Vous pouvez
                            maintenant vous connecter avec votre nouveau mot de passe.
                        </p>
                    </div>

                    <Link
                        href="/login"
                        className="w-full bg-green-700
                        text-white py-3 px-4
                        rounded-lg font-medium
                        hover:bg-green-800 focus:outline-none
                        focus:ring-2 focus:ring-green-700
                        focus:ring-offset-2 transition-colors
                        whitespace-nowrap text-center block"
                    >
                        Se connecter
                    </Link>
                </div>
            </div>
        </div>
    );
}
