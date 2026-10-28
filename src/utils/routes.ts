/**
 * Slugs y Arquitectura de Rutas para la Web de Empleo
 * Permite routing limpio, deep-linking y sincronización de URL en el navegador.
 */

export const APP_SLUGS = {
  // 1. Estaciones principales
  DASHBOARD: '/consola',
  MARKET: '/mercado',
  DOSSIER: '/perfil',
  APPLICATIONS: '/candidaturas',
  FUNDING: '/convocatorias',
  SETTINGS: '/ajustes',
  PROTOCOL: '/protocolo',

  // 2. Submódulos de Mercado
  MARKET_OFFERS: '/mercado/ofertas',
  MARKET_SOURCES: '/mercado/fuentes',
  MARKET_COMPANIES: '/mercado/empresas',

  // 3. Submódulos de Perfil / Operators
  DOSSIER_SHOWCASE: '/perfil/resumen',
  DOSSIER_PROFILE: '/perfil/maestro',
  DOSSIER_CV_STUDIO: '/perfil/cv-studio',
  DOSSIER_COVER_LETTER: '/perfil/cover-letter',

  // 4. Submódulos de Candidaturas
  APPLICATIONS_ACTIVE: '/candidaturas/activas',
  APPLICATIONS_BATCH: '/candidaturas/lote',
  APPLICATIONS_INTELLIGENCE: '/candidaturas/inteligencia',

  // 5. Convocatorias I+D
  FUNDING_ACTIVE: '/convocatorias/activas',
  FUNDING_EU: '/convocatorias/horizon-ue',
  FUNDING_DACH: '/convocatorias/alemania-dach',
  FUNDING_EUSKADI: '/convocatorias/euskadi'
} as const;

export interface ParsedRouteState {
  station: string;
  subTab?: string;
  docType?: 'cv' | 'cover_letter';
  offerId?: string;
}

/**
 * Traduce el estado actual de la aplicación a su slug canónico
 */
export const getSlugForState = (
  stationId: string,
  subTab?: string,
  docType: 'cv' | 'cover_letter' = 'cv'
): string => {
  if (stationId === 'market_radar') {
    if (subTab === 'sources') return APP_SLUGS.MARKET_SOURCES;
    if (subTab === 'companies') return APP_SLUGS.MARKET_COMPANIES;
    return APP_SLUGS.MARKET_OFFERS;
  }

  if (stationId === 'agent_dossier') {
    if (subTab === 'studio') {
      return docType === 'cover_letter' ? APP_SLUGS.DOSSIER_COVER_LETTER : APP_SLUGS.DOSSIER_CV_STUDIO;
    }
    if (subTab === 'profile') return APP_SLUGS.DOSSIER_PROFILE;
    return APP_SLUGS.DOSSIER_SHOWCASE;
  }

  if (stationId === 'mission_control') {
    if (subTab === 'batch') return APP_SLUGS.APPLICATIONS_BATCH;
    if (subTab === 'intelligence') return APP_SLUGS.APPLICATIONS_INTELLIGENCE;
    return APP_SLUGS.APPLICATIONS_ACTIVE;
  }

  if (stationId === 'funding') return APP_SLUGS.FUNDING;
  if (stationId === 'settings') return APP_SLUGS.SETTINGS;

  return APP_SLUGS.DASHBOARD;
};

/**
 * Traduce una URL, pathname o hash a los estados de Empleo (estación, subTab, docType)
 */
export const parseSlugToState = (rawPath: string): ParsedRouteState => {
  // Soporta tanto pathnames directos (/mercado/ofertas) como hash routing (/#/mercado/ofertas)
  let path = rawPath;
  if (path.includes('#')) {
    path = path.split('#')[1] || '/';
  }

  // Quitar el BASE_URL si existe (ej. /empleo/)
  const baseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL)
    ? import.meta.env.BASE_URL.replace(/\/+$/, '')
    : '';
  if (baseUrl && path.startsWith(baseUrl)) {
    path = path.slice(baseUrl.length);
  }

  const clean = path.toLowerCase().replace(/\/+$/, '') || '/';

  // 1. Mercado
  if (clean === '/mercado' || clean === '/mercado/ofertas' || clean.startsWith('/mercado/ofertas/')) {
    return { station: 'market_radar', subTab: 'offers' };
  }
  if (clean === '/mercado/fuentes') {
    return { station: 'market_radar', subTab: 'sources' };
  }
  if (clean === '/mercado/empresas' || clean.startsWith('/mercado/empresas/')) {
    return { station: 'market_radar', subTab: 'companies' };
  }

  // 2. Perfil
  if (clean === '/perfil/cv-studio' || clean.startsWith('/perfil/cv-studio')) {
    return { station: 'agent_dossier', subTab: 'studio', docType: 'cv' };
  }
  if (clean === '/perfil/cover-letter' || clean === '/perfil/carta' || clean.startsWith('/perfil/cover-letter')) {
    return { station: 'agent_dossier', subTab: 'studio', docType: 'cover_letter' };
  }
  if (clean === '/perfil/maestro' || clean === '/perfil/datos') {
    return { station: 'agent_dossier', subTab: 'profile' };
  }
  if (clean === '/perfil' || clean === '/perfil/resumen') {
    return { station: 'agent_dossier', subTab: 'showcase' };
  }

  // 3. Candidaturas
  if (clean === '/candidaturas/lote' || clean === '/candidaturas/batch') {
    return { station: 'mission_control', subTab: 'batch' };
  }
  if (clean === '/candidaturas/inteligencia' || clean === '/candidaturas/wingman') {
    return { station: 'mission_control', subTab: 'intelligence' };
  }
  if (clean === '/candidaturas' || clean === '/candidaturas/activas' || clean.startsWith('/candidaturas/')) {
    return { station: 'mission_control', subTab: 'applications' };
  }

  // 4. Convocatorias
  if (clean.startsWith('/convocatorias')) {
    return { station: 'funding' };
  }

  // 5. Ajustes
  if (clean.startsWith('/ajustes') || clean === '/configuracion') {
    return { station: 'settings' };
  }

  // Dashboard / Consola por defecto
  return { station: 'dashboard' };
};
