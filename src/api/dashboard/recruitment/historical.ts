import axiosInstance from "@/api/axiosInstance";
import { ActionHistory } from "@/types/recruitment/historical";
import { PaginatedResponse } from "@/types/recruitment/paginatedResponse";

export type ActionHistoryResponse = PaginatedResponse<ActionHistory>;

export const getActionHistory = async (
    params: {
        userId?: string;
        userEmail?: string;
        type?: string;
        page?: number;
        size?: number;
    } = {}
): Promise<ActionHistoryResponse> => {

    const response = await axiosInstance.get<ActionHistoryResponse>(
        "/api/history",
        {
            params
        }
    );

    return response.data;
};