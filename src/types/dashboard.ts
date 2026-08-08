export interface PieChartDTO {
    label: string;
    value: number;
}

export interface LeaveEvolutionDTO {

    mois: string;

    demandes: number;

}

export interface BarChartDTO {
    label: string;
    value: number;
}

export interface EvolutionDTO {

    mois: string;

    recrutements: number;

    departs: number;

    effectif: number;

}

export interface EmployeeDashboard {
    nouveauxCeMois: number;
    ancienneteMoyenne: number;
    soldeMoyenConge: number;
    nombreDepartements: number;
    nombreAgences: number;
    evolutionNouveauxEmployes: number;
    evolutionAnciennete: number;
    evolutionSoldeConge: number;
    parDepartement: BarChartDTO[];
    parAgence: BarChartDTO[];
    parSexe: PieChartDTO[];
    parContrat: PieChartDTO[];
    parStatut: PieChartDTO[];
}

export interface RecruitmentDashboard {

    campagnesActives: number;

    totalPostulants: number;

    candidatsRecrutes: number;

    entretiensProgrammes: number;

    evolutionPostulants: number;

    evolutionRecrutements: number;

    tauxConversion: number;

    evolutionCampagnes: number;

    evolution: RecruitmentEvolutionDTO[];

    postulantsParStatut: PieChartDTO[];

    postulantsParNiveau: PieChartDTO[];

    recrutementParAgence: BarChartDTO[];

}

export interface LeaveDashboard {

    employesEnConge: number;

    demandesEnAttente: number;

    congesValides: number;

    congesRefuses: number;

    soldeMoyenRestant: number;

    evolutionEmployesEnConge: number;

    evolutionDemandesEnAttente: number;

    evolutionCongesValides: number;

    evolutionCongesRefuses: number;

    evolutionSoldeMoyen: number;

    evolution: LeaveEvolutionDTO[];

    congesParStatut: PieChartDTO[];

    congesParDepartement: BarChartDTO[];

}

export interface SmartCards {

    departementPlusEmployes: string | null;

    nombreEmployesDepartement: number | null;

    agencePlusEmployes: string | null;

    nombreEmployesAgence: number | null;

    departementQuiRecrute: string | null;

    nombreRecrutements: number | null;

    departementPlusConges: string | null;

    nombreConges: number | null;

    recrutesCeMois: number;

    preavis: number;

}

export interface DashboardResponse {

    overview: OverviewDTO;

    employee: EmployeeDashboard;

    recruitment: RecruitmentDashboard;

    leave: LeaveDashboard;

    smartCards: SmartCards;

}


export interface OverviewDTO {

    effectifTotal: number;

    employesActifs: number;

    employesEnConge: number;

    demandesEnAttente: number;

    campagnesActives: number;

    totalPostulants: number;

    tauxRecrutement: number;

    tauxDemission: number;

    preavisEnCours: number;

    // Nouveaux indicateurs

    /**
     * Évolution de l'effectif par rapport au mois précédent (%)
     */
    evolutionEffectif: number;

    /**
     * Pourcentage d'employés actifs sur l'effectif total (%)
     */
    pourcentageEmployesActifs: number;

    /**
     * Évolution du nombre de postulants par rapport au mois précédent (%)
     */
    evolutionPostulants: number;

    /**
     * Évolution du taux de recrutement (%)
     */
    evolutionTauxRecrutement: number;

    /**
     * Évolution du taux de démission (%)
     */
    evolutionTauxDemission: number;

    effectifEvolution: EvolutionDTO[];
}

export interface RecruitmentEvolutionDTO {

    mois: string;

    postulants: number;

    recrutes: number;

}