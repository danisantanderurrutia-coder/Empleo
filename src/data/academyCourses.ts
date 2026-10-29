import type { AcademyCourse } from '../types/academy';

export const ACADEMY_COURSES: AcademyCourse[] = [
  // ==========================================================================
  // 1. SWAT+ & MODELACIÓN HIDROLÓGICA DE CUENCAS (gap-swat)
  // ==========================================================================
  {
    id: 'course-swat-plus-official',
    title: 'SWAT+ Model Development, Watershed Delineation & QSWAT+ Workflow',
    provider: 'Texas A&M AgriLife Research / USDA-ARS',
    gapId: 'gap-swat',
    gapName: 'Modelación Hidrológica SWAT+ / Iber',
    costType: 'FREE',
    costLabel: '100% Gratuito (Código Abierto & Workshops)',
    durationHours: 35,
    certificationType: 'Certificado de Asistencia Oficial SWAT+ Community',
    url: 'https://swat.tamu.edu/software/plus/',
    syllabusSummary: 'Configuración de cuencas en QSWAT+, integración con datos espaciales DEM y Sentinel, parametrización de HRUs (Unidades de Respuesta Hidrológica), balance hídrico y calibración con SWAT+ Toolbox.',
    difficulty: 'INTERMEDIATE',
    matchImpact: '+18% en vacantes de modelación fluvial y consultoría ambiental en DACH y Euskadi',
    skillsLearned: ['QSWAT+', 'GIS Hidrológico', 'Calibración de Caudales', 'Transporte de Sedimentos', 'HRU Mapping'],
    languages: ['EN'],
    badgeIcon: '🌊',
    xpValue: 450
  },
  {
    id: 'course-ihe-delft-swat',
    title: 'River Basin Modelling with SWAT: From Data Preparation to Simulation',
    provider: 'IHE Delft Institute for Water Education (OpenCourseWare)',
    gapId: 'gap-swat',
    gapName: 'Modelación Hidrológica SWAT+ / Iber',
    costType: 'FREE',
    costLabel: '100% Gratuito (OpenCourseWare)',
    durationHours: 40,
    certificationType: 'Insignia de Finalización Abierta',
    url: 'https://ocw.un-ihe.org/',
    syllabusSummary: 'Modelación integral de cuencas fluviales, acoplamiento con series climáticas ERA5, evaluación de impactos de cambio de uso de suelo y mitigación de inundaciones extremas.',
    difficulty: 'ADVANCED',
    matchImpact: '+15% en institutos de investigación hidrológica (BfG, LUBW, URA)',
    skillsLearned: ['Modelado de Cuencas', 'ERA5 Reanalysis', 'Evaluación de Escenarios Climáticos', 'Python SWAT'],
    languages: ['EN'],
    badgeIcon: '💧',
    xpValue: 400
  },

  // ==========================================================================
  // 2. DIRECTIVA DE SUELOS UE & MÉTRICAS DE SALUD DEL SUELO (gap-soil-directive)
  // ==========================================================================
  {
    id: 'course-eu-academy-soil-law',
    title: 'EU Soil Strategy for 2030 and the Soil Monitoring Law Framework',
    provider: 'EU Academy (Comisión Europea)',
    gapId: 'gap-soil-directive',
    gapName: 'EU Soil Monitoring Law (Protocolos 2024)',
    costType: 'FREE',
    costLabel: '100% Gratuito (Oficial Comisión Europea)',
    durationHours: 20,
    certificationType: 'Certificado Oficial de la Unión Europea (EU Academy Digital Credential)',
    url: 'https://academy.europa.eu/',
    syllabusSummary: 'Directiva de Monitorización del Suelo (COM/2023/416), descriptores de salud edáfica, balance de carbono orgánico en suelos agrícolas y turberas, y criterios de certificación de absorción de carbono (CRCF).',
    difficulty: 'INTERMEDIATE',
    matchImpact: '+22% en roles de asesoría regulatoria agrícola y técnica ambiental en la UE',
    skillsLearned: ['EU Soil Law', 'Carbono Orgánico del Suelo (SOC)', 'Protocolos LUCAS', 'Marco Regulatorio Verde UE'],
    languages: ['EN'],
    badgeIcon: '🌱',
    xpValue: 500
  },
  {
    id: 'course-copernicus-soil-health',
    title: 'Earth Observation for Soil Protection and Sustainable Agriculture',
    provider: 'Copernicus Academy / ESA / EO College',
    gapId: 'gap-soil-directive',
    gapName: 'EU Soil Monitoring Law (Protocolos 2024)',
    costType: 'FREE',
    costLabel: '100% Gratuito (Programa Espacial de la UE)',
    durationHours: 30,
    certificationType: 'Certificado Verificable Copernicus / ESA EO College',
    url: 'https://eo-college.org/',
    syllabusSummary: 'Uso de Sentinel-1 (radar SAR) y Sentinel-2 (óptico multiespectral) para estimación de humedad superficial del suelo, rugosidad, índice de vegetación y detección de erosión laminar.',
    difficulty: 'INTERMEDIATE',
    matchImpact: '+20% en vacantes de teledetección agroambiental y gemelos digitales de suelo',
    skillsLearned: ['Sentinel-1 SAR Soil Moisture', 'Sentinel-2 Indices', 'SNAP Tool', 'Teledetección Edáfica'],
    languages: ['EN'],
    badgeIcon: '🛰️',
    xpValue: 450
  },

  // ==========================================================================
  // 3. CSRD, ESRS E4 & TAXONOMÍA EUROPEA DE SOSTENIBILIDAD (gap-csrd)
  // ==========================================================================
  {
    id: 'course-eu-esrs-csrd-efrag',
    title: 'Corporate Sustainability Reporting Directive (CSRD) & ESRS Standards',
    provider: 'EU Academy / EFRAG Educational Gateway',
    gapId: 'gap-csrd',
    gapName: 'Auditoría de Carbono Corporativo & CSRD',
    costType: 'FREE',
    costLabel: '100% Gratuito (Portal Institucional UE)',
    durationHours: 25,
    certificationType: 'Certificado Digital de Competencia ESRS (EU Academy)',
    url: 'https://academy.europa.eu/',
    syllabusSummary: 'Análisis de Doble Materialidad, arquitectura de las normas ESRS (con foco en ESRS E1 Cambio Climático y ESRS E4 Biodiversidad y Ecosistemas), alineamiento con la Taxonomía Verde de la UE y gobernanza ASG.',
    difficulty: 'INTERMEDIATE',
    matchImpact: '+25% en firmas de auditoría de sostenibilidad y departamentos corporativos ESG',
    skillsLearned: ['CSRD / ESRS', 'Doble Materialidad', 'Taxonomía de la UE', 'Gobernanza ESG', 'Auditoría no Financiera'],
    languages: ['EN', 'ES'],
    badgeIcon: '📊',
    xpValue: 550
  },
  {
    id: 'course-climate-kic-carbon-accounting',
    title: 'Corporate Climate Strategy, GHG Accounting & Science Based Targets (SBTi)',
    provider: 'EIT Climate-KIC / Coursera',
    gapId: 'gap-csrd',
    gapName: 'Auditoría de Carbono Corporativo & CSRD',
    costType: 'FREE_AUDIT',
    costLabel: 'Auditoría Gratuita / Financial Aid disponible',
    durationHours: 28,
    certificationType: 'Certificado Profesional Compartible en LinkedIn',
    url: 'https://www.coursera.org/',
    syllabusSummary: 'Metodología GHG Protocol para Alcance 1, 2 y 3, establecimiento de objetivos net-zero según SBTi, planes de descarbonización industrial e integración de métricas en memorias corporativas.',
    difficulty: 'INTERMEDIATE',
    matchImpact: '+18% en puestos de consultor sénior de descarbonización y huella de carbono',
    skillsLearned: ['GHG Protocol (Alcance 1-2-3)', 'SBTi Targets', 'Planes de Transición', 'Data Analytics Climático'],
    languages: ['EN'],
    badgeIcon: '📉',
    xpValue: 400
  },

  // ==========================================================================
  // 4. METODOLOGÍA PM² & GESTIÓN DE CONSORCIOS HORIZON EUROPE (gap-pm2, gap-horizon)
  // ==========================================================================
  {
    id: 'course-pm2-essentials-eu',
    title: 'PM² Project Management Methodology Essentials',
    provider: 'Centre of Excellence in PM² (CoEPM²) / EU Academy',
    gapId: 'gap-pm2',
    gapName: 'Metodología PM² de la Comisión Europea / PRINCE2',
    costType: 'FREE',
    costLabel: '100% Gratuito (Comisión Europea CoEPM²)',
    durationHours: 30,
    certificationType: 'Certificado Oficial de Formación PM² de la Unión Europea',
    url: 'https://academy.europa.eu/',
    syllabusSummary: 'Gobernanza de proyectos bajo el estándar oficial de la Comisión Europea: ciclo de 4 fases (Iniciación, Planificación, Ejecución, Cierre), matriz RASCI de consorcio, planes de comunicación y gestión de entregables.',
    difficulty: 'BEGINNER',
    matchImpact: '+24% en roles de Project Manager en consorcios europeos e instituciones públicas',
    skillsLearned: ['Metodología PM²', 'Gobernanza de Proyectos UE', 'Matriz RASCI', 'Gestión de Stakeholders'],
    languages: ['EN'],
    badgeIcon: '🇪🇺',
    xpValue: 500
  },
  {
    id: 'course-horizon-europe-grant-prep',
    title: 'Horizon Europe: Grant Proposal Preparation, Financials & Consortium Lifecycle',
    provider: 'European Commission Funding & Tenders / NCP Network',
    gapId: 'gap-horizon',
    gapName: 'Redacción de Propuestas Horizon Europe (Grant Writing)',
    costType: 'FREE',
    costLabel: '100% Gratuito (Portal Oficial de Financiación UE)',
    durationHours: 35,
    certificationType: 'Insignia de Participación en Programas Marco UE',
    url: 'https://ec.europa.eu/info/funding-tenders/',
    syllabusSummary: 'Estructuración de propuestas en tres pilares: Excelencia, Impacto y Calidad de la Implementación. Modelación de presupuestos de consorcio, acuerdos de consorcio (DESCA), propiedad intelectual e informes periódicos.',
    difficulty: 'ADVANCED',
    matchImpact: '+30% en centros tecnológicos (Tecnalia, Helmholtz, AZTI) y gestores de I+D',
    skillsLearned: ['Horizon Europe Grants', 'Acuerdos DESCA', 'Budgeting de Consorcios', 'Lump Sum Funding'],
    languages: ['EN'],
    badgeIcon: '📑',
    xpValue: 550
  },

  // ==========================================================================
  // 5. CAPTACIÓN DE FONDOS GRASSROOTS & FILANTROPÍA CLIMÁTICA (gap-grassroots-funds)
  // ==========================================================================
  {
    id: 'course-un-cc-learn-climate-finance',
    title: 'Climate Finance and Grassroots Mobilization for Environmental Projects',
    provider: 'UN CC:Learn (United Nations) & Philanthropy University',
    gapId: 'gap-grassroots-funds',
    gapName: 'Gestión de Fondos Filantrópicos & Cooperación Internacional',
    costType: 'FREE',
    costLabel: '100% Gratuito (Naciones Unidas)',
    durationHours: 24,
    certificationType: 'Certificado Oficial de las Naciones Unidas (UN CC:Learn)',
    url: 'https://www.unccelearn.org/',
    syllabusSummary: 'Mapeo de donantes filantrópicos internacionales (Patagonia 1% for the Planet, EOCA, EuroNatur, Oak Foundation), redacción de solicitudes de subvención, métricas de impacto de campo y rendición ética de cuentas.',
    difficulty: 'INTERMEDIATE',
    matchImpact: '+20% en ONGs ambientales, fundaciones de conservación y proyectos territoriales',
    skillsLearned: ['Filantropía Ambiental', 'Grant Writing Grassroots', 'Métricas de Impacto', 'Rendición de Cuentas'],
    languages: ['EN', 'ES'],
    badgeIcon: '🌍',
    xpValue: 450
  },

  // ==========================================================================
  // 6. MEDIA RELATIONS B2B & CAMPAÑAS DE PRENSA AMBIENTAL (gap-media-b2b)
  // ==========================================================================
  {
    id: 'course-dw-media-science-comms',
    title: 'Strategic Science Communication & International Media Outreach',
    provider: 'Deutsche Welle Akademie / European Journalism Centre',
    gapId: 'gap-media-b2b',
    gapName: 'Media Relations B2B & Lobbying Científico en Europa',
    costType: 'FREE',
    costLabel: '100% Gratuito (Cooperación Pública DW)',
    durationHours: 22,
    certificationType: 'Certificado Digital DW Akademie',
    url: 'https://www.dw.com/en/dw-akademie/',
    syllabusSummary: 'Traducción de papers científicos complejos a comunicados de prensa de alto impacto para agencias de noticias (Reuters, EFE, DPA), gestión de portavocía ante crisis ecológicas y relación continuada con periodistas.',
    difficulty: 'INTERMEDIATE',
    matchImpact: '+16% en puestos de Director de Comunicación Científica y Media Relations',
    skillsLearned: ['Press Release B2B', 'Media Outreach', 'Crisis Communication', 'Storytelling Científico'],
    languages: ['EN', 'DE'],
    badgeIcon: '🎙️',
    xpValue: 400
  },

  // ==========================================================================
  // 7. ALEMÁN PROFESIONAL C1 PARA PROYECTOS CIENTÍFICOS Y COOPERACIÓN (gap-de-c1)
  // ==========================================================================
  {
    id: 'course-vhs-deutsch-arbeitsplatz-c1',
    title: 'Deutsch am Arbeitsplatz C1: Fachsprache für Wissenschaft und Umwelttechnik',
    provider: 'vhs-Lernportal (BMBF - Ministerio Federal de Educación e Investigación de Alemania)',
    gapId: 'gap-de-c1',
    gapName: 'Alemán Profesional C1 (Fachsprache Geodaten)',
    costType: 'FREE',
    costLabel: '100% Gratuito y Financiado por el BMBF',
    durationHours: 60,
    certificationType: 'Certificado Oficial vhs-Lernportal reconocido en Alemania',
    url: 'https://www.vhs-lernportal.de/',
    syllabusSummary: 'Perfeccionamiento comunicativo en entorno laboral alemán: redacción de informes técnicos (Fachberichte), argumentación en comités evaluadores, correspondencia con ministerios (BMUV, UBA) y terminología científica C1.',
    difficulty: 'ADVANCED',
    matchImpact: '+35% en acceso a posiciones de liderazgo científico y proyectos bilaterales en Alemania',
    skillsLearned: ['Wissenschaftsdeutsch C1', 'Fachsprache Umwelt', 'Formaler Schriftverkehr', 'Verhandlungsführung'],
    languages: ['DE'],
    badgeIcon: '🇩🇪',
    xpValue: 600
  },
  {
    id: 'course-dw-wissenschaftsdeutsch',
    title: 'Wissenschaftsdeutsch & Akademische Kommunikation C1',
    provider: 'Deutsche Welle Learn German / Goethe-Institut Resource Track',
    gapId: 'gap-de-c1',
    gapName: 'Alemán Profesional C1 (Fachsprache Geodaten)',
    costType: 'FREE',
    costLabel: '100% Gratuito (Servicio Público Alemán)',
    durationHours: 40,
    certificationType: 'Comprobante de Módulos Completados DW',
    url: 'https://learngerman.dw.com/',
    syllabusSummary: 'Estructuras sintácticas complejas de la literatura científica alemana (Partizipialattribute, Passiversatzformen), presentación oral de hipótesis y defensa de resultados empíricos.',
    difficulty: 'ADVANCED',
    matchImpact: '+25% en universidades e institutos de investigación (Kiel, Potsdam, Braunschweig)',
    skillsLearned: ['Gramática C1 Académica', 'Ponencias Científicas', 'Discusión Metodológica'],
    languages: ['DE'],
    badgeIcon: '📚',
    xpValue: 450
  },

  // ==========================================================================
  // 8. CERTIFICACIÓN PSPO I (SCRUM.ORG) PARA PRODUCT OWNER DE IA (gap-pspo-ai)
  // ==========================================================================
  {
    id: 'course-scrum-org-pspo1-prep',
    title: 'Professional Scrum Product Owner™ (PSPO I) Open Assessment & Preparation Track',
    provider: 'Scrum.org',
    gapId: 'gap-pspo-ai',
    gapName: 'Certificación PSPO I Scrum & AI Systems Evaluation',
    costType: 'OFFICIAL_EXAM',
    costLabel: 'Preparación Abierta / Examen Oficial Internacional',
    durationHours: 25,
    certificationType: 'Certificación Oficial Internacional PSPO I de por vida (Scrum.org)',
    url: 'https://www.scrum.org/open-assessments/professional-scrum-product-owner-i-open-assessment',
    syllabusSummary: 'Gestión de valor del producto, refinamiento del Product Backlog, maximización de retorno de inversión (ROI), definición de métricas de entrega, y aplicación práctica en squads ágiles de IA y Climate-Tech.',
    difficulty: 'INTERMEDIATE',
    matchImpact: '+28% en vacantes de AI Product Owner, Technical Lead y Software de Clima en Europa',
    skillsLearned: ['Scrum Framework', 'Product Backlog Management', 'Maximización de Valor', 'Métricas Ágiles', 'Roadmapping'],
    languages: ['EN'],
    badgeIcon: '⚡',
    xpValue: 600
  },
  {
    id: 'course-deeplearning-ai-product-mgr',
    title: 'AI Product Management Specialization: From Scoping to Deployment',
    provider: 'DeepLearning.AI / Coursera',
    gapId: 'gap-pspo-ai',
    gapName: 'Certificación PSPO I Scrum & AI Systems Evaluation',
    costType: 'FREE_AUDIT',
    costLabel: 'Auditoría Gratuita / Financial Aid disponible',
    durationHours: 35,
    certificationType: 'Especialización Profesional DeepLearning.AI',
    url: 'https://www.coursera.org/',
    syllabusSummary: 'Diseño de sistemas de aprendizaje automático, especificación de requerimientos para modelos LLM/visión, métricas de evaluación de IA (precision, recall, latencia), ética algorítmica y despliegue continuo.',
    difficulty: 'ADVANCED',
    matchImpact: '+22% en empresas de software geoespacial y plataformas de inteligencia climática',
    skillsLearned: ['AI Product Lifecycle', 'Evaluación de Modelos', 'Data Quality Assurance', 'MLOps Basics'],
    languages: ['EN'],
    badgeIcon: '🧠',
    xpValue: 500
  }
];

export const INITIAL_COURSE_PROGRESS: Record<string, { status: 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED'; progressPercent: number; startedAt?: string; completedAt?: string; notes?: string }> = {
  'course-swat-plus-official': {
    status: 'IN_PROGRESS',
    progressPercent: 45,
    startedAt: '2026-10-15',
    notes: 'Módulos 1-3 completados. Calibrando cuenca piloto en QSWAT+ con datos de elevación y Sentinel-2.'
  },
  'course-eu-academy-soil-law': {
    status: 'IN_PROGRESS',
    progressPercent: 60,
    startedAt: '2026-10-10',
    notes: 'Revisando descriptores oficiales de degradación y metodologías de muestreo para turberas degradadas.'
  },
  'course-scrum-org-pspo1-prep': {
    status: 'IN_PROGRESS',
    progressPercent: 75,
    startedAt: '2026-10-01',
    notes: 'Simulacros de Open Assessment promediando 95%. Listo para la fecha del examen oficial.'
  },
  'course-vhs-deutsch-arbeitsplatz-c1': {
    status: 'IN_PROGRESS',
    progressPercent: 50,
    startedAt: '2026-09-20',
    notes: 'Unidades de correspondencia técnica oficial y comités de expertos evaluadas.'
  }
};
