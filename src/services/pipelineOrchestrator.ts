import type { JobOffer } from '../types/offers';
import type { ApplicationItem } from '../types/applications';
import type { 
  IProfileRepository, 
  IOfferRepository, 
  ICompanyRepository, 
  IApplicationRepository 
} from '../types/repositories';
import { 
  LocalStorageProfileRepository, 
  LocalStorageOfferRepository, 
  LocalStorageCompanyRepository, 
  LocalStorageApplicationRepository 
} from './repositories/localStorageRepositories';
import { calculateMatchScore } from './matchEngine';
import { syncConnectedPortalAccounts } from './portalIntegrationEngine';
import { OfferVerificationService, type IOfferVerifier } from './offerVerificationService';
import { CompanyIntelligenceService, type IIntelligenceService } from './companyIntelligenceService';
import { BatchApplicationService, type IBatchApplicationService } from './batchApplicationService';

export interface PipelineProgressStatus {
  step: 'search' | 'verify' | 'enrich' | 'prepare_batch' | 'completed';
  percent: number;
  message: string;
  offersFoundCount: number;
  offersVerifiedCount: number;
  batchPreparedCount: number;
}

export interface PipelineOrchestratorOptions {
  batchSize?: number; // Configurable batch size (e.g. 5, 10, 25, 100)
  minMatchScore?: number; // e.g. 55 or 65
}

export interface PipelineOrchestratorResult {
  allOffers: JobOffer[];
  verifiedOffers: JobOffer[];
  batchApplications: ApplicationItem[];
  summary: string;
}

/**
 * PipelineOrchestrator (SOLID Enterprise Orchestrator with Dependency Inversion)
 * Decoupled high-level workflow engine accepting injected repositories, verifiers, and options.
 */
export class PipelineOrchestrator {
  private profileRepo: IProfileRepository;
  private offerRepo: IOfferRepository;
  private companyRepo: ICompanyRepository;
  private verifier: IOfferVerifier;
  private intelligence: IIntelligenceService;
  private batchService: IBatchApplicationService;

  constructor(
    profileRepo?: IProfileRepository,
    offerRepo?: IOfferRepository,
    companyRepo?: ICompanyRepository,
    appRepo?: IApplicationRepository,
    verifier?: IOfferVerifier,
    intelligence?: IIntelligenceService,
    batchService?: IBatchApplicationService
  ) {
    const defaultAppRepo = appRepo || new LocalStorageApplicationRepository();
    const defaultProfileRepo = profileRepo || new LocalStorageProfileRepository();

    this.profileRepo = defaultProfileRepo;
    this.offerRepo = offerRepo || new LocalStorageOfferRepository();
    this.companyRepo = companyRepo || new LocalStorageCompanyRepository();
    this.verifier = verifier || new OfferVerificationService();
    this.intelligence = intelligence || new CompanyIntelligenceService();
    this.batchService = batchService || new BatchApplicationService(defaultAppRepo, defaultProfileRepo);
  }

  /**
   * Run the complete 5-step SOLID pipeline.
   */
  async runPipeline(
    options: PipelineOrchestratorOptions = {},
    onProgress?: (status: PipelineProgressStatus) => void
  ): Promise<PipelineOrchestratorResult> {
    const batchSize = options.batchSize || 10;
    const minMatchScore = options.minMatchScore || 55;

    const profile = this.profileRepo.getProfile();

    // -------------------------------------------------------------
    // Step 1: Multi-Source Search & Portal Sync
    // -------------------------------------------------------------
    onProgress?.({
      step: 'search',
      percent: 20,
      message: 'Escaneando fuentes y portales registrados...',
      offersFoundCount: 0,
      offersVerifiedCount: 0,
      batchPreparedCount: 0
    });

    await syncConnectedPortalAccounts();

    const rawOffers = this.offerRepo.getOffers();

    // Re-score against profile & filter by score threshold
    const filteredOffers = rawOffers.map(offer => ({
      ...offer,
      matchScore: calculateMatchScore(offer, profile)
    })).filter(offer => offer.matchScore.totalScore >= minMatchScore);

    // -------------------------------------------------------------
    // Step 2: Verification (Strict No False Positives)
    // -------------------------------------------------------------
    onProgress?.({
      step: 'verify',
      percent: 45,
      message: 'Verificando enlaces de forma estricta...',
      offersFoundCount: filteredOffers.length,
      offersVerifiedCount: 0,
      batchPreparedCount: 0
    });

    const verifiedOffers = await this.verifier.verifyOffersBatch(filteredOffers);
    const validOffers = verifiedOffers.filter(o => o.isVerified || o.verificationStatus === 'Pendiente de Verificación Manual');

    // -------------------------------------------------------------
    // Step 3: Company Intelligence & Personal Fit Breakdown
    // -------------------------------------------------------------
    onProgress?.({
      step: 'enrich',
      percent: 70,
      message: 'Extrayendo inteligencia de empresas e hiper-personalizando requisitos...',
      offersFoundCount: filteredOffers.length,
      offersVerifiedCount: validOffers.length,
      batchPreparedCount: 0
    });

    const enrichedOffers = validOffers.map(offer => {
      const enrichment = this.intelligence.enrichOffer(offer, profile, this.companyRepo);
      return {
        ...offer,
        companyEnrichment: enrichment.companyEnrichment,
        personalFitDetails: enrichment.personalFitDetails
      };
    });

    this.offerRepo.saveOffers(enrichedOffers);

    // -------------------------------------------------------------
    // Step 4: Configurable Batch Application Prep (CV & Cover Letter)
    // -------------------------------------------------------------
    onProgress?.({
      step: 'prepare_batch',
      percent: 90,
      message: `Generando adaptaciones en lote (${batchSize} ofertas prioritarias)...`,
      offersFoundCount: filteredOffers.length,
      offersVerifiedCount: validOffers.length,
      batchPreparedCount: 0
    });

    // Sort by match score and apply configurable batch size limit
    const topOffers = [...enrichedOffers]
      .sort((a, b) => b.matchScore.totalScore - a.matchScore.totalScore)
      .slice(0, batchSize);

    const batchApplications = await this.batchService.prepareBatchDrafts(topOffers);

    onProgress?.({
      step: 'completed',
      percent: 100,
      message: 'Pipeline SOLID ejecutado con éxito. Lote preparado para revisión.',
      offersFoundCount: filteredOffers.length,
      offersVerifiedCount: validOffers.length,
      batchPreparedCount: batchApplications.length
    });

    return {
      allOffers: enrichedOffers,
      verifiedOffers: validOffers,
      batchApplications,
      summary: `Procesadas ${filteredOffers.length} ofertas. Verificadas ${validOffers.length} vacantes. Preparados ${batchApplications.length} borradores de postulación.`
    };
  }

  // Backwards compatibility static runner
  static async runCompletePipeline(
    onProgress?: (status: PipelineProgressStatus) => void,
    options?: PipelineOrchestratorOptions
  ): Promise<PipelineOrchestratorResult> {
    return new PipelineOrchestrator().runPipeline(options, onProgress);
  }
}
