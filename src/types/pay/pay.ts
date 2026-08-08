import { Employee } from "@/types/employee/employee";
import { Agence } from "@/types/employee/employee";

// --- Avance ---
export interface Avance {
  id: string;                // UUID
  amount: number;
  employee: Employee;
  periode: string;           // YearMonth → "YYYY-MM"
}

export interface Irsa {
  id: string;             // UUID
  tranche1: number;
  tranche2: number;
  tranche3: number;
  tranche4: number;
  irsaNet: number;
  employee: Employee;
  periode: string;        // YearMonth → "YYYY-MM"
}

// --- BruteSalaire ---
export interface BruteSalaire {
  id: string;
  amount: number;
  employee: Employee;
  periode: string;
}

// --- Indemnite ---
export interface Indemnite {
  id: string;
  amount: number;
  employee: Employee;
  periode: string;
}

// --- Prime ---
export interface Prime {
  id: string;
  amount: number;
  employee: Employee;
  periode: string;
}

// --- SalaireBase ---
export interface SalaireBase {
  id: string;
  baseSalaire: number;
  devise: string;
  employee: Employee;
}

// EtatCampaignPay.ts
export enum EtatCampagnePaye {
  VERIFICATION = "VERIFICATION",
  VALIDATION = "VALIDATION",
  GENERATION = "GENERATION",
}

// StatueCampaignPay.ts
export enum StatuCampagnePaye {
  EN_COURS = "EN_COURS",
  VALIDE = "VALIDÉ",
}

export enum StatusModelPaye {
  EN_COURS = "EN_COURS",
  VALIDE = "VALIDÉ",
}

// Ton modèle CampagnePay
export interface CampagnePay {
  id: string;
  name: string;
  periode: string; // ex: "2025-09"
  statu: StatuCampagnePaye;
  etat: EtatCampagnePaye;
  emailUser: string;
  dateCreation: string;
  agence: Agence; // tu peux mettre un type Agence si tu l’as déjà
}

// --- ModelPay ---
export interface ModelPay {
  id: string;
  campagnePay: CampagnePay;
  employee: Employee;
  account: Account;
  salaireBase: SalaireBase;
  prime: Prime;
  indemnite: Indemnite;
  bruteSalaire: BruteSalaire;
  cnaps: number;
  osie: number;
  baseImposable: number;
  nombreEnfant: number;
  irsa: Irsa;
  salaireNet: number;
  avance: Avance;
  netAPayer: number;
  periode: string;
  status: StatusModelPaye;
}

// --- Account (stub, à détailler si besoin) ---
export interface Account {
  id: string;
  accountNumber?: string;
  iban?: string;
  bankName?: string;
}

export interface PayrollPeriod {
    id: string;
    month: string;
    year: number;
    status: StatuCampagnePaye; // dérivé de StatueCampaignPay
    sonEtat: EtatCampagnePaye; // directement depuis etatCampaignPay
    dateGeneration: string;
    generatedBy: string;
    employeeCount: number;
    validatedCount: number;
}

export interface CreateSalaireBaseDto {
  baseSalaire: number;
  devise: string;
  employeeId: string;
}


export interface UpdateSalaireBaseDto {
    baseSalaire: number;
    devise: string;
}