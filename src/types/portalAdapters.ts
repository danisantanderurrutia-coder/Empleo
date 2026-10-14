import type { JobOffer } from './offers';
import type { EnrichedCompanyInfo } from '../services/companyIntelligenceService';

export interface IPortalAdapter {
  portalName: string;
  region: string;
  icon: string;
  defaultUrl: string;
  description: string;

  /**
   * Determine whether this adapter handles the target URL or portal name.
   */
  canHandle(portalNameOrUrl: string): boolean;

  /**
   * Extract or generate candidate offers from this portal source.
   */
  extractOffers(accountUser: string, alertUrl?: string): Promise<Partial<JobOffer>[]>;

  /**
   * Optional custom company enrichment specific to this portal.
   */
  enrichCompany?(companyName: string, rawDescription: string): Partial<EnrichedCompanyInfo>;
}
