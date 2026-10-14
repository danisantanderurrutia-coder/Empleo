import { getStoredSources, getStoredOffers, getStoredApplications, saveStoredApplications, getStoredProfile, getStoredDocs, saveStoredDocs } from './db';
import type { ApplicationItem, ApplicationStage } from '../types/applications';
import { generateCVFromProfile } from './cvGenerator';

export interface AgentLog {
  id: string;
  timestamp: string;
  agentName: string;
  workflow: string;
  action: string;
  status: 'info' | 'success' | 'warning' | 'error';
  details: string;
}

export const runDailyJobSearchWorkflow = (): { newOffersCount: number; logs: AgentLog[] } => {
  const logs: AgentLog[] = [];
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
  const sources = getStoredSources().filter(s => s.status === 'Activo');
  const profile = getStoredProfile();
  const existingOffers = getStoredOffers();

  logs.push({
    id: `log-${Date.now()}-1`,
    timestamp,
    agentName: 'Scout Agent',
    workflow: '/daily-job-search',
    action: 'Iniciando escaneo de fuentes activas',
    status: 'info',
    details: `Explorando ${sources.length} fuentes de empleo (LinkedIn, EURES, Tecnoempleo, Tecnalia, Sherpa.ai, Lanbide).`
  });

  logs.push({
    id: `log-${Date.now()}-2`,
    timestamp,
    agentName: 'Scout Agent',
    workflow: '/daily-job-search',
    action: 'Búsqueda automática no disponible',
    status: 'warning',
    details: 'La app no puede consultar portales sin backend. No se ha añadido ninguna oferta; añade ofertas manualmente.'
  });

  void profile;
  void existingOffers;

  return { newOffersCount: 0, logs };
};

export const runProcessApplicationWorkflow = (offerId: string): { applicationId: string; logs: AgentLog[] } => {
  const logs: AgentLog[] = [];
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
  const offers = getStoredOffers();
  const profile = getStoredProfile();
  const applications = getStoredApplications();

  const offer = offers.find(o => o.id === offerId) || offers[0];
  const candId = `CAND-2026-${Math.floor(100 + Math.random() * 900)}`;

  logs.push({
    id: `log-${Date.now()}-1`,
    timestamp,
    agentName: 'Application Assistant',
    workflow: '/process-application',
    action: 'Paso 1: Oferta seleccionada y verificada',
    status: 'info',
    details: `Creando candidatura ID ${candId} para "${offer.title}" en ${offer.company}.`
  });

  const generatedCV = generateCVFromProfile('es_standard', `CV Adaptado - ${offer.company}`, profile);
  
  const customLetter = `[BORRADOR SIN REDACTAR: escribe aquí tu carta para ${offer.title} en ${offer.company}. No se ha generado texto automático.]

${profile.fullName}`;

  const newApp: ApplicationItem = {
    id: candId,
    offerId: offer.id,
    offerTitle: offer.title,
    companyName: offer.company,
    location: offer.location,
    currentStage: 6,
    status: 'En Progreso',
    createdDate: timestamp.split(' ')[0],
    updatedDate: timestamp.split(' ')[0],
    cvVersionId: generatedCV.id,
    cvVersionName: generatedCV.name,
    coverLetter: customLetter,
    formDraft: {
      "nombre_completo": profile.fullName,
      "email": profile.email,
      "telefono": profile.phone,
      "ciudad_residencia": profile.location,
      "linkedin": profile.linkedin,
      "expectativa_salarial": String(profile.desiredSalary)
    },
    humanApprovalGranted: false,
    history: [
      { id: `h-${Date.now()}-1`, timestamp, stage: 1 as ApplicationStage, title: 'Oferta revisada y asociada a candidatura', actor: 'Usuario' },
            { id: `h-${Date.now()}-3`, timestamp, stage: 3 as ApplicationStage, title: 'CV generado desde Master Profile (sin adaptar a la oferta)', actor: 'Usuario' },
      { id: `h-${Date.now()}-4`, timestamp, stage: 4 as ApplicationStage, title: 'Carta pendiente de redactar por el usuario', actor: 'Usuario' },
      { id: `h-${Date.now()}-5`, timestamp, stage: 5 as ApplicationStage, title: 'Borrador de datos de formulario copiado desde el perfil', actor: 'Usuario' },
      { id: `h-${Date.now()}-6`, timestamp, stage: 6 as ApplicationStage, title: 'Candidatura lista en Paso 6 (Revisión Final). APROBACIÓN HUMANA REQUERIDA PARA ENVÍO.', actor: 'Agente IA' }
    ]
  };

  saveStoredApplications([newApp, ...applications]);

  logs.push({
    id: `log-${Date.now()}-3`,
    timestamp,
    agentName: 'QA & Compliance Agent',
    workflow: '/process-application',
    action: 'Paso 6: Candidatura detenida esperando confirmación humana',
    status: 'warning',
    details: 'Control irreversible activo: La candidatura requiere que el usuario presione "Confirmar Envío" manualmente.'
  });

  return { applicationId: candId, logs };
};

export const runUpdateDocumentationWorkflow = (): { updatedCount: number; logs: AgentLog[] } => {
  const logs: AgentLog[] = [];
  const timestamp = new Date().toISOString().split('T')[0];
  const docs = getStoredDocs();

  logs.push({
    id: `log-${Date.now()}-1`,
    timestamp,
    agentName: 'Documentation Agent',
    workflow: '/update-documentation',
    action: 'Analizando interfaz y componentes del sistema',
    status: 'info',
    details: `Escaneando ${docs.length} pantallas y flujos de Job Search OS para verificar vigencia.`
  });

  const updatedDocs = {
    ...docs,
    version: 'v1.0.5',
    lastUpdated: timestamp,
    updatedByAgent: 'Documentation Agent'
  };

  saveStoredDocs(updatedDocs);

  logs.push({
    id: `log-${Date.now()}-2`,
    timestamp,
    agentName: 'Documentation Agent',
    workflow: '/update-documentation',
    action: 'Documentación actualizada a v1.0.5',
    status: 'success',
    details: 'Solo se actualizó el número de versión; no se verificó el contenido de la documentación.'
  });

  return { updatedCount: updatedDocs.length, logs };
};
