export interface MatchScoreBreakdown {
  totalScore: number; // 0 - 100
  skillFitScore: number; // 0 - 35
  locationScore: number; // 0 - 25 (Bilbao bonus)
  salaryScore: number; // 0 - 15
  experienceScore: number; // 0 - 15
  companyQualityScore: number; // 0 - 10
  rationale: string[]; // List of detailed reasons for score
  matchingSkills: string[];
  missingSkills: string[];
  pendingVerificationRequirements: string[]; // Strict guardrail list
}

export type SupportedCountry =
  | 'España'
  | 'Dinamarca'
  | 'Alemania'
  | 'Suecia'
  | 'Noruega'
  | 'Suiza'
  | 'Italia'
  | 'Grecia'
  | 'Reino Unido'
  | 'Francia'
  | 'Netherlands';

/**
 * Interface Segregation Principle (ISP): Base Core Job Offer
 */
export interface BaseJobOffer {
  id: string;
  title: string;
  company: string;
  companyId?: string;
  location: string;
  country?: SupportedCountry;
  isBilbaoLocation: boolean;
  isRemote: boolean;
  url: string;
  sourceId: string;
  sourceName: string;
  publishedDate: string;
  deadline?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  rawDescription: string;
  requirements: string[];
  responsibilities: string[];
}

/**
 * Interface Segregation Principle (ISP): Verification Metadata
 */
export interface VerifiedOfferMetadata {
  isVerified?: boolean;
  verificationStatus?: 'Vigente y Verificada' | 'Pendiente' | 'Pendiente de Verificación Manual' | 'No Disponible / Caída' | 'Expirada';
  verifiedAt?: string;
  httpStatus?: number;
  verificationReason?: string;
}

/**
 * Interface Segregation Principle (ISP): Intelligence Enrichment Metadata
 */
export interface EnrichedOfferMetadata {
  companyEnrichment?: {
    sector: string;
    description: string;
    hqLocation: string;
    websiteUrl?: string;
    strategicProjects: string[];
  };
  personalFitDetails?: {
    matchingSkills: string[];
    skillGaps: string[];
    fitSummary: string;
  };
}

/**
 * Composite Full Job Offer Interface
 */
export interface JobOffer extends BaseJobOffer, VerifiedOfferMetadata, EnrichedOfferMetadata {
  matchScore: MatchScoreBreakdown;
  status: 'Nueva' | 'En Evaluación' | 'Candidatura Creada' | 'Descartada';
  extractedAt: string;
}
