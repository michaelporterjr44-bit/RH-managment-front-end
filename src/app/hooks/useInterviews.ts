import { useState, useEffect } from "react";
import { InterviewStatus, InterviewTestScheduling } from "@/types/recruitment/interview";
import axiosInstance from "@/api/axiosInstance";

interface UseInterviewsOptions {
  start: Date;
  end: Date;
  type?: string;
  agenceCode?: string;
}

// Utilise ce hook dans App, en passant start/end/type selon la vue courante !
export const useInterviews = ({ start, end, type, agenceCode }: UseInterviewsOptions) => {
  const [interviews, setInterviews] = useState<InterviewTestScheduling[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const params: any = {
        start: start.toISOString(), // Plage visible
        end: end.toISOString(),
      };
      if (type) params.type = type;
      if (agenceCode) params.Agencecode = agenceCode;

      const { data } = await axiosInstance.get<InterviewTestScheduling[]>("/api/interviews", { params });
      setInterviews(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des interviews :", error);
      setInterviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
    // eslint-disable-next-line
  }, [start, end, type, agenceCode]);

  // Ajouter un interview
  const addInterview = async (interview: InterviewTestScheduling) => {
    setLoading(true);
    try {
      const { data: newInterview } = await axiosInstance.post<InterviewTestScheduling>("/api/interviews", interview);
      setInterviews((prev) => [...prev, newInterview]);
    } catch (error) {
      console.error("Erreur lors de la création :", error);
    } finally {
      setLoading(false);
    }
  };

  // Met à jour côté serveur (drag & drop, resize, modif…)
  const updateInterview = async (id: string, updates: Partial<InterviewTestScheduling>) => {
    setLoading(true);
    try {
      const { data: updatedInterview } = await axiosInstance.put<InterviewTestScheduling>(`/api/interviews/${id}`, updates);
      setInterviews((prev) => prev.map(itv => itv.id === id ? updatedInterview : itv));
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    } finally {
      setLoading(false);
    }
  };

  // Annuler un interview
  const cancelInterviewById = async (id: string) => {
    setLoading(true);
    try {
      await axiosInstance.put<string>(`/api/interviews/cancel/${id}`);
      setInterviews((prev) =>
        prev.map((interview) =>
          interview.id === id ? { ...interview, status: InterviewStatus.CANCELLED } : interview
        )
      );
    } catch (error) {
      console.error("Erreur lors de l’annulation :", error);
    } finally {
      setLoading(false);
    }
  };

  // Récupérer par ID directement du tableau chargé
  const getInterview = (id: string) => interviews.find(interview => interview.id === id);

  return {
    interviews,
    loading,
    fetchInterviews,
    addInterview,
    updateInterview,
    cancelInterviewById,
    getInterview,
  };
};
