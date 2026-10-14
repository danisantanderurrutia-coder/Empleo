import { getStoredOffers, saveStoredOffers, getStoredCompanies } from './db';
import { scrapeLiveWebsite } from './liveWebScraper';
import { MASTER_SECTORAL_SOURCES } from './masterSourceCatalog';
import type { JobOffer } from '../types/offers';

export interface PipelineExecutionResult {
  executionId: string;
  timestamp: string;
  totalPillarsScanned: number;
  totalSourcesScanned: number;
  newOffersFound: number;
  offersByPillar: { pillarName: string; offersCount: number }[];
  scoutedOffers: JobOffer[];
  summary: string;
}

/**
 * Automated Daily Search Pipeline for Spain & Basque Country (Euskadi).
 * Scans 5 thematic pillars:
 * 1. Innovación & I+D+i (BC3, Tecnalia, AZTI, Neiker, CIC energiGUNE)
 * 2. Empresas & Clústeres (Aclima, IDOM, Iberdrola, Siemens Gamesa, Petronor, Gestamp)
 * 3. Pensamiento & Transición (IHOBE, Cristina Enea, ECODES, SEO/BirdLife)
 * 4. Cooperación Internacional & Comunidades (AVCD, Coordinadora ONGD Euskadi, Alboan, Mundubat, AECID)
 * 5. Boletines Oficiales & Empleo Público (BOPV, Lanbide, BOE)
 */
export const runDailyPipelineEuskadi = async (): Promise<PipelineExecutionResult> => {
  const existingOffers = getStoredOffers();
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

  const allDiscoveredOffers: JobOffer[] = [];
  const offersByPillar: { pillarName: string; offersCount: number }[] = [];
  let totalSourcesScanned = 0;

  for (const category of MASTER_SECTORAL_SOURCES) {
    let categoryOffersCount = 0;

    for (const source of category.sources) {
      totalSourcesScanned++;
      try {
        const scrapeRes = await scrapeLiveWebsite(source.url, source.name);
        if (scrapeRes.scrapedOffers.length > 0) {
          scrapeRes.scrapedOffers.forEach(offer => {
            // Ensure location priority is marked for Euskadi
            const locLower = (offer.location || '').toLowerCase();
            if (locLower.includes('bilbao') || locLower.includes('bizkaia') || locLower.includes('donostia') || locLower.includes('euskadi') || locLower.includes('país vasco')) {
              offer.isBilbaoLocation = true;
            }
            allDiscoveredOffers.push(offer);
            categoryOffersCount++;
          });
        }
      } catch (err) {
        console.warn(`Pipeline warning scraping ${source.name}:`, err);
      }
    }

    offersByPillar.push({
      pillarName: category.sectorName,
      offersCount: categoryOffersCount
    });
  }

  // Scan companies registered in Empresas & Careers tab
  const registeredCompanies = getStoredCompanies();
  for (const comp of registeredCompanies) {
    if (comp.website && comp.website.startsWith('http')) {
      totalSourcesScanned++;
      try {
        const compRes = await scrapeLiveWebsite(comp.website, comp.name);
        if (compRes.scrapedOffers.length > 0) {
          compRes.scrapedOffers.forEach(offer => {
            allDiscoveredOffers.push(offer);
          });
        }
      } catch (err) {
        console.warn(`Pipeline warning scraping company ${comp.name}:`, err);
      }
    }
  }

  // Deduplicate against existing stored offers
  const newOffers = allDiscoveredOffers.filter(
    n => !existingOffers.some(e => e.title.toLowerCase() === n.title.toLowerCase() || e.url === n.url)
  );

  const mergedOffers = [...newOffers, ...existingOffers];
  saveStoredOffers(mergedOffers);

  const executionId = `pip-euskadi-${Date.now()}`;
  return {
    executionId,
    timestamp,
    totalPillarsScanned: MASTER_SECTORAL_SOURCES.length,
    totalSourcesScanned,
    newOffersFound: newOffers.length,
    offersByPillar,
    scoutedOffers: mergedOffers,
    summary: `Pipeline Diario de Euskadi & España completado. Se han escaneado ${totalSourcesScanned} fuentes en 5 pilares temáticos (I+D+i, Empresas, Transición, Cooperación y Boletines), incorporando ${newOffers.length} enlaces (sin verificar).`
  };
};
