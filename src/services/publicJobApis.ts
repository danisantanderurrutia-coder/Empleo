import type { JobOffer } from '../types/offers';
import { getStoredProfile } from './db';
import { calculateMatchScore } from './matchEngine';

interface RemotiveJob {
  id: number;
  url: string;
  title: string;
  company_name: string;
  category: string;
  tags?: string[];
  candidate_required_location?: string;
  salary?: string;
  description?: string;
  publication_date?: string;
}

interface ArbeitnowJob {
  slug: string;
  title: string;
  company_name: string;
  description?: string;
  remote: boolean;
  url: string;
  location: string;
  tags?: string[];
  publication_time?: number;
}

interface JobicyJob {
  id: number;
  url: string;
  jobTitle: string;
  companyName: string;
  jobGeo?: string;
  jobExcerpt?: string;
  jobDescription?: string;
  pubDate?: string;
  annualSalaryMin?: number | string | null;
  annualSalaryMax?: number | string | null;
  salaryCurrency?: string;
}

const stripHtml = (html?: string): string => {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
};

/**
 * Tokenizes and translates user search terms into English/international technical equivalents.
 */
export const mapQueryToSearchTerms = (query: string): string[] => {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const translations: Record<string, string[]> = {
    'suelo': ['soil', 'land', 'edafolog', 'agriculture'],
    'suelos': ['soil', 'land', 'edafolog', 'agriculture'],
    'clima': ['climate', 'environmental', 'carbon', 'sustainab'],
    'cambio climático': ['climate', 'carbon', 'transition', 'net zero'],
    'cambio climatico': ['climate', 'carbon', 'transition', 'net zero'],
    'gobernanza': ['governance', 'policy', 'advocacy'],
    'política': ['policy', 'governance', 'advocacy'],
    'politica': ['policy', 'governance', 'advocacy'],
    'políticas': ['policy', 'governance', 'advocacy'],
    'politicas': ['policy', 'governance', 'advocacy'],
    'geofísica': ['geophysics', 'geology', 'spatial', 'gis'],
    'geofisica': ['geophysics', 'geology', 'spatial', 'gis'],
    'teledetección': ['remote sensing', 'gis', 'spatial', 'satellite', 'earth observation'],
    'teledeteccion': ['remote sensing', 'gis', 'spatial', 'satellite', 'earth observation'],
    'cuencas': ['watershed', 'hydrolog', 'water', 'basin'],
    'hidrología': ['hydrolog', 'water', 'watershed'],
    'hidrologia': ['hydrolog', 'water', 'watershed'],
    'r': ['r', 'data', 'statistics', 'shiny'],
    'python': ['python', 'data', 'developer'],
    'gis': ['gis', 'spatial', 'qgis', 'cartography', 'arcgis'],
    'qgis': ['gis', 'spatial', 'qgis'],
    'ambiental': ['environmental', 'ecology', 'sustainab'],
    'investigación': ['research', 'scientist', 'fellow', 'postdoc'],
    'investigacion': ['research', 'scientist', 'fellow', 'postdoc'],
    'carbono': ['carbon', 'ghg', 'emissions', 'net zero']
  };

  const tokens = new Set<string>();

  for (const [key, list] of Object.entries(translations)) {
    if (q.includes(key)) {
      list.forEach(item => tokens.add(item));
    }
  }

  const words = q.split(/[\s,+/]+/).filter(w => w.length > 2);
  for (const word of words) {
    if (translations[word]) {
      translations[word].forEach(item => tokens.add(item));
    } else {
      tokens.add(word);
    }
  }

  return Array.from(tokens);
};

/**
 * Loads authentic jobs ingested by the automated Git-Scraper (`public/data/jobs.json`).
 * Hosted on the repository's own origin: 100% CORS-free and reliable.
 */
export const fetchStaticIngestedJobs = async (): Promise<JobOffer[]> => {
  try {
    const res = await fetch('./data/jobs.json');
    if (!res.ok) return [];
    const data: JobOffer[] = await res.json();
    const profile = getStoredProfile();

    return data.map(offer => ({
      ...offer,
      matchScore: calculateMatchScore(offer, profile)
    }));
  } catch (err) {
    console.warn('[PublicJobApis] Static jobs.json not available yet:', err);
    return [];
  }
};

/**
 * Fetches real job openings from Remotive Public API (CORS open).
 */
export const fetchRemotiveJobs = async (query: string = ''): Promise<JobOffer[]> => {
  try {
    const tokens = mapQueryToSearchTerms(query);
    const searchParam = tokens.length > 0 ? `&search=${encodeURIComponent(tokens[0])}` : '';
    const res = await fetch(`https://remotive.com/api/remote-jobs?limit=25${searchParam}`);
    if (!res.ok) return [];
    const data = await res.json();
    const jobs: RemotiveJob[] = data.jobs || [];
    const profile = getStoredProfile();
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const filtered = tokens.length > 0
      ? jobs.filter(j => {
          const text = `${j.title || ''} ${j.category || ''} ${(j.tags || []).join(' ')} ${stripHtml(j.description)}`.toLowerCase();
          return tokens.some(t => text.includes(t.toLowerCase()));
        })
      : jobs;

    return filtered.slice(0, 20).map(j => {
      const isRemote = true;
      const location = j.candidate_required_location || 'Remoto (Global)';
      const locLower = location.toLowerCase();
      const isBilbao = locLower.includes('bilbao') || locLower.includes('bizkaia');
      const cleanDesc = stripHtml(j.description);

      const offerPartial: Partial<JobOffer> = {
        id: `remotive-${j.id}`,
        title: j.title || 'Puesto Remoto',
        company: j.company_name || 'Empresa (Remotive)',
        location,
        isBilbaoLocation: isBilbao,
        isRemote,
        url: j.url,
        sourceId: 'src-remotive-api',
        sourceName: 'Remotive (API Pública)',
        publishedDate: j.publication_date ? j.publication_date.split('T')[0] : timestamp.split(' ')[0],
        rawDescription: cleanDesc.slice(0, 1200),
        requirements: Array.isArray(j.tags) ? j.tags.slice(0, 10) : [],
        responsibilities: [],
        status: 'Nueva',
        extractedAt: timestamp,
        isVerified: true,
        verificationStatus: 'Vigente y Verificada'
      };

      const matchScore = calculateMatchScore(offerPartial, profile);
      return {
        ...offerPartial,
        matchScore
      } as JobOffer;
    });
  } catch (err) {
    console.warn('[PublicJobApis] Error fetching Remotive jobs:', err);
    return [];
  }
};

/**
 * Fetches real job openings from Arbeitnow Public API (CORS open).
 */
export const fetchArbeitnowJobs = async (query: string = ''): Promise<JobOffer[]> => {
  try {
    const res = await fetch('https://www.arbeitnow.com/api/job-board-api');
    if (!res.ok) return [];
    const data = await res.json();
    const jobs: ArbeitnowJob[] = data.data || [];
    const profile = getStoredProfile();
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const tokens = mapQueryToSearchTerms(query);
    const filtered = tokens.length > 0
      ? jobs.filter(j => {
          const text = `${j.title || ''} ${stripHtml(j.description)} ${(j.tags || []).join(' ')} ${j.location || ''}`.toLowerCase();
          return tokens.some(t => text.includes(t.toLowerCase()));
        })
      : jobs;

    return filtered.slice(0, 25).map(j => {
      const location = j.location || (j.remote ? 'Remoto (Europa)' : 'Alemania');
      const locLower = location.toLowerCase();
      const isBilbao = locLower.includes('bilbao') || locLower.includes('bizkaia');
      const cleanDesc = stripHtml(j.description);

      const pubDate = j.publication_time
        ? new Date(j.publication_time * 1000).toISOString().split('T')[0]
        : timestamp.split(' ')[0];

      const offerPartial: Partial<JobOffer> = {
        id: `arbeitnow-${j.slug}`,
        title: j.title || 'Oferta de Empleo',
        company: j.company_name || 'Empresa (Arbeitnow)',
        location,
        country: locLower.includes('alemania') || locLower.includes('germany') ? 'Alemania' : undefined,
        isBilbaoLocation: isBilbao,
        isRemote: !!j.remote,
        url: j.url,
        sourceId: 'src-arbeitnow-api',
        sourceName: 'Arbeitnow (Alemania & Europa)',
        publishedDate: pubDate,
        rawDescription: cleanDesc.slice(0, 1200),
        requirements: Array.isArray(j.tags) ? j.tags.slice(0, 10) : [],
        responsibilities: [],
        status: 'Nueva',
        extractedAt: timestamp,
        isVerified: true,
        verificationStatus: 'Vigente y Verificada'
      };

      const matchScore = calculateMatchScore(offerPartial, profile);
      return {
        ...offerPartial,
        matchScore
      } as JobOffer;
    });
  } catch (err) {
    console.warn('[PublicJobApis] Error fetching Arbeitnow jobs:', err);
    return [];
  }
};

/**
 * Fetches real job openings from Jobicy Public API (CORS open).
 */
export const fetchJobicyJobs = async (query: string = ''): Promise<JobOffer[]> => {
  try {
    const tokens = mapQueryToSearchTerms(query);
    const count = 20;
    const tagParam = tokens.length > 0 ? `&tag=${encodeURIComponent(tokens[0])}` : '';
    const res = await fetch(`https://jobicy.com/api/v2/remote-jobs?count=${count}${tagParam}`);
    if (!res.ok) return [];
    const data = await res.json();
    const jobs: JobicyJob[] = data.jobs || [];
    const profile = getStoredProfile();
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const filtered = tokens.length > 0
      ? jobs.filter(j => {
          const text = `${j.jobTitle || ''} ${stripHtml(j.jobDescription || j.jobExcerpt)} ${j.jobGeo || ''}`.toLowerCase();
          return tokens.some(t => text.includes(t.toLowerCase()));
        })
      : jobs;

    return filtered.slice(0, 20).map(j => {
      const location = j.jobGeo || 'Remoto (Global)';
      const locLower = location.toLowerCase();
      const isBilbao = locLower.includes('bilbao') || locLower.includes('bizkaia');
      const cleanDesc = stripHtml(j.jobDescription || j.jobExcerpt);

      const minSal = typeof j.annualSalaryMin === 'number' ? j.annualSalaryMin : undefined;
      const maxSal = typeof j.annualSalaryMax === 'number' ? j.annualSalaryMax : undefined;

      const offerPartial: Partial<JobOffer> = {
        id: `jobicy-${j.id}`,
        title: j.jobTitle || 'Puesto Remoto',
        company: j.companyName || 'Empresa (Jobicy)',
        location,
        isBilbaoLocation: isBilbao,
        isRemote: true,
        url: j.url,
        sourceId: 'src-jobicy-api',
        sourceName: 'Jobicy (API Remota)',
        publishedDate: j.pubDate ? j.pubDate.split(' ')[0] : timestamp.split(' ')[0],
        salaryMin: minSal,
        salaryMax: maxSal,
        salaryCurrency: j.salaryCurrency || undefined,
        rawDescription: cleanDesc.slice(0, 1200),
        requirements: [],
        responsibilities: [],
        status: 'Nueva',
        extractedAt: timestamp,
        isVerified: true,
        verificationStatus: 'Vigente y Verificada'
      };

      const matchScore = calculateMatchScore(offerPartial, profile);
      return {
        ...offerPartial,
        matchScore
      } as JobOffer;
    });
  } catch (err) {
    console.warn('[PublicJobApis] Error fetching Jobicy jobs:', err);
    return [];
  }
};

/**
 * Multi-source real search combining:
 * 1. Ingested static repository jobs (`jobs.json`) with zero CORS barriers
 * 2. Live Arbeitnow public API (Europe / Germany)
 * 3. Live Remotive public API (Global remote)
 * 4. Live Jobicy public API (Global remote)
 */
export const searchRealPublicJobs = async (query: string = ''): Promise<{
  offers: JobOffer[];
  totalFound: number;
  sourcesSearched: string[];
}> => {
  const [staticJobs, arbeitnow, remotive, jobicy] = await Promise.all([
    fetchStaticIngestedJobs(),
    fetchArbeitnowJobs(query),
    fetchRemotiveJobs(query),
    fetchJobicyJobs(query)
  ]);

  const combined = [...staticJobs, ...arbeitnow, ...remotive, ...jobicy];

  // Deduplicate by URL or title+company
  const unique = combined.filter((item, index, self) =>
    index === self.findIndex(o => (o.url && o.url === item.url) || (o.title === item.title && o.company === item.company))
  );

  return {
    offers: unique,
    totalFound: unique.length,
    sourcesSearched: [
      'Base Ingestada GitHub (jobs.json)',
      'Arbeitnow (API)',
      'Remotive (API)',
      'Jobicy (API)'
    ]
  };
};
