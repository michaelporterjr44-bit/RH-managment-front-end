import axiosInstance from "@/api/axiosInstance";

export async function forgotPassword(email: string) {
    const response = await axiosInstance.post(
        "/api/auth/forgot-password",
        { email }
    );

    return response.data;
}