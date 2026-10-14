import type { MasterProfile } from './profile';
import type { JobOffer } from './offers';
import type { CompanyDossier } from './companies';
import type { ApplicationItem } from './applications';

export interface IProfileRepository {
  getProfile(): MasterProfile;
  saveProfile(profile: MasterProfile): void;
}

export interface IOfferRepository {
  getOffers(): JobOffer[];
  saveOffers(offers: JobOffer[]): void;
  getOfferById(id: string): JobOffer | undefined;
}

export interface ICompanyRepository {
  getCompanies(): CompanyDossier[];
  saveCompanies(companies: CompanyDossier[]): void;
  getCompanyByName(name: string): CompanyDossier | undefined;
}

export interface IApplicationRepository {
  getApplications(): ApplicationItem[];
  saveApplications(applications: ApplicationItem[]): void;
  getApplicationById(id: string): ApplicationItem | undefined;
}
