import axiosInstance from "../axiosInstance";

interface LoginResult {
    success: boolean;
    data?: any;
    message?: string;
}

export const login = async (
    email: string,
    password: string
): Promise<LoginResult> => {

    try {

        const response = await axiosInstance.post("/login", {
            email,
            password,
        });

        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("refreshToken", response.data.refresh_token);

        return {
            success: true,
            data: response.data,
        };

    } catch (error: any) {

        if (error.response?.status === 401) {
            return {
                success: false,
                message: "Email ou mot de passe incorrect.",
            };
        }

        throw error;
    }
};