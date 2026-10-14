import { getStoredOffers, getStoredProfile } from './db';
import type { JobOffer } from '../types/offers';

export type SupportedPortalName = 
  | 'LinkedIn' 
  | 'UNjobs' 
  | 'GreenJobs Global' 
  | 'RemoteJobs (Remotive / RemoteOK)'
  | 'XING (Alemania & DACH)' 
  | 'InfoJobs' 
  | 'Indeed' 
  | 'StepStone (Alemania)' 
  | 'Climatebase' 
  | 'Eurobrussels (EU Jobs)';

export interface ConnectedPortalAccount {
  id: string;
  portalName: SupportedPortalName;
  accountUser: string;
  profileUrl: string;
  savedSearchAlertUrl: string;
  targetKeywords: string[];
  status: 'Conectado' | 'Sincronizando' | 'Pendiente';
  lastSynced: string;
  extractedOffersCount: number;
}

export const ALL_SUPPORTED_PORTALS: { name: SupportedPortalName; region: string; icon: string; defaultUrl: string; description: string }[] = [
  { name: 'LinkedIn', region: 'Global', icon: 'Linkedin', defaultUrl: 'https://linkedin.com/jobs', description: 'Red profesional global con alertas de empleo personalizadas.' },
  { name: 'UNjobs', region: 'Global / ONU', icon: 'Globe', defaultUrl: 'https://unjobs.org', description: 'Portales oficiales del Sistema de Naciones Unidas y ONGs.' },
  { name: 'GreenJobs Global', region: 'Europa & Global', icon: 'Leaf', defaultUrl: 'https://www.greenjobs.de', description: 'Bolsa de empleo especializada en medio ambiente, clima y energía.' },
  { name: 'RemoteJobs (Remotive / RemoteOK)', region: '100% Remoto Global', icon: 'Wifi', defaultUrl: 'https://remotive.com', description: 'Bolsa internacional de empleos 100% remotas en ciencia, datos y medio ambiente.' },
  { name: 'XING (Alemania & DACH)', region: 'Alemania / Suiza / Austria', icon: 'Briefcase', defaultUrl: 'https://www.xing.com/jobs', description: 'Red profesional #1 en países de habla alemana (DACH).' },
  { name: 'InfoJobs', region: 'España / Euskadi', icon: 'Building2', defaultUrl: 'https://www.infojobs.net', description: 'Bolsa de trabajo líder en España y Bizkaia.' },
  { name: 'Indeed', region: 'Global / España', icon: 'Search', defaultUrl: 'https://es.indeed.com', description: 'Agregador global de vacantes públicas y privadas.' },
  { name: 'StepStone (Alemania)', region: 'Alemania', icon: 'Compass', defaultUrl: 'https://www.stepstone.de', description: 'Portal principal de empleo técnico e industrial en Alemania.' },
  { name: 'Climatebase', region: '100% Remoto', icon: 'CloudRain', defaultUrl: 'https://climatebase.org', description: 'Empleos de impacto ambiental y descarbonización.' },
  { name: 'Eurobrussels (EU Jobs)', region: 'Bruselas & Europa', icon: 'Landmark', defaultUrl: 'https://www.eurobrussels.com', description: 'Políticas públicas europeas y asuntos ambientales UE.' }
];

const STORAGE_KEY_PORTALS = 'job_search_os_connected_portals_v6';

export const initialPortals: ConnectedPortalAccount[] = [];

export const getConnectedPortals = (): ConnectedPortalAccount[] => {
  // Clear old versions if present
  localStorage.removeItem('job_search_os_connected_portals_v4');
  localStorage.removeItem('job_search_os_connected_portals_v5');

  const data = localStorage.getItem(STORAGE_KEY_PORTALS);
  if (!data) {
    saveConnectedPortals(initialPortals);
    return initialPortals;
  }
  try {
    const parsed: ConnectedPortalAccount[] = JSON.parse(data);
    // Sanitize any speculative handles if user had cached previous versions
    const cleaned = parsed.filter(p => 
      !p.accountUser.includes('Daniel_SantanderUrrutia') && 
      !p.accountUser.includes('daniel.santander.greenjobs')
    );
    if (cleaned.length !== parsed.length) {
      saveConnectedPortals(cleaned);
    }
    return cleaned;
  } catch {
    return initialPortals;
  }
};

export const saveConnectedPortals = (portals: ConnectedPortalAccount[]): void => {
  localStorage.setItem(STORAGE_KEY_PORTALS, JSON.stringify(portals));
};

/**
 * Synchronize all connected user accounts (LinkedIn, UNjobs, GreenJobs, XING, InfoJobs, Indeed, StepStone)
 * and import personalized alerts & recommended job offers directly into Job Search OS.
 */
export const syncConnectedPortalAccounts = async (): Promise<{
  syncedPortalsCount: number;
  newOffersCount: number;
  summary: string;
}> => {
  const portals = getConnectedPortals();
  const profile = getStoredProfile();
  const existingOffers = getStoredOffers();
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
  const dateToday = timestamp.split(' ')[0];

  // Not implemented: reading a logged-in portal account is impossible from a browser. Nothing is imported.
  void profile;
  void dateToday;
  const newOffers: JobOffer[] = [];
  void existingOffers;

  const updatedPortals = portals.map(p => ({
    ...p,
    lastSynced: p.lastSynced,
    status: p.status
  }));
  saveConnectedPortals(updatedPortals);

  return {
    syncedPortalsCount: portals.length,
    newOffersCount: newOffers.length,
    summary: 'Sincronización no disponible: la app no puede leer tus cuentas de portales. No se ha importado ninguna oferta.'
  };
};
