import axiosInstance from "@/api/axiosInstance";
import { Prime } from "@/types/pay/prime";
import { EmployeePrimeDTO } from "@/types/pay/prime";

// Créer une prime
export const createPrime = async (prime: Omit<Prime, "id">): Promise<Prime> => {
    const res = await axiosInstance.post<Prime>("/prime", prime);
    return res.data;
};

// Récupérer toutes les primes (paginated)
export const getPrimes = async (page = 0, size = 10) => {
    const res = await axiosInstance.get(`/prime`, {
        params: { page, size },
    });
    return res.data;
};

// Récupérer les primes par période
export const getPrimesByPeriode = async (periode: string, page = 0, size = 10) => {
    const res = await axiosInstance.get(`/prime/periode/${periode}`, {
        params: { page, size },
    });
    return res.data;
};

// Récupérer les primes d’un employé
export const getPrimesByEmployee = async (matricule: string, page = 0, size = 10) => {
    const res = await axiosInstance.get(`/prime/employee/${matricule}`, {
        params: { page, size },
    });
    return res.data;
};

// Récupérer les primes d’un employé pour une période
export const getPrimesByEmployeeAndPeriode = async (
    matricule: string,
    periode: string,
    page = 0,
    size = 10
) => {
    const res = await axiosInstance.get(`/prime/employee/${matricule}/${periode}`, {
        params: { page, size },
    });
    return res.data;
};

// Modifier une prime
export const updatePrime = async (id: string, prime: Partial<Prime>): Promise<Prime> => {
    const res = await axiosInstance.put<Prime>(`/prime/${id}`, prime);
    return res.data;
};

// Supprimer une prime
export const deletePrime = async (id: string): Promise<void> => {
    await axiosInstance.delete(`/prime/${id}`);
};

// Importer fichier primes
export const importPrimes = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axiosInstance.post(`/prime/import`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
};

export const importPrimesFromExcel = async (url: string): Promise<EmployeePrimeDTO[]> => {
  try {
    const response = await axiosInstance.post<EmployeePrimeDTO[]>(
      "/api/prime-excel",
      null,
      { params: { url } } 
    );
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'importation des primes :", error);
    throw error;
  }
};
