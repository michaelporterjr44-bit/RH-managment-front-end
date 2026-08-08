"use client";
import { useState } from "react";
import ForgotPasswordForm from "../components/auth/reset-forgot-password/ForgotPasswordForm";
import ResetPasswordForm from "../components/auth/reset-forgot-password/ResetPasswordForm";
import SuccessReset from "../components/auth/reset-forgot-password/SuccessReset";

export default function ForgotPasswordPage() {
    const [step, setStep] = useState<"email" | "reset" | "success">("email");

    return (
        <div className="min-h-screen
             flex items-center
             justify-center"
            style={{
                backgroundColor: "#1C4010",
                backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 400'%3E%3Cdefs%3E%3CradialGradient id='a' cx='396' cy='281' r='514' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%23176205'/%3E%3Cstop offset='1' stop-color='%231C4010'/%3E%3C/radialGradient%3E%3ClinearGradient id='b' gradientUnits='userSpaceOnUse' x1='400' y1='148' x2='400' y2='333'%3E%3Cstop offset='0' stop-color='%236EB458' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%236EB458' stop-opacity='0.5'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23a)' width='800' height='400'/%3E%3Cg fill-opacity='0.4'%3E%3Ccircle fill='url(%23b)' cx='267.5' cy='61' r='300'/%3E%3Ccircle fill='url(%23b)' cx='532.5' cy='61' r='300'/%3E%3Ccircle fill='url(%23b)' cx='400' cy='30' r='300'/%3E%3C/g%3E%3C/svg%3E\")",
                backgroundAttachment: "fixed",
                backgroundSize: "cover",
            }}
        >

            <div className="w-full max-w-md">
                {step === "email" && (
                    <ForgotPasswordForm onEmailSent={() => setStep("reset")} />
                )}
                {step === "reset" && (
                    <ResetPasswordForm onSuccess={() => setStep("success")} />
                )}
                {step === "success" && <SuccessReset />}
            </div>
        </div>
    );
}
