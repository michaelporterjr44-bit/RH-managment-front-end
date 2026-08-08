// api/pay.ts
import axiosInstance from "@/api/axiosInstance";
import { PaginatedResponse } from "@/types/recruitment/paginatedResponse";
import type { CampagnePay, ModelPay } from "@/types/pay/pay";
import { EtatCampagnePaye, StatuCampagnePaye } from "@/types/pay/pay";

export const getOnePayrollPeriod = async (periode: string, codeAgence?: string, page = 0, size = 10): Promise<CampagnePay[]> => {
  let url = `/api/campagne-paye/getOne?periode=${periode}&page=${page}&size=${size}`;
  if (codeAgence) url += `&codeAgence=${codeAgence}`;
  const res = await axiosInstance.get<PaginatedResponse<CampagnePay>>(url);
  return res.data.content;
};

// --- Campagne Pay ---

// Récupérer toutes les campagnes
export const getAllCampagnePay = async (page = 0, size = 10): Promise<PaginatedResponse<CampagnePay>> => {
  const res = await axiosInstance.get<PaginatedResponse<CampagnePay>>(`/api/campagne-paye/getAll?page=${page}&size=${size}`);
  return res.data;
};

// Récupérer une campagne spécifique par période (et optionnellement par code agence)
export const getOneCampagnePay = async (
  periode: string,   // "YYYY-MM"
  codeAgence?: string,
  page = 0,
  size = 10
): Promise<PaginatedResponse<CampagnePay>> => {
  let url = `/api/campagne-paye/getOne?periode=${periode}&page=${page}&size=${size}`;
  if (codeAgence) url += `&codeAgence=${codeAgence}`;
  const res = await axiosInstance.get<PaginatedResponse<CampagnePay>>(url);
  return res.data;
};

// Créer une nouvelle campagne
export const createCampagnePay = async (campagne: Partial<CampagnePay>): Promise<CampagnePay> => {
  const res = await axiosInstance.post<CampagnePay>("/api/campagne-paye", campagne);
  return res.data;
};

// Supprimer une campagne par ID
export const deleteCampagnePay = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/api/campagne-paye/${id}`);
};

// --- ModelPay (fiche de paie d'un employé) ---

// Récupérer la liste des ModelPay pour une campagne spécifique
export const getModelPayByCampagne = async (campagneId: string): Promise<ModelPay[]> => {
  const res = await axiosInstance.get<ModelPay[]>(`/payrolls/${campagneId}/employees`);
  return res.data;
};

// Récupérer une fiche de paie spécifique
export const getModelPayByEmployee = async (modelPayId: string): Promise<ModelPay> => {
  const res = await axiosInstance.get<ModelPay>(`/payrolls/employee/${modelPayId}`);
  return res.data;
};


// --- Récupère toutes les campagnes de paie ---
export const getPayrollPeriods = async (
    page = 0,
    size = 10,
    keyword = ""
): Promise<PaginatedResponse<CampagnePay>> => {

    const { data } = await axiosInstance.get(
        "/api/campagne-paye/getAll",
        {
            params: {
                page,
                size,
                keyword
            }
        }
    );

    return data;
};

// --- Récupère tous les employés d'une campagne de paie ---
export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

export const getEmployeesByPayroll = async (
  idCampagnePaye: string,
  page = 0,
  size = 10,
  keyword = ""
): Promise<PageResponse<ModelPay>> => {

  const { data } = await axiosInstance.get(
    `/api/model-pay/getList/${idCampagnePaye}`,
    {
      params: {
        page,
        size,
        keyword
      }
    }
  );

  return data;
};

// --- Récupère un employé spécifique d'une campagne ---
export const getEmployeeByMatricule = async (
  matricule: string,
  idCampagnePaye: string,
  page = 0,
  size = 1
): Promise<ModelPay | null> => {
  const { data } = await axiosInstance.get(`/api/model-pay/getOne/${matricule}/${idCampagnePaye}?page=${page}&size=${size}`);
  return data.content.length > 0 ? data.content[0] : null;
};

/**
 * Génère toutes les fiches de paie pour une campagne
 * @param idCampagnePaye - l'ID de la campagne de paie
 * @returns message du serveur
 */
export const generatePayslipsForAllEmployees = async (idCampagnePaye: string) => {
  try {
    const response = await axiosInstance.post(`/api/model-pay/async/all/${idCampagnePaye}`);
    return response.data; // message de confirmation depuis le back
  } catch (error) {
    console.error("Erreur lors de la génération des fiches :", error);
    throw error;
  }
};


export const updateModelPay = async (id: string, updatedModelPay: ModelPay): Promise<ModelPay> => {
  const res = await axiosInstance.put<ModelPay>(`/api/model-pay/update/${id}`, updatedModelPay);
  return res.data;
};

export const generatePayslipForEmployee = async (
  matricule: string,
  idCampagnePaye: string
): Promise<string> => {
  const res = await axiosInstance.post<string>(
    `/api/model-pay/async/one/${matricule}/${idCampagnePaye}`
  );
  return res.data;
};

export const resetModelPay = async (modelPayId: string, matricule: string): Promise<ModelPay> => {
  try {
    const response = await axiosInstance.put<ModelPay>(`/api/model-pay/reset/${modelPayId}/${matricule}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors du reset de la fiche de paie :", error);
    throw error;
  }
};

export const updateEtatCampaignPay = async (campagneId: string, etat: EtatCampagnePaye) => {
  try {
    console.log("campagneId:", campagneId);
    console.log("etat envoyé:", etat);

    const response = await axiosInstance.patch(
      `/api/campagne-paye/${campagneId}/etat`,
      { etat: etat.toString().toUpperCase() }, // ← ICI
      { headers: { 'Content-Type': 'application/json' } }
    );

    console.log("Updating campagne", campagneId, "to etat", etat);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'état de la campagne :", error);
    throw error;
  }
};

export const exportPayrollExcel = async (idCampagne: string): Promise<Blob> => {
  const response = await axiosInstance.get(
    `/api/model-pay/export-excel/${idCampagne}`,
    {
      responseType: "blob",
    }
  );

  return response.data;
};


export const validateAllEmployeesInCampaign = async (campagneId: string) => {
  try {
    const response = await axiosInstance.patch(
      `/api/model-pay/campagne-paye/${campagneId}/valider-tous` // ← ajouter /api/model-pay ici
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la validation de tous les employés :", error);
    throw error;
  }
};

export const patchCampaignStatus = async (campaignId: string, status: StatuCampagnePaye) => {
  const res = await axiosInstance.patch(`/api/campagne-paye/${campaignId}/statu`, {
    statu: status
  });
  return res.data;
};
