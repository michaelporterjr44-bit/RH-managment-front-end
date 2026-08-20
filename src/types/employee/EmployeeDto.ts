import { ImageProfilDto } from "./employee";

export interface EmployeeDto {
    id: string;

    firstName: string;

    lastName: string;

    function?: string;

    matricule: string;

    imageProfil?: ImageProfilDto | null;
}