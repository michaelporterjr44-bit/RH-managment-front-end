import axiosInstance from "@/api/axiosInstance";

export async function resetPassword(token: string, newPassword: string) {
    const response = await axiosInstance.post(
        "/api/auth/reset-password",
        {
            token,
            newPassword,
        }
    );

    return response.data;
}