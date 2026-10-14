import type { 
  IProfileRepository, 
  IOfferRepository, 
  ICompanyRepository, 
  IApplicationRepository 
} from '../../types/repositories';
import type { MasterProfile } from '../../types/profile';
import type { JobOffer } from '../../types/offers';
import type { CompanyDossier } from '../../types/companies';
import type { ApplicationItem } from '../../types/applications';
import { 
  getStoredProfile, 
  saveStoredProfile, 
  getStoredOffers, 
  saveStoredOffers, 
  getStoredCompanies, 
  saveStoredCompanies, 
  getStoredApplications, 
  saveStoredApplications 
} from '../db';

export class LocalStorageProfileRepository implements IProfileRepository {
  getProfile(): MasterProfile {
    return getStoredProfile();
  }
  saveProfile(profile: MasterProfile): void {
    saveStoredProfile(profile);
  }
}

export class LocalStorageOfferRepository implements IOfferRepository {
  getOffers(): JobOffer[] {
    return getStoredOffers();
  }
  saveOffers(offers: JobOffer[]): void {
    saveStoredOffers(offers);
  }
  getOfferById(id: string): JobOffer | undefined {
    return getStoredOffers().find(o => o.id === id);
  }
}

export class LocalStorageCompanyRepository implements ICompanyRepository {
  getCompanies(): CompanyDossier[] {
    return getStoredCompanies();
  }
  saveCompanies(companies: CompanyDossier[]): void {
    saveStoredCompanies(companies);
  }
  getCompanyByName(name: string): CompanyDossier | undefined {
    return getStoredCompanies().find(c => c.name.toLowerCase() === name.toLowerCase());
  }
}

export class LocalStorageApplicationRepository implements IApplicationRepository {
  getApplications(): ApplicationItem[] {
    return getStoredApplications();
  }
  saveApplications(applications: ApplicationItem[]): void {
    saveStoredApplications(applications);
  }
  getApplicationById(id: string): ApplicationItem | undefined {
    return getStoredApplications().find(a => a.id === id);
  }
}
