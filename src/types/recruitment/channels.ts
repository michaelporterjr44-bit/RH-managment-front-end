export interface Canal {
    id: number;
    nom: string;
}

export interface CanalResponse {
    content: Canal[];
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
    isFirst: boolean;
    isLast: boolean;
}