import axiosInstance from "../axiosInstance";
import { DashboardResponse } from "@/types/dashboard";

export const getDashboard = async (): Promise<DashboardResponse> => {
    const response = await axiosInstance.get("/api/dashboard");
    return response.data;
};