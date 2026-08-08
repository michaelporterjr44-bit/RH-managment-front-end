// types/pay/avance.ts
import { Employee } from "../employee/employee";

export interface Avance {
    id: string;        // UUID généré par le backend
    amount: number;
    employee: Employee;
    periode: string;    // YYYY-MM
}
