import { Employee } from "@/types/employee/employee";

export interface Prime {
    id: string;
    amount: number;
    employee: Employee;
    periode: string;
}

export interface EmployeePrimeDTO {
    matricule: string;
    prime: number;
    employee: Employee;
}
