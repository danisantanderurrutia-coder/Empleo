import type { MasterProfile } from '../types/profile';
import type { JobOffer } from '../types/offers';
import type { CompanyDossier } from '../types/companies';
import type { ApplicationItem } from '../types/applications';
import type { JobSource } from '../types/sources';
import type { CVTemplateInfo, CVVersion } from '../types/cv';
import { calculateMatchScore } from './matchEngine';
import { THUENEN_TECHWORMS_DOSSIER } from './jobWingmanService';

export const cvTemplatesList: CVTemplateInfo[] = [
  {
    id: 'es_standard',
    name: 'Español Estándar (1-2 pág.)',
    language: 'es',
    pages: '1-2 pág.',
    description: 'Formato profesional ideal para empresas en España y Bizkaia.',
    targetAudience: 'Empresas locales y multinacionales en España',
    accentColor: '#10b981'
  },
  {
    id: 'en_tech',
    name: 'English Tech (Modern 1 pág.)',
    language: 'en',
    pages: '1 pág.',
    description: 'Impactful 1-page modern layout for international research & tech.',
    targetAudience: 'International research centers & NGOs',
    accentColor: '#0ea5e9'
  },
  {
    id: 'de_two_page',
    name: 'German Business Lebenslauf (2 pág.)',
    language: 'de',
    pages: '2 pág.',
    description: 'Ausführlicher Lebenslauf im deutschen Standardformat.',
    targetAudience: 'Unternehmen in Deutschland, Österreich & Schweiz',
    accentColor: '#8b5cf6'
  },
  {
    id: 'de_short',
    name: 'German Kurzlebenslauf (1 pág.)',
    language: 'de',
    pages: '1 pág.',
    description: 'Kompakter Kurzlebenslauf für Initiativbewerbungen.',
    targetAudience: 'Kurzbewerbungen & Netzwerkkontakte',
    accentColor: '#f59e0b'
  },
  {
    id: 'europass',
    name: 'Europass Oficial UE (2-3 pág.)',
    language: 'es',
    pages: '2-3 pág.',
    description: 'Formato europeo estándar para convocatorias públicas e I+D.',
    targetAudience: 'Convocatorias públicas UE y proyectos europeos',
    accentColor: '#06b6d4'
  },
  {
    id: 'ats_clean',
    name: 'ATS Friendly Clean Text',
    language: 'es',
    pages: '1-2 pág.',
    description: 'Texto estructurado optimizado para escáneres ATS sin tablas complejas.',
    targetAudience: 'Portales automatizados (Workday, Greenhouse, Lever)',
    accentColor: '#64748b'
  },
  {
    id: 'academic_ngo',
    name: 'Académico / ONG / I+D',
    language: 'es',
    pages: '2-3 pág.',
    description: 'Énfasis en publicaciones, conferencias e impacto social.',
    targetAudience: 'Universidades, centros de investigación y ONGs',
    accentColor: '#ec4899'
  }
];

export const initialProfile: MasterProfile = {
  fullName: 'DANIEL SEBASTIÁN SANTANDER URRUTIA',
  email: 'danisantander.urrutia@gmail.com',
  phone: '+4917676497440',
  location: 'Kiel, Alemania / Bilbao, Bizkaia / Chile',
  linkedin: 'https://www.linkedin.com/in/santanderurrutia/',
  github: 'https://github.com/danisantanderurrutia-coder',
  portfolio: 'https://danisantanderurrutia-coder.github.io/portafolio/',
  preferredCity: 'Bilbao',
  locationPreferences: [
    { city: 'Bilbao / Bizkaia (Preferencia Residencia)', country: 'España', isPreferredHome: true, scoreMultiplier: 1.0, openToRemote: true, openToRelocation: false },
    { city: 'Euskadi / Donostia / Vitoria', country: 'España', isPreferredHome: true, scoreMultiplier: 1.0, openToRemote: true, openToRelocation: true },
    { city: 'Kiel / Hannover / Alemania', country: 'Alemania', isPreferredHome: false, scoreMultiplier: 0.95, openToRemote: true, openToRelocation: true },
    { city: 'Europa (Remoto / Institutos de Investigación)', country: 'Europa / UE', isPreferredHome: false, scoreMultiplier: 0.95, openToRemote: true, openToRelocation: false }
  ],
  targetRoles: [
    { id: 'tr-1', title: 'Científico Ambiental / Investigador Biofísico (Suelos & GEI)', minSalaryExpected: 42000, desiredSalary: 55000, seniorityLevel: 'Senior', keywords: ['Suelos', 'GEI', 'Eddy Covariance', 'R', 'GIS'] },
    { id: 'tr-2', title: 'Asesor en Políticas Ambientales y Gobernanza del Territorio', minSalaryExpected: 42000, desiredSalary: 52000, seniorityLevel: 'Senior', keywords: ['Gobernanza', 'Incidencia', 'Políticas Clima', 'Cuencas'] },
    { id: 'tr-3', title: 'Especialista en Teledetección y Modelación Espacial', minSalaryExpected: 40000, desiredSalary: 50000, seniorityLevel: 'Mid-Senior', keywords: ['QGIS', 'Python', 'Google Earth Engine', 'SWAT'] }
  ],
  minSalary: 40000,
  desiredSalary: 52000,
  summary: 'Científico ambiental interdisciplinario con base fundacional en Geofísica (FCFM, Universidad de Chile) y Doble Maestría Europea en Manejo y Protección Ambiental (CAU Kiel, Alemania / AMU Poznań, Polonia). Especializado en cuantificación biofísica, dinámica de flujos de gases de efecto invernadero (torres eddy covariance en turberas), balance hídrico de cuencas frente a monocultivos forestales, ordenamiento territorial y gobernanza multiactor. Trayectoria comprobada en Europa y América Latina vinculando ciencia empírica con salvaguardias ambientales, incidencia parlamentaria y análisis de políticas públicas.',
  experiences: [
    {
      id: 'exp-cau-kiel',
      company: 'Christian-Albrechts-Universität zu Kiel & Adam Mickiewicz University',
      role: 'Investigador en Sistemas Biofísicos y Dinámica de GEI en Turberas',
      location: 'Kiel (Alemania) / Poznań (Polonia)',
      startDate: '2023',
      endDate: 'Presente',
      isCurrent: true,
      summary: 'Cuantificación empírica de flujos de gases de efecto invernadero (CO2/CH4) en turberas rehumedecidas mediante torres micrometeorológicas de covarianza de torbellinos (Eddy Covariance) y cámaras estáticas. Muestreo de suelos y vegetación, modelación estadística y geoespacial (R, GIS).',
      achievements: [
        'Análisis continuo de balances de carbono y flujos de metano en humedales en transición ecológica.',
        'Integración de mediciones micrometeorológicas con teledetección satelital.'
      ],
      technologies: ['R', 'Python', 'QGIS', 'ArcGIS', 'Google Earth Engine', 'Eddy Covariance'],
      isVerified: true
    },
    {
      id: 'exp-advocacy-policy',
      company: 'Asesoría en Políticas Ambientales e Incidencia Legislativa',
      role: 'Asesor Técnico en Políticas Ambientales y Cuencas',
      location: 'Chile & Alemania',
      startDate: '2021',
      endDate: 'Presente',
      isCurrent: true,
      summary: 'Asesoría técnica parlamentaria y comunitaria sobre política de prevención de incendios forestales, gestión integrada del agua y transición agroecológica. Presentación oficial ante la Comisión de Emergencia, Desastres y Bomberos de la Cámara de Diputadas y Diputados de Chile sobre la correlación estructural entre monocultivos forestales y riesgo de megaincendios.',
      achievements: [
        'Exposición y testimonio oficial en el Congreso Nacional de Chile sobre ordenamiento territorial y modelo forestal.',
        'Acompañamiento a comités de agua potable rural y comunidades en gobernanza de cuencas.'
      ],
      technologies: ['Gobernanza Ambiental', 'Políticas Públicas', 'Incidencia Legislativa', 'Gestión de Cuencas'],
      isVerified: true
    },
    {
      id: 'exp-biomass-epn',
      company: 'Environmental Paper Network & Global Forest Coalition',
      role: 'Investigador de Impactos de la Industria de Biomasa y Celulosa',
      location: 'América Latina & Europa',
      startDate: '2022',
      endDate: '2024',
      isCurrent: false,
      summary: 'Investigación técnica independiente sobre los impactos biofísicos y socioecológicos de las plantaciones forestales a gran escala, bioenergía y metodologías de contabilidad de carbono. Coordinación con redes socioambientales e instituciones internacionales.',
      achievements: [
        'Elaboración de informes de integridad ambiental y contabilidad de carbono en cadenas de suministro forestal.',
        'Articulación de diálogos internacionales sobre manejo y protección comunitaria de bosques.'
      ],
      technologies: ['Contabilidad de Carbono', 'Salvaguardias Ambientales', 'Facilitación Multiactor'],
      isVerified: true
    }
  ],
  education: [
    {
      id: 'edu-msc-kiel-amu',
      institution: 'Christian-Albrechts-Universität zu Kiel (Alemania) & Adam Mickiewicz University in Poznań (Polonia)',
      degree: 'Doble Máster en Environmental Management & Environmental Protection',
      fieldOfStudy: 'Ciencias Ambientales, Manejo Integrado de Cuencas y Protección Ecosistémica',
      startDate: '2023',
      endDate: '2026',
      location: 'Kiel (Alemania) y Poznań (Polonia)',
      isVerified: true
    },
    {
      id: 'edu-geophysics-uchile',
      institution: 'Universidad de Chile (FCFM)',
      degree: 'Licenciatura en Geofísica (con Distinción)',
      fieldOfStudy: 'Geofísica de la Tierra Sólida, Hidrogeofísica y Física de Fluidos',
      startDate: '2016',
      endDate: '2021',
      location: 'Santiago, Chile',
      isVerified: true
    },
    {
      id: 'edu-permaculture-epac',
      institution: 'Escuela de Permacultura y Agroecología de Chile (EPAC)',
      degree: 'Certified Permaculture Designer (CDP)',
      fieldOfStudy: 'Diseño Hidrológico Keyline, Regeneración Edáfica y Restauración Ecosistémica',
      startDate: '2023',
      endDate: '2023',
      location: 'Chile',
      isVerified: true
    }
  ],
  skills: [
    { id: 'sk-1', name: 'R', category: 'Tech', level: 'Avanzado', yearsOfExperience: 5 },
    { id: 'sk-2', name: 'Python', category: 'Tech', level: 'Avanzado', yearsOfExperience: 4 },
    { id: 'sk-3', name: 'QGIS', category: 'Tech', level: 'Avanzado', yearsOfExperience: 5 },
    { id: 'sk-4', name: 'ArcGIS', category: 'Tech', level: 'Avanzado', yearsOfExperience: 5 },
    { id: 'sk-5', name: 'Google Earth Engine', category: 'Tech', level: 'Intermedio', yearsOfExperience: 3 },
    { id: 'sk-6', name: 'Eddy Covariance', category: 'Tech', level: 'Avanzado', yearsOfExperience: 3 },
    { id: 'sk-7', name: 'Gobernanza Ambiental', category: 'Soft', level: 'Experto', yearsOfExperience: 6 },
    { id: 'sk-8', name: 'Incidencia Política & Legislativa', category: 'Soft', level: 'Experto', yearsOfExperience: 5 },
    { id: 'sk-9', name: 'Facilitación Multiactor', category: 'Soft', level: 'Experto', yearsOfExperience: 5 },
    { id: 'sk-10', name: 'Sistemas Biofísicos & Suelos', category: 'Tech', level: 'Avanzado', yearsOfExperience: 4 }
  ],
  languages: [
    { id: 'lang-1', language: 'Español', proficiency: 'Nativo' },
    { id: 'lang-2', language: 'Inglés', proficiency: 'C1' },
    { id: 'lang-3', language: 'Alemán', proficiency: 'B1' },
    { id: 'lang-4', language: 'Polaco', proficiency: 'A1' }
  ],
  achievementsBank: [
    {
      id: 'ach-1',
      title: 'Comparecencia e Intervención Oficial en la Cámara de Diputadas y Diputados de Chile',
      description: 'Demostración técnica de la correlación estructural entre el monocultivo forestal y el riesgo de megaincendios ante la Comisión de Emergencia, Desastres y Bomberos.',
      metrics: 'Intervención Legislativa Oficial',
      tags: ['Congreso', 'Incidencia', 'Modelo Forestal', 'Incendios'],
      date: '2024-03-01',
      isVerified: true
    },
    {
      id: 'ach-2',
      title: 'Investigación Internacional de Impactos de la Industria de Biomasa',
      description: 'Estudio de balances de carbono y salvaguardias socioambientales en conjunto con Global Forest Coalition y Environmental Paper Network.',
      metrics: 'Publicación e Informe Internacional',
      tags: ['Biomasa', 'Carbono', 'Bosques', 'EPN'],
      date: '2024-06-01',
      isVerified: true
    },
    {
      id: 'ach-3',
      title: 'Semifinalista UN Citiverse Challenge para Ciudades Sostenibles (SDG Cities)',
      description: 'Desarrollo del concepto Smart Food Parks integrando gemelos digitales, IoT y teledetección espacial para ordenamiento urbano y resiliencia climática.',
      metrics: 'Semifinalista Internacional ONU',
      tags: ['UN', 'Gemelo Digital', 'IoT', 'Resiliencia'],
      date: '2024-11-01',
      isVerified: true
    },
    {
      id: 'ach-4',
      title: 'Ponencias en Conferencias Internacionales de Clima y Decrecimiento',
      description: 'Presentaciones en Degrowth Conference Oslo 2025, Environmental Justice Conference Bonn 2025 y Foro Latinoamericano en Bogotá.',
      metrics: '5+ Ponencias en Europa y América Latina',
      tags: ['Conferencias', 'Internacional', 'Transición Justa'],
      date: '2025-01-01',
      isVerified: true
    }
  ],
  otherCourses: [
    'Green Economy and Financialization of Nature (CENSAT Agua Viva, 2022)',
    'R Modeling and GIS Satellite Data Management (Escuela Ambiental GIS, 2022)',
    'Climate Action Plan Design (ClimateReality, Chile 2023)',
    'Doughnut Economics (DEAL Copenhagen, Denmark, 2025)',
    'BlueGreen Biodiversity (WSL Davos, Switzerland, 2025)',
    'Interlinked Justice (Dresden, Germany, 2025)',
    'Curso de Diseño en Permacultura (EPAC Chile, 2023)'
  ],
  pendingFields: [],
  lastUpdated: '2026-10-14'
};

export const initialSources: JobSource[] = [
  {
    id: 'src-thuenen',
    name: 'Thünen-Institut Karriereportal (Braunschweig & Bundesweit)',
    type: 'research_center',
    url: 'https://www.karriere-thuenen.de/',
    priority: 'Alta',
    frequency: 'Diario',
    status: 'Activo',
    lastScraped: '2026-10-21 03:00',
    offersExtracted: 1,
    notes: 'Instituto Federal de Investigación para Áreas Rurales, Bosques y Pesca (BMEL). Puestos de investigación en clima, suelos y agroecología.'
  },
  {
    id: 'src-interamt',
    name: 'Interamt (Karriereportal des Öffentlichen Dienstes)',
    type: 'public_admin',
    url: 'https://interamt.de/',
    priority: 'Alta',
    frequency: 'Diario',
    status: 'Activo',
    lastScraped: '2026-10-21 03:00',
    offersExtracted: 1,
    notes: 'Portal unificado de convocatorias públicas de Alemania (Bund, Länder, Kommunen), incluyendo Umweltbundesamt (UBA).'
  },
  {
    id: 'src-bund',
    name: 'Service.bund.de (Stellenangebote des Bundes)',
    type: 'public_admin',
    url: 'https://www.service.bund.de/Content/DE/Stellen/Suche/Formular.html',
    priority: 'Alta',
    frequency: 'Diario',
    status: 'Activo',
    lastScraped: '2026-10-21 03:00',
    offersExtracted: 1,
    notes: 'Canal oficial con agregación RSS de ofertas del Estado Federal en ciencia, digitalización y administración ambiental.'
  },
  {
    id: 'src-bc3',
    name: 'BC3 Basque Centre for Climate Change (Bilbao / Leioa)',
    type: 'research_center',
    url: 'https://www.bc3research.org/careers.html',
    priority: 'Alta',
    frequency: 'Diario',
    status: 'Activo',
    lastScraped: '',
    offersExtracted: 0,
    notes: 'Centro de investigación en cambio climático de excelencia mundial en Bizkaia.'
  },
  {
    id: 'src-tecnalia',
    name: 'Tecnalia Research & Innovation (Bilbao Hub)',
    type: 'research_center',
    url: 'https://www.tecnalia.com/empleo',
    priority: 'Alta',
    frequency: 'Diario',
    status: 'Activo',
    lastScraped: '',
    offersExtracted: 0,
    notes: 'Centro de I+D de referencia en el País Vasco.'
  },
  {
    id: 'src-azti',
    name: 'AZTI - Ciencia y Tecnología Marina y Alimentaria (Pasaia / Sukunza)',
    type: 'research_center',
    url: 'https://www.azti.es/empleo',
    priority: 'Alta',
    frequency: 'Diario',
    status: 'Activo',
    lastScraped: '',
    offersExtracted: 0,
    notes: 'Investigación marina, servicios ecosistémicos y clima en Euskadi.'
  },
  {
    id: 'src-neiker',
    name: 'Neiker - Instituto Vasco de Investigación Agraria & Suelos (Arkaute)',
    type: 'research_center',
    url: 'https://neiker.eus/es/empleo/',
    priority: 'Alta',
    frequency: 'Diario',
    status: 'Activo',
    lastScraped: '',
    offersExtracted: 0,
    notes: 'Ciencias del suelo, agricultura sostenible y agrotecnología en Euskadi.'
  },
  {
    id: 'src-aclima',
    name: 'Aclima - Clúster de Industrias del Medio Ambiente de Euskadi',
    type: 'job_board',
    url: 'https://aclima.eus/empleo/',
    priority: 'Alta',
    frequency: 'Diario',
    status: 'Activo',
    lastScraped: '',
    offersExtracted: 0,
    notes: 'Bolsa de empleo del sector ambiental vasco.'
  },
  {
    id: 'src-idom',
    name: 'IDOM Consulting & Engineering (Sede Central Bilbao)',
    type: 'research_center',
    url: 'https://www.idom.com/unete-a-idom/',
    priority: 'Alta',
    frequency: 'Diario',
    status: 'Activo',
    lastScraped: '',
    offersExtracted: 0,
    notes: 'Sede en Zorrotzaurre (Bilbao). Proyectos ambientales y ordenamiento territorial.'
  },
  {
    id: 'src-ihobe',
    name: 'IHOBE - Sociedad Pública de Gestión Ambiental del Gobierno Vasco',
    type: 'public_admin',
    url: 'https://www.ihobe.eus/empleo',
    priority: 'Alta',
    frequency: 'Diario',
    status: 'Activo',
    lastScraped: '',
    offersExtracted: 0,
    notes: 'Sociedad pública de medio ambiente de Euskadi en Bilbao.'
  },
  {
    id: 'src-cristinaenea',
    name: 'Fundación Cristina Enea (Donostia / San Sebastián)',
    type: 'research_center',
    url: 'https://www.cristinaenea.eus/',
    priority: 'Alta',
    frequency: 'Diario',
    status: 'Activo',
    lastScraped: '',
    offersExtracted: 0,
    notes: 'Educación ambiental, sostenibilidad urbana e intercambio de conocimiento en Gipuzkoa.'
  },
  {
    id: 'src-avcd',
    name: 'AVCD - Agencia Vasca de Cooperación para el Desarrollo',
    type: 'public_admin',
    url: 'https://www.euskadi.eus/agencia-vasca-de-cooperacion-para-el-desarrollo/',
    priority: 'Alta',
    frequency: 'Diario',
    status: 'Activo',
    lastScraped: '',
    offersExtracted: 0,
    notes: 'Agencia pública vasca para cooperación y trabajo con comunidades.'
  },
  {
    id: 'src-ongdeuskadi',
    name: 'Coordinadora de ONGD de Euskadi (Bolsa de Empleo Sectorial)',
    type: 'job_board',
    url: 'https://www.ongdeuskadi.org/es/empleo.asp',
    priority: 'Alta',
    frequency: 'Diario',
    status: 'Activo',
    lastScraped: '',
    offersExtracted: 0,
    notes: 'Bolsa unificada de empleo en cooperación internacional en Euskadi.'
  },
  {
    id: 'src-alboan',
    name: 'Alboan ONG Euskadi (Bilbao & Donostia)',
    type: 'job_board',
    url: 'https://www.alboan.org/es/trabaja-con-nosotros',
    priority: 'Alta',
    frequency: 'Diario',
    status: 'Activo',
    lastScraped: '',
    offersExtracted: 0,
    notes: 'Justicia socio-ambiental y defensa comunitaria del territorio.'
  },
  {
    id: 'src-mundubat',
    name: 'Mundubat Euskadi (Derechos a la Tierra & Comunidades)',
    type: 'job_board',
    url: 'https://www.mundubat.org/empleo/',
    priority: 'Alta',
    frequency: 'Diario',
    status: 'Activo',
    lastScraped: '',
    offersExtracted: 0,
    notes: 'Derechos campesinos y gobernanza de recursos naturales.'
  },
  {
    id: 'src-bopv',
    name: 'BOPV - Boletín Oficial del País Vasco (Gobierno Vasco)',
    type: 'public_admin',
    url: 'https://www.euskadi.eus/bopv/',
    priority: 'Alta',
    frequency: 'Diario',
    status: 'Activo',
    lastScraped: '',
    offersExtracted: 0,
    notes: 'Convocatorias públicas oficiales de técnicos ambientales en Euskadi.'
  },
  {
    id: 'src-lanbide',
    name: 'Lanbide - Servicio Vasco de Empleo',
    type: 'public_admin',
    url: 'https://www.lanbide.euskadi.eus/',
    priority: 'Alta',
    frequency: 'Diario',
    status: 'Activo',
    lastScraped: '',
    offersExtracted: 0,
    notes: 'Portal oficial de empleo del País Vasco.'
  },
  {
    id: 'src-ecodes',
    name: 'ECODES - Fundación Ecología y Desarrollo (España)',
    type: 'job_board',
    url: 'https://ecodes.org/empleo',
    priority: 'Alta',
    frequency: 'Diario',
    status: 'Activo',
    lastScraped: '',
    offersExtracted: 0,
    notes: 'Transición justa, política ambiental y acción comunitaria.'
  },
  {
    id: 'src-boe',
    name: 'BOE - Convocatorias de Empleo Público en España',
    type: 'public_admin',
    url: 'https://www.boe.es/diarios_doc/boe/',
    priority: 'Alta',
    frequency: 'Diario',
    status: 'Activo',
    lastScraped: '',
    offersExtracted: 0,
    notes: 'Convocatorias oficiales del Ministerio de Transición Ecológica MITECO.'
  }
];


export const initialCompanies: CompanyDossier[] = [
  {
    id: 'comp-thuenen',
    name: 'Johann Heinrich von Thünen-Institut',
    website: 'https://www.thuenen.de/',
    sector: 'Investigación Federal en Suelos, Clima, Bosques y Agricultura (BMEL)',
    size: '1.000+ investigadores y personal científico',
    headquarters: 'Braunschweig, Niedersachsen, Alemania',
    description: 'Bundesforschungsinstitut für Ländliche Räume, Wald und Fischerei. Su Institut für Agrarklimaschutz (AK) lidera la investigación científica en mitigación del cambio climático en el sector agrario, secuestro de carbono orgánico en suelos agrícolas y balances de GEI para el Gobierno Federal alemán.',
    keyProjects: [
      'Proyecto "TechWorms": Secuestro de carbono en subsuelo mediante bioporos verticales y estimulación radicular profunda',
      'Inventario Nacional de Suelos Agrícolas de Alemania (Bodenzustandserhebung Landwirtschaft - BZE-LW)',
      'Red nacional de monitoreo de flujos de carbono y GEI en ecosistemas agrícolas y turberas'
    ],
    recentNews: [
      {
        title: 'Lanzamiento de ensayos de campo del proyecto TechWorms para captura de carbono en subsuelos',
        date: '2026-10-01',
        snippet: 'Evaluación del potencial de macroporos artificiales para transportar carbono a horizontes edáficos profundos.'
      }
    ],
    workCulture: [
      'Investigación científica de alto impacto para políticas públicas federales',
      'Convenio colectivo del sector público federal (TVöD Bund E13)',
      'Excelente conciliación familiar, horarios flexibles por Gleitzeit y fomento del doctorado con universidades socias (TU Braunschweig)'
    ],
    redFlags: ['Contrato vinculado a duración del proyecto de investigación (noviembre 2030) y plazos de postulación estrictos'],
    interviewArguments: [
      'Máster europeo en Gestión y Protección Ambiental completado en Alemania (CAU Kiel) con conocimiento directo del sistema científico alemán.',
      'Sólida formación en física y edafología con experiencia empírica en dinámica de suelos y flujos de gases.',
      'Dominio demostrado de R para análisis estadístico y modelado de datos de campo.'
    ],
    techStack: ['R', 'RootBox', 'Isotopenanalytik', 'TVöD Bund', 'GIS', 'Python'],
    lastResearched: '2026-10-21'
  },
  {
    id: 'comp-uba',
    name: 'Umweltbundesamt (UBA)',
    website: 'https://www.umweltbundesamt.de/',
    sector: 'Agencia Federal de Medio Ambiente de Alemania (BMUV)',
    size: '1.800+ empleados',
    headquarters: 'Dessau-Roßlau / Sedes en Berlín y Leipzig',
    description: 'La máxima autoridad técnica y científica de Alemania para la protección del medio ambiente. Su Anwendungslabor für Künstliche Intelligenz und Big Data (KI-Lab) lidera la Agenda Digital de Política Ambiental, creando herramientas de IA para optimizar la toma de decisiones ecológicas y la administración ambiental.',
    keyProjects: [
      'Anwendungslabor für Künstliche Intelligenz und Big Data (KI-Lab) con hasta 30 especialistas en Leipzig/Berlín',
      'Desarrollo de modelos predictivos y gemelos de IA para supervisión de calidad del aire, agua y suelos',
      'Plataforma de datos federados e inteligencia ambiental para el Verwaltungsvollzug'
    ],
    recentNews: [
      {
        title: 'Despliegue de nuevas iniciativas del KI-Lab para la Agenda Digital de Política Ambiental',
        date: '2026-10-05',
        snippet: 'Proyectos piloto de IA aplicados a la evaluación de impacto y monitorización satelital.'
      }
    ],
    workCulture: [
      'Organismo federal con alta seguridad laboral y teletrabajo regulado',
      'Metodologías ágiles (Scrum, Kanban) aplicadas al sector público',
      'Compromiso social y ambiental con impacto directo en legislación y ciudadanía'
    ],
    redFlags: ['Puesto inicial como Mutterschutzvertretung, requiriendo validación de prórroga para la fase de Elternzeit'],
    interviewArguments: [
      'Capacidad probada de tender puentes entre la ciencia biofísica de datos y la gobernanza / gestión de proyectos.',
      'Experiencia en proyectos de impacto internacional y comunicación efectiva con equipos multidisciplinares.',
      'Perfil MINT riguroso con base analítica en geofísica y máster europeo en protección ambiental.'
    ],
    techStack: ['Scrum / Kanban', 'AI / Machine Learning', 'OpenProject', 'MS Project', 'Python', 'GIS'],
    lastResearched: '2026-10-21'
  },
  {
    id: 'comp-bc3',
    name: 'BC3 - Basque Centre for Climate Change',
    website: 'https://www.bc3research.org/',
    sector: 'Investigación Climática & Modelación Biofísica (BRTA / Ikerbasque)',
    size: '50-150 investigadores',
    headquarters: 'Leioa / Bilbao (Parque Científico UPV/EHU, Bizkaia)',
    description: 'Centro de investigación de excelencia María de Maeztu enfocado en las causas y consecuencias del cambio climático, modelación de servicios ecosistémicos (plataforma k.LAB / ARIES) y gobernanza de la transición justa.',
    keyProjects: [
      'Plataforma k.LAB / ARIES para modelado biofísico interoperable de servicios ecosistémicos',
      'Políticas de descarbonización e inventarios de emisiones de GEI en cuencas europeas',
      'Evaluación de resiliencia climática territorial e impactos socioeconómicos'
    ],
    recentNews: [
      {
        title: 'Convocatorias abiertas de proyectos de investigación en modelación climática y ecosistemas',
        date: '2026-09-15',
        snippet: 'Líneas prioritarias en contabilidad de carbono e interoperabilidad de datos geoespaciales.'
      }
    ],
    workCulture: [
      'Investigación puntera interdisciplinar',
      'Entorno multinacional y bilingüe (EN/ES/EU)',
      'Alto rigor metodológico y publicaciones internacionales'
    ],
    redFlags: ['Procesos de selección muy rigurosos basados en méritos y alineamiento metodológico'],
    interviewArguments: [
      'Experiencia directa en cuantificación empírica de flujos de GEI (torres eddy covariance en CAU Kiel) y modelación biofísica con R/Python.',
      'Manejo avanzado de balance de cuencas hidrológicas y análisis espacial (QGIS, GEE).',
      'Base sólida en geofísica matemática (U. de Chile) complementada con visión de políticas europeas de sostenibilidad.'
    ],
    techStack: ['R', 'Python', 'QGIS', 'Google Earth Engine', 'k.LAB / ARIES', 'EddyPro'],
    lastResearched: '2026-10-14'
  },
  {
    id: 'comp-tecnalia',
    name: 'Tecnalia Research & Innovation',
    website: 'https://www.tecnalia.com/',
    sector: 'I+D+i Aplicada & Transición Ecológica',
    size: '1.400+ investigadores',
    headquarters: 'Derio / Bilbao (Bizkaia)',
    description: 'El mayor centro de investigación aplicada y desarrollo tecnológico de España y uno de los principales de Europa, con divisiones líderes en Transición Energética, Clima, Ecosistemas Urbanos y Soluciones Basadas en la Naturaleza.',
    keyProjects: [
      'Gemelos digitales para resiliencia climática urbana y ordenamiento territorial',
      'Modelos predictivos de inundabilidad y balance hídrico en cuencas fluviales',
      'Valorización de biomasa y ecodiseño industrial'
    ],
    recentNews: [
      {
        title: 'Expansión de programas de adaptación climática y gemelos digitales en Euskadi',
        date: '2026-10-01',
        snippet: 'Licitaciones europeas Horizonte Europa en soluciones basadas en la naturaleza.'
      }
    ],
    workCulture: [
      'Orientación a proyectos industriales y europeos',
      'Transferencia tecnológica directa',
      'Equipos multidisciplinares de ingeniería y ciencias ambientales'
    ],
    redFlags: ['Ritmo ágil de entrega y plazos ajustados en licitaciones europeas'],
    interviewArguments: [
      'Doble perfil científico-técnico capaz de integrar sensorización de campo con modelos numéricos y geoespaciales.',
      'Semifinalista en el UN Citiverse Challenge con gemelo digital territorial para resiliencia.',
      'Experiencia de trabajo trilingüe y adaptación inmediata a consorcios europeos.'
    ],
    techStack: ['Python', 'QGIS', 'IoT Sensor Networks', 'ArcGIS', 'R'],
    lastResearched: '2026-10-14'
  },
  {
    id: 'comp-neiker',
    name: 'Neiker - Instituto Vasco de Investigación y Desarrollo Agrario',
    website: 'https://neiker.eus/',
    sector: 'Agroecología, Suelos & Servicios Ecosistémicos (BRTA)',
    size: '150-250 empleados',
    headquarters: 'Arkaute (Vitoria-Gasteiz) / Derio (Bizkaia)',
    description: 'Entidad pública dedicada a la I+D+i agroganadera y ambiental de Euskadi. Referente en calidad biológica de suelos, salud edáfica, mitigación de GEI y agroecología.',
    keyProjects: [
      'Monitoreo continuo de salud del suelo y secuestro edáfico de carbono (Directiva Suelos UE)',
      'Impacto de prácticas agroecológicas en la retención de agua y biodiversidad',
      'Vigilancia de plagas y balance hídrico ante eventos climáticos extremos'
    ],
    recentNews: [
      {
        title: 'Liderazgo en proyectos europeos de protección y salud del suelo edáfico',
        date: '2026-09-20',
        snippet: 'Implementación de metodologías pioneras de análisis biológico y físico de suelos.'
      }
    ],
    workCulture: [
      'Cercanía con el sector primario vasco y la administración pública',
      'Investigación aplicada sobre el terreno',
      'Científicos edafólogos y ecólogos de primer nivel'
    ],
    redFlags: ['Requiere disponibilidad para trabajo de campo regular en fincas experimentales y cuencas'],
    interviewArguments: [
      'Formación especializada en conservación y protección del suelo en Kiel y Poznań.',
      'Diseñador en permacultura certificado (EPAC Chile) con conocimiento de diseño keyline y regeneración de suelos.',
      'Capacidad de muestreo riguroso y análisis estadístico robusto de variables edáficas.'
    ],
    techStack: ['R', 'QGIS', 'Muestreo Edáfico', 'Sensores de Humedad TDR', 'Cámaras de Flujo'],
    lastResearched: '2026-10-14'
  },
  {
    id: 'comp-idom',
    name: 'IDOM Consulting, Engineering & Architecture',
    website: 'https://www.idom.com/',
    sector: 'Consultoría Ambiental Internacional, Hidrología e Infraestructuras',
    size: '4.500+ empleados',
    headquarters: 'Bilbao (Sede Central Zorrotzaurre, Bizkaia)',
    description: 'Multinacional independiente de consultoría e ingeniería con sede central en Bilbao. Lidera grandes estudios de impacto ambiental, modelación hidrológica, salvaguardias socioambientales y resiliencia climática para el Banco Mundial, BID y la Comisión Europea.',
    keyProjects: [
      'Estudios de modelación hidrológica de cuencas y mapas de inundabilidad',
      'Auditorías de salvaguardias socioambientales en proyectos de infraestructura en LatAm y África',
      'Estrategias de transición energética y planes de adaptación al cambio climático'
    ],
    recentNews: [
      {
        title: 'Apertura de nuevos contratos marco de consultoría ambiental internacional',
        date: '2026-10-05',
        snippet: 'Creciente demanda de perfiles en modelación de cuencas y gestión de recursos hídricos.'
      }
    ],
    workCulture: [
      'Propiedad 100% de los empleados (asociados)',
      'Proyección internacional en más de 120 países',
      'Alta exigencia técnica y rigor en documentación'
    ],
    redFlags: ['Picos de trabajo elevados durante entrega de licitaciones internacionales'],
    interviewArguments: [
      'Geofísico con dominio numérico de mecánica de fluidos e hidrología de cuencas.',
      'Experiencia en asesoría técnica ante comisiones parlamentarias y diálogo multiactor.',
      'Bilingüe español/inglés con soltura para interactuar con clientes multilaterales.'
    ],
    techStack: ['HEC-RAS', 'Iber', 'QGIS', 'Python', 'AutoCAD Civil 3D'],
    lastResearched: '2026-10-14'
  },
  {
    id: 'comp-azti',
    name: 'AZTI - Marine & Food Technology',
    website: 'https://www.azti.es/',
    sector: 'Investigación Marina, Oceanografía y Costas (BRTA)',
    size: '250-350 investigadores',
    headquarters: 'Pasaia (Gipuzkoa) / Sukarrieta (Bizkaia)',
    description: 'Centro científico y tecnológico especializado en el medio marino y la cadena de valor alimentaria. Líder en monitoreo oceanográfico, dinámica de sedimentos costeros y gestión de pesquerías sostenibles.',
    keyProjects: [
      'Red de radares costeros de alta frecuencia HF y boyas oceanográficas',
      'Modelado hidrodinámico de estuarios y dinámica sedimentaria en el Golfo de Bizkaia',
      'Evaluación de impacto del calentamiento y acidificación oceánica'
    ],
    recentNews: [
      {
        title: 'Convocatorias de monitorización satelital y oceanografía operativa en el Cantábrico',
        date: '2026-08-30',
        snippet: 'Nuevos sensores autónomos para seguimiento ambiental costero.'
      }
    ],
    workCulture: [
      'Fuerte vinculación al litoral y a los ecosistemas marinos',
      'Alta productividad en proyectos científicos europeos',
      'Colaboración estrecha con administraciones marítimas'
    ],
    redFlags: ['Campañas oceanográficas y embarques periódicos requeridos para ciertos puestos'],
    interviewArguments: [
      'Formación de origen en geofísica con base en física de la Tierra, dinámica de fluidos y oleaje.',
      'Procesamiento avanzado de series temporales y datos geoespaciales con Python y R.',
      'Compromiso demostrado con la conservación de humedales costeros y zonas de transición.'
    ],
    techStack: ['Python', 'Matlab / Octave', 'QGIS', 'Copernicus Marine Data', 'Series Temporales'],
    lastResearched: '2026-10-14'
  },
  {
    id: 'comp-ihobe',
    name: 'IHOBE - Sociedad Pública de Gestión Ambiental',
    website: 'https://www.ihobe.eus/',
    sector: 'Gestión Ambiental Pública & Políticas de Sostenibilidad',
    size: '50-100 empleados',
    headquarters: 'Bilbao (Bizkaia)',
    description: 'Sociedad pública adscrita al Departamento de Desarrollo Económico, Sostenibilidad y Medio Ambiente del Gobierno Vasco. Diseña e implementa la Estrategia Vasca de Cambio Climático (Klima 2050), el Plan de Suelos Contaminados y la economía circular en Euskadi.',
    keyProjects: [
      'Observatorio de Cambio Climático de Euskadi y Red KLIMATEK',
      'Inventario y remediación de suelos históricamente alterados de la CAV',
      'Guías de compra pública verde y ecodiseño industrial'
    ],
    recentNews: [
      {
        title: 'Actualización del catálogo de herramientas de adaptación climática para municipios vascos',
        date: '2026-09-10',
        snippet: 'Impulso a la renaturalización y resiliencia territorial en Euskadi.'
      }
    ],
    workCulture: [
      'Servicio público, vocación territorial y rigor técnico',
      'Articulación entre administración, empresas y centros de investigación',
      'Enfoque en políticas y resultados medibles'
    ],
    redFlags: ['Procesos de contratación pública sujetos a baremación oficial'],
    interviewArguments: [
      'Doble máster europeo en gestión y protección ambiental (Kiel/Poznań) centrado en políticas territoriales.',
      'Comprensión integral del marco normativo ambiental europeo (Directiva Suelos, Pacto Verde, Taxonomía).',
      'Residencia e implicación directa en Bilbao/Bizkaia con interés a largo plazo en el territorio.'
    ],
    techStack: ['GIS', 'Inventarios GEI', 'Métricas ESG', 'Evaluación de Impacto'],
    lastResearched: '2026-10-14'
  },
  {
    id: 'comp-aclima',
    name: 'Aclima - Basque Environment Cluster',
    website: 'https://aclima.eus/',
    sector: 'Clúster Empresarial & Ecosistema Ambiental de Euskadi',
    size: '10-25 equipo de gestión (representa a 120+ entidades)',
    headquarters: 'Bilbao (Bizkaia)',
    description: 'Asociación Clúster de Industrias de Medio Ambiente de Euskadi. Aglutina a la cadena de valor de la ecoindustria vasca: residuos, suelos, agua, aire, cambio climático y ecodiseño.',
    keyProjects: [
      'Iniciativas de simbiosis industrial y valorización de subproductos en Bizkaia',
      'Fomento de licitaciones multilaterales consorciadas para empresas vascas en el exterior',
      'Mapeo de talento y competencias clave para la transición ecológica'
    ],
    recentNews: [
      {
        title: 'Publicación del informe de coyuntura y oportunidades de empleo en el sector verde vasco',
        date: '2026-09-28',
        snippet: 'Demanda creciente de especialistas en análisis de datos ambientales y gestión hídrica.'
      }
    ],
    workCulture: [
      'Networking institucional de alto nivel',
      'Dinamismo en gestión de proyectos de innovación colaborativa',
      'Visión panorámica de todo el tejido industrial y consultor vasco'
    ],
    redFlags: ['Puestos de gestión en el clúster suelen tener alta polivalencia organizativa'],
    interviewArguments: [
      'Capacidad de interlocución entre el mundo científico-técnico y las necesidades empresariales reales.',
      'Visión internacional de mejores prácticas en Europa del Norte (Alemania/Polonia).',
      'Habilidad demostrada para dinamizar mesas de trabajo multiactor y sintetizar datos complejos.'
    ],
    techStack: ['Gestión de Proyectos', 'Inteligencia de Mercado', 'Análisis de Redes de Clúster'],
    lastResearched: '2026-10-14'
  },
  {
    id: 'comp-cic-energigune',
    name: 'CIC energiGUNE',
    website: 'https://cicenergigune.com/',
    sector: 'I+D en Almacenamiento de Energía & Baterías (BRTA)',
    size: '180-250 investigadores',
    headquarters: 'Parque Tecnológico de Álava (Miñano, Vitoria-Gasteiz)',
    description: 'Centro de investigación referente en Europa en almacenamiento electroquímico (baterías de estado sólido, sodio) y térmico para energías renovables y movilidad sostenible.',
    keyProjects: [
      'Iniciativa europea Battery 2030+ y desarrollo de celdas libres de cobalto',
      'Sistemas de almacenamiento térmico para calor industrial descarbonizado',
      'Análisis de ciclo de vida (LCA) y huella de carbono de nuevos materiales de almacenamiento'
    ],
    recentNews: [
      {
        title: 'Nuevos laboratorios de prototipado y validación de tecnologías de almacenamiento',
        date: '2026-08-15',
        snippet: 'Convocatorias continuas de personal investigador e ingenieros de sostenibilidad.'
      }
    ],
    workCulture: [
      'Investigación de vanguardia mundial',
      'Entorno multicultural con más de 20 nacionalidades',
      'Equipamiento de última generación (difracción de rayos X, salas secas)'
    ],
    redFlags: ['Fuerte focalización en ciencia de materiales y electroquímica'],
    interviewArguments: [
      'Base sólida en física y matemáticas que permite abordar modelación termodinámica y análisis de balance de masas.',
      'Especialización en análisis de ciclo de vida (LCA) y evaluación de huella ambiental de tecnologías de transición.',
      'Experiencia en redacción y justificación de proyectos europeos.'
    ],
    techStack: ['Python', 'LCA OpenLCA / SimaPro', 'Modelación Térmica', 'Análisis de Datos'],
    lastResearched: '2026-10-14'
  },
  {
    id: 'comp-cristina-enea',
    name: 'Fundación Cristina Enea',
    website: 'https://www.cristinaenea.eus/',
    sector: 'Educación Ambiental, Transición Ecosocial & Cultura de Sostenibilidad',
    size: '15-30 empleados',
    headquarters: 'Donostia-San Sebastián (Gipuzkoa)',
    description: 'Fundación municipal y centro de recursos medioambientales de referencia en Gipuzkoa. Genera conocimiento, debate ciudadano y estrategias participativas para la transición ecológica urbana y la defensa de la biodiversidad.',
    keyProjects: [
      'Observatorio de Sostenibilidad de San Sebastián',
      'Programas de renaturalización urbana y ciencia ciudadana en cuencas del Urumea',
      'Exposiciones y debates sobre justicia climática y decrecimiento'
    ],
    recentNews: [
      {
        title: 'Lanzamiento de las jornadas anuales sobre biodiversidad urbana y adaptación local',
        date: '2026-09-05',
        snippet: 'Enfoque en la integración de conocimiento científico en la toma de decisiones ciudadana.'
      }
    ],
    workCulture: [
      'Sensibilidad ecológica profunda y compromiso social',
      'Trabajo cercano a la comunidad local y centros educativos',
      'Foco en la divulgación científica rigurosa y accesible'
    ],
    redFlags: ['Presupuestos de proyectos medianos dependientes de convenios institucionales'],
    interviewArguments: [
      'Trayectoria probada en educación y divulgación ambiental, incluyendo exposiciones internacionales (Oslo, Bonn).',
      'Diseño agroecológico y permacultura aplicable a renaturalización urbana y huertos comunitarios.',
      'Habilidad pedagógica para traducir datos biofísicos complejos a narrativas transformadoras.'
    ],
    techStack: ['Divulgación Científica', 'Ciencia Ciudadana', 'Facilitación Participativa', 'QGIS'],
    lastResearched: '2026-10-14'
  },
  {
    id: 'comp-ecodes',
    name: 'ECODES - Ecología y Desarrollo',
    website: 'https://ecodes.org/',
    sector: 'Think Tank Ambiental, Gobernanza del Agua y Descarbonización',
    size: '40-70 profesionales',
    headquarters: 'Zaragoza / Madrid / Bilbao',
    description: 'Organización referente en España que actúa como puente entre la sociedad civil, las administraciones públicas y el sector privado para acelerar la transición hacia una economía neutra en carbono y socialmente justa.',
    keyProjects: [
      'Iniciativa CeroCO2 para huella de carbono y compensación de emisiones con impacto social',
      'Gobernanza participativa del agua y adaptación a la sequía en cuencas ibéricas',
      'Observatorio de la Transición Justa y pobreza energética'
    ],
    recentNews: [
      {
        title: 'Presentación del informe sobre políticas de resiliencia hídrica ante el cambio climático',
        date: '2026-09-18',
        snippet: 'Propuestas concretas de gestión de la demanda y protección de caudales ecológicos.'
      }
    ],
    workCulture: [
      'Incidencia política constructiva basada en evidencias científicas',
      'Cultura de trabajo en red y alianzas amplias',
      'Enfoque propositivo y de soluciones viables'
    ],
    redFlags: ['Dependencia de convocatorias competitivas y donaciones institucionales'],
    interviewArguments: [
      'Autor de presentaciones técnicas ante el Congreso de Chile sobre gestión de cuencas y riesgo de incendios.',
      'MSc en Environmental Management con comprensión de instrumentos de gobernanza ambiental.',
      'Alineamiento ético total con los principios de transición justa y equidad territorial.'
    ],
    techStack: ['Gobernanza Ambiental', 'Inventarios de Emisiones', 'Gestión de Cuencas', 'Incidencia Política'],
    lastResearched: '2026-10-14'
  },
  {
    id: 'comp-alboan',
    name: 'Alboan ONGD',
    website: 'https://www.alboan.org/',
    sector: 'Cooperación Internacional, Justicia Ambiental y Defensores del Territorio',
    size: '40-60 personas',
    headquarters: 'Bilbao (Bizkaia) / Donostia / Pamplona',
    description: 'ONGD jesuita en Euskadi y Navarra. Trabaja en la defensa de los derechos humanos y la justicia socioambiental en comunidades del Sur Global (América Latina, África, India) y la movilización ciudadana en Euskadi.',
    keyProjects: [
      'Defensa de defensores y defensoras de la tierra y los bienes comunes en la Amazonía',
      'Campaña Tecnología Libre de Conflicto sobre cadenas globales de suministro y minerales',
      'Proyectos de soberanía alimentaria y adaptación al cambio climático en comunidades indígenas'
    ],
    recentNews: [
      {
        title: 'Convocatorias de cooperación descentralizada y educación transformadora en Euskadi',
        date: '2026-09-12',
        snippet: 'Énfasis en los vínculos entre crisis climática y derechos de los pueblos indígenas.'
      }
    ],
    workCulture: [
      'Fuerte compromiso ético y humano',
      'Respeto mutuo y horizontalidad en las relaciones con contrapartes del Sur',
      'Enfoque de género y decolonial'
    ],
    redFlags: ['Salarios del tercer sector regulados por convenio de acción social'],
    interviewArguments: [
      'Experiencia en investigación sobre impactos de monocultivos forestales con comunidades locales en América Latina.',
      'Colaboración con redes globales como Global Forest Coalition y Environmental Paper Network.',
      'Competencias en diseño permacultural, agroecología y mediación comunitaria.'
    ],
    techStack: ['Formulación de Proyectos UE/AECID', 'Enfoque de Marco Lógico', 'Salvaguardias Socioambientales'],
    lastResearched: '2026-10-14'
  },
  {
    id: 'comp-mundubat',
    name: 'Mundubat',
    website: 'https://www.mundubat.org/',
    sector: 'Soberanía Alimentaria, Derechos Territoriales y Solidaridad Internacional',
    size: '30-45 personas',
    headquarters: 'Bilbao (Bizkaia)',
    description: 'Organización vasca de cooperación internacional y transformación social. Centrada en la soberanía alimentaria, la agroecología, la defensa de los derechos colectivos territoriales y los derechos del campesinado.',
    keyProjects: [
      'Apoyo a sistemas agroalimentarios locales y redes campesinas agroecológicas',
      'Incidencia en políticas públicas de comercio justo y debida diligencia empresarial',
      'Defensa de las comunidades rurales frente al extractivismo en América Latina'
    ],
    recentNews: [
      {
        title: 'Nuevos proyectos de agroecología y transición alimentaria en Euskadi y América Latina',
        date: '2026-08-25',
        snippet: 'Articulación con movimientos sociales y administraciones locales.'
      }
    ],
    workCulture: [
      'Militancia activa, horizontalidad y asamblearismo',
      'Solidaridad internacionalista y respeto a la autonomía comunitaria',
      'Espacio de debate político profundo'
    ],
    redFlags: ['Estructura muy arraigada al tejido asociativo local que valora trayectoria previa en movimientos sociales'],
    interviewArguments: [
      'Compromiso práctico en agroecología (PDC certificado) y defensa de sistemas hídricos comunitarios.',
      'Testimonio oficial en el Congreso de Chile sobre los impactos territoriales del modelo forestal.',
      'Conexión vivencial y política con las luchas socioambientales latinoamericanas.'
    ],
    techStack: ['Agroecología', 'Facilitación Comunitaria', 'Gestión de Subvenciones AVCD/Gobierno Vasco'],
    lastResearched: '2026-10-14'
  },
  {
    id: 'comp-elankidetza',
    name: 'eLankidetza - Agencia Vasca de Cooperación y Solidaridad',
    website: 'https://www.elankidetza.euskadi.eus/',
    sector: 'Administración Pública / Cooperación al Desarrollo de Euskadi',
    size: '30-50 personas',
    headquarters: 'Vitoria-Gasteiz / Bilbao',
    description: 'Entidad pública dependiente del Gobierno Vasco encargada de planificar, gestionar y evaluar las políticas públicas vascas de cooperación internacional para el desarrollo y solidaridad transformadora.',
    keyProjects: [
      'Convocatorias anuales de proyectos de cooperación y ayuda humanitaria internacional',
      'Estrategia vasca de transición ecológica justa en cooperación internacional',
      'Seguimiento y evaluación técnica de programas plurianuales en cuencas prioritarias'
    ],
    recentNews: [
      {
        title: 'Resolución de convocatorias estratégicas de cooperación con enfoque ecológico y de género',
        date: '2026-09-30',
        snippet: 'Priorización de iniciativas de mitigación y soberanía alimentaria.'
      }
    ],
    workCulture: [
      'Gestión pública con altos estándares de transparencia y control de gasto',
      'Compromiso social de país respaldado por la sociedad vasca',
      'Rigor administrativo y normativo'
    ],
    redFlags: ['Puestos fijos sujetos a procesos de selección pública de la administración vasca'],
    interviewArguments: [
      'Capacidad de evaluación técnica y metodológica de proyectos con criterios de impacto ambiental medibles.',
      'Doble formación en ciencias duras (geofísica) y políticas ambientales europeas.',
      'Conocimiento exhaustivo del contexto latinoamericano y de la cooperación descentralizada.'
    ],
    techStack: ['Evaluación de Impacto', 'Marco Lógico', 'Directrices de Cooperación Vasca', 'Auditoría Técnica'],
    lastResearched: '2026-10-14'
  },
  {
    id: 'comp-epn',
    name: 'Environmental Paper Network (EPN)',
    website: 'https://environmentalpaper.org/',
    sector: 'Coalición Científica y de Incidencia Internacional en Bosques y Carbono',
    size: 'Red internacional de más de 150 organizaciones',
    headquarters: 'Alemania / Internacional',
    description: 'Red global de organizaciones de la sociedad civil que monitorea y combate la expansión de monocultivos de árboles industriales, la deforestación y la falsa neutralidad de la bioenergía de biomasa.',
    keyProjects: [
      'Auditoría de integridad de créditos de carbono en el sector forestal y de plantaciones',
      'Campaña global contra los subsidios a la biomasa leñosa a gran escala en la UE (RED III)',
      'Monitoreo de derechos humanos y tenencia de tierras en zonas de monocultivos'
    ],
    recentNews: [
      {
        title: 'Publicación del informe sobre los impactos climáticos ocultos de la bioenergía industrial',
        date: '2026-07-20',
        snippet: 'Análisis cuantitativo de la deuda de carbono y el impacto en sumideros forestales.'
      }
    ],
    workCulture: [
      'Trabajo remoto global altamente coordinado',
      'Investigación técnica independiente para desmantelar greenwashing',
      'Colaboración solidaria entre científicos y activistas de campo'
    ],
    redFlags: ['Financiación dependiente de fundaciones filantrópicas internacionales'],
    interviewArguments: [
      'Investigador con experiencia directa como autor de informes técnicos para EPN y GFC sobre plantaciones de biomasa.',
      'Dominio de contabilidad de carbono e inconsistencias en salvaguardias ambientales de la cadena de suministro.',
      'Red de contactos activa en Alemania, Europa y América Latina.'
    ],
    techStack: ['Contabilidad de Carbono', 'Análisis Satelital GIS', 'Redacción de Informes Técnicos', 'Incidencia Política'],
    lastResearched: '2026-10-14'
  },
  {
    id: 'comp-gfc',
    name: 'Global Forest Coalition',
    website: 'https://globalforestcoalition.org/',
    sector: 'Políticas Globales de Biodiversidad, Bosques y Derechos Colectivos',
    size: 'Red internacional con 125+ organizaciones en 70 países',
    headquarters: 'Alemania / Países Bajos / Internacional',
    description: 'Coalición internacional de ONG y organizaciones de Pueblos Indígenas que defiende políticas de conservación forestal basadas en los derechos humanos y combate soluciones basadas en el mercado que destruyen ecosistemas.',
    keyProjects: [
      'Observatorio de Falsas Soluciones Climáticas y Mercados Voluntarios de Carbono',
      'Campaña por la Conservación Comunitaria de Bosques e iniciativa ICCAs',
      'Monitoreo de las negociaciones de la COP del Convenio sobre la Diversidad Biológica (CDB)'
    ],
    recentNews: [
      {
        title: 'Participación en las negociaciones del CDB sobre financiamiento de la biodiversidad',
        date: '2026-09-02',
        snippet: 'Demanda de apoyo directo a las comunidades locales frente a los esquemas de compensación.'
      }
    ],
    workCulture: [
      'Perspectiva global anticolonial y de justicia de género',
      'Facilitación multicultural en inglés, español y francés',
      'Incidencia directa en cumbres de la ONU (CMNUCC, CDB)'
    ],
    redFlags: ['Organización con horarios flexibles adaptados a husos horarios globales'],
    interviewArguments: [
      'Trayectoria demostrada como investigador colaborador en informes de impacto del sector de celulosa y biomasa.',
      'Manejo riguroso del marco científico de sumideros de carbono y dinámicas de suelos edáficos.',
      'Compromiso genuino con los derechos colectivos de las comunidades guardianas de ecosistemas.'
    ],
    techStack: ['Gobernanza de la Biodiversidad', 'Políticas ONU', 'Análisis Socioambiental', 'Comunicaciones Estratégicas'],
    lastResearched: '2026-10-14'
  },
  {
    id: 'comp-cau-kiel',
    name: 'CAU Kiel - Coastal & Peatland Research Group',
    website: 'https://www.uni-kiel.de/',
    sector: 'Investigación Universitaria de Excelencia en Turberas y Ecosistemas Costeros',
    size: '3.500+ investigadores y docentes',
    headquarters: 'Kiel (Schleswig-Holstein, Alemania)',
    description: 'Universidad de excelencia alemana con uno de los institutos de geociencias y ciencias ambientales más prestigiosos de Europa. Lidera la investigación en restauración de turberas, balances de GEI con eddy covariance y dinámica de cuencas en el Báltico y Mar del Norte.',
    keyProjects: [
      'Monitoreo continuo micrometeorológico de flujos de CO2 y CH4 en turberas restauradas (paludicultura)',
      'Dinámica hidrogeoquímica y transporte de nutrientes en cuencas agrícolas del norte de Alemania',
      'Modelado numérico de interacción océano-atmósfera y balance sedimentario costero'
    ],
    recentNews: [
      {
        title: 'Ampliación de la red de torres de flujo micrometeorológico en turberas del norte de Alemania',
        date: '2026-10-10',
        snippet: 'Medición de alta frecuencia de balance de carbono para políticas de descarbonización de la UE.'
      }
    ],
    workCulture: [
      'Máximo rigor académico y metodológico alemán',
      'Laboratorios e instrumentación de campo de última generación',
      'Publicación en revistas científicas de alto impacto (Nature, Global Change Biology)'
    ],
    redFlags: ['Exige titulación oficial alemana o homologada para contratos de personal investigador (con la que Daniel cuenta)'],
    interviewArguments: [
      'Investigador activo en el laboratorio de turberas de CAU Kiel con experiencia práctica en torres eddy covariance y cámaras estáticas.',
      'Doble titulación M.Sc. en Environmental Management por CAU Kiel con evaluación sobresaliente.',
      'Dominio de tratamiento de datos crudos de alta frecuencia en R y modelación espacial.'
    ],
    techStack: ['EddyPro', 'R', 'Python', 'Sensores Micrometeorológicos Licor', 'QGIS'],
    lastResearched: '2026-10-14'
  },
  {
    id: 'comp-iberdrola',
    name: 'Iberdrola Renovable & Innovación',
    website: 'https://www.iberdrola.com/',
    sector: 'Energías Renovables, Redes Eléctricas y Descarbonización',
    size: '40.000+ empleados',
    headquarters: 'Bilbao (Torre Iberdrola, Bizkaia)',
    description: 'Líder energético global con sede mundial en Bilbao. Mayor productor de energía eólica del mundo y pionero en la transición energética hacia un modelo 100% renovable, redes inteligentes e hidrógeno verde.',
    keyProjects: [
      'Parques eólicos marinos (offshore) en el Mar del Norte y Báltico (Wikinger, Baltic Eagle)',
      'Integración de biodiversidad y restauración ambiental en plantas fotovoltaicas y eólicas',
      'Estudios de impacto ambiental y licencias de conexión para proyectos internacionales'
    ],
    recentNews: [
      {
        title: 'Inversiones récord en redes inteligentes e innovación renovable internacional',
        date: '2026-10-08',
        snippet: 'Compromiso de cero emisiones netas en Alcances 1, 2 y 3 para 2040.'
      }
    ],
    workCulture: [
      'Gran multinacional del IBEX 35 con recursos técnicos avanzados',
      'Oportunidades de movilidad internacional en Europa y América',
      'Enfoque en excelencia operativa y cumplimiento de plazos'
    ],
    redFlags: ['Estructura corporativa jerárquica con procesos de decisión más lentos que en pymes'],
    interviewArguments: [
      'Perfil geofísico idóneo para prospección de recursos eólicos/solares y geotecnia ambiental marina.',
      'Familiaridad con los mercados energéticos de Alemania y España.',
      'Dominio de herramientas SIG para optimización del emplazamiento de activos renovables.'
    ],
    techStack: ['GIS', 'Python', 'Modelos Meteorológicos', 'ESG Reporting', 'Estudios de Impacto'],
    lastResearched: '2026-10-14'
  },
  {
    id: 'comp-siemens-gamesa',
    name: 'Siemens Gamesa Renewable Energy',
    website: 'https://www.siemensgamesa.com/',
    sector: 'Tecnología Eólica Terrestre y Marina',
    size: '25.000+ empleados',
    headquarters: 'Zamudio (Parque Científico y Tecnológico de Bizkaia)',
    description: 'Líder mundial en fabricación, instalación y mantenimiento de aerogeneradores para energía eólica onshore y offshore, con centros de ingeniería clave en Zamudio (Bizkaia).',
    keyProjects: [
      'Desarrollo de palas de aerogenerador 100% reciclables (RecyclableBlade)',
      'Modelado de recurso eólico y micrometeorología en terrenos complejos',
      'Evaluación de impacto ambiental y acústico en proyectos eólicos internacionales'
    ],
    recentNews: [
      {
        title: 'Lanzamiento de nuevas turbinas marinas de alta potencia para el mercado europeo',
        date: '2026-09-14',
        snippet: 'Desarrollo de proyectos estratégicos de I+D en el Parque Tecnológico de Zamudio.'
      }
    ],
    workCulture: [
      'Cultura de ingeniería eólica alemana-española',
      'Enfoque en seguridad, calidad y sostenibilidad de materiales',
      'Inglés como lengua principal de trabajo técnico'
    ],
    redFlags: ['Reestructuraciones corporativas periódicas vinculadas a la integración en Siemens Energy'],
    interviewArguments: [
      'Formación sólida en geofísica y mecánica de fluidos aplicable a la física del viento y capas límite atmosféricas.',
      'Capacidad de modelación estadística y geoespacial en R y Python.',
      'Doble formación germano-iberoamericana ideal para la cultura binacional de la compañía.'
    ],
    techStack: ['Python', 'WAsP / WindPRO', 'QGIS', 'Análisis Micrometeorológico', 'LCA'],
    lastResearched: '2026-10-14'
  }
];

const thuenenRaw: Partial<JobOffer> = {
  id: 'job-thuenen-techworms-369',
  title: 'Wissenschaftliche*r Mitarbeiter*in / Doktorand*in Agrar-/Bodenwissenschaften (w/m/d)',
  company: 'Johann Heinrich von Thünen-Institut',
  companyId: 'comp-thuenen',
  location: 'Braunschweig, Niedersachsen, Alemania',
  country: 'Alemania',
  isBilbaoLocation: false,
  isRemote: false,
  url: 'https://www.karriere-thuenen.de/index.php?ac=jobad&id=369&language=2',
  sourceId: 'src-thuenen',
  sourceName: 'Thünen-Institut Karriereportal',
  publishedDate: '2026-10-01',
  deadline: '2026-10-22',
  salaryMin: 43742,
  salaryMax: 62705,
  salaryCurrency: 'EUR',
  rawDescription: 'Das Institut für Agrarklimaschutz des Johann Heinrich von Thünen-Instituts am Standort Braunschweig sucht zum 01.12.2026 befristet bis zum 31.10.2030 eine*n wissenschaftliche*n Mitarbeiter*in / Doktorand*in im Bereich Agrar- oder Bodenwissenschaften (w/m/d) in Teilzeit mit 70 v. H. (27,3 h/Woche) zur Mitarbeit im Verbundprojekt "TechWorms". Das Projekt erforscht die Kohlenstoffsequestrierung im Unterboden durch künstliche vertikale Makroporen (Regenwurmtechnik), um Bodenkohlenstoff in tiefere Horizonte zu transportieren und landwirtschaftliche Erträge sowie Klimaschutz zu optimieren. Vergütung nach TVöD Bund E 13.',
  requirements: [
    'Estudios universitarios superiores (M.Sc. o Diplom) en Agronomía, Ciencias del Suelo (Bodenkunde), Geoecología o afines',
    'Conocimientos sólidos y fundamentados en edafología y física/química del suelo',
    'Conocimientos en interacción suelo-planta y dinámica radicular',
    'Experiencia práctica en evaluación y análisis estadístico de datos en R',
    'Experiencia en redacción científica y elaboración de reportes de proyectos',
    'Disponibilidad para trabajo de campo independiente de la meteorología y viajes de muestreo',
    'Excelente nivel de inglés y alemán (hablado y escrito)'
  ],
  responsibilities: [
    'Montaje e instrumentación de ensayos de campo con la tecnología Tech-Worm',
    'Mediciones de penetración radicular con RootBox y evaluación de rendimientos agrícolas',
    'Análisis isotópicos en biomasa y raíces para evaluar la absorción hídrica y de nutrientes',
    'Evaluación y modelado estadístico de series de datos en R',
    'Redacción de publicaciones científicas y tesis doctoral en cooperación con universidades (TU Braunschweig)',
    'Divulgación científica y comunicación con stakeholders agrícolas y del sector público'
  ],
  status: 'Nueva',
  isFavorite: true,
  extractedAt: '2026-10-21 03:00',
  isVerified: true,
  verificationStatus: 'Vigente y Verificada',
  verifiedAt: '2026-10-21 03:00',
  verificationReason: 'Convocatoria oficial activa del Instituto Thünen con plazo de recepción hasta el 22.10.2026.',
  companyEnrichment: {
    sector: 'Investigación Federal en Suelos, Clima, Bosques y Agricultura (BMEL)',
    description: 'Bundesforschungsinstitut für Ländliche Räume, Wald und Fischerei.',
    hqLocation: 'Braunschweig, Niedersachsen, Alemania',
    websiteUrl: 'https://www.thuenen.de/',
    strategicProjects: ['TechWorms', 'BZE-LW Bodenzustandserhebung', 'MoorNetz']
  },
  personalFitDetails: {
    matchingSkills: ['R', 'Sistemas Biofísicos & Suelos', 'Gobernanza Ambiental', 'Python'],
    skillGaps: [],
    fitSummary: 'Encaje sobresaliente con el perfil de máster en CAU Kiel, experiencia en dinámica de suelos, carbono y análisis estadístico en R.'
  },
  leadProfile: THUENEN_TECHWORMS_DOSSIER.leadProfile,
  jobDossier: THUENEN_TECHWORMS_DOSSIER
};

const ubaRaw: Partial<JobOffer> = {
  id: 'job-uba-ki-product-owner-1499096',
  title: 'Spezialist*in im Bereich KI-Projektmanagement und KI Product Owner (KI-Lab)',
  company: 'Umweltbundesamt (UBA)',
  companyId: 'comp-uba',
  location: 'Leipzig, Berlin oder Dessau-Roßlau, Alemania',
  country: 'Alemania',
  isBilbaoLocation: false,
  isRemote: true,
  url: 'https://interamt.de/koop/app/stelle?0&id=1499096',
  sourceId: 'src-interamt',
  sourceName: 'Interamt (Öffentlicher Dienst)',
  publishedDate: '2026-10-05',
  deadline: '2026-10-28',
  salaryMin: 62489,
  salaryMax: 89579,
  salaryCurrency: 'EUR',
  rawDescription: 'Das Umweltbundesamt (UBA) sucht für sein Anwendungslabor für Künstliche Intelligenz und Big Data (KI-Lab) mit bis zu 30 Mitarbeitenden an den Standorten Leipzig, Berlin oder Dessau-Roßlau eine*n Spezialistin*Spezialisten im Bereich KI-Projektmanagement und KI Product Owner (w/m/d). Es handelt sich um eine Mutterschutzvertretung mit 100% der regelmäßigen Arbeitszeit (39 h/Woche) vom 13.12.2026 bis 31.03.2027 mit angestrebter Verlängerung während der Elternzeit. Vergütung nach TVöD Bund E 13.',
  requirements: [
    'Título universitario superior (Máster o Diplom) preferentemente en área MINT (informática, ingeniería ambiental, diseño técnico, economía o gestión)',
    'Conocimientos profundos y experiencia contrastada en gestión híbrida y ágil de proyectos (Scrum, Product Ownership)',
    'Conocimientos metodológicos de procesos de desarrollo de software y aplicaciones de IA',
    'Manejo solvente de herramientas de gestión de proyectos (MS Project, OpenProject, tableros Kanban)',
    'Alta capacidad de comunicación, trabajo en equipo y resolución creativa de problemas',
    'Sensibilidad de género y competencias relacionales en la administración pública',
    'Excelente nivel de inglés y alemán (hablado y escrito)'
  ],
  responsibilities: [
    'Product Ownership en proyectos de desarrollo de soluciones de Inteligencia Artificial para el Verwaltungsvollzug ambiental',
    'Levantamiento de necesidades, conceptualización funcional y elaboración de business cases',
    'Dirección y coordinación de proyectos ágiles/híbridos en el KI-Lab del UBA',
    'Planificación, seguimiento y control de presupuestos y recursos del portfolio de IA',
    'Asesoramiento y formación a coordinadores de proyectos en gestión ágil y contingencias',
    'Interlocución con usuarios finales, personal científico y equipos de diseño UX/UI'
  ],
  status: 'Nueva',
  isFavorite: true,
  extractedAt: '2026-10-21 03:00',
  isVerified: true,
  verificationStatus: 'Vigente y Verificada',
  verifiedAt: '2026-10-21 03:00',
  verificationReason: 'Convocatoria oficial activa del Umweltbundesamt en Interamt con plazo hasta el 28.10.2026.',
  companyEnrichment: {
    sector: 'Agencia Federal de Medio Ambiente de Alemania (BMUV)',
    description: 'La máxima autoridad técnica y científica de Alemania para la protección del medio ambiente.',
    hqLocation: 'Dessau-Roßlau / Leipzig / Berlín',
    websiteUrl: 'https://www.umweltbundesamt.de/',
    strategicProjects: ['KI-Lab Umweltbundesamt', 'Umweltpolitische Digitalagenda', 'Smart Environmental Analytics']
  },
  personalFitDetails: {
    matchingSkills: ['Python', 'Gobernanza Ambiental', 'Facilitación Multiactor', 'GIS'],
    skillGaps: [],
    fitSummary: 'Alta sintonía entre la formación MINT/geofísica, las políticas ambientales y la gestión de proyectos tecnológicos de IA.'
  }
};

export const initialOffers: JobOffer[] = [
  {
    ...thuenenRaw,
    matchScore: calculateMatchScore(thuenenRaw, initialProfile)
  } as JobOffer,
  {
    ...ubaRaw,
    matchScore: calculateMatchScore(ubaRaw, initialProfile)
  } as JobOffer
];

export const initialApplications: ApplicationItem[] = [];

export const initialCVs: CVVersion[] = [
  {
    id: 'cv-daniel-santander-es',
    name: 'CV Daniel Santander — Científico & Gobernanza Ambiental (ES)',
    templateId: 'academic_ngo',
    language: 'es',
    createdAt: '2026-10-14',
    updatedAt: '2026-10-14',
    selectedExperiences: ['exp-cau-kiel', 'exp-advocacy-policy', 'exp-biomass-epn'],
    selectedEducation: ['edu-msc-kiel-amu', 'edu-geophysics-uchile', 'edu-permaculture-epac'],
    selectedSkills: ['sk-1', 'sk-2', 'sk-3', 'sk-4', 'sk-5', 'sk-6', 'sk-7', 'sk-8', 'sk-9', 'sk-10'],
    selectedAchievements: ['ach-1', 'ach-2', 'ach-3', 'ach-4'],
    customSummary: initialProfile.summary,
    compiledData: {
      fullName: initialProfile.fullName,
      contactInfo: {
        email: initialProfile.email,
        phone: initialProfile.phone,
        location: `${initialProfile.preferredCity}, España`,
        linkedin: initialProfile.linkedin,
        github: initialProfile.github
      },
      summary: initialProfile.summary,
      experiences: initialProfile.experiences,
      education: initialProfile.education,
      skills: initialProfile.skills,
      languages: initialProfile.languages,
      achievements: initialProfile.achievementsBank,
      otherCourses: initialProfile.otherCourses
    }
  },
  {
    id: 'cv-daniel-santander-en',
    name: 'CV Daniel Santander — Biophysical Systems & Environmental Science (EN)',
    templateId: 'en_tech',
    language: 'en',
    createdAt: '2026-10-14',
    updatedAt: '2026-10-14',
    selectedExperiences: ['exp-cau-kiel', 'exp-advocacy-policy', 'exp-biomass-epn'],
    selectedEducation: ['edu-msc-kiel-amu', 'edu-geophysics-uchile', 'edu-permaculture-epac'],
    selectedSkills: ['sk-1', 'sk-2', 'sk-3', 'sk-4', 'sk-5', 'sk-6', 'sk-7', 'sk-8', 'sk-9', 'sk-10'],
    selectedAchievements: ['ach-1', 'ach-2', 'ach-3', 'ach-4'],
    customSummary: 'Interdisciplinary Environmental Scientist with a foundational background in Geophysics (FCFM, University of Chile) and a European Double M.Sc. in Environmental Management & Environmental Protection (CAU Kiel, Germany / AMU Poznań, Poland). Specialized in biophysical quantification, greenhouse gas flux dynamics (eddy covariance towers in peatlands), hydrological watershed balance, spatial data modeling (R, Python, QGIS, GEE), and multi-stakeholder environmental policy governance.',
    compiledData: {
      fullName: initialProfile.fullName,
      contactInfo: {
        email: initialProfile.email,
        phone: initialProfile.phone,
        location: 'Bilbao, Spain / EU Remote',
        linkedin: initialProfile.linkedin,
        github: initialProfile.github
      },
      summary: 'Interdisciplinary Environmental Scientist with a foundational background in Geophysics (FCFM, University of Chile) and a European Double M.Sc. in Environmental Management & Environmental Protection (CAU Kiel, Germany / AMU Poznań, Poland). Specialized in biophysical quantification, greenhouse gas flux dynamics (eddy covariance towers in peatlands), hydrological watershed balance, spatial data modeling (R, Python, QGIS, GEE), and multi-stakeholder environmental policy governance.',
      experiences: [
        {
          id: 'exp-cau-kiel',
          company: 'Christian-Albrechts-Universität zu Kiel & Adam Mickiewicz University',
          role: 'Researcher in Biophysical Systems & Peatland GHG Flux Dynamics',
          location: 'Kiel (Germany) / Poznań (Poland)',
          startDate: '2023',
          endDate: 'Present',
          isCurrent: true,
          summary: 'Empirical quantification of greenhouse gas fluxes (CO2/CH4) in rewetted peatlands using micrometeorological eddy covariance towers and static chambers. Soil and vegetation sampling, statistical and geospatial modeling (R, GIS).',
          achievements: [
            'Continuous monitoring and analysis of carbon balance and methane dynamics in ecological transition wetlands.',
            'Integration of high-frequency micrometeorological measurements with satellite remote sensing data.'
          ],
          technologies: ['R', 'Python', 'QGIS', 'ArcGIS', 'Google Earth Engine', 'Eddy Covariance'],
          isVerified: true
        },
        {
          id: 'exp-advocacy-policy',
          company: 'Environmental Policy Advisory & Legislative Advocacy',
          role: 'Technical Advisor on Environmental Policies and Watershed Management',
          location: 'Chile & Germany',
          startDate: '2021',
          endDate: 'Present',
          isCurrent: true,
          summary: 'Parliamentary and community technical advisory on wildfire prevention policy, integrated watershed management, and agroecological transition. Official testimony before the Emergency, Disasters and Firefighter Commission of the Chilean Chamber of Deputies on the structural link between forest monocultures and wildfire risk.',
          achievements: [
            'Official testimony and presentation at the National Congress of Chile on territorial planning and forest monoculture risk.',
            'Technical assistance to rural drinking water committees and community water governance networks.'
          ],
          technologies: ['Environmental Governance', 'Public Policy', 'Legislative Advocacy', 'Watershed Management'],
          isVerified: true
        },
        {
          id: 'exp-biomass-epn',
          company: 'Environmental Paper Network & Global Forest Coalition',
          role: 'Researcher on Biomass and Pulp Industry Impacts',
          location: 'Latin America & Europe',
          startDate: '2022',
          endDate: '2024',
          isCurrent: false,
          summary: 'Independent technical investigation into the biophysical and socio-ecological impacts of large-scale timber plantations, bioenergy, and carbon accounting methodologies. Coordination with civil society coalitions and international institutions.',
          achievements: [
            'Publication of technical reports on carbon accounting integrity and environmental safeguards in forestry supply chains.',
            'Co-organizer of international policy dialogues on community-led forest protection and governance.'
          ],
          technologies: ['Carbon Accounting', 'Environmental Safeguards', 'Multi-stakeholder Facilitation'],
          isVerified: true
        }
      ],
      education: [
        {
          id: 'edu-msc-kiel-amu',
          institution: 'Christian-Albrechts-Universität zu Kiel (Germany) & Adam Mickiewicz University in Poznań (Poland)',
          degree: 'Double M.Sc. in Environmental Management & Environmental Protection',
          fieldOfStudy: 'Environmental Sciences, Integrated Watershed Management & Ecosystem Protection',
          startDate: '2023',
          endDate: '2026',
          location: 'Kiel (Germany) & Poznań (Poland)',
          isVerified: true
        },
        {
          id: 'edu-geophysics-uchile',
          institution: 'University of Chile (FCFM)',
          degree: 'B.Sc. in Geophysics (Graduated with Distinction)',
          fieldOfStudy: 'Solid Earth Geophysics, Hydrogeophysics & Fluid Mechanics',
          startDate: '2016',
          endDate: '2021',
          location: 'Santiago, Chile',
          isVerified: true
        },
        {
          id: 'edu-permaculture-epac',
          institution: 'Permaculture and Agroecology School of Chile (EPAC)',
          degree: 'Certified Permaculture Designer (PDC)',
          fieldOfStudy: 'Keyline Hydrological Design, Soil Regeneration & Ecosystem Restoration',
          startDate: '2023',
          endDate: '2023',
          location: 'Chile',
          isVerified: true
        }
      ],
      skills: initialProfile.skills,
      languages: initialProfile.languages,
      achievements: [
        {
          id: 'ach-1',
          title: 'Official Testimony before the Chamber of Deputies of Chile',
          description: 'Technical demonstration of the structural correlation between industrial forest plantations and wildfire disaster risk before the Congressional Emergency Commission.',
          metrics: 'Official Legislative Testimony',
          tags: ['Congress', 'Advocacy', 'Forestry Model', 'Wildfires'],
          date: '2024-03-01',
          isVerified: true
        },
        {
          id: 'ach-2',
          title: 'International Investigation on Biomass Industry & Carbon Accounting',
          description: 'Comprehensive study of carbon integrity and socio-environmental safeguards with Global Forest Coalition and Environmental Paper Network.',
          metrics: 'International Report & Publication',
          tags: ['Biomass', 'Carbon Accounting', 'Forests', 'EPN'],
          date: '2024-06-01',
          isVerified: true
        },
        {
          id: 'ach-3',
          title: 'Semifinalist UN Citiverse Challenge for Sustainable Cities (SDG Cities)',
          description: 'Co-development of the Smart Food Parks concept integrating digital twins, IoT, and satellite remote sensing for urban territorial planning and climate resilience.',
          metrics: 'UN International Semifinalist',
          tags: ['UN', 'Digital Twin', 'IoT', 'Resilience'],
          date: '2024-11-01',
          isVerified: true
        },
        {
          id: 'ach-4',
          title: 'International Climate & Ecological Economics Presentations',
          description: 'Key presentations at Degrowth Conference Oslo 2025, Environmental Justice Conference Bonn 2025, and Latin American Forum in Bogotá.',
          metrics: '5+ International Presentations',
          tags: ['Conferences', 'International', 'Just Transition'],
          date: '2025-01-01',
          isVerified: true
        }
      ],
      otherCourses: initialProfile.otherCourses
    }
  }
];

