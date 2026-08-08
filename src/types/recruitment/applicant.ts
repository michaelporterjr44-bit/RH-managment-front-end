import { Campagne } from "./campaign";
import { Niveau } from "./canalNivau";
import { Decision, PostulantStatus } from "./postulant.enums";

export interface Postulant {
    id: string;

    nom: string;
    prenom: string;

    email?: string;

    decision: Decision;

    observation: string;

    note: number;

    niveau: Niveau;

    niveau_id: number;

    campagne: Campagne;

    statue: PostulantStatus;

    tel?: string;

    cv?: CvPostulant | null;
}

export interface CvPostulant {
    id: string;
    name: string;
    url: string;
    publicId: string;
}

export interface PostulantResponse {
    content: Postulant[];

    page: number;
    size: number;

    totalPages: number;
    totalElements: number;

    first: boolean;
    last: boolean;
}

export interface PostulantCounts {
    all: number;
    validate: number;
    rejected: number;
    hired: number;
}

export interface PaginatedPostulantResponse {
    content: Postulant[];

    page: number;
    size: number;

    totalPages: number;
    totalElements: number;

    first: boolean;
    last: boolean;

    counts: PostulantCounts;
}

export interface CreatePostulantDTO {
    nom: string;
    prenom: string;
    email: string;
    observation?: string;
    note?: number;
    decision?: Decision;

    niveau: {
        id: number;
    };

    campagne: {
        id: string;
    };
}

export interface UpdatePostulantDTO {
    nom?: string;
    prenom?: string;
    email?: string;
    observation?: string;
    note?: number;
    decision?: Decision;
    niveau?: {
        id: number;
    };
}