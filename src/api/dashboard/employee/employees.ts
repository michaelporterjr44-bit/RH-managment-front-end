import axiosInstance from "@/api/axiosInstance";
import { Employee } from "@/types/employee/employee";

export const getEmployeeByMatricule = async (
    matricule: string
): Promise<Employee> => {
    const response = await axiosInstance.get<Employee>(
        `/api/employees/emp_in_my_agence/${matricule}`
    );
    return response.data;
};
