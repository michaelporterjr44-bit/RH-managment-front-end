import axiosInstance from "@/api/axiosInstance";
import { AppUser, AppRole } from "@/types/users/user";
import { Agence } from "@/types/recruitment/agency";
import { PaginatedResponse } from "@/types/recruitment/paginatedResponse";

export const getUsersPage = async (
    page = 0,
    size = 10
): Promise<PaginatedResponse<AppUser>> => {
    const res = await axiosInstance.get<PaginatedResponse<AppUser>>(
        `/api/user/users_page?page=${page}&size=${size}`
    );
    return res.data;
};

export const getUsersInSameAgence = async (
    page = 0,
    size = 10
): Promise<PaginatedResponse<AppUser>> => {
    const res = await axiosInstance.get<PaginatedResponse<AppUser>>(
        `/api/user/users_in_same_agence?page=${page}&size=${size}`
    );
    return res.data;
};

export const getUserByMatricule = async (matricule: string): Promise<AppUser> => {
    const res = await axiosInstance.get<AppUser>(
        `/api/user/users_in_my_agence/${matricule}`
    );
    return res.data;
};


export const addUser = async (user: AppUser): Promise<AppUser> => {
    const res = await axiosInstance.post<AppUser>("/api/user/add/users", user);
    return res.data;
};


export const updateUser = async (id: string, user: AppUser): Promise<AppUser> => {
    const res = await axiosInstance.put<AppUser>(
        `/api/user/update_users/${id}`,
        user
    );
    return res.data;
};


export const deleteUserByMatricule = async (matricule: string): Promise<void> => {
    await axiosInstance.delete(`/api/user/users/delete-by-matricule/${matricule}`);
};

export const getUserProfile = async (): Promise<AppUser> => {
    const res = await axiosInstance.get<AppUser>("/api/user/profile");
    return res.data;
};

export const getRoles = async (): Promise<AppRole[]> => {
    const res = await axiosInstance.get<AppRole[]>("/api/role");
    return res.data;
};

export const addRole = async (role: AppRole): Promise<AppRole> => {
    const res = await axiosInstance.post<AppRole>("/api/role", role);
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
