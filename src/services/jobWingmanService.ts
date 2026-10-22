import type { JobDossier } from '../types/intelligence';
import type { JobOffer } from '../types/offers';

const WINGMAN_STORAGE_KEY = 'empleo_job_wingman_dossiers_v1';

/**
 * DOSSIER CANÓNICO DE ORO: THÜNEN-INSTITUT / TECHWORMS
 * Prof. Dr. Axel Don - Thünen-Institut für Agrarklimaschutz, Braunschweig
 */
export const THUENEN_TECHWORMS_DOSSIER: JobDossier = {
  id: 'dossier-thuenen-techworms-axel-don',
  offerId: 'thuenen-techworms-369',
  targetCompany: 'Thünen-Institut für Agrarklimaschutz (Braunschweig)',
  projectTitle: 'TechWorms: Künstliche Makroporen zur Unterbodenerschließung, Wurzelökologie & C-Sequestrierung',
  createdAt: '2026-10-22T20:00:00.000Z',
  notes: 'Dossier de alta prioridad. Foco en física de medios porosos, cuantificación en RootBox y balance de C con isótopos estables.',
  leadProfile: {
    name: 'Axel Don',
    titleHonorific: 'Prof. Dr.',
    role: 'Stellvertretender Institutsleiter & Leiter der AG Organische Bodensubstanz',
    institution: 'Johann Heinrich von Thünen-Institut für Agrarklimaschutz, Braunschweig',
    email: 'axel.don@thuenen.de',
    researchFocus: [
      'Subsoil Organic Carbon Dynamics (SUBSOM, SOIL3, BZE-LW)',
      'Organo-mineral Carbon Stabilization (MAOM vs. POM)',
      'Root-derived Carbon Sequestration vs. Microbial Priming Effects',
      'Artificial & Biogenic Macropores (Earthworm Burrows / TechWorms)',
      'Drought Resilience through Deep Root Exploration'
    ],
    keyPublications: [
      'Don et al. (2018): Subsoil carbon storage and management in agricultural soils',
      'SUBSOM Project Reports: The forgotten part of carbon cycling in deeper horizons',
      'SOIL3 Synthesis: Deep soil loosening, root access to subsoil water & nutrients',
      'BZE-LW: Carbon stocks and stabilization across German agricultural profiles'
    ],
    styleNotes: 'Rigor científico absoluto, escéptico de promesas simplistas de "carbon farming". Valora perfiles con sólida formación matemática/física, independencia analítica en R y solvencia práctica en terreno.',
    knownProjects: ['TechWorms', 'SOIL3', 'SUBSOM', 'Eternal-C', 'BZE-LW']
  },
  projectPainPoints: [
    'Validación in-situ con RootBox: Procesamiento de imágenes UV/LED en testigos de suelo profundos con problemas de fondo mineral, artefactos de rugosidad y solapamiento radicular.',
    'Régimen hidráulico de doble permeabilidad: Cuantificar la frontera entre bypass flow rápido por macroporos durante tormentas y redistribución matricial hacia el subsuelo profundo.',
    'Trade-off C-Sequestration vs. Priming Effect: La penetración radicular y oxigenación en la pared del macroporo puede mineralizar carbono estabilizado antiguo en lugar de fijar C neto.',
    'Complejidad del balance isotópico (13C / 15N): Separar la firma de exudados y necrosis radicular fresca de la matriz del suelo circundante a escala milimétrica.'
  ],
  technicalHooks: [
    'Física de medios porosos y transporte multifásico: La formación geofísica modela el suelo como un medio continuo anisótropo con ecuaciones de Richards y dispersión advectiva, superando el empirismo agronómico descriptivo.',
    'Procesamiento de señales e imágenes para RootBox: Habilidad nativa en R/Python para filtrado, segmentación morfológica e inversión cuantitativa de densidad radicular (RLD).',
    'Resistencia probada en instrumentación de campo: Experiencia geofísica pesada en campañas con condiciones meteorológicas adversas (turberas, hidrogeofísica, sensores continuos in-situ).',
    'Proximidad y arraigo local: Residencia en Kiel (CAU Kiel), rápida movilidad hacia Braunschweig y familiaridad directa con los protocolos de investigación y normativas en Alemania.'
  ],
  candidateValueThesis: 'La ventaja decisiva de un Geofísico frente a un agrónomo tradicional es que aborda la drilósfera artificial de TechWorms como un sistema físico acoplado (flujo preferencial, gradientes de potencial hídrico y balance de masa) y procesa los datos de RootBox/isótopos con rigor computacional avanzado.',
  coverLetterAngles: [
    'Ángulo 1 (Física de Macroporos): Tratar los canales TechWorm como discontinuidades hidráulicas de alta conductividad que exigen modelado hidrofísico cuantitativo.',
    'Ángulo 2 (Automatización de RootBox): Aplicar algoritmos de visión y scripts en R desarrollados en geofísica para transformar las fotos UV en densidades radiculares milimétricas.',
    'Ángulo 3 (Rigor Isotópico y Balance de C): Encarar el debate del priming effect con honestidad de balance de masa, en perfecta sintonía con las publicaciones de Axel Don.'
  ],
  cvGuidance: [
    'Abrir con una línea de perfil cuantitativo: geofísica + física de medios porosos + R/Python (no "gestión ambiental" genérica).',
    'Priorizar: hidrogeofísica, flujos de GEI en turberas (instrumentación de campo continua), análisis de datos en R, tesis de resistividad/nivel freático (agua en el subsuelo).',
    'Nombrar explícitamente R y Python y cualquier trabajo con imágenes/series de señales; es lo que habilita el análisis de RootBox.',
    'Dejar al fondo o fuera: incidencia política y comunicación pública, salvo una línea (el PI valora rigor de balance de masa, no advocacy).',
    'Declarar solo hechos verificados del portafolio: nada de experiencia en isótopos estables, RootBox o suelos agrícolas si no está documentada.'
  ],
  coldApproachEmail: {
    subjectDe: 'Kurze fachliche Rückfrage zum Projekt TechWorms (Doktorandenstelle Ref. 369)',
    bodyDe: `Sehr geehrter Herr Prof. Dr. Don,

mit großem Interesse verfolge ich Ihre Arbeiten zur Kohlenstoffdynamik in Unterböden (insbesondere die Erkenntnisse aus SUBSOM und den Arbeiten zu Makroporen). Die ausgeschriebene Promotionsstelle im Projekt „TechWorms“ adressiert genau die Schnittstelle, die mich wissenschaftlich antreibt: die mechanische Erschließung des Unterbodens und deren physikalisch-ökologische Rückkopplung.

Vor Einreichung meiner vollständigen Unterlagen über das Thünen-Portal erlaube ich mir eine kurze methodische Frage:
Liegt der Schwerpunkt der experimentellen Auswertung mit der RootBox primär auf der bildanalytischen Wurzelquantifizierung (RLD/Fluoreszenz) und deren Skalierung im R-Umfeld, oder ist im Rahmen der Isotopenanalytik (13C/15N) auch eine gekoppelte hydro-physikalische Modellierung des präferentiellen Flusses in der künstlichen Drilosphäre vorgesehen?

Als Umweltgeophysiker (Universidad de Chile, Abschluss mit Auszeichnung; derzeit M.Sc. Umweltmanagement an der CAU Kiel) bringe ich einen stark quantitativen Hintergrund in der Physik poröser Medien, R-Programmierung und instrumenteller Feldarbeit mit.

Über einen kurzen fachlichen Impuls würde ich mich sehr freuen; meine formalen Bewerbungsunterlagen bereite ich parallel für das Portal vor.

Mit besten Grüßen aus Kiel,
Daniel Santander Urrutia
M.Sc. Candidate | Environmental Geophysicist
danisantander.urrutia@gmail.com | +49 152 23026367`,
    subjectEn: 'Technical inquiry regarding the TechWorms PhD position (Ref. 369)',
    bodyEn: `Dear Prof. Dr. Don,

I have been following your research on subsoil carbon turnover and stabilization with keen interest—particularly the insights emerging from SUBSOM and your work on root-accessible macropores. The doctoral opening within the "TechWorms" project targets the precise scientific interface I specialize in: coupling subsoil physical mechanics with root architecture and carbon dynamics.

Prior to submitting my formal application via the Thünen portal, I would like to ask a brief methodological question:
Is the analytical focus with the RootBox centered strictly on computer vision root quantification (RLD/UV fluorescence) and statistical scaling in R, or is there an intention to couple the 13C/15N isotopic tracing with hydro-physical modeling of preferential flow along the artificial drilosphere?

As an Environmental Geophysicist (Universidad de Chile, with distinction; currently completing an M.Sc. in Environmental Management at CAU Kiel), I combine training in porous media physics and data processing in R with robust all-weather field experience.

Thank you very much for your time and guidance. I look forward to submitting my formal documents shortly.

Sincerely, from Kiel,
Daniel Santander Urrutia
M.Sc. Candidate | Environmental Geophysicist
danisantander.urrutia@gmail.com | +49 152 23026367`
  }
};

/**
 * Recuperar todos los dossiers guardados
 */
export const getStoredDossiers = (): JobDossier[] => {
  try {
    if (typeof localStorage === 'undefined') {
      return [THUENEN_TECHWORMS_DOSSIER];
    }
    const raw = localStorage.getItem(WINGMAN_STORAGE_KEY);
    if (!raw) {
      return [THUENEN_TECHWORMS_DOSSIER];
    }
    const parsed = JSON.parse(raw) as JobDossier[];
    // Asegurar que el dossier canónico de Thünen esté presente
    if (!parsed.some(d => d.id === THUENEN_TECHWORMS_DOSSIER.id)) {
      parsed.unshift(THUENEN_TECHWORMS_DOSSIER);
    }
    return parsed;
  } catch (e) {
    return [THUENEN_TECHWORMS_DOSSIER];
  }
};

/**
 * Guardar o actualizar un dossier
 */
export const saveDossier = (dossier: JobDossier): void => {
  try {
    if (typeof localStorage === 'undefined') return;
    const dossiers = getStoredDossiers();
    const idx = dossiers.findIndex(d => d.id === dossier.id);
    if (idx >= 0) {
      dossiers[idx] = dossier;
    } else {
      dossiers.unshift(dossier);
    }
    localStorage.setItem(WINGMAN_STORAGE_KEY, JSON.stringify(dossiers));
  } catch (e) {
    console.error('Error saving wingman dossier', e);
  }
};

/**
 * Obtener dossier por ID o por Offer ID
 */
export const getDossierForOffer = (offer: JobOffer): JobDossier => {
  const dossiers = getStoredDossiers();
  
  // 1. Chequeo directo por ID
  const direct = dossiers.find(d => d.offerId === offer.id || (offer.jobDossier && d.id === offer.jobDossier.id));
  if (direct) return direct;

  // 2. Si la oferta menciona Thünen o Axel Don o TechWorms
  const text = `${offer.company} ${offer.title} ${offer.rawDescription}`.toLowerCase();
  if (text.includes('thünen') || text.includes('thuenen') || text.includes('techworm') || text.includes('axel don')) {
    return THUENEN_TECHWORMS_DOSSIER;
  }

  // 3. Fallback inteligente: construir dossier preliminar
  return createPreliminaryDossier(offer);
};

/**
 * Generador automático de dossier preliminar a partir de una oferta
 */
export const createPreliminaryDossier = (offer: JobOffer): JobDossier => {
  const company = offer.company || 'Organización';
  const title = offer.title || 'Posición Técnica/Científica';

  return {
    id: `dossier-${offer.id || Date.now()}`,
    offerId: offer.id,
    targetCompany: company,
    projectTitle: `${title} @ ${company}`,
    createdAt: new Date().toISOString(),
    leadProfile: {
      name: 'Hiring Lead / PI',
      role: 'Responsable Técnico del Proyecto',
      institution: company,
      researchFocus: offer.requirements.slice(0, 4),
      styleNotes: 'Pragmático, orientado a resultados verificables y rigor metodológico.'
    },
    projectPainPoints: [
      `Integración y procesamiento robusto de datos en el stack requerido para ${title}.`,
      'Validación experimental y operacional en terreno o laboratorio sin fallos de calibración.',
      'Optimización de tiempos de entrega en análisis cuantitativo y automatización de pipelines.'
    ],
    technicalHooks: [
      'Capacidad cuantitativa de análisis y modelado de datos en R/Python.',
      'Experiencia de campo y laboratorio en sistemas ambientales complejos.',
      'Enfoque de resolución de problemas desde primeros principios físicos.'
    ],
    candidateValueThesis: `Aportar solidez analítica y capacidad de ejecución autónoma para que ${company} resuelva los cuellos de botella técnicos de ${title}.`,
    coverLetterAngles: [
      'Demostrar cómo la combinación de rigor cuantitativo y solvencia en campo reduce el riesgo de errores técnicos.',
      'Enfocar la propuesta de valor en resultados medibles y entrega continua de datos limpios.'
    ],
    cvGuidance: [
      'Priorizar los hechos verificados que coinciden con los requisitos de la oferta.',
      'Abrir el resumen con la competencia técnica central que pide el puesto.',
      'No afirmar nada que no esté en el portafolio verificado.'
    ],
    coldApproachEmail: {
      subjectDe: `Kurze fachliche Rückfrage zur Position: ${title}`,
      bodyDe: `Sehr geehrte Damen und Herren,\n\nmit großem Interesse verfolge ich Ihre aktuellen Projekte bei ${company}.\n\nVor Einreichung meiner Bewerbung für die Position als ${title} möchte ich mich kurz erkundigen, welcher methodische Schwerpunkt bei der Umsetzung der anstehenden Aufgaben im Vordergrund steht.\n\nMit freundlichen Grüßen,\nDaniel Santander Urrutia`,
      subjectEn: `Brief technical question regarding ${title}`,
      bodyEn: `Dear Hiring Team,\n\nI have been following your ongoing work at ${company} with great interest.\n\nBefore submitting my application for ${title}, I would like to ask a brief question regarding the primary technical focus of the incoming project cycle.\n\nSincerely,\nDaniel Santander Urrutia`
    }
  };
};

export interface WingmanFormInput {
  leadName: string;
  honorific?: string;
  role?: string;
  institution?: string;
  email?: string;
  researchFocus: string[];
  styleNotes?: string;
  projectTitle?: string;
  painPoints: string[];
  hooks: string[];
  questionDe?: string;
  questionEn?: string;
}

/**
 * Construye y guarda un dossier a partir del formulario manual de Wingman.
 * Parte del dossier actual de la oferta (para conservar guías y ángulos) y sobrescribe lo que el usuario completó.
 */
export const saveDossierFromForm = (offer: JobOffer, form: WingmanFormInput): JobDossier => {
  const base = getDossierForOffer(offer);
  const company = offer.company || base.targetCompany;
  const title = form.projectTitle?.trim() || base.projectTitle;
  const lastName = form.leadName.trim().split(' ').slice(-1)[0];
  const honorific = form.honorific?.trim();
  const qDe = form.questionDe?.trim();
  const qEn = form.questionEn?.trim();
  const sig = 'Daniel Santander Urrutia\nM.Sc. Candidate | Environmental Geophysicist\ndanisantander.urrutia@gmail.com';

  const email = { ...base.coldApproachEmail };
  if (qDe) {
    email.subjectDe = `Kurze fachliche Rückfrage zur Stelle: ${offer.title}`;
    email.bodyDe = `Sehr geehrter Herr ${honorific ? honorific + ' ' : ''}${lastName},\n\nich beschäftige mich mit Ihren Arbeiten bei ${company} und plane, mich auf die Stelle „${offer.title}“ zu bewerben. Vorab eine kurze fachliche Frage:\n\n${qDe}\n\nMit freundlichen Grüßen,\n${sig}`;
  }
  if (qEn) {
    email.subjectEn = `Brief technical question regarding: ${offer.title}`;
    email.bodyEn = `Dear ${honorific ? honorific + ' ' : ''}${lastName},\n\nI have been following your work at ${company} and plan to apply for the position "${offer.title}". Before doing so, a brief technical question:\n\n${qEn}\n\nSincerely,\n${sig}`;
  }

  const dossier: JobDossier = {
    ...base,
    id: `dossier-${offer.id}`,
    offerId: offer.id,
    targetCompany: company,
    projectTitle: title,
    createdAt: new Date().toISOString(),
    leadProfile: {
      ...base.leadProfile,
      name: form.leadName.trim(),
      titleHonorific: honorific || undefined,
      role: form.role?.trim() || base.leadProfile.role,
      institution: form.institution?.trim() || company,
      email: form.email?.trim() || undefined,
      researchFocus: form.researchFocus,
      styleNotes: form.styleNotes?.trim() || undefined
    },
    projectPainPoints: form.painPoints.length ? form.painPoints : base.projectPainPoints,
    technicalHooks: form.hooks.length ? form.hooks : base.technicalHooks,
    coldApproachEmail: email
  };
  saveDossier(dossier);
  return dossier;
};
