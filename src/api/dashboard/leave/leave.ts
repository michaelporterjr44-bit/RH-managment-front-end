  import axiosInstance from "@/api/axiosInstance";
  import type {
    Leave,
    PaginatedResponse,
    CreateLeavePayload,
  } from "@/types/leave/leave.types";

  const BASE_URL = "/api/demande-conges";

  export const getLeaves = async (
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<Leave>> => {
    const response = await axiosInstance.get(`${BASE_URL}/demande_page`, {
      params: { page, size },
    });

    return response.data;
  };

  export const createLeave = async (
    payload: CreateLeavePayload
  ): Promise<Leave> => {
    const response = await axiosInstance.post(BASE_URL, payload);
    return response.data;
  };

  export const validateLeave = async (id: string): Promise<Leave> => {
    const response = await axiosInstance.put(`${BASE_URL}/${id}/accepter`);
    return response.data;
  };

  export const refuseLeave = async (id: string): Promise<Leave> => {
    const response = await axiosInstance.put(`${BASE_URL}/${id}/refuser`);
    return response.data;
  };

  export default {
    getLeaves,
    createLeave,
    validateLeave,
    refuseLeave,
  };