import { Employee } from "./employee";

export interface PayrollEmployee extends Employee {
  baseSalary: number; // Salaire de base
  netToPay: number;   // Net à payer
  status: "Validé" | "En cours"; // Statut de la paie
}