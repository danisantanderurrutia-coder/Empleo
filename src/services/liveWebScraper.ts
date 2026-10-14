import { getStoredProfile } from './db';
import { calculateMatchScore } from './matchEngine';
import { PortalAdapterRegistry } from './adapters/portalAdaptersRegistry';
import type { JobOffer, SupportedCountry } from '../types/offers';

export interface ScrapedLiveOffer {
  title: string;
  url: string;
  company: string;
  location: string;
  country?: SupportedCountry;
  snippet?: string;
}


/**
 * Real-Time URL Liveness Verifier
 * Returns true only if the URL responds with HTTP 200/300 status code.
 */
export const checkUrlLiveness = async (url: string): Promise<boolean> => {
  if (!url || !url.startsWith('http')) return false;
  try {
    const res = await fetch(`/api/check-link?url=${encodeURIComponent(url)}`);
    if (res.ok) {
      const data = await res.json();
      return !!data.alive;
    }
  } catch (err) {
    console.warn('URL check request error:', err);
  }
  // Unknown: the check endpoint only exists in `npm run dev`; failure must not be reported as "alive".
  return false;
};

export const inferSupportedCountry = (text?: string, url?: string): SupportedCountry => {
  const combined = `${text || ''} ${url || ''}`.toLowerCase();

  if (combined.includes('.de') || combined.includes('germany') || combined.includes('alemania') || combined.includes('hannover') || combined.includes('berlin') || combined.includes('kiel') || combined.includes('munich')) {
    return 'Alemania';
  }
  if (combined.includes('.it') || combined.includes('italy') || combined.includes('italia') || combined.includes('roma') || combined.includes('rome') || combined.includes('fao')) {
    return 'Italia';
  }
  if (combined.includes('.fr') || combined.includes('france') || combined.includes('francia') || combined.includes('paris') || combined.includes('parís')) {
    return 'Francia';
  }
  if (combined.includes('.ch') || combined.includes('switzerland') || combined.includes('suiza') || combined.includes('geneva') || combined.includes('ginebra')) {
    return 'Suiza';
  }
  if (combined.includes('.uk') || combined.includes('united kingdom') || combined.includes('reino unido') || combined.includes('london')) {
    return 'Reino Unido';
  }

  return 'España'; // Default for Spain & Euskadi
};

/**
 * Helper to dynamically extract the REAL location from job title, URL, snippet, and company HQ.
 * Prevents false "Bilbao" default overrides for non-Bilbao jobs.
 */
export const extractLocationFromText = (title: string, url: string, companyName: string): string => {
  const textLower = `${title} ${url} ${companyName}`.toLowerCase();

  // Check specific cities in text/url
  if (textLower.includes('bilbao') || textLower.includes('bizkaia') || textLower.includes('erandio') || textLower.includes('leioa') || textLower.includes('barakaldo') || textLower.includes('zamudio') || textLower.includes('getxo')) {
    return 'Bilbao, Bizkaia';
  }
  if (textLower.includes('donostia') || textLower.includes('san sebastián') || textLower.includes('san sebastian') || textLower.includes('gipuzkoa')) {
    return 'Donostia / San Sebastián, Gipuzkoa';
  }
  if (textLower.includes('vitoria') || textLower.includes('gasteiz') || textLower.includes('álava') || textLower.includes('alava')) {
    return 'Vitoria-Gasteiz, Álava';
  }
  if (textLower.includes('madrid')) {
    return 'Madrid, España';
  }
  if (textLower.includes('barcelona')) {
    return 'Barcelona, España';
  }
  if (textLower.includes('valencia')) {
    return 'Valencia, España';
  }
  if (textLower.includes('sevilla')) {
    return 'Sevilla, España';
  }
  if (textLower.includes('zaragoza')) {
    return 'Zaragoza, España';
  }
  if (textLower.includes('roma') || textLower.includes('rome') || textLower.includes('fao')) {
    return 'Roma, Italia (Remoto / España)';
  }
  if (textLower.includes('ginebra') || textLower.includes('geneva') || textLower.includes('parís') || textLower.includes('paris') || textLower.includes('bruselas') || textLower.includes('brussels')) {
    return 'Europa (Internacional / Remoto)';
  }
  if (textLower.includes('remoto') || textLower.includes('remote') || textLower.includes('teletrabajo')) {
    return 'Remoto (100% Teletrabajo)';
  }

  // Company HQ Fallbacks
  if (textLower.includes('idom')) return 'Bilbao / Madrid, España';
  if (textLower.includes('tecnalia')) return 'Bilbao, Bizkaia';
  if (textLower.includes('bc3')) return 'Leioa / Bilbao, Bizkaia';
  if (textLower.includes('ihobe')) return 'Bilbao, Bizkaia';
  if (textLower.includes('azti')) return 'Pasaia / Sukarrieta, Euskadi';
  if (textLower.includes('neiker')) return 'Derio, Bizkaia';
  if (textLower.includes('tragsa')) return 'Madrid, España';

  return 'España (Nacional / Remoto)';
};

/**
 * Real Dynamic Web Scraper & HTML Parser for Job Search OS.
 * Calls Node.js server middleware (/api/scrape-live) to fetch live webpages without CORS restrictions.
 */
export const scrapeLiveWebsite = async (sourceUrl: string, sourceName?: string): Promise<{
  scrapedOffers: JobOffer[];
  totalExtracted: number;
  sourceUrl: string;
}> => {
  const profile = getStoredProfile();
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
  const dateToday = timestamp.split(' ')[0];

  let extractedPositions: ScrapedLiveOffer[] = [];

  try {
    const apiEndpoint = `/api/scrape-live?url=${encodeURIComponent(sourceUrl)}`;
    const res = await fetch(apiEndpoint);

    if (res.ok) {
      const data = await res.json();
      if (data.links && Array.isArray(data.links) && data.links.length > 0) {
        data.links.forEach((link: { url: string; title: string }) => {
          const compName = sourceName || 'Entidad Convocante Verificada';
          const realLoc = extractLocationFromText(link.title, link.url, compName);
          extractedPositions.push({
            title: link.title,
            url: link.url,
            company: compName,
            location: realLoc,
            country: 'España',
            snippet: `Enlace extraído de ${link.url} (sin verificar que sea una oferta vigente).`
          });
        });
      }
    }
  } catch (err) {
    console.warn('Scraping via Node API failed:', err);
  }

  // Check if a specialized Portal Adapter handles this URL or source
  const adapter = PortalAdapterRegistry.findAdapter(sourceUrl) || (sourceName ? PortalAdapterRegistry.findAdapter(sourceName) : undefined);
  if (adapter) {
    try {
      const adapterOffers = await adapter.extractOffers(profile.fullName);
      if (adapterOffers.length > 0) {
        adapterOffers.forEach(o => {
          extractedPositions.push({
            title: o.title || 'Convocatoria Oficial de Empleo',
            url: o.url || sourceUrl,
            company: o.company || sourceName || 'Entidad Convocante Verificada',
            location: o.location || 'Berlín / Remoto Europa',
            country: o.country || 'España',
            snippet: o.rawDescription || `Puesto oficial indexado desde ${o.url}.`
          });
        });
      }
    } catch (adapterErr) {
      console.warn(`Adapter extraction error for ${sourceName}:`, adapterErr);
    }
  }

  // No fallback catalog: if nothing was scraped, we return no offers (never fabricated ones).

  // Map extracted positions to JobOffer format and calculate real-time Match Score
  const scrapedOffers: JobOffer[] = extractedPositions.map((pos, idx) => {
    const partial: Partial<JobOffer> = {
      id: `off-dyn-${Date.now()}-${idx}`,
      title: pos.title,
      company: pos.company,
      location: pos.location,
      country: 'España',
      isBilbaoLocation: pos.location.toLowerCase().includes('bilbao') || pos.location.toLowerCase().includes('bizkaia'),
      isRemote: pos.location.toLowerCase().includes('remoto') || pos.location.toLowerCase().includes('remote'),
      url: pos.url,
      sourceId: `src-dyn-${Date.now()}`,
      sourceName: sourceName || 'Buscador Autónomo Antigravity',
      publishedDate: dateToday,
      rawDescription: pos.snippet || `Vacante extraída en tiempo real desde ${pos.url}.`,
      requirements: [],
      responsibilities: [],
      status: 'Nueva',
      extractedAt: timestamp
    };

    const matchScore = calculateMatchScore(partial, profile);
    return {
      ...partial,
      matchScore
    } as JobOffer;
  });

  return {
    scrapedOffers,
    totalExtracted: scrapedOffers.length,
    sourceUrl
  };
};
