"use client";

import { useState } from "react";
import { login } from "@/api/auth/login";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [errorModal, setErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [successModal, setSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {

            const result = await login(email, password);

            if (!result.success) {
                setError(result.message!);
                return;
            }

            window.location.href = "/dashboard";

        } catch (err: any) {

            setErrorMessage(
                err.response?.data?.message ??
                "Une erreur serveur est survenue."
            );

            setErrorModal(true);

        } finally {

            setLoading(false);

        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Email address
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="ri-mail-line text-gray-400 text-lg"></i>
                    </div>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-10
                        pr-4 py-3
                        border border-gray-400
                        rounded-lg focus:ring-2
                        focus:ring-green-500"
                        placeholder="yourmail@exemple.com"
                    />
                </div>
            </div>


            <div>
                <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Password
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="ri-lock-line text-gray-400 text-lg"></i>
                    </div>
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full pl-10
                        pr-12 py-3 border
                        border-gray-400 rounded-lg
                        focus:ring-2 focus:ring-green-700"
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    >
                        <i
                            className={`${showPassword ? "ri-eye-off-line" : "ri-eye-line"
                                } text-gray-400 text-lg hover:text-gray-600`}
                        ></i>
                    </button>
                </div>
            </div>


            <div className="flex items-center justify-between">
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 text-green-600 border-green-300 rounded"
                    />
                    <span className="ml-2 text-sm">Remember me</span>
                </label>
                <a
                    href="/forgot-password"
                    className="text-sm text-green-700 hover:text-green-600"
                >
                    Forgot password?
                </a>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}


            <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-800
                text-white py-3 px-4
                rounded-lg hover:bg-green-900
                disabled:bg-green-800"
            >
                {loading ? "Connexion..." : "Se connecter"}
            </button>
        </form>

    );
}
