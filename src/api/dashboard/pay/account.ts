import axiosInstance from "@/api/axiosInstance";

import {
    AccountDTO,
    CreateAccountDto,
    UpdateAccountDto
} from "@/types/pay/account";

import { PaginatedResponse } from "@/types/recruitment/paginatedResponse";


export const getAccounts = async (
    page = 0,
    size = 10,
    search = ""
): Promise<PaginatedResponse<AccountDTO>> => {

    const res = await axiosInstance.get<
        PaginatedResponse<AccountDTO>
    >(
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
    size = 10
): Promise<PaginatedResponse<AccountDTO>> => {

    const res = await axiosInstance.get<
        PaginatedResponse<AccountDTO>
    >(
        `/api/accounts/employee/${matricule}`,
        {
            params: {
                page,
                size
            }
        }
    );

    return res.data;
};


export const createAccount = async (
    account: CreateAccountDto
): Promise<AccountDTO | null> => {

    try {

        const res = await axiosInstance.post<AccountDTO>(
            "/api/accounts",
            account
        );

        return res.data;

    } catch (error) {

        console.error(
            "Erreur createAccount:",
            error
        );

        return null;
    }
};


export const updateAccount = async (
    id: string,
    account: UpdateAccountDto
): Promise<AccountDTO | null> => {

    try {

        const res = await axiosInstance.put<AccountDTO>(
            `/api/accounts/${id}`,
            account
        );

        return res.data;

    } catch (error) {

        console.error(
            "Erreur updateAccount:",
            error
        );

        return null;
    }
};


export const deleteAccount = async (
    id: string
): Promise<boolean> => {

    try {

        await axiosInstance.delete(
            `/api/accounts/${id}`
        );

        return true;

    } catch (error) {

        console.error(
            "Erreur deleteAccount:",
            error
        );

        return false;
    }
};