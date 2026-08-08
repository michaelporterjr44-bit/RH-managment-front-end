// Données RH agrégées, cohérentes avec les entités :
// Employee, Department, Agence, DemandeConge, SoldeConge, Campagne, Postulant.
// Les valeurs sont pré-calculées pour alimenter les KPI et graphiques du dashboard.

export type Trend = { value: number; positif: boolean }

/* ------------------------------------------------------------------ */
/* Vue d'ensemble                                                      */
/* ------------------------------------------------------------------ */

export const overviewKpis = {
  effectifTotal: 1284,
  employesActifs: 1197,
  employesEnConge: 63,
  demandesEnAttente: 24,
  campagnesActives: 7,
  totalPostulants: 486,
  tauxRecrutement: 9.4, // %
  tauxDemission: 4.1, // %
  preavisEnCours: 11,
}

// Évolution de l'effectif sur 12 mois
export const effectifEvolution = [
  { mois: 'Janv', recrutements: 18, departs: 9, effectif: 1180 },
  { mois: 'Févr', recrutements: 22, departs: 11, effectif: 1191 },
  { mois: 'Mars', recrutements: 15, departs: 14, effectif: 1192 },
  { mois: 'Avr', recrutements: 27, departs: 8, effectif: 1211 },
  { mois: 'Mai', recrutements: 19, departs: 12, effectif: 1218 },
  { mois: 'Juin', recrutements: 24, departs: 10, effectif: 1232 },
  { mois: 'Juil', recrutements: 16, departs: 15, effectif: 1233 },
  { mois: 'Août', recrutements: 12, departs: 7, effectif: 1238 },
  { mois: 'Sept', recrutements: 29, departs: 13, effectif: 1254 },
  { mois: 'Oct', recrutements: 21, departs: 9, effectif: 1266 },
  { mois: 'Nov', recrutements: 17, departs: 11, effectif: 1272 },
  { mois: 'Déc', recrutements: 23, departs: 11, effectif: 1284 },
]

/* ------------------------------------------------------------------ */
/* Module Employés                                                     */
/* ------------------------------------------------------------------ */

export const employeKpis = {
  nouveauxCeMois: 23,
  ancienneteMoyenne: 4.6, // années
  soldeMoyenConge: 18.3, // jours
  nombreDepartements: 6,
  nombreAgences: 4,
}

export const parDepartement = [
  { departement: 'Opérations', employes: 312 },
  { departement: 'Commercial', employes: 268 },
  { departement: 'Informatique', employes: 214 },
  { departement: 'Finance', employes: 176 },
  { departement: 'Marketing', employes: 168 },
  { departement: 'Ress. Humaines', employes: 146 },
]

export const parAgence = [
  { agence: 'Antananarivo', employes: 548 },
  { agence: 'Toamasina', employes: 312 },
  { agence: 'Mahajanga', employes: 244 },
  { agence: 'Fianarantsoa', employes: 180 },
]

export const parSexe = [
  { sexe: 'Hommes', valeur: 702 },
  { sexe: 'Femmes', valeur: 582 },
]

export const parContrat = [
  { contrat: 'CDI', valeur: 864 },
  { contrat: 'CDD', valeur: 258 },
  { contrat: 'Stage', valeur: 96 },
  { contrat: 'Freelance', valeur: 66 },
]

export const parStatut = [
  { statut: 'Actif', valeur: 1197 },
  { statut: 'En congé', valeur: 63 },
  { statut: 'Préavis', valeur: 11 },
  { statut: 'Suspendu', valeur: 13 },
]

/* ------------------------------------------------------------------ */
/* Module Recrutement                                                  */
/* ------------------------------------------------------------------ */

export const recrutementKpis = {
  campagnesActives: 7,
  totalPostulants: 486,
  entretiensProgrammes: 58,
  candidatsRecrutes: 42,
}

export const recrutementEvolution = [
  { mois: 'Janv', postulants: 32, recrutes: 4 },
  { mois: 'Févr', postulants: 41, recrutes: 6 },
  { mois: 'Mars', postulants: 28, recrutes: 3 },
  { mois: 'Avr', postulants: 54, recrutes: 7 },
  { mois: 'Mai', postulants: 39, recrutes: 5 },
  { mois: 'Juin', postulants: 47, recrutes: 6 },
  { mois: 'Juil', postulants: 35, recrutes: 4 },
  { mois: 'Août', postulants: 26, recrutes: 2 },
  { mois: 'Sept', postulants: 58, recrutes: 8 },
  { mois: 'Oct', postulants: 44, recrutes: 5 },
  { mois: 'Nov', postulants: 31, recrutes: 3 },
  { mois: 'Déc', postulants: 51, recrutes: 6 },
]

export const postulantsParStatut = [
  { statut: 'Nouveau', valeur: 168 },
  { statut: 'Présélection', valeur: 124 },
  { statut: 'Entretien', valeur: 92 },
  { statut: 'Offre', valeur: 60 },
  { statut: 'Recruté', valeur: 42 },
]

export const postulantsParNiveau = [
  { niveau: 'Bac', valeur: 64 },
  { niveau: 'Bac+2', valeur: 138 },
  { niveau: 'Licence', valeur: 152 },
  { niveau: 'Master', valeur: 108 },
  { niveau: 'Doctorat', valeur: 24 },
]

export const recrutementParAgence = [
  { agence: 'Antananarivo', valeur: 21 },
  { agence: 'Toamasina', valeur: 9 },
  { agence: 'Mahajanga', valeur: 7 },
  { agence: 'Fianarantsoa', valeur: 5 },
]

/* ------------------------------------------------------------------ */
/* Module Congés                                                       */
/* ------------------------------------------------------------------ */

export const congeKpis = {
  employesEnConge: 63,
  demandesEnAttente: 24,
  congesValides: 342,
  congesRefuses: 38,
  soldeMoyenRestant: 18.3, // jours
}

export const congesEvolution = [
  { mois: 'Janv', demandes: 28 },
  { mois: 'Févr', demandes: 24 },
  { mois: 'Mars', demandes: 31 },
  { mois: 'Avr', demandes: 42 },
  { mois: 'Mai', demandes: 38 },
  { mois: 'Juin', demandes: 47 },
  { mois: 'Juil', demandes: 68 },
  { mois: 'Août', demandes: 74 },
  { mois: 'Sept', demandes: 36 },
  { mois: 'Oct', demandes: 29 },
  { mois: 'Nov', demandes: 33 },
  { mois: 'Déc', demandes: 58 },
]

export const congesParStatut = [
  { statut: 'Validé', valeur: 342 },
  { statut: 'En attente', valeur: 24 },
  { statut: 'Refusé', valeur: 38 },
]

export const congesParDepartement = [
  { departement: 'Opérations', valeur: 96 },
  { departement: 'Commercial', valeur: 78 },
  { departement: 'Informatique', valeur: 61 },
  { departement: 'Finance', valeur: 44 },
  { departement: 'Marketing', valeur: 39 },
  { departement: 'Ress. Humaines', valeur: 24 },
]

/* ------------------------------------------------------------------ */
/* Cartes RH intelligentes                                             */
/* ------------------------------------------------------------------ */

export const cartesIntelligentes = {
  departementPlusEmployes: { nom: 'Opérations', valeur: 312 },
  agencePlusEmployes: { nom: 'Antananarivo', valeur: 548 },
  departementRecrutantPlus: { nom: 'Informatique', valeur: 14 },
  departementPlusConges: { nom: 'Opérations', valeur: 96 },
  recrutesCeMois: { valeur: 23 },
  preavis: { valeur: 11 },
}
