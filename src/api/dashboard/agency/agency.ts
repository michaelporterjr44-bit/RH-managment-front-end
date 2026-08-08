import axiosInstance from "@/api/axiosInstance";
import { Agence } from "@/types/employee/employee";
import { AgencyFormData } from "@/types/agency/agency";

export const fetchAgencies = async (): Promise<Agence[]> => {
    const res = await axiosInstance.get<Agence[]>("/api/agence");
    return res.data;
};

export const getAgencies = async (): Promise<Agence[]> => {
    const res = await axiosInstance.get<Agence[]>("/api/agence");
    return res.data;
};

export const addAgency = async (agency: Agence): Promise<Agence> => {
    const res = await axiosInstance.post<Agence>("/api/agence", agency);
    return res.data;
};

export const updateAgency = async (
  id: number,
  updates: Record<string, unknown>
): Promise<Agence> => {
  const res = await axiosInstance.put<Agence>(`/api/agence/${id}`, updates);
  return res.data;
};