import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL
});

const API_URL = process.env.NEXT_PUBLIC_API_URL;

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        const isLoginRequest =
            originalRequest.url?.includes("/login") ||
            originalRequest.url?.includes("/auth/login");

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !isLoginRequest
        ) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");
                if (!refreshToken) throw new Error("Refresh token manquant");

                const response = await axios.get(`${API_URL}/api/account/refreshToken`, {
                    headers: { Authorization: `Bearer ${refreshToken}` },
                });

                const newAccessToken = response.data.access_token;

                localStorage.setItem("token", newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);

            } catch (err) {
                console.error("Impossible de rafraîchir le token", err);
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");

                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
