import { Employee } from "../employee/employee";

export interface Department {
    id: number;
    code: string;
    libelle: string;
    type: string;
}

export interface DepartmentDetail extends Department {
    employees?: Employee[];
}

export interface DepartmentUI {
    id: number;
    code: string;
    libelle: string;
    type: string;
    employees?: Employee[];
}

export interface CreateDepartmentRequest {
    code: string;
    libelle: string;
    type: string;
}

export interface UpdateDepartmentRequest {
    code: string;
    libelle: string;
    type: string;
}

export type DepartmentType = 'Salarié' | 'Autre';

export const DEPARTMENT_TYPES: DepartmentType[] = ['Salarié', 'Autre'];