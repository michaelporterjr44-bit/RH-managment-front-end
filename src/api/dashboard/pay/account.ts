// src/api/pay/account-api.ts
import axiosInstance from "@/api/axiosInstance";
import { Account } from "@/types/pay/account";
import { PaginatedResponse } from "@/types/recruitment/paginatedResponse";

// Récupérer tous les comptes (paginated)
export const getAccounts = async (
    page = 0,
    size = 100,
    search = ""
): Promise<PaginatedResponse<Account>> => {

    const res = await axiosInstance.get<PaginatedResponse<Account>>(
        "/api/accounts",
        {
            params: {
                page,
                size,
                search: search.trim() || undefined
            }
        }
    );

    return res.data;
};

export const getAccountsByEmployee = async (
    matricule: string,
    page = 0,
    size = 100
): Promise<Account[]> => {
    try {
        const res = await axiosInstance.get<PaginatedResponse<Account>>(
            `/api/accounts/employee/${matricule}?page=${page}&size=${size}`
        );
        return res.data.content;
    } catch (error) {
        console.error("Erreur getAccountsByEmployee:", error);
        return [];
    }
};

// Créer un compte
export const createAccount = async (account: Partial<Account>): Promise<Account | null> => {
    try {
        const res = await axiosInstance.post<Account>("/api/accounts", account);
        return res.data;
    } catch (error) {
        console.error("Erreur createAccount:", error);
        return null;
    }
};

// Mettre à jour un compte
export const updateAccount = async (id: string, account: Partial<Account>): Promise<Account | null> => {
    try {
        const res = await axiosInstance.put<Account>(`/api/accounts/${id}`, account);
        return res.data;
    } catch (error) {
        console.error("Erreur updateAccount:", error);
        return null;
    }
};

// Supprimer un compte
export const deleteAccount = async (id: string): Promise<boolean> => {
    try {
        await axiosInstance.delete(`/api/accounts/${id}`);
        return true;
    } catch (error) {
        console.error("Erreur deleteAccount:", error);
        return false;
    }
};
