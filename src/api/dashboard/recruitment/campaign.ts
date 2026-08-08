import axiosInstance from "@/api/axiosInstance";
import { CampagneAdded, CampagneResponse, Campagne } from "@/types/recruitment/campaign";

export const getCampagne = async (
    page = 0,
    size = 10,
    keyword = ""
): Promise<CampagneResponse> => {

    const response = await axiosInstance.get(
        "/api/campagnes",
        {
            params: {
                page,
                size,
                keyword
            }
        }
    );

    return response.data;
};

export const createCampagne = async (newCampagne: CampagneAdded): Promise<Campagne> => {
    const response = await axiosInstance.post("/api/campagnes", newCampagne);
    return response.data;
};

export const updateCampagne = async (id: string, updatedCampagne: Partial<Campagne>): Promise<Campagne> => {
    const response = await axiosInstance.put(`/api/campagnes/${id}`, updatedCampagne);
    return response.data;
};

export async function deleteCampagne(id: string) {
    await axiosInstance.delete(`/api/campagnes/${id}`);
}

export const getCampagneByRef = async (
    ref: string
): Promise<Campagne | null> => {

    const response = await getCampagne(
        0,
        1,
        ref
    );

    return response.content.find(
        c => c.ref === ref
    ) ?? null;
};

export const closeCampaignAndHired = async (id: string): Promise<string> => {
    const response = await axiosInstance.put(`/api/postulants/${id}/hired`);
    return response.data;
};

export const patchCampagne = async (id: string, payload: Partial<Campagne>): Promise<Campagne> => {
    const response = await axiosInstance.patch(`/api/campagnes/${id}`, payload);
    return response.data;
};

export const patchCampagneStatu = async (id: string, statu: string) => {
  const response = await axiosInstance.patch(
    `/api/campagnes/${id}/status`,
    { statuCampagne: statu }
  );
  return response.data;
};

export const patchCampagneEtat = async (id: string, etat: string) => {
  const response = await axiosInstance.patch(
    `/api/campagnes/${id}/etat`,
    { etat }
  );
  return response.data;
};
