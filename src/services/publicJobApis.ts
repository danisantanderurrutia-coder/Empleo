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
 * Fetches real job openings from Remotive Public API (CORS open).
 */
export const fetchRemotiveJobs = async (query: string = ''): Promise<JobOffer[]> => {
  try {
    const searchParam = query.trim() ? `&search=${encodeURIComponent(query.trim())}` : '';
    const res = await fetch(`https://remotive.com/api/remote-jobs?limit=15${searchParam}`);
    if (!res.ok) return [];
    const data = await res.json();
    const jobs: RemotiveJob[] = data.jobs || [];
    const profile = getStoredProfile();
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

    return jobs.map(j => {
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
        rawDescription: cleanDesc.slice(0, 1000),
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
    const qLower = query.toLowerCase().trim();

    const filtered = qLower
      ? jobs.filter(j => 
          (j.title || '').toLowerCase().includes(qLower) ||
          (j.description || '').toLowerCase().includes(qLower) ||
          (j.tags || []).some(t => t.toLowerCase().includes(qLower))
        )
      : jobs;

    return filtered.slice(0, 15).map(j => {
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
        sourceName: 'Arbeitnow (API Pública)',
        publishedDate: pubDate,
        rawDescription: cleanDesc.slice(0, 1000),
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
    const count = 15;
    const tagParam = query.trim() ? `&tag=${encodeURIComponent(query.trim())}` : '';
    const res = await fetch(`https://jobicy.com/api/v2/remote-jobs?count=${count}${tagParam}`);
    if (!res.ok) return [];
    const data = await res.json();
    const jobs: JobicyJob[] = data.jobs || [];
    const profile = getStoredProfile();
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

    return jobs.map(j => {
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
        sourceName: 'Jobicy (API Pública)',
        publishedDate: j.pubDate ? j.pubDate.split(' ')[0] : timestamp.split(' ')[0],
        salaryMin: minSal,
        salaryMax: maxSal,
        salaryCurrency: j.salaryCurrency || undefined,
        rawDescription: cleanDesc.slice(0, 1000),
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
 * Multi-source real public search combining Remotive, Arbeitnow and Jobicy.
 */
export const searchRealPublicJobs = async (query: string = ''): Promise<{
  offers: JobOffer[];
  totalFound: number;
  sourcesSearched: string[];
}> => {
  const [remotive, arbeitnow, jobicy] = await Promise.all([
    fetchRemotiveJobs(query),
    fetchArbeitnowJobs(query),
    fetchJobicyJobs(query)
  ]);

  const combined = [...remotive, ...arbeitnow, ...jobicy];

  // Deduplicate by URL
  const unique = combined.filter((item, index, self) =>
    index === self.findIndex(o => o.url === item.url || (o.title === item.title && o.company === item.company))
  );

  return {
    offers: unique,
    totalFound: unique.length,
    sourcesSearched: ['Remotive (API)', 'Arbeitnow (API)', 'Jobicy (API)']
  };
};
