import type { IPortalAdapter } from '../../types/portalAdapters';
import type { JobOffer } from '../../types/offers';

export class LinkedInPortalAdapter implements IPortalAdapter {
  portalName = 'LinkedIn';
  region = 'Global';
  icon = 'Linkedin';
  defaultUrl = 'https://linkedin.com/jobs';
  description = 'Red profesional global con alertas de empleo personalizadas.';

  canHandle(portalNameOrUrl: string): boolean {
    return portalNameOrUrl.toLowerCase().includes('linkedin');
  }

  async extractOffers(accountUser: string): Promise<Partial<JobOffer>[]> {
    // Not implemented: no real integration exists (needs backend/API). Returns nothing instead of fake offers.
    void accountUser;
    return [];
  }
}

export class UNjobsPortalAdapter implements IPortalAdapter {
  portalName = 'UNjobs';
  region = 'Global / ONU';
  icon = 'Globe';
  defaultUrl = 'https://unjobs.org';
  description = 'Portales oficiales del Sistema de Naciones Unidas y ONGs.';

  canHandle(portalNameOrUrl: string): boolean {
    return portalNameOrUrl.toLowerCase().includes('unjobs') || portalNameOrUrl.toLowerCase().includes('unep');
  }

  async extractOffers(accountUser: string): Promise<Partial<JobOffer>[]> {
    // Not implemented: no real integration exists (needs backend/API). Returns nothing instead of fake offers.
    void accountUser;
    return [];
  }
}

export class GreenJobsPortalAdapter implements IPortalAdapter {
  portalName = 'GreenJobs Global';
  region = 'Europa & Global';
  icon = 'Leaf';
  defaultUrl = 'https://www.greenjobs.de';
  description = 'Bolsa de empleo especializada en medio ambiente, clima y energía.';

  canHandle(portalNameOrUrl: string): boolean {
    return portalNameOrUrl.toLowerCase().includes('greenjobs');
  }

  async extractOffers(accountUser: string): Promise<Partial<JobOffer>[]> {
    // Not implemented: no real integration exists (needs backend/API). Returns nothing instead of fake offers.
    void accountUser;
    return [];
  }
}

export class PersonioPortalAdapter implements IPortalAdapter {
  portalName = 'Personio ATS Global';
  region = 'Europa (DACH / Alemania / UE)';
  icon = 'Cpu';
  defaultUrl = 'https://agora-thinktanks.jobs.personio.com';
  description = 'Portal ATS de empleo para think tanks y centros de investigación europeos (Agora Energiewende, Agora Agrar).';

  canHandle(portalNameOrUrl: string): boolean {
    const lower = portalNameOrUrl.toLowerCase();
    return lower.includes('personio') || lower.includes('agora-thinktanks');
  }

  async extractOffers(accountUser: string): Promise<Partial<JobOffer>[]> {
    // Not implemented: no real integration exists (needs backend/API). Returns nothing instead of fake offers.
    void accountUser;
    return [];
  }
}

export class DevNetJobsPortalAdapter implements IPortalAdapter {
  portalName = 'DevNetJobs';
  region = 'Global / Desarrollo Internacional';
  icon = 'Globe';
  defaultUrl = 'https://www.devnetjobs.org';
  description = 'Red internacional de ofertas de empleo en cooperación, desarrollo y clima.';

  canHandle(portalNameOrUrl: string): boolean {
    return portalNameOrUrl.toLowerCase().includes('devnetjobs');
  }

  async extractOffers(accountUser: string): Promise<Partial<JobOffer>[]> {
    // Not implemented: no real integration exists (needs backend/API). Returns nothing instead of fake offers.
    void accountUser;
    return [];
  }
}

/**
 * Open/Closed Registry for Portal Adapters
 */
export class PortalAdapterRegistry {
  private static adapters: IPortalAdapter[] = [
    new LinkedInPortalAdapter(),
    new UNjobsPortalAdapter(),
    new GreenJobsPortalAdapter(),
    new PersonioPortalAdapter(),
    new DevNetJobsPortalAdapter()
  ];

  /**
   * Register a new portal adapter (Extensibility point without mutating existing code)
   */
  static registerAdapter(adapter: IPortalAdapter): void {
    const exists = this.adapters.some(a => a.portalName.toLowerCase() === adapter.portalName.toLowerCase());
    if (!exists) {
      this.adapters.push(adapter);
    }
  }

  static getAdapters(): IPortalAdapter[] {
    return this.adapters;
  }

  static findAdapter(portalNameOrUrl: string): IPortalAdapter | undefined {
    return this.adapters.find(a => a.canHandle(portalNameOrUrl));
  }
}
