"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useAuthWatcher() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            router.replace("/login");
            return;
        }

        try {
            const payload = JSON.parse(
                atob(token.split(".")[1])
            );

            const expirationTime = payload.exp * 1000;
            const remainingTime = expirationTime - Date.now();

            if (remainingTime <= 0) {
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                router.replace("/login");
                return;
            }

            const timeout = setTimeout(() => {
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                router.replace("/login");
            }, remainingTime);

            return () => clearTimeout(timeout);

        } catch (error) {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            router.replace("/login");
        }
    }, [router]);
}