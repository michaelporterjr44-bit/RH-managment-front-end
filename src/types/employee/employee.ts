import { SoldeConge } from "../leave/leave.types";
import { ImageProfil } from "../users/imageProfil";
import { Department } from "../department/department.types";
import {
  ContractType,
  EmployeeStatus,
  Gender,
  MaritalStatus
} from "./employee.enums";


export interface Employee {
  //Identité & Informations personnelles
  id?: string;
  lastName: string;
  firstName: string;
  dateOfBirth: string;
  gender?: Gender;
  maritalStatus?: MaritalStatus;
  numberOfChildren?: string;
  address?: string;
  phoneNumber?: string;
  email: string;
  cin?: string;
  cinDate?: string;
  cinLocation?: string;

  //Informations professionnelles
  matricule: string;
  // 🔥 ICI LA CORRECTION
  department?: Department | null;
  function?: string;
  hireDate: string;
  contractType?: ContractType;
  status?: EmployeeStatus;
  superior?: string;
  agence?: Agence | null;

  //Parcours & formation
  educationLevel?: string;
  degree?: string;
  experience?: string;

  //Fin de contrat
  exitDate?: string;
  exitReason?: string;

  //
  imageProfil: ImageProfil | null;
  soldeConge?: SoldeConge
}


export interface Agence {
  id: number;
  code: string;
  name: string;
  address: string;
  contact: string;
  email: string;
}

export interface CreateEmployeeDTO {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: string;
  phoneNumber: string;

  matricule: string;
  email: string;

  departmentId: number;
  agenceId: number;

  hireDate: string;
  contractType?: ContractType;
  status?: EmployeeStatus;
  function?: string;

  cin?: string;
  cinDate?: string;
  cinLocation?: string;

  maritalStatus?: MaritalStatus;
  gender?: Gender;
  numberOfChildren?: string;

  educationLevel?: string;
  degree?: string;
  experience?: string;
}

export interface UpdateEmployeeDTO {
  lastName?: string;
  firstName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;

  matricule?: string;

  contractType?: ContractType;
  status?: EmployeeStatus;
  function?: string;

  hireDate?: string;
  dateOfBirth?: string;

  educationLevel?: string;
  degree?: string;
  experience?: string;

  numberOfChildren?: string;

  exitDate?: string;
  exitReason?: string;

  departmentId?: number | null;
  agenceId?: number | null;
}

export interface AgenceDto {
  id: number;
  code: string;
  name: string;
}

export interface ImageProfilDto {
  url: string;
}

export interface EmployeeResponse {
  id: string;

  lastName: string;
  firstName: string;
  matricule: string;
  email: string;
  phoneNumber: string;
  status: EmployeeStatus;

  department?: DepartmentDto | null;
  agence?: AgenceDto | null;
  imageProfilDto?: ImageProfilDto | null;
}


export interface EmployeeProfileResponse {
  id: string;

  matricule: string;

  firstName: string;
  lastName: string;

  email: string;
  phoneNumber: string;

  address: string;
  status: EmployeeStatus;

  hireDate: string;
  dateOfBirth: string;

  contractType: ContractType;

  educationLevel: string;
  degree: string;
  experience: string;

  exitDate: string;
  exitReason: string;

  numberOfChildren: string;

  departmentDto: DepartmentDto | null;

  agence: AgenceDto | null;

  imageProfil: ImageProfil | null;
}

export interface DepartmentDto {
  id: number;
  libelle: string;
}

export interface AgenceDto {
  id: number;
  code: string;
  name: string;
}


