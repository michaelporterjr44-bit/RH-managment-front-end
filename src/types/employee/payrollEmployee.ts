import { Employee } from "./employee";

export interface PayrollEmployee extends Employee {
  baseSalary: number;
  netToPay: number;
  payrollStatus: "Validé" | "En cours";
}