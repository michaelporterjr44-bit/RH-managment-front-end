// types/pay/indemnite.ts
import { Employee} from "@/types/employee/employee";

export interface Indemnite {
    id?: string;
    amount: number;
    employee: Employee;
    periode: string;
}
