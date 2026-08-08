import { CodeBank } from "./codeBank";
import { Employee } from "../employee/employee";

export interface Account {
    id: string;
    codeBank: CodeBank;
    accountNumber: string;
    employee: Employee;
}