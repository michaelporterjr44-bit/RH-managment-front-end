import axiosInstance from "@/api/axiosInstance";
import { Postulant } from "@/types/recruitment/applicant";
import { PaginatedResponse } from "@/types/recruitment/paginatedResponse";
import { CvPostulant } from "@/types/recruitment/applicant";
import { PaginatedPostulantResponse } from "@/types/recruitment/applicant";
import { CreatePostulantDTO } from "@/types/recruitment/applicant";

export const getPostulant = async (): Promise<Postulant> => {
    const response = await axiosInstance.get("/api/postulants");
    return response.data;
};

export const getPostulantsByCampaign = async (
    campaignId: string,
    page = 0,
    size = 5
): Promise<{
    content: Postulant[];
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
}> => {
    const response = await axiosInstance.get(
        `/api/postulants/default/campagne/${campaignId}?page=${page}&size=${size}`
    );
    return response.data;
};

export const getAllHiredPostulants = async (
    page = 0,
    size = 10,
    keyword = ""
) => {
    const response = await axiosInstance.get(
        "/api/postulants/hired",
        {
            params: {
                page,
                size,
                keyword,
            },
        }
    );

    return response.data;
};

export const validatePostulant = async (postulantId: string) => {
    try {
        const response = await axiosInstance.put(`/api/postulants/statue_validate/${postulantId}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la validation du postulant :", error);
        throw error;
    }
};

export const getAllValidatedPostulantsByCampaign = async (
    campaignId: string,
    page = 0,
    size = 10
) => {
    try {
        const response = await axiosInstance.get<PaginatedResponse<Postulant>>(
            `/api/postulants/validate/campagne/${campaignId}`,
            {
                params: { page, size },
            }
        );
        return response.data;
    } catch (error: any) {
        console.error("Erreur lors de la récupération des postulants validés :", error);
        throw error;
    }
};

export const getPostulants = async (
    page = 0,
    size = 10,
    keyword = "",
    statue = ""
): Promise<PaginatedPostulantResponse> => {

    const response = await axiosInstance.get<PaginatedPostulantResponse>(
        "/api/postulants",
        {
            params: { page, size, keyword, statue },
        }
    );

    return response.data;
};

export const getCampaignPostulants = async (
    campagneId: string,
    page = 0,
    size = 10,
    keyword = "",
    statue = ""
): Promise<PaginatedPostulantResponse> => {

    const response = await axiosInstance.get<PaginatedPostulantResponse>(
        `/api/postulants/campagne/${campagneId}`,
        {
            params: {
                page,
                size,
                keyword,
                statue,
            },
        }
    );

    return response.data;
};


export const addPostulant = async (
    payload: CreatePostulantDTO
): Promise<Postulant> => {

    const { data } = await axiosInstance.post(
        "/api/postulants",
        payload
    );

    return data;
};

export const getAllValidatedPostulants = async (
    page: number = 0,
    size: number = 10
): Promise<PaginatedResponse<Postulant>> => {
    const response = await axiosInstance.get<PaginatedResponse<Postulant>>(
        `/api/postulants`,
        {
            params: { page, size },
        }
    );
    return response.data;
};


export const rejectPostulant = async (
    postulantId: string
): Promise<Postulant> => {
    const { data } = await axiosInstance.put(
        `/api/postulants/statue_rejected/${postulantId}`
    );

    return data;
};

export const getPostulantById = async (
    postulantId: string
): Promise<Postulant> => {
    const { data } = await axiosInstance.get(
        `/api/postulants/${postulantId}`
    );

    return data;
};

export const deletePostulant = async (
    postulantId: string
): Promise<void> => {
    await axiosInstance.delete(
        `/api/postulants/${postulantId}`
    );
};

export const hiredPostulant = async (
    postulantId: string
): Promise<string> => {
    const { data } = await axiosInstance.put(
        `/api/postulants/${postulantId}/hired`
    );

    return data;
};

export const updatePostulant = async (
    postulantId: string,
    payload: Partial<Postulant>
): Promise<Postulant> => {
    const { data } = await axiosInstance.put(
        `/api/postulants/${postulantId}`,
        payload
    );

    return data;
};

export const uploadCv = async (file: File): Promise<CvPostulant> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post("/cv/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
};

export const addCvToPostulant = async (emailPostulant: string, nameCv: string) => {
    await axiosInstance.post("/postulants/add_cv/ToPostulant", {
        emailPostulant,
        nameCv,
    });
};
