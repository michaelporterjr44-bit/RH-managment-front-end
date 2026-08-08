import axiosInstance from "@/api/axiosInstance";
import { Cnaps } from "@/types/pay/cnaps";

const API_URL = "/api/cnaps";

export const getCnaps = async (): Promise<Cnaps> => {
    const response = await axiosInstance.get<Cnaps>(API_URL);
    return response.data;
};

export const fetchAndSaveCnaps = async (): Promise<Cnaps> => {
    const response = await axiosInstance.post<Cnaps>(API_URL);
    return response.data;
};

export const deleteCnaps = async (): Promise<void> => {
    await axiosInstance.delete(API_URL);
};
