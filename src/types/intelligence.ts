export interface IntelligenceMetrics {
  totalOffersScouted: number;
  activeCandidatures: number;
  totalSubmissions: number;
  interviewsScheduled: number;
  responseRatePercent: number; // Submissions that led to interviews
  averageMatchScore: number;
  topPerformingCVTemplate: string;
  topPerformingSource: string;
  bilbaoOffersCount: number;
  offersBySource: { sourceName: string; count: number; avgScore: number }[];
  candidaturesByStage: { stage: number; label: string; count: number }[];
  cvPerformance: { templateId: string; templateName: string; usedCount: number; interviewCount: number; conversionRate: number }[];
}

export interface StrategyChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}

/**
 * Job Wingman - Intelligence Models
 * Modelos para inteligencia interpersonal, perfil de líderes de contratación y dossiers de abordaje.
 */
export interface TargetLeadProfile {
  name: string;
  titleHonorific?: string; // e.g. "Prof. Dr."
  role: string; // e.g. "Head of Working Group / PI"
  institution?: string;
  email?: string;
  keyPublications?: string[];
  researchFocus?: string[];
  styleNotes?: string; // Tono, exigencia científica, pragmatismo
  knownProjects?: string[];
}

export interface ColdApproachEmail {
  subjectDe: string;
  bodyDe: string;
  subjectEn: string;
  bodyEn: string;
}

export interface JobDossier {
  id: string;
  offerId?: string;
  targetCompany: string;
  projectTitle: string;
  leadProfile: TargetLeadProfile;
  projectPainPoints: string[];
  technicalHooks: string[];
  candidateValueThesis: string;
  coverLetterAngles: string[];
  /** Qué priorizar/omitir en el CV para esta vacante según lo entendido del supervisor */
  cvGuidance: string[];
  coldApproachEmail: ColdApproachEmail;
  createdAt: string;
  notes?: string;
}

