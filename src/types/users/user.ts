import { AgenceDto, Employee, ImageProfilDto } from "../employee/employee";
import { Agence } from "../recruitment/agency";
import { ImageProfil } from "./imageProfil";
import { RoleDto } from "./role";

export interface AppUser {
  id: string; // UUID → string
  matricule: string;
  email: string;
  password?: string; // en WRITE_ONLY côté backend → à ne pas exposer côté front
  lastName: string;
  firstName: string;

  imageProfil?: ImageProfil | null;
  agence: Agence;
  appRoles: AppRole[];
  employee?: Employee;
}

export interface AppRole {
  id: number;
  roleName: string;
}

export interface CreateUserDto {
  matricule: string;
  email: string;
  password: string;
  lastName: string;
  firstName: string;

  employeeId?: string | null;

  agenceId: number;

  roleIds: number[];

  imageProfilUrl?: string | null;
}

export interface UserResponseDto {
  matricule: string;
  email: string;
  password: string;
  lastName: string;
  firstName: string;

  employeeId?: string | null;

  agenceDto: AgenceDto;

  roleDtos: RoleDto[];

  imageProfilDto?: ImageProfilDto | null;
}

export type TabType = 'management' | 'users' | 'canaux-niveaux';
export type TabTypeSettings = 'departement' | 'canaux-niveaux';