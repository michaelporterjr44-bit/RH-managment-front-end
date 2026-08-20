import { CodeBank } from "./codeBank";
import { Employee } from "../employee/employee";
import { EmployeeDto } from "../employee/EmployeeDto";
import { CodeBankDto } from "./codeBank";

export interface Account {
    id: string;

    codeBank: CodeBank;

    accountNumber: string;

    employee: Employee;
}

export interface CreateAccountDto {
    employeeId: string;

    codeBankId: string;

    accountNumber: string;
}

export interface UpdateAccountDto {
    codeBankId?: string;

    accountNumber?: string;
}

export interface AccountDTO {
    id: string;

    accountNumber: string;

    employee: EmployeeDto;

    codeBank: CodeBankDto;
}