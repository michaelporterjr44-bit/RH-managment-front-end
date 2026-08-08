// api/dashboard/pay/salaireBase.ts
import axiosInstance from "@/api/axiosInstance";
import { SalaireBase, CreateSalaireBaseDto } from "@/types/pay/pay";
import { PaginatedResponse } from "@/types/recruitment/paginatedResponse";
import { UpdateSalaireBaseDto } from "@/types/pay/pay";

// ➝ Créer un salaire de base
export const createSalaireBase = async (data: CreateSalaireBaseDto): Promise<SalaireBase> => {
  const res = await axiosInstance.post<SalaireBase>("/api/salaire-base", data);
  return res.data;
};

// ➝ Récupérer tous les salaires de base (avec pagination)
export const getSalaireBases = async (
  page = 0,
  size = 10,
  search = ""
): Promise<PaginatedResponse<SalaireBase>> => {

  const res = await axiosInstance.get<PaginatedResponse<SalaireBase>>(
    "/api/salaire-base",
    {
      params: {
        page,
        size,
        search: search || undefined
      }
    }
  );

  return res.data;
};

// ➝ Récupérer par matricule (avec pagination)
export const getSalaireBaseByMatricule = async (
  matricule: string,
  page = 0,
  size = 10
): Promise<PaginatedResponse<SalaireBase>> => {
  const res = await axiosInstance.get<PaginatedResponse<SalaireBase>>(
    `/api/salaire-base/employee/${matricule}?page=${page}&size=${size}`
  );
  return res.data;
};

export const updateSalaireBase = async (
    id: string,
    data: UpdateSalaireBaseDto
): Promise<SalaireBase> => {

    const res = await axiosInstance.put<SalaireBase>(
        `/api/salaire-base/${id}`,
        data
    );

    return res.data;
};

// ➝ Supprimer un salaire de base
export const deleteSalaireBase = async (id: string): Promise<boolean> => {
  try {
    await axiosInstance.delete(`/api/salaire-base/${id}`);
    return true;
  } catch {
    return false;
  }
};
