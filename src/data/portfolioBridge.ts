// ============================================================================
// PORTFOLIO BRIDGE & EVIDENCE DATALINKS // ALIANZA EMPLEO - PORTAFOLIO
// Single Source of Truth que conecta las postulaciones de Empleo con las
// láminas y pruebas multimedia del Portafolio de Daniel Santander.
// ============================================================================

export interface PortfolioEvidenceItem {
  id: string;
  sectionId: string;
  title: string;
  category: 'SCIENCE' | 'GEOPHYSICS' | 'POLICY' | 'COMMUNICATIONS' | 'ACADEMIC';
  role: string;
  institution: string;
  badge: string;
  summary: string;
  impactMetrics: string[];
  keyKeywords: string[];
  portfolioUrlAnchor: string;
  attachmentsForCV: {
    slotType: 'CHASSIS_SUMMARY' | 'BULLET_ACHIEVEMENT' | 'METHODOLOGY' | 'TECH_STACK';
    bulletEs: string;
    bulletEn: string;
    bulletDe: string;
  };
}

export const PORTFOLIO_EVIDENCE_CATALOG: PortfolioEvidenceItem[] = [
  {
    id: 'ev-001-peatlands',
    sectionId: '001',
    title: 'Sistemas Biofísicos, Dinámica de GEI en Turberas y Balance de Cuencas',
    category: 'SCIENCE',
    role: 'Científico Ambiental y Especialista en Sistemas Biofísicos',
    institution: 'CAU Kiel (Alemania) / AMU Poznań (Polonia)',
    badge: 'INVESTIGACIÓN CUANTITATIVA Y EVALUACIÓN BIOFÍSICA',
    summary: 'Modelación de flujos de carbono, metano y balances hídricos en turberas y lagos templados (Góreckie, Durowskie).',
    impactMetrics: [
      'Modelación cuantitativa de sumideros de carbono',
      'Evaluación de riesgo de eutrofización y rehumectación',
      'Monitoreo in-situ de gases de efecto invernadero'
    ],
    keyKeywords: ['Biogeoquímica', 'Carbon Accounting', 'GEI', 'Turberas', 'R', 'Python', 'Hydrology'],
    portfolioUrlAnchor: '#investigacion-cuantitativa',
    attachmentsForCV: {
      slotType: 'BULLET_ACHIEVEMENT',
      bulletEs: 'Modeló dinámicas biogeoquímicas de carbono y metano en turberas europeas, integrando balances hidrológicos con series temporales multianuales en R y Python.',
      bulletEn: 'Quantified peatland carbon and methane fluxes across European catchments, coupling hydrological water balances with high-resolution temporal time-series in R & Python.',
      bulletDe: 'Quantifizierte Kohlenstoff- und Methanflüsse in europäischen Mooren durch Kopplung hydrologischer Bilanzen mit Zeitreihenanalysen in R und Python.'
    }
  },
  {
    id: 'ev-002-smartparks',
    sectionId: '002',
    title: 'Smart Food Parks, Teledetección Espacial y Sensores de Laboratorio',
    category: 'GEOPHYSICS',
    role: 'Modelador de Datos y Especialista en Teledetección',
    institution: 'Laboratorio de Suelos CAU Kiel / FCFM U. de Chile',
    badge: 'CAPACIDADES COMPUTACIONALES & INSTRUMENTACIÓN',
    summary: 'Diseño de arquitectura de datos para gemelos digitales agroambientales, procesamiento multiespectral y sondajes geoeléctricos.',
    impactMetrics: [
      'Procesamiento satelital Sentinel-2 y Landsat en GEE',
      'Instrumentación de laboratorio de suelos e impedancia',
      'Desarrollo de pipelines en Python y scripts geoespaciales QGIS'
    ],
    keyKeywords: ['GIS', 'QGIS', 'Google Earth Engine', 'Sentinel-2', 'Sensores', 'Teledetección', 'Python'],
    portfolioUrlAnchor: '#capacidades-computacionales',
    attachmentsForCV: {
      slotType: 'BULLET_ACHIEVEMENT',
      bulletEs: 'Diseñó flujos de trabajo de teledetección satelital (Sentinel-2, Landsat) y sensores de laboratorio de suelos para evaluación de humedad, textura y degradación de tierras.',
      bulletEn: 'Engineered satellite Earth observation workflows (Sentinel-2, GEE) and laboratory soil sensors to map soil moisture, carbon sequestration, and land degradation.',
      bulletDe: 'Entwickelte Satelliten-Fernerkundungs-Pipelines (Sentinel-2, GEE) und Bodenlaborsensoren zur Kartierung von Bodenfeuchte und Landdegradation.'
    }
  },
  {
    id: 'ev-003-congreso',
    sectionId: '003',
    title: 'Exposición en el Congreso Nacional: Modelo Forestal y Riesgo de Incendios',
    category: 'POLICY',
    role: 'Vocero Técnico y Asesor en Gestión de Riesgo y Desastres',
    institution: 'Cámara de Diputadas y Diputados de Chile / Convención Constitucional',
    badge: 'GOBERNANZA, ASESORÍA EN POLÍTICAS Y ENFOQUE MULTIACTOR',
    summary: 'Defensa técnica ante la Comisión de Emergencia y Desastres sobre el impacto hidrológico e inflamabilidad de monocultivos de pino y eucalipto.',
    impactMetrics: [
      'Presentación oficial ante el parlamento chileno',
      'Asesoría técnica en salvaguardas ambientales y ordenamiento territorial',
      'Articulación con comunidades afectadas y cuerpos de bomberos'
    ],
    keyKeywords: ['Políticas Públicas', 'Legislación Ambiental', 'Gestión de Riesgo', 'Incendios Forestales', 'Stakeholder Engagement'],
    portfolioUrlAnchor: '#gobernanza-politicas',
    attachmentsForCV: {
      slotType: 'BULLET_ACHIEVEMENT',
      bulletEs: 'Compareció como perito técnico ante la Comisión de Emergencia del Congreso Nacional, presentando evidencia cuantitativa sobre riesgo hidrogeológico e incendios.',
      bulletEn: 'Delivered expert scientific testimony before the National Congressional Disaster Committee on forest catchment hydrology and wildfire risk modeling.',
      bulletDe: 'Lieferte gutachterliche wissenschaftliche Zeugenaussagen vor dem Katastrophenausschuss des Parlaments zur Hydrologie und Waldbrandrisikomodellierung.'
    }
  },
  {
    id: 'ev-004-epn-report',
    sectionId: '004',
    title: 'Informe EPN sobre Biomasa, Rewilding Aljezur y Rehumectación',
    category: 'SCIENCE',
    role: 'Autor Técnico Principal & Analista de Políticas',
    institution: 'Environmental Paper Network (EPN) / Aljezur Rewilding (Portugal)',
    badge: 'PUBLICACIONES TÉCNICAS E INFORMES DE POLÍTICA',
    summary: 'Investigación técnica y redacción de informes internacionales sobre impactos de bioenergía forestal, regeneración ecológica y sumideros de carbono.',
    impactMetrics: [
      'Publicación técnica internacional con alcance global',
      'Análisis de Directiva RED II y taxonomía verde de la Unión Europea',
      'Evaluación de proyectos de restauración de cuencas en Portugal y Chile'
    ],
    keyKeywords: ['EPN', 'Taxonomía UE', 'RED II', 'Bioeconomía', 'Policy Brief', 'Rewilding', 'LCA'],
    portfolioUrlAnchor: '#publicaciones-tecnicas',
    attachmentsForCV: {
      slotType: 'BULLET_ACHIEVEMENT',
      bulletEs: 'Coautor de informes técnicos para la red europea EPN sobre directivas de bioenergía de la UE (RED II) y su compatibilidad con la restauración de sumideros de carbono.',
      bulletEn: 'Co-authored technical policy briefs for the European Paper Network (EPN) assessing EU biomass taxonomy (RED II) and carbon sink restoration integrity.',
      bulletDe: 'Mitautor technischer Grundsatzberichte für das europäische EPN-Netzwerk zur EU-Biomassetaxonomie (RED II) und der Integrität von Kohlenstoffsenken.'
    }
  },
  {
    id: 'ev-005-conferencias',
    sectionId: '005',
    title: 'Conferencias Internacionales: Bonn, Oslo, Bogotá, San José',
    category: 'COMMUNICATIONS',
    role: 'Conferencista Internacional & Panelista Multilateral',
    institution: 'ENJUST / Cumbres Climáticas Internacionales',
    badge: 'TRANSFERENCIA DE CONOCIMIENTO & DIPLOMACIA CIENTÍFICA',
    summary: 'Representación en cumbres internacionales de gobernanza climática, oratoria técnica y articulación de redes intercontinentales.',
    impactMetrics: [
      'Ponencias magistrales en Alemania, Noruega, Colombia y Costa Rica',
      'Dominio de debates técnicos en español, inglés y alemán',
      'Construcción de alianzas académicas e institucionales globales'
    ],
    keyKeywords: ['Oratoria', 'Diplomacia Científica', 'Conferencias', 'Redes Internacionales', 'Inglés C1', 'Alemán B1'],
    portfolioUrlAnchor: '#conferencias-internacionales',
    attachmentsForCV: {
      slotType: 'BULLET_ACHIEVEMENT',
      bulletEs: 'Expositor invitado en conferencias científicas y multilaterales en Bonn, Oslo y Bogotá, articulando hallazgos biofísicos con gobernanza territorial.',
      bulletEn: 'Keynote speaker at international scientific and multilateral forums in Bonn, Oslo, and Bogotá, translating biophysical data into policy-grade recommendations.',
      bulletDe: 'Eingeladener Referent auf internationalen Foren in Bonn, Oslo und Bogotá; Übertragung bio-physikalischer Daten in politische Handlungsempfehlungen.'
    }
  },
  {
    id: 'ev-006-plp-media',
    sectionId: 'plp',
    title: 'Periodismo Ciudadano & Dirección Ejecutiva: Primera Línea Prensa (+700k)',
    category: 'COMMUNICATIONS',
    role: 'Fundador y Director Ejecutivo',
    institution: 'Primera Línea Prensa / Red Maule Sur',
    badge: 'COMUNICACIÓN ESTRATÉGICA & IMPACTO MASIVO',
    summary: 'Liderazgo editorial y tecnológico de un medio digital independiente con más de 700.000 seguidores en redes sociales y transmisiones radiales regionales.',
    impactMetrics: [
      '+700.000 seguidores orgánicos en redes sociales',
      'Cobertura en tiempo real de crisis sociales y ambientales',
      'Gestión de equipo editorial y producción audiovisual independiente'
    ],
    keyKeywords: ['Media Strategy', 'Audiencia +700k', 'Dirección de Medios', 'Storytelling', 'Comunicaciones'],
    portfolioUrlAnchor: '#primera-linea-prensa',
    attachmentsForCV: {
      slotType: 'BULLET_ACHIEVEMENT',
      bulletEs: 'Fundó y dirigió una red de comunicación digital con más de 700.000 seguidores orgánicos, gestionando cobertura informativa en tiempo real y campañas cívicas.',
      bulletEn: 'Founded and directed a digital communication media outlet reaching over 700,000 organic followers, coordinating crisis coverage and public advocacy campaigns.',
      bulletDe: 'Gründete und leitete ein digitales Mediennetzwerk mit über 700.000 Followern und koordinierte Kampagnen zur Bürgerbeteiligung.'
    }
  },
  {
    id: 'ev-007-titulaciones',
    sectionId: '007',
    title: 'Doble Titulación de Maestría Europea en Ciencias & Geofísica U. de Chile',
    category: 'ACADEMIC',
    role: 'Graduado con Distinción / Doble M.Sc. Europeo',
    institution: 'CAU Kiel (Alemania) • AMU Poznań (Polonia) • FCFM U. de Chile',
    badge: 'TITULACIONES ACADÉMICAS & REFERENCIAS DE ÉLITE',
    summary: 'Formación de posgrado de excelencia con enfoque en gobernanza ambiental de la UE, modelación cuantitativa y ciencias de la Tierra.',
    impactMetrics: [
      'Doble M.Sc. Environmental Management (Alemania) & Environmental Protection (Polonia)',
      'Licenciatura en Geofísica, FCFM Universidad de Chile (Aprobado con Distinción)',
      'Referencias académicas directas de CAU Kiel, AMU Poznań y WSL Davos'
    ],
    keyKeywords: ['Doble M.Sc.', 'CAU Kiel', 'AMU Poznan', 'U. de Chile', 'Geofísica', 'AufenthG §20', 'Ley 14/2013'],
    portfolioUrlAnchor: '#titulaciones-academicas',
    attachmentsForCV: {
      slotType: 'CHASSIS_SUMMARY',
      bulletEs: 'Doble M.Sc. en Gestión Ambiental por CAU Kiel (Alemania) y Protección Ambiental por AMU Poznań (Polonia), Licenciado en Geofísica por la Universidad de Chile con Distinción.',
      bulletEn: 'Double M.Sc. in Environmental Management (CAU Kiel, Germany) and Environmental Protection (AMU Poznań, Poland); B.Sc. in Geophysics from Universidad de Chile with Distinction.',
      bulletDe: 'Doppel-M.Sc. in Umweltmanagement (CAU Kiel) und Umweltschutz (AMU Poznań); B.Sc. in Geophysik an der Universidad de Chile mit Auszeichnung.'
    }
  }
];

// Helper to find evidence items matching specific job offer keywords
export function getRecommendedEvidenceForOffer(keywords: string[]): PortfolioEvidenceItem[] {
  const normalized = keywords.map(k => k.toLowerCase());
  return PORTFOLIO_EVIDENCE_CATALOG.filter(item => {
    return item.keyKeywords.some(kw => 
      normalized.some(nk => nk.includes(kw.toLowerCase()) || kw.toLowerCase().includes(nk))
    );
  });
}
