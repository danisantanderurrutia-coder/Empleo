import type { JobOffer } from '../types/offers';
import { CANONICAL_CONTACT } from '../data/verifiedCvFacts';

export type CoverLetterLang = 'es' | 'en' | 'de';

export interface CoverLetterConfig {
  lang: CoverLetterLang;
  offer?: Partial<JobOffer> | null;
  recipientName?: string;
  recipientRole?: string;
  recipientOrg?: string;
  recipientAddress?: string;
  date?: string;
  customBodyText?: string;
}

export interface AntiAiAuditResult {
  passed: boolean;
  clicheCount: number;
  detectedCliches: string[];
  scientificTermsFound: string[];
  hasMethodology: boolean;
  hasMassBalancePerspective: boolean;
}

export interface BuiltCoverLetter {
  config: CoverLetterConfig;
  lang: CoverLetterLang;
  sender: {
    name: string;
    headline: string;
    email: string;
    portfolio: string;
    linkedin: string;
    location: string;
  };
  recipient: {
    org: string;
    role?: string;
    address?: string;
  };
  date: string;
  referenceSubject: string;
  salutation: string;
  paragraphs: string[];
  closing: string;
  signature: string;
  fullMarkdown: string;
  audit: AntiAiAuditResult;
}

export interface SavedCoverLetterVersion {
  id: string;
  name: string;
  createdAt: string;
  lang: CoverLetterLang;
  offerId?: string;
  offerLabel?: string;
  customBodyText: string;
}

// ----------------------------------------------------------------------------
// Listas de clichés prohibidos (Anti-AI Clichés) y términos científicos requeridos
// ----------------------------------------------------------------------------

export const FORBIDDEN_AI_CLICHES = [
  'thrilled to',
  'excited to apply',
  'delve into',
  'testament to',
  'beacon of',
  'aligns seamlessly',
  'seamlessly align',
  'in conclusion',
  'passionate about',
  'foster',
  'deep dive',
  'dynamic environment',
  'pleased to submit',
  'testimonio de',
  'faro de',
  'se alinea a la perfección',
  'se alinea perfectamente',
  'en conclusión',
  'apasionado por',
  'fomentar',
  'estoy emocionado',
  'estoy entusiasmado',
  'me complace postular',
  'ich freue mich sehr',
  'leidenschaftlich',
  'nahtlos',
  'zusammenfassend',
  'zeugnis für'
];

export const REQUIRED_SCIENTIFIC_MARKERS = [
  'resistividad',
  'resistivity',
  'resistiv',
  'sev',
  'ves',
  'eddy covariance',
  'flujo',
  'flux',
  'flüsse',
  'geofísica',
  'geophysics',
  'geophysik',
  'balance',
  'bilanz',
  'kiel',
  'wallener au',
  'chile',
  'r',
  'ghg',
  'gei',
  'biomasse',
  'biomass',
  'biomasa'
];

export const auditTextForAiCliches = (text: string): AntiAiAuditResult => {
  const lower = text.toLowerCase();
  const detectedCliches = FORBIDDEN_AI_CLICHES.filter((c) => lower.includes(c));
  const scientificTermsFound = REQUIRED_SCIENTIFIC_MARKERS.filter((m) => lower.includes(m));

  const hasMethodology = ['sev', 'ves', 'eddy covariance', 'resistiv', 'r', 'cámaras', 'chambers', 'hauben', 'three.js', 'gis'].some((t) => lower.includes(t));
  const hasMassBalancePerspective = ['balance', 'bilanz', 'flujo', 'flux', 'flüsse', 'subsuperficial', 'subsurface', 'tensión', 'spannung', 'stress', 'carbon', 'kohlenstoff', 'carbono'].some((t) => lower.includes(t));

  return {
    passed: detectedCliches.length === 0 && scientificTermsFound.length >= 3,
    clicheCount: detectedCliches.length,
    detectedCliches,
    scientificTermsFound,
    hasMethodology,
    hasMassBalancePerspective
  };
};

// ----------------------------------------------------------------------------
// Redacción de Borrador Base Científico Riguroso (Estrictamente Anti-AI)
// ----------------------------------------------------------------------------

export const buildDefaultScientificDraft = (lang: CoverLetterLang, offer?: CoverLetterConfig['offer']): string[] => {
  const offerTitle = offer?.title || (lang === 'en' ? 'the announced position' : lang === 'de' ? 'die ausgeschriebene Stelle' : 'la posición convocada');
  const company = offer?.company || (lang === 'en' ? 'your organization' : lang === 'de' ? 'Ihre Organisation' : 'su organización');

  const isUba = Boolean(
    offer?.id?.includes('uba') ||
    offer?.company?.toLowerCase().includes('umweltbundesamt') ||
    offer?.company?.toLowerCase().includes('uba') ||
    offer?.title?.toLowerCase().includes('ki-lab') ||
    offer?.title?.toLowerCase().includes('1499096') ||
    offer?.title?.toLowerCase().includes('product owner')
  );

  if (lang === 'de') {
    if (isUba) {
      return [
        `ich bewerbe mich auf die ausgeschriebene Stelle als Spezialist*in im Bereich KI-Projektmanagement und KI Product Owner im Anwendungslabor für Künstliche Intelligenz und Big Data (KI-Lab) des Umweltbundesamtes (Kennziffer 8/LB/26, Interamt-ID 1499096). Als quantitativer Umweltgeophysiker und Doppel-M.Sc.-Kandidat für Umweltmanagement (CAU Kiel) und Umweltschutz (AMU Poznań) verbinde ich ein fundiertes MINT-Fundament mit praxiserprobter Product-Ownership-Erfahrung in der Konzeption und eigenständigen Realisierung dreier ökologischer Softwareanwendungen. Mein methodischer Fokus liegt auf der präzisen Übersetzung komplexer biogeochemischer Fachanforderungen in agile Backlogs (Scrum) und auditsichere Datenpipelines für den Verwaltungsvollzug.`,

        `Mein wissenschaftlicher Ansatz basiert auf messbaren biophysikalischen Bilanzen und methodischer Transparenz: An der Universidad de Chile (Abschluss mit Auszeichnung) untersuchte ich im Maule-Becken mittels geoelektrischer Schlumberger-Tiefensondierungen (VES) die Veränderung der subsuperfiziellen Resistivität und den Grundwasserabfall unter forstlichen Monokulturen. An der CAU Kiel quantifiziere ich auf der wiedervernässten Moorfläche Wallener Au Treibhausgasflüsse (CO₂, CH₄) mittels geschlossener Hauben und hochfrequenter Eddy Covariance sowie die Vorbelastungsspannung des Bodens (σp = 62,4 kPa) mit reproduzierbaren R-Pipelines. Diese Feld- und Sensorerfahrung schützt mich vor praxisfernen Annahmen bei Datenqualität und Sensorrauschen.`,

        `Den Schritt von der reinen Umweltforschung zur agilen Software- und Produktentwicklung habe ich durch die eigenständige Konzeption und Entwicklung dreier Umwelt-Software-Lösungen vollzogen:
1. „Wetland Monitor“: Eine interaktive 3D-Webanwendung (React, Three.js, R) zur räumlich-zeitlichen Modellierung von Moorwiedervernässung und Eddy-Covariance-Flüssen.
2. „AgriTwin“: Ein landwirtschaftlicher digitaler Zwilling, der kontinuierliche IoT-Bodenfeuchte-Sensorik mit Copernicus-Satellitendaten (Sentinel-2 NDVI/NDRE) im Weinbau fusioniert.
3. „Rewilding Field Suite“: Eine modulare, offline-fähige Progressive Web App (PWA mit lokaler IndexedDB-Architektur und GIS-Schichtfusion) für standardisierte Feldprotokolle im ökologischen Gewässerschutz, Biomassemonitoring und Waldbrandrisiko-Management (Aljezur, Portugal).`,

        `In allen drei Vorhaben übernahm ich die Rolle des Product Owners: von der Bedarfsanalyse und Datenmodellierung über das Anforderungsmanagement im Backlog bis hin zur Usability-Validierung im Gelände. Ergänzt wird diese Praxis durch Verhandlungssicherheit im öffentlichen Raum: als geladener Sachverständiger vor der Kommission für Katastrophenschutz der chilenischen Abgeordnetenkammer und als Hauptautor internationaler Fachanalysen zu Kohlenstoff- und Biomasse-Bilanzen (EPN & Global Forest Coalition, 2023).`,

        `Als Absolvent einer deutschen Hochschule stehe ich dem Umweltbundesamt mit voller vertraglicher Verfügbarkeit (§20 AufenthG), verhandlungssicherem Englisch (C2), praxiserprobtem Deutsch (B1–B2) und hoher Einsatzbereitschaft für den Standort Leipzig sowie mobiles Arbeiten zur Verfügung. Für Rückfragen stehe ich Ihnen gerne zur Verfügung.`
      ];
    }

    return [
      `ich bewerbe mich hiermit auf die Position als ${offerTitle} bei ${company}. Als Umweltgeophysiker und Doppel-M.Sc.-Kandidat für Umweltmanagement (CAU Kiel) und Umweltschutz (AMU Poznań) basiert mein methodischer Ansatz auf quantitativen In-situ-Messungen und biophysikalischen Massenbilanzen im Boden- und Moorökosystem. Ich teile das wissenschaftliche Engagement für nachweisbare Kohlenstoffintegrität und die kritische Distanz zu spekulativen Modellierungsansätzen ohne empirische Feldvalidierung.`,

      `Meine wissenschaftliche Grundlage wurde an der Universidad de Chile gelegt (Abschluss mit Auszeichnung). In meiner Abschlussarbeit im Maule-Becken nutzte ich geoelektrische Schlumberger-Tiefensondierungen (VES), um subsurface Widerstandsanomalien und den durch forstliche Monokulturen beschleunigten Grundwasserabsturz unter Dürrebedingungen quantitativ zu erfassen.`,

      `Diese Feldmessungen überführte ich in wissenschaftsbasierte Politikberatung und Öffentlichkeitsarbeit: als Hauptautor des internationalen Berichts zu forstlicher Biomasse und RED-III-Richtlinien (EPN & Global Forest Coalition, 2023), durch ein Gutachten vor der Sonderkommission für Katastrophenschutz der chilenischen Abgeordnetenkammer sowie in evidenzbasierten Fachkampagnen.`,

      `Im Rahmen meiner M.Sc.-Forschung an der CAU Kiel untersuche ich das wiedervernässte Moor Wallener Au (Schleswig-Holstein). Mein Schwerpunkt liegt auf der Quantifizierung von Treibhausgasflüssen (CO₂, CH₄) mittels geschlossener Hauben und Eddy-Covariance-Daten, der Paludikultur und der Bestimmung der Vorbelastung des Bodens (σp = 62,4 kPa), verknüpft mit reproduzierbaren Auswertungen in R (Wetland Monitor).`,

      `Diese Verbindung aus geophysikalischer Feldanalytik, mikrometeorologischer Flussmessung und Datenprogrammierung bringe ich gezielt in die Vorhaben von ${company} ein. Als Absolvent einer deutschen Universität verfüge ich über volle vertragliche Verfügbarkeit nach §20 AufenthG sowie Arbeitsfähigkeit in Deutsch (B1–B2), Englisch (C2) und Spanisch (Muttersprache).`
    ];
  }

  if (lang === 'en') {
    if (isUba) {
      return [
        `I am submitting my application for the position of AI Project Management Specialist and AI Product Owner within the AI Application Laboratory (KI-Lab) at the German Environment Agency (Umweltbundesamt - UBA, Reference 8/LB/26, Interamt ID 1499096). As an Environmental Geophysicist and dual European M.Sc. candidate in Environmental Management (CAU Kiel) and Environmental Protection (AMU Poznań), I combine rigorous quantitative STEM training with hands-on Product Ownership experience across three self-architected environmental software systems. My operational focus is bridging complex biophysical and Earth-observation data with agile sprint backlogs (Scrum) and reproducible MLOps architectures for environmental public administration.`,

        `My methodology is grounded in physical mass balances and verifiable data integrity: At Universidad de Chile (graduated with distinction), I analyzed subsurface electrical resistivity anomalies and groundwater drawdown under forestry monocultures in the Maule Basin via Schlumberger vertical electrical soundings (VES). At CAU Kiel, I quantify greenhouse gas fluxes (CO₂, CH₄) on the rewetted peatland Wallener Au using closed chambers, high-frequency Eddy Covariance towers, and soil precompression stress analysis (σp = 62.4 kPa) processed through reproducible R scripts. This continuous field sensor instrumentation prevents naive assumptions regarding sensor noise, data drift, or calibration limits.`,

        `I have bridged environmental science and agile software delivery through the end-to-end architecture and product management of three dedicated environmental applications:
1. "Wetland Monitor": An interactive 3D web application (React, Three.js, R) for temporal simulation of peatland rewetting, GHG fluxes, and Eddy Covariance data.
2. "AgriTwin": An agricultural digital twin coupling continuous IoT soil-moisture telemetry with Sentinel-2 satellite imagery (NDVI/NDRE) in vineyard catchment systems.
3. "Rewilding Field Suite": A modular, offline-first Progressive Web App (PWA with local IndexedDB persistence and GIS layer fusion) for standardized ecological restoration protocols, biomass monitoring, and wildfire risk mitigation (Aljezur, Portugal).`,

        `Across all three applications, I acted as Product Owner: translating stakeholder needs and ecological metrics into user stories, managing backlog priorities, and conducting usability validation with field teams. This technical execution is complemented by institutional communication acumen: serving as an invited expert witness before Chile's Chamber of Deputies on wildfire risk and authoring international technical reports on carbon accounting frameworks (EPN & Global Forest Coalition, 2023).`,

        `As a graduate of a German university, I offer immediate contractual readiness under Germany's §20 AufenthG framework, operational fluency in English (C2) and German (B1–B2), and full flexibility for on-site collaboration in Leipzig as well as hybrid mobile work. I remain available for any technical or formal inquiries.`
      ];
    }

    return [
      `I am submitting my application for the position of ${offerTitle} at ${company}. My background as an Environmental Geophysicist and dual European M.Sc. candidate is grounded in quantitative empirical measurement and biophysical mass balances, with a clear focus on soil and peatland systems. I share a methodological commitment to scientific integrity in carbon accounting, moving deliberately past speculative offset schemes and high-level claims that lack ground-truth validation.`,

      `My trajectory began with rigorous physical and mathematical training at Universidad de Chile (graduated with distinction). In my thesis on the Maule Basin, I used vertical electrical soundings (Schlumberger VES array) to quantify subsurface electrical resistivity anomalies and groundwater depletion driven by forestry monoculture expansion under severe drought. Rather than treating catchment degradation as an abstract narrative, I framed it as a measurable alteration of subsurface water storage and hydrological conductivity.`,

      `I subsequently translated this empirical field reality into high-stakes science communication and public policy accountability: authoring investigative technical reports for international consortia (Environmental Paper Network & Global Forest Coalition, 2023) on bioenergy subsidy loopholes, delivering an invited expert testimony before the Special Commission on Emergencies and Disasters of Chile's Chamber of Deputies, and directing large-scale data-driven outreach reaching over 700,000 citizens.`,

      `During my dual European Master of Science in Environmental Management (CAU Kiel, Germany) and Environmental Protection (AMU Poznań, Poland), I have conducted direct quantitative field research on the rewetted peatland Wallener Au (Schleswig-Holstein). My work quantifies greenhouse gas fluxes (CO₂, CH₄) using closed chamber measurements and Eddy Covariance data, couples paludiculture implementation with soil mechanics (precompression stress σp = 62.4 kPa), and integrates reproducible spatial processing pipelines in R, including the development of Wetland Monitor.`,

      `This combination of geophysical inversion, micro-meteorological flux analysis, and scientific application development provides direct empirical ground-truth for ${company}. I bring sustained resilience in demanding field environments, bilingual operational fluency (Spanish native, English C2, German B1–B2), and immediate contractual readiness under Germany's §20 AufenthG research and job-seeking framework as a German master's graduate.`
    ];
  }

  // Español (predeterminado)
  if (isUba) {
    return [
      `Presento mi postulación a la posición de Especialista en Gestión de Proyectos de IA y Product Owner de IA en el Laboratorio de Aplicación de Inteligencia Artificial y Big Data (KI-Lab) de la Agencia Federal de Medio Ambiente de Alemania (Umweltbundesamt - UBA, Kennziffer 8/LB/26, Interamt-ID 1499096). Como Geofísico Ambiental y candidato a doble Máster en Ciencias europeo en Manejo Ambiental (CAU Kiel) y Protección Ambiental (AMU Poznań), integro una formación cuantitativa rigurosa con experiencia contrastada de Product Ownership en la concepción y desarrollo autónomo de tres aplicaciones de software ambiental. Mi enfoque radica en traducir requerimientos biogeoquímicos complejos en backlogs ágiles (Scrum) y arquitecturas de datos verificables para la administración ambiental pública.`,

      `Mi metodología parte de balances de masa biofísicos y rigor empírico: En la Universidad de Chile (con distinción) analicé, mediante sondeos eléctricos verticales (SEV, Schlumberger), las alteraciones de resistividad eléctrica del subsuelo y la depresión freática bajo monocultivos forestales en el Maule. En la CAU Kiel cuantifico los flujos de gases de efecto invernadero (CO₂, CH₄) en la turbera rehumedecida Wallener Au mediante cámaras cerradas y torres micrometeorológicas de Eddy Covariance, evaluando la tensión de preconsolidación del suelo (σp = 62,4 kPa) con pipelines reproducibles en R. Esta experiencia de instrumentación continua en terreno evita supuestos desconectados de la calidad real de los datos.`,

      `He trasladado la ciencia ambiental al desarrollo ágil de software mediante la arquitectura y entrega de tres productos tecnológicos:
1. «Wetland Monitor»: Aplicación web 3D interactiva (React, Three.js, R) para la modelación espaciotemporal de rehumedecimiento de turberas, flujos de GEI y registros de Eddy Covariance.
2. «AgriTwin»: Gemelo digital agrícola que integra telemetría continua de humedad de suelo IoT con índices satelitales Sentinel-2 (NDVI/NDRE) en cuencas vitivinícolas.
3. «Rewilding Field Suite»: Aplicación web progresiva modular y offline-first (PWA con almacenamiento local IndexedDB y fusión de capas GIS) para protocolos de campo de restauración ecológica, monitoreo de biomasa y prevención de incendios (Aljezur, Portugal).`,

      `En los tres productos ejercí el rol de Product Owner: desde el levantamiento de especificaciones y arquitectura de datos hasta la priorización de historias de usuario y la validación con equipos de terreno. Esta solvencia técnica se complementa con capacidad probada de interlocución pública: perito invitado ante la Cámara de Diputadas y Diputados de Chile para la modelación de riesgo de incendios y autor principal de informes internacionales sobre balances de carbono y biomasa (EPN y Global Forest Coalition, 2023).`,

      `Como graduado de una universidad alemana, dispongo de plena habilitación contractual (§20 AufenthG), inglés profesional (C2), alemán operativo (B1–B2) y total disposición para trabajar en Leipzig y en modalidad híbrida/remota. Quedo a su disposición para cualquier requerimiento técnico o formal.`
    ];
  }

  return [
    `Presento mi postulación a la posición de ${offerTitle} en ${company}. Mi perfil como Geofísico Ambiental y candidato a doble Máster en Ciencias europeo se fundamenta en la medición cuantitativa en terreno y en balances de masa biofísicos en sistemas de suelos y turberas. Comparto un compromiso irrestricto con la integridad metodológica en la contabilidad de carbono, rechazando las narrativas especulativas de compensación que carecen de verificación directa en el sustrato.`,

    `Mi trayectoria inició con una sólida formación física y matemática en la Universidad de Chile (con distinción). En mi investigación de título en la Cuenca del Maule cuantifiqué, mediante sondeos eléctricos verticales (SEV, arreglo Schlumberger), las anomalías de resistividad eléctrica del subsuelo y el agotamiento del nivel freático provocados por la expansión de monocultivos forestales bajo megasequía. Traduje la degradación de la cuenca no como una consigna, sino como una alteración mensurable de la capacidad de almacenamiento y conductividad hídrica subsuperficial.`,

    `Posteriormente llevé esta evidencia empírica al debate público y legislativo: autor técnico del informe internacional sobre subsidios a biomasa y contabilidad de carbono RED III (EPN y Global Forest Coalition, 2023), expositor pericial invitado ante la Comisión Especial de Emergencias y Desastres de la Cámara de Diputados de Chile, y director de campañas de divulgación basada en datos con un alcance superior a 700.000 personas.`,

    `En el marco de mi doble maestría en Manejo Ambiental (CAU Kiel, Alemania) y Protección Ambiental (AMU Poznań, Polonia), desarrollo investigación cuantitativa directa en la turbera rehumedecida Wallener Au (Schleswig-Holstein). Cuantifico flujos de gases de efecto invernadero (CO₂, CH₄) mediante cámaras cerradas y registros de Eddy Covariance, evaluando la tensión de preconsolidación del suelo orgánico (σp = 62,4 kPa), la paludicultura y gemelos digitales en R (aplicación Wetland Monitor).`,

    `Esta integración de inversión geofísica, micro-meteorología de flujos y programación científica encaja de forma directa con las demandas analíticas de ${company}. Aporto resiliencia comprobada para campañas prolongadas de terreno, dominio lingüístico (español nativo, inglés C2 técnico-ejecutivo y alemán B1–B2) y disponibilidad contractual inmediata bajo el marco legal de graduado universitario europeo (§20 AufenthG / Ley 14/2013).`
  ];
};

// ----------------------------------------------------------------------------
// Ensamblador de la Carta de Motivación
// ----------------------------------------------------------------------------

export const buildCoverLetter = (config: CoverLetterConfig): BuiltCoverLetter => {
  const { lang, offer, recipientName, recipientRole, recipientOrg, recipientAddress, customBodyText } = config;

  const isUba = Boolean(
    offer?.id?.includes('uba') ||
    offer?.company?.toLowerCase().includes('umweltbundesamt') ||
    offer?.company?.toLowerCase().includes('uba') ||
    offer?.title?.toLowerCase().includes('ki-lab') ||
    offer?.title?.toLowerCase().includes('1499096') ||
    offer?.title?.toLowerCase().includes('product owner')
  );

  const dateStr = config.date?.trim() || new Date().toLocaleDateString(
    lang === 'en' ? 'en-US' : lang === 'de' ? 'de-DE' : 'es-ES',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  const org = recipientOrg || (isUba ? 'Umweltbundesamt (UBA) – KI-Lab' : (offer?.company || (lang === 'en' ? 'Selection Committee' : lang === 'de' ? 'Auswahlkommission' : 'Comité de Selección')));

  const resolvedAddress = recipientAddress || (isUba ? 'Anwendungslabor für Künstliche Intelligenz und Big Data (KI-Lab), Dienstsitz Leipzig / Wörlitzer Platz 1, 06844 Dessau-Roßlau' : undefined);

  let refSubject = lang === 'en'
    ? `Application: ${offer?.title || 'Environmental Scientist / Geophysicist'}${offer?.company ? ` — ${offer.company}` : ''}`
    : lang === 'de'
    ? `Bewerbung als ${offer?.title || 'Umweltwissenschaftler / Geophysiker'}${offer?.company ? ` — ${offer.company}` : ''}`
    : `Candidatura: ${offer?.title || 'Geofísico Ambiental / Investigador'}${offer?.company ? ` — ${offer.company}` : ''}`;

  if (isUba) {
    refSubject = lang === 'de'
      ? 'Bewerbung als Spezialist*in im Bereich KI-Projektmanagement und KI Product Owner (KI-Lab) — Kennziffer 8/LB/26 (Interamt ID 1499096)'
      : lang === 'en'
      ? 'Application: AI Project Management Specialist and AI Product Owner (KI-Lab) — Ref. 8/LB/26 (Interamt ID 1499096)'
      : 'Candidatura: Especialista en Gestión de Proyectos de IA y Product Owner de IA (KI-Lab) — Kennziffer 8/LB/26 (Interamt ID 1499096)';
  }

  const salutation = recipientName?.trim()
    ? (lang === 'en' ? `Dear ${recipientName},` : lang === 'de' ? `Sehr geehrte(r) ${recipientName},` : `Estimado/a ${recipientName}:`)
    : (lang === 'en' ? `Dear Hiring Committee at ${org},` : lang === 'de' ? `Sehr geehrte Damen und Herren der ${org},` : `Estimado Comité de Selección de ${org}:`);

  const paragraphs = customBodyText?.trim()
    ? customBodyText.split(/\n\n+/).map((p) => p.trim()).filter(Boolean)
    : buildDefaultScientificDraft(lang, offer);

  const closing = lang === 'en' ? 'Sincerely,' : lang === 'de' ? 'Mit freundlichen Grüßen,' : 'Atentamente,';

  const fullText = paragraphs.join('\n\n');
  const audit = auditTextForAiCliches(fullText);

  const fullMarkdown = [
    `**Daniel Santander Urrutia**`,
    `${CANONICAL_CONTACT.defaultLocation} | ${CANONICAL_CONTACT.email} | ${CANONICAL_CONTACT.portfolio}`,
    '',
    `**Destinatario:** ${org}${recipientRole ? ` (${recipientRole})` : ''}`,
    resolvedAddress ? `${resolvedAddress}` : '',
    `**Fecha:** ${dateStr}`,
    '',
    `### ${refSubject}`,
    '',
    salutation,
    '',
    ...paragraphs,
    '',
    closing,
    '',
    `**Daniel Santander Urrutia**`
  ].filter(Boolean).join('\n\n');

  return {
    config,
    lang,
    sender: {
      name: 'Daniel Santander Urrutia',
      headline: lang === 'en' ? 'Environmental Geophysicist • Dual European M.Sc. Candidate' : 'Geofísico Ambiental • Candidato a Doble M.Sc. Europeo',
      email: CANONICAL_CONTACT.email,
      portfolio: CANONICAL_CONTACT.portfolio.replace(/^https?:\/\//, '').replace(/\/$/, ''),
      linkedin: CANONICAL_CONTACT.linkedin.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''),
      location: CANONICAL_CONTACT.defaultLocation
    },
    recipient: {
      org,
      role: recipientRole,
      address: resolvedAddress
    },
    date: dateStr,
    referenceSubject: refSubject,
    salutation,
    paragraphs,
    closing,
    signature: 'Daniel Santander Urrutia',
    fullMarkdown,
    audit
  };
};

// ----------------------------------------------------------------------------
// Render HTML (A4 / Formato DIN Académico e Institucional)
// ----------------------------------------------------------------------------

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const COVER_LETTER_CSS = `
@page { size: A4 portrait; margin: 0; }
* { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
html, body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #1e293b; background: #fff; font-size: 9.6pt; line-height: 1.5; }
.letter-page { width: 210mm; min-height: 297mm; max-height: 297mm; padding: 18mm 20mm 16mm 20mm; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; background: #fff; }
@media screen { html, body { background: #cbd5e1; } .letter-page { margin: 0 auto 14px auto; box-shadow: 0 4px 16px rgba(15,23,42,.2); } }
.sender-header { border-bottom: 2px solid #0f172a; padding-bottom: 7px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: flex-end; }
.sender-name { font-size: 15pt; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: -.3px; line-height: 1; }
.sender-headline { font-size: 8.5pt; font-weight: 600; color: #0284c7; margin-top: 3px; }
.sender-contact { font-size: 7.8pt; color: #475569; text-align: right; line-height: 1.4; }
.meta-block { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; font-size: 8.8pt; }
.recipient-box { color: #1e293b; line-height: 1.35; }
.recipient-org { font-weight: 700; color: #0f172a; font-size: 9.2pt; }
.date-box { font-size: 8.5pt; color: #64748b; font-weight: 600; text-align: right; }
.subject-line { font-size: 10.2pt; font-weight: 800; color: #0f172a; border-left: 3px solid #0284c7; padding-left: 8px; margin-bottom: 14px; }
.salutation { font-weight: 700; margin-bottom: 10px; font-size: 9.4pt; }
.content-body p { margin: 0 0 9px 0; text-align: justify; text-justify: inter-word; font-size: 9.1pt; line-height: 1.48; color: #1e293b; }
.content-body p:last-child { margin-bottom: 0; }
.closing-block { margin-top: 14px; font-size: 9.2pt; }
.signature-name { font-weight: 800; color: #0f172a; margin-top: 14px; font-size: 10pt; text-transform: uppercase; }
.letter-footer { border-top: 1px solid #cbd5e1; padding-top: 4px; font-size: 7pt; color: #64748b; display: flex; justify-content: space-between; }
`;

export const renderCoverLetterHtml = (built: BuiltCoverLetter): string => {
  const { lang, sender, recipient, date, referenceSubject, salutation, paragraphs, closing, signature } = built;

  const recipientHtml = `
    <div class="recipient-org">${esc(recipient.org)}</div>
    ${recipient.role ? `<div>${esc(recipient.role)}</div>` : ''}
    ${recipient.address ? `<div>${esc(recipient.address)}</div>` : ''}
  `;

  const paragraphsHtml = paragraphs.map((p) => `<p>${esc(p)}</p>`).join('');

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <title>${esc(referenceSubject)} — Daniel Santander Urrutia</title>
  <style>${COVER_LETTER_CSS}</style>
</head>
<body>
  <div class="letter-page">
    <div>
      <div class="sender-header">
        <div>
          <div class="sender-name">${esc(sender.name)}</div>
          <div class="sender-headline">${esc(sender.headline)}</div>
        </div>
        <div class="sender-contact">
          <div>${esc(sender.location)} • ${esc(sender.email)}</div>
          <div>${esc(sender.portfolio)} • ${esc(sender.linkedin)}</div>
        </div>
      </div>

      <div class="meta-block">
        <div class="recipient-box">${recipientHtml}</div>
        <div class="date-box">${esc(date)}</div>
      </div>

      <div class="subject-line">${esc(referenceSubject)}</div>
      <div class="salutation">${esc(salutation)}</div>

      <div class="content-body">
        ${paragraphsHtml}
      </div>

      <div class="closing-block">
        <div>${esc(closing)}</div>
        <div class="signature-name">${esc(signature)}</div>
      </div>
    </div>

    <div class="letter-footer">
      <div>Carta de postulación académica e institucional • Verificación empírica de antecedentes</div>
      <div><b>${esc(CANONICAL_CONTACT.email)}</b> • ${esc(CANONICAL_CONTACT.defaultLocation)}</div>
    </div>
  </div>
</body>
</html>`;
};

// ----------------------------------------------------------------------------
// Generador del Prompt Editorial Anti-AI para LLMs externos (Claude, ChatGPT, etc.)
// ----------------------------------------------------------------------------

export const generateAntiAiPrompt = (offer?: CoverLetterConfig['offer'], currentDraft?: string): string => {
  const company = offer?.company || '[ORGANIZACIÓN/UNIVERSIDAD/EMPRESA]';
  const title = offer?.title || '[PUESTO O PROYECTO]';
  const desc = offer?.rawDescription || '[PEGA AQUÍ LA DESCRIPCIÓN DE LA VACANTE O LÍNEA DE INVESTIGACIÓN]';

  return `Actúa como un editor científico y redactor de solicitudes académicas de alto nivel.
Quiero que redactes/traduzcas mi carta de postulación basándote ESTRICTAMENTE en el borrador que te adjunto abajo, respetando mi narrativa y mis argumentos.

### Oferta objetivo:
- Puesto: ${title}
- Institución: ${company}
- Requisitos y contexto:
${desc}

### Reglas críticas de redacción (Anti-AI Clichés):
1. PROHIBIDO usar fórmulas genéricas de IA como: "I am thrilled/excited to apply", "delve into", "testament to", "foster", "beacon of", "aligns seamlessly", "in conclusion", "passionate about".
2. Mantén la primera persona y mi perspectiva crítica frente al "carbon farming" especulativo y la degradación del suelo, pero traduce las quejas o sentimientos a HIPÓTESIS CIENTÍFICAS y BALANCES DE MASA (por ejemplo: en vez de "el modelo forestal es destructivo", usa "la alteración de la resistividad eléctrica y el agotamiento del agua subsuperficial bajo monocultivos frente a sequía").
3. No borres mis vivencias territoriales ni mis artículos de prensa; encuádralos como capacidad de transferencia de conocimiento, análisis de riesgo biofísico y trabajo empírico de campo.
4. Tono: Riguroso, directo, analítico, seguro y formal. Cada afirmación debe estar respaldada por un dato, una metodología (SEV, R, Eddy Covariance) o un proyecto concreto.

### Estructura obligatoria:
- Encabezado formal DIN / Institucional con destinatario exacto.
- Párrafo 1: Identificación precisa del puesto (ID) + declaración de enfoque compartido sobre la integridad del carbono y el rechazo a narrativas superficiales.
- Párrafos centrales: Mi trayectoria contada en orden: Geofísica/SEV en Chile -> Artículos de prensa e incidencia pública -> Doble Máster en Alemania/Polonia (Eddy Covariance y gemelo digital en R) -> Encaje metodológico directo con el proyecto.
- Cierre: Resiliencia de campo, idiomas y disponibilidad inmediata.

### Mi borrador base:
${currentDraft || buildDefaultScientificDraft('es', offer).join('\n\n')}
`;
};

// ----------------------------------------------------------------------------
// Almacenamiento local de versiones de carta
// ----------------------------------------------------------------------------

const LETTER_VERSIONS_KEY = 'empleo_cover_letter_versions_v1';

export const getSavedLetterVersions = (): SavedCoverLetterVersion[] => {
  try {
    return JSON.parse(localStorage.getItem(LETTER_VERSIONS_KEY) || '[]');
  } catch {
    return [];
  }
};

export const saveLetterVersions = (versions: SavedCoverLetterVersion[]): void => {
  localStorage.setItem(LETTER_VERSIONS_KEY, JSON.stringify(versions));
};
