import { getStoredOffers, saveStoredOffers } from './db';
import { searchRealPublicJobs } from './publicJobApis';
import type { JobOffer } from '../types/offers';

export interface AutonomousSearchResult {
  query: string;
  totalFound: number;
  newCount: number;
  offers: JobOffer[];
  discoveredCompanies: number;
  scoutedSourcesCount: number;
  summary: string;
}

/**
 * Searches genuine open job board APIs (Remotive, Arbeitnow, Jobicy)
 * that have open CORS and return live public vacancies.
 */
export const runAutonomousGlobalSearch = async (queryText: string): Promise<AutonomousSearchResult> => {
  const existingOffers = getStoredOffers();

  // Search real public job board APIs (CORS open)
  const searchResult = await searchRealPublicJobs(queryText);
  const discoveredOffers = searchResult.offers;

  // Filter out duplicates against existing stored offers
  const newOffers = discoveredOffers.filter(
    n => !existingOffers.some(e => e.title.toLowerCase() === n.title.toLowerCase() || e.url === n.url)
  );

  // Save merged offers
  const mergedOffers = [...newOffers, ...existingOffers];
  if (newOffers.length > 0) {
    saveStoredOffers(mergedOffers);
  }

  const sourcesList = searchResult.sourcesSearched.join(', ');
  const summary = newOffers.length > 0
    ? `Búsqueda real completada en APIs públicas (${sourcesList}). Se han indexado ${newOffers.length} ofertas nuevas verificadas.`
    : `Búsqueda completada en ${sourcesList}. No se encontraron nuevas ofertas para "${queryText || 'general'}" (o ya estaban añadidas).`;

  return {
    query: queryText,
    totalFound: discoveredOffers.length,
    newCount: newOffers.length,
    offers: mergedOffers,
    discoveredCompanies: 0,
    scoutedSourcesCount: searchResult.sourcesSearched.length,
    summary
  };
};
