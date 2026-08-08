import axiosInstance from "@/api/axiosInstance";
import { Canal } from "@/types/recruitment/channels";

export const getChannels = async (): Promise<Canal[]> => {
    const response = await axiosInstance.get<{ content: Canal[] }>("/api/canaux");
    return response.data.content;
};

export const getCanaux = async (page = 0, size = 10): Promise<Canal[]> => {
    try {
        const response = await axiosInstance.get(`/api/canaux?page=${page}&size=${size}`);
        return response.data.content || [];
    } catch (error) {
        console.error("Erreur lors de la récupération des canaux :", error);
        return [];
    }
};

// Créer un canal
export const createCanal = async (canal: Partial<Canal>): Promise<Canal | null> => {
    try {
        const response = await axiosInstance.post("/api/canaux", canal);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la création du canal :", error);
        return null;
    }
};

// Supprimer un canal
export const deleteCanal = async (id: string | number): Promise<boolean> => {
    try {
        await axiosInstance.delete(`/api/canaux/${id}`);
        return true;
    } catch (error) {
        console.error("Erreur lors de la suppression du canal :", error);
        return false;
    }
};


