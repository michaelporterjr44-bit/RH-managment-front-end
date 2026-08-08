import axiosInstance from "@/api/axiosInstance";
import { Employee} from "@/types/employee/employee";
import { PaginatedResponse } from "@/types/recruitment/paginatedResponse";
import { UpdateEmployeeDTO, EmployeeProfileResponse } from "@/types/employee/employee";
import { EmployeeResponse } from "@/types/employee/employee";
import { uploadImage } from "./image";
import { CreateEmployeeDTO } from "@/types/employee/employee";

export const addEmployee = async (
    dto: CreateEmployeeDTO,
    createUser = false
) => {
    const res = await axiosInstance.post(
        `/api/employees?createUser=${createUser}`,
        dto
    );
    return res.data;
};

export const updateEmployee = async (
  id: string,
  data: UpdateEmployeeDTO
): Promise<Employee> => {
  const res = await axiosInstance.put(`/api/employees/${id}`, data);
  return res.data;
};

export const getEmployeesPage = async (
  page = 0,
  size = 7,
  keyword = ""
): Promise<PaginatedResponse<EmployeeResponse>> => {

  const res = await axiosInstance.get(
    "/api/employees/emp_page",
    {
      params: {
        page,
        size,
        keyword,
      },
    }
  );

  return res.data;
};

/*
 * employee with pagination for ADMIN
 */
export const getEmployeesEntity = async (
  page: number = 0,
  size: number = 7,
  keyword: string = "" // 1. Ajout du paramètre keyword avec une valeur par défaut empty
) => {
  try {
    // 2. Utilisation des `params` d'axios (plus propre que de concaténer l'URL à la main)
    const response = await axiosInstance.get("/api/employees/employeePage", {
      params: {
        page,
        size,
        keyword
      }
    });

    return response.data; // Retourne le type PaginatedResponse<Employee>
  } catch (error) {
    console.error("Erreur lors de la récupération des employés :", error);
    throw error;
  }
};

export const getEmployeesInSameAgence = async (
  page = 0,
  size = 7,
  keyword = ""
): Promise<PaginatedResponse<EmployeeResponse>> => {

  const res = await axiosInstance.get(
    "/api/employees/emp_in_same_agence",
    {
      params: {
        page,
        size,
        keyword,
      },
    }
  );

  return res.data;
};

export const getEmployeeByMatricule = async (
    matricule: string
): Promise<EmployeeProfileResponse> => {

    const res = await axiosInstance.get(
        `/api/employees/emp_in_my_agence/${matricule}`
    );

    return res.data;
};

export const deleteEmployeeByMatricule = async (matricule: string): Promise<void> => {
    await axiosInstance.delete(`/api/employees/${matricule}`);
};


export const updateEmployeeImage = async (
    id: string,
    file: File
) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axiosInstance.put(
        `/api/employees/${id}/image`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return res.data;
};


export const updateImageProfile = async (
    id: string,
    file: File
) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axiosInstance.put(
        `/api/image-profile/update/${id}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return res.data;
};

export const getEmployeeById = async (id: string) => {
    const res = await axiosInstance.get(`/api/employees/${id}`);
    return res.data;
};


export const updateEmployeeImageAutoMatricule = async (
    employee: EmployeeProfileResponse,
    file: File
) => {
    const extension = file.name.split('.').pop();

    const renamedFile = new File(
        [file],
        `${employee.matricule.toUpperCase()}.${extension}`, // 🔥 clé du système
        { type: file.type }
    );

    return await uploadImage(renamedFile); // ✅ ici
};
