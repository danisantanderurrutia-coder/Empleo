import type { MasterProfile } from '../types/profile';
import type { JobOffer } from '../types/offers';
import type { CompanyDossier } from '../types/companies';
import type { ApplicationItem } from '../types/applications';
import type { JobSource } from '../types/sources';
import type { CVTemplateInfo, CVVersion } from '../types/cv';

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
  linkedin: 'https://linkedin.com/in/daniel-santander',
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
      degree: 'Licenciatura en Geofísica (con Distinción Máxima)',
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


export const initialOffers: JobOffer[] = [];

export const initialCompanies: CompanyDossier[] = [];

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
          degree: 'B.Sc. in Geophysics (Graduated with Highest Distinction)',
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

