// api/pay/avance.ts
import axiosInstance from "@/api/axiosInstance";
import { Avance } from "@/types/pay/pay";

export const createAvance = async (avance: Avance): Promise<Avance> => {
    const response = await axiosInstance.post("/api/avance", avance);
    return response.data;
};
