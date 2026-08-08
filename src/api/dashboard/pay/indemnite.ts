// api/dashboard/pay/indemnite.ts
import axiosInstance from "@/api/axiosInstance";
import { Indemnite } from "@/types/pay/indemnite";
import { PaginatedResponse } from "@/types/recruitment/paginatedResponse";

const BASE_URL = "/api/indemnite";

export const createIndemnite = async (indemnite: Partial<Indemnite>) => {
    const response = await axiosInstance.post<Indemnite>(BASE_URL, indemnite);
    return response.data;
};

export const getIndemnites = async (page = 0, size = 10) => {
    const response = await axiosInstance.get<PaginatedResponse<Indemnite>>(BASE_URL, { params: { page, size } });
    return response.data;
};

export const getIndemniteByEmployee = async (matricule: string, page = 0, size = 10) => {
    const response = await axiosInstance.get<PaginatedResponse<Indemnite>>(`${BASE_URL}/employee/${matricule}`, { params: { page, size } });
    return response.data;
};

export const updateIndemnite = async (id: string, indemnite: Partial<Indemnite>) => {
    const response = await axiosInstance.put<Indemnite>(`${BASE_URL}/${id}`, indemnite);
    return response.data;
};

export const deleteIndemnite = async (id: string) => {
    await axiosInstance.delete(`${BASE_URL}/${id}`);
};
