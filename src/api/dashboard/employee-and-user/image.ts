import axiosInstance from "@/api/axiosInstance";
import { PaginatedResponse } from "@/types/recruitment/paginatedResponse";
import { ImageProfil } from "@/types/users/imageProfil";

export const uploadImage = async (file: File): Promise<ImageProfil> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post<ImageProfil>(
        "/api/image-profile",
        formData
    );

    return response.data;
};

export const getImageById = async (id: string): Promise<ImageProfil> => {
    const res = await axiosInstance.get<ImageProfil>(`/api/image-profile/${id}`);
    return res.data;
};

export const getAllImages = async (
    page = 0,
    size = 10
): Promise<PaginatedResponse<ImageProfil>> => {
    const res = await axiosInstance.get<PaginatedResponse<ImageProfil>>(
        `/api/image-profile?page=${page}&size=${size}`
    );
    return res.data;
};

export const updateImage = async (id: string, file: File): Promise<ImageProfil> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axiosInstance.put<ImageProfil>(
        `/api/image-profile/update/${id}`,
        formData
    );

    return res.data;
};
