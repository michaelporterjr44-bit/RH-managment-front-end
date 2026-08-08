import axiosInstance from "@/api/axiosInstance";
import { Niveau } from "@/types/recruitment/canalNivau";

export const getNiveaux = async (): Promise<Niveau[]> => {
    try {
        const response = await axiosInstance.get("/api/niveaux");
        return response.data.content;
    } catch (error) {
        console.error("Erreur lors de la récupération des niveaux :", error);
        return [];
    }
};

export const addNiveau = async (nom: string): Promise<Niveau | null> => {
    try {
        const response = await axiosInstance.post("/api/niveaux", { nom });
        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'ajout du niveau :", error);
        return null;
    }
};

export const deleteNiveau = async (id: number): Promise<boolean> => {
    try {
        await axiosInstance.delete(`/api/niveaux/${id}`);
        return true;
    } catch (error) {
        console.error("Erreur lors de la suppression du niveau :", error);
        return false;
    }
};

export const createNiveau = async (nom: string): Promise<Niveau | null> => {
    try {
        const response = await axiosInstance.post("/api/niveaux", { nom });
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la création du niveau :", error);
        return null;
    }
};

