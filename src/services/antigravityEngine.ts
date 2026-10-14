import type { MasterProfile, WorkExperience, Education, SkillItem, LanguageItem, Achievement } from '../types/profile';
import type { JobOffer } from '../types/offers';
import type { CompanyDossier } from '../types/companies';
import { cleanExtractedText } from './pdfExtractor';
import { calculateMatchScore } from './matchEngine';

export interface AntigravityParseResult {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experiences: WorkExperience[];
  education: Education[];
  skills: SkillItem[];
  languages: LanguageItem[];
  achievements: Achievement[];
  extractedCount: number;
}


/**
 * Heuristic CV text parser (regex only, NO AI). Extracts only what is literally found
 * in the text (email, phone, name guess, summary). Everything else is left empty so the
 * user must review/complete it: no fields are invented.
 */
export const parseCVWithAntigravity = (rawText: string): AntigravityParseResult => {
  const text = cleanExtractedText(rawText);

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = text.match(/(\+\d{1,4})?[\s-]?(\(?\d{2,4}\)?[\s-]?){2,4}\d{2,4}/);
  const nameLine = lines.find(l => l.length < 40 && !l.includes('@') && !l.includes('http') && !/\d/.test(l));

  const fullName = nameLine || '';
  const email = emailMatch ? emailMatch[0] : '';
  const phone = phoneMatch ? phoneMatch[0].trim() : '';
  const summary = text.substring(0, 350).trim();
  const extractedCount = [fullName, email, phone, summary].filter(Boolean).length;

  return {
    fullName,
    email,
    phone,
    location: '',
    summary,
    experiences: [],
    education: [],
    skills: [],
    languages: [],
    achievements: [],
    extractedCount
  };
};

/**
 * Builds a JobOffer from manually provided text. Fields not present in the input
 * (salary, requirements, real URL) are left empty instead of being invented.
 */
export const analyzeOfferWithAntigravity = (titleInput: string, companyInput: string, rawText: string, profile: MasterProfile): JobOffer => {
  const lowerText = rawText.toLowerCase();
  const isBilbao = lowerText.includes('bilbao') || lowerText.includes('bizkaia');
  const isRemote = lowerText.includes('remoto') || lowerText.includes('remote');

  const offerId = `off-ag-${Date.now()}`;
  const partialOffer: Partial<JobOffer> = {
    id: offerId,
    title: titleInput || 'Sin título',
    company: companyInput || 'Sin empresa',
    location: isBilbao ? 'Bilbao, Bizkaia' : isRemote ? 'Remoto' : 'No especificada',
    isBilbaoLocation: isBilbao,
    isRemote,
    url: '',
    sourceId: 'src-manual',
    sourceName: 'Entrada manual',
    publishedDate: new Date().toISOString().split('T')[0],
    rawDescription: rawText,
    requirements: [],
    responsibilities: [],
    status: 'Nueva',
    extractedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
  };

  const matchScore = calculateMatchScore(partialOffer, profile);

  return {
    ...partialOffer,
    matchScore
  } as JobOffer;
};

/**
 * Creates an EMPTY company dossier with only the data the user typed.
 * No research is performed: sector, size, news, culture, etc. are not invented.
 */
export const researchCompanyWithAntigravity = (name: string, website: string): CompanyDossier => {
  const timestamp = new Date().toISOString().split('T')[0];

  return {
    id: `comp-ag-${Date.now()}`,
    name: name || 'Sin nombre',
    website: website || '',
    sector: '',
    size: '',
    headquarters: '',
    description: '',
    keyProjects: [],
    recentNews: [],
    workCulture: [],
    redFlags: [],
    interviewArguments: [],
    lastResearched: timestamp
  };
};

/**
 * NOT IMPLEMENTED: scraping a source requires a backend (CORS). This no longer
 * fabricates offers; it always reports 0 new offers.
 */
export const scoutSourceWithAntigravity = (
  _sourceUrl: string,
  _sourceName: string
): { newOffers: JobOffer[]; newCount: number; totalSourceOffersCount: number } => {
  return { newOffers: [], newCount: 0, totalSourceOffersCount: 0 };
};

export interface ExploreResult {
  category: 'sources' | 'companies' | 'offers' | 'profile';
  summary: string;
  addedSourcesCount: number;
  addedCompaniesCount: number;
  addedOffersCount: number;
  items: { title: string; subtitle: string; tag: string }[];
}

/**
 * NOT IMPLEMENTED: there is no AI/search backend. This no longer fabricates sources,
 * companies or offers; it only reports that nothing was added.
 */
export const exploreAndIncorporateWithAntigravity = (
  _promptText: string,
  category: 'sources' | 'companies' | 'offers' | 'profile' | 'auto' = 'auto'
): ExploreResult => {
  return {
    category: category === 'auto' ? 'sources' : category,
    summary: 'Función no disponible: la app no tiene IA ni backend de búsqueda, así que no se ha añadido nada. Añade fuentes, empresas y ofertas manualmente.',
    addedSourcesCount: 0,
    addedCompaniesCount: 0,
    addedOffersCount: 0,
    items: []
  };
};
