// src/api/dashboard/recruitment/interview.ts
import axiosInstance from '@/api/axiosInstance';
import { InterviewTestScheduling } from '@/types/recruitment/interview';
import { PaginatedResponse } from '@/types/recruitment/paginatedResponse';

// 🔹 Récupérer tous les interviews (avec pagination)
export const getAllInterviews = async (page = 0, size = 10, agenceCode?: string) => {
    const params: any = { page, size };
    if (agenceCode) params.Agencecode = agenceCode;

    const response = await axiosInstance.get<PaginatedResponse<InterviewTestScheduling>>(
        '/api/interviews/getAll',
        { params }
    );
    return response.data;
};

// 🔹 Récupérer les interviews par type (TEST / INTERVIEW)
export const getInterviewsByType = async (type: string, page = 0, size = 10, agenceCode?: string) => {
    const params: any = { type, page, size };
    if (agenceCode) params.Agencecode = agenceCode;

    const response = await axiosInstance.get<PaginatedResponse<InterviewTestScheduling>>(
        '/api/interviews/getByType',
        { params }
    );
    return response.data;
};

export type InterviewInsert = Omit<InterviewTestScheduling, 'id' | 'postulant' | 'campagne'> & {
    postulant: { id: string };
    campagne: { id: string };
};

// 🔹 Créer un nouvel interview
export const createInterview = async (interview: InterviewInsert) => {
    const response = await axiosInstance.post<InterviewTestScheduling>('/api/interviews', interview);
    return response.data;
};

// 🔹 Récupérer un interview par ID
export const getInterviewById = async (id: string) => {
    const response = await axiosInstance.get<InterviewTestScheduling>(`/api/interviews/${id}`);
    return response.data;
};

// 🔹 Annuler un interview
export const cancelInterview = async (id: string) => {
    const response = await axiosInstance.put<string>(`/api/interviews/cancel/${id}`);
    return response.data;
};

export const completedInterview = async (id: string) => {
    const response = await axiosInstance.put<string>(`/api/interviews/completed/${id}`);
    return response.data;
};

// 🔹 (Optionnel) Traiter manuellement les interviews (rappels automatiques)
export const processInterviewsManually = async () => {
    const response = await axiosInstance.put<string>('/api/interviews/process');
    return response.data;
};

export const getInterviewsByDateRange = async (start: Date, end: Date): Promise<InterviewTestScheduling[]> => {
    const startStr = start.toISOString();
    const endStr = end.toISOString();
    return await axiosInstance.get(`/interviews/getByDateRange?start=${startStr}&end=${endStr}`);
};
