import { Employee } from "../employee/employee";

export type LeaveState = "NEW" | "VALIDE" | "REFUSE" | "ANNULE";

export type Leave = {
  id: string;
  employee: Employee;
  motif: string;
  dateDebut: string;
  dateFin: string;
  dateDeReprise?: string;
  nbreDeJour: number;
  interieur?: Employee | null;
  state: LeaveState;
  remarque?: string;
};

export type CreateLeavePayload = {
  employee: {
    id: string;
  };
  motif: string;
  dateDebut: string;
  dateFin: string;
  dateDeReprise?: string;
  interieur?: {
    id: number;
  } | null;
  remarque?: string;
};

export interface SoldeConge {
  id: number;
  employee: Employee;
  solde: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
}

export type SoldeResponse = {
  total: number;
  used: number;
  remaining: number;
};

export type ListLeavesParams = {
  page?: number;
  size?: number;
  agence?: string;
  state?: string;
  startDate?: string;
  endDate?: string;
};