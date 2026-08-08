import axiosInstance from "@/api/axiosInstance";
import { CreateDepartmentRequest, UpdateDepartmentRequest } from "@/types/department/department.types";
import { DepartmentUI } from "@/types/department/department.types";

// GET ALL
export const getAllDepartments = async (search?: string) => {

    const response = await axiosInstance.get("/api/departments", {
        params: {
            search: search?.trim() || undefined,
        },
    });

    return response.data ?? [];
};
// GET BY ID
export const getDepartmentById = async (id: number) => {
    const response = await axiosInstance.get(`/api/departments/id/${id}`);
    return response.data;
};

// CREATE
export const createDepartment = async (data: CreateDepartmentRequest) => {
    const response = await axiosInstance.post(`/api/departments`, data);
    return response.data;
};

// UPDATE
export const updateDepartment = async (id: number, data: UpdateDepartmentRequest) => {
    const response = await axiosInstance.put(`/api/departments/${id}`, data);
    return response.data;
};

// DELETE
export const deleteDepartment = async (id: number) => {
    const response = await axiosInstance.delete(`/api/departments/${id}`);
    return response.data;
};