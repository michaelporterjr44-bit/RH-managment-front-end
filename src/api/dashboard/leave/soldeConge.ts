import axiosInstance from "@/api/axiosInstance";
import { Employee } from "@/types/employee/employee";

export interface SoldeConge {
  id: string;
  solde: number;
  employee: Employee;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  page: number;
}

const BASE_URL = "/api/solde-conges";

// récupérer les soldes paginés
const getAll = async (
  page = 0,
  size = 10,
  keyword = ""
): Promise<PaginatedResponse<SoldeConge>> => {

  const response = await axiosInstance.get(
    `${BASE_URL}/solde_page`,
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

// reset solde pour tous les employés (ancien)
const resetAll = async () => {
  const response = await axiosInstance.post(`${BASE_URL}/reset-all`);
  return response.data;
};

// reset solde pour tous les employés (nouveau endpoint PUT)
const resetAllSolde = async () => {
  const response = await axiosInstance.put(`${BASE_URL}/reset-all-solde`);
  return response.data; // "ok"
};

// ajouter solde à un employé
const addSoldeToEmployee = async (employeeId: string, solde: number) => {
  const response = await axiosInstance.post(
    `${BASE_URL}/${employeeId}`,
    null,
    {
      params: { solde },
    }
  );

  return response.data;
};

// reset solde d'un employé
const resetEmployee = async (employeeId: string) => {
  const response = await axiosInstance.put(`${BASE_URL}/reset/${employeeId}`);
  return response.data;
};

export const getSoldeCongeByEmployee = async (employeeId: string): Promise<SoldeConge> => {
    const res = await axiosInstance.get(`/api/solde-conges/employee/${employeeId}`);
    return res.data;
};

export default {
  getAll,
  resetAll,
  resetAllSolde, // <-- nouveau endpoint
  addSoldeToEmployee,
  resetEmployee,
};