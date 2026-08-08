import { Agence } from "./agency";
import { Canal } from "./channels";

export interface Campagne {
    id: string;
    ref: string;
    dateDebut: string;
    dateFin: string;
    etat: EtatCampagne;
    statuCampagne: 'Test' | 'Entretien' | 'Validation' | 'Recruté';
    description: string;
    canal: Canal[];
    agenceCode: Agence['code'][];
}

export enum EtatCampagne {
    NOUVEAU = "NOUVEAU",
    EN_COURS = "EN_COURS",
    CLOTURE = "CLOTURE"
}

export interface CampagneAdded {
    ref: string;
    dateDebut: string;
    dateFin: string;
    etat: string;
    agenceCode: string;
    description: string;
    canal: { id: number }[];
}

export interface CampagneResponse {
    content: Campagne[];
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
    isFirst: boolean;
    isLast: boolean;
}
