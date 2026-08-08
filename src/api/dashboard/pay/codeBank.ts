// src/api/pay/codeBank-api.ts
import axiosInstance from "@/api/axiosInstance"; // ton instance Axios pré-configurée
import { CodeBank,CreateCodeBankDto } from "@/types/pay/codeBank";
import { PaginatedResponse } from "@/types/recruitment/paginatedResponse"; // si tu as un type PaginatedResponse

// Récupérer toutes les banques (paginated)
export const getCodeBanks = async (page = 0, size = 100): Promise<CodeBank[]> => {
    try {
        const res = await axiosInstance.get<PaginatedResponse<CodeBank>>(`/api/codebanks?page=${page}&size=${size}`);
        return res.data.content;
    } catch (error) {
        console.error("Erreur getCodeBanks:", error);
        return [];
    }
};

// Récupérer une banque par ID
export const getCodeBankById = async (id: string): Promise<CodeBank | null> => {
    try {
        const res = await axiosInstance.get<CodeBank>(`/api/codebanks/${id}`);
        return res.data;
    } catch (error) {
        console.error("Erreur getCodeBankById:", error);
        return null;
    }
};

// Rechercher une banque par nom
export const searchCodeBanks = async (bankName: string, page = 0, size = 10): Promise<CodeBank[]> => {
    try {
        const res = await axiosInstance.get<PaginatedResponse<CodeBank>>(
            `/api/codebanks/search?bankName=${encodeURIComponent(bankName)}&page=${page}&size=${size}`
        );
        return res.data.content;
    } catch (error) {
        console.error("Erreur searchCodeBanks:", error);
        return [];
    }
};

// Créer une nouvelle banque
export const createCodeBank = async (data: CreateCodeBankDto): Promise<CodeBank | null> => {
    try {
        const res = await axiosInstance.post<CodeBank>("/api/codebanks", data);
        return res.data;
    } catch (error) {
        console.error("Erreur createCodeBank:", error);
        return null;
    }
};

// Mettre à jour une banque
export const updateCodeBank = async (id: string, codeBank: Partial<CodeBank>): Promise<CodeBank | null> => {
    try {
        const res = await axiosInstance.put<CodeBank>(`/api/codebanks/${id}`, codeBank);
        return res.data;
    } catch (error) {
        console.error("Erreur updateCodeBank:", error);
        return null;
    }
};

// Supprimer une banque
export const deleteCodeBank = async (id: string): Promise<boolean> => {
    try {
        await axiosInstance.delete(`/api/codebanks/${id}`);
        return true;
    } catch (error) {
        console.error("Erreur deleteCodeBank:", error);
        return false;
    }
};
