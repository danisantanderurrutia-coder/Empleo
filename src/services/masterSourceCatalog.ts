import type { JobSource } from '../types/sources';

export interface SectorCategory {
  sectorName: string;
  description: string;
  icon: string;
  sources: JobSource[];
}

export const MASTER_SECTORAL_SOURCES: SectorCategory[] = [
  {
    sectorName: '✨ Empleo con Propósito e Impacto Social',
    description: 'Portales dedicados a proyectos sociales, ONGs, transición socio-ecológica e impacto ético.',
    icon: 'Sparkles',
    sources: [
      {
        id: 'src-idealist',
        name: 'Idealist.org (España & Global)',
        type: 'job_board',
        url: 'https://www.idealist.org/es/trabajos',
        priority: 'Alta',
        frequency: 'Diario',
        status: 'Activo',
        lastScraped: '2026-08-19 18:00',
        offersExtracted: 12,
        notes: 'Organizaciones sin ánimo de lucro y empleos con impacto social directo.'
      },
      {
        id: 'src-hacesfalta',
        name: 'Hacesfalta.org (Fundación Hazloposible)',
        type: 'job_board',
        url: 'https://www.hacesfalta.org/oportunidades/remuneradas/',
        priority: 'Alta',
        frequency: 'Diario',
        status: 'Activo',
        lastScraped: '2026-08-19 18:00',
        offersExtracted: 15,
        notes: 'Bolsa de empleo de referencia para ONGs e impacto en España.'
      },
      {
        id: 'src-impactpool',
        name: 'Impactpool (Naciones Unidas & Desarrollo)',
        type: 'job_board',
        url: 'https://www.impactpool.org/search',
        priority: 'Alta',
        frequency: 'Diario',
        status: 'Activo',
        lastScraped: '2026-08-19 18:00',
        offersExtracted: 9,
        notes: 'Carreras en la ONU, ONGs internacionales y organismos multilaterales.'
      }
    ]
  },
  {
    sectorName: '🗺️ Cooperación Internacional y Desarrollo',
    description: 'Agencias y redes de desarrollo internacional, ayuda humanitaria y cooperación comunitaria.',
    icon: 'Globe2',
    sources: [
      {
        id: 'src-reliefweb',
        name: 'ReliefWeb (UN OCHA)',
        type: 'job_board',
        url: 'https://reliefweb.int/jobs',
        priority: 'Alta',
        frequency: 'Diario',
        status: 'Activo',
        lastScraped: '2026-08-19 18:00',
        offersExtracted: 14,
        notes: 'Convocatorias mundiales de ayuda humanitaria, clima y desarrollo.'
      },
      {
        id: 'src-devnetjobs',
        name: 'DevNetJobs (International Development Jobs)',
        type: 'job_board',
        url: 'https://www.devnetjobs.org/',
        priority: 'Alta',
        frequency: 'Diario',
        status: 'Activo',
        lastScraped: '2026-08-19 18:00',
        offersExtracted: 8,
        notes: 'Empleo especializado en desarrollo internacional y gobernanza.'
      },
      {
        id: 'src-ongdeuskadi',
        name: 'Coordinadora de ONGD de Euskadi & Coordinadora Estatal',
        type: 'job_board',
        url: 'https://www.ongdeuskadi.org/empleo-ongd/',
        priority: 'Alta',
        frequency: 'Diario',
        status: 'Activo',
        lastScraped: '2026-08-19 18:00',
        offersExtracted: 10,
        notes: 'Bolsa unificada de empleo en cooperación y desarrollo en Euskadi y España.'
      }
    ]
  },
  {
    sectorName: '📊 Acción Climática y "Climate Tech"',
    description: 'Comunidades y startups dedicadas al clima, descarbonización, energía y transición justa.',
    icon: 'Cpu',
    sources: [
      {
        id: 'src-climatebase',
        name: 'Climatebase (Climate Tech Jobs)',
        type: 'job_board',
        url: 'https://climatebase.org/jobs',
        priority: 'Alta',
        frequency: 'Diario',
        status: 'Activo',
        lastScraped: '2026-08-19 18:00',
        offersExtracted: 18,
        notes: 'La mayor plataforma mundial de empleos en tecnologías climáticas y remediación.'
      },
      {
        id: 'src-workonclimate',
        name: 'Work on Climate',
        type: 'job_board',
        url: 'https://workonclimate.org/',
        priority: 'Alta',
        frequency: 'Diario',
        status: 'Activo',
        lastScraped: '2026-08-19 18:00',
        offersExtracted: 11,
        notes: 'Comunidad global de talento acelerando soluciones al cambio climático.'
      },
      {
        id: 'src-terrado',
        name: 'Terra.do Climate Jobs',
        type: 'job_board',
        url: 'https://www.terra.do/jobs',
        priority: 'Alta',
        frequency: 'Diario',
        status: 'Activo',
        lastScraped: '2026-08-19 18:00',
        offersExtracted: 9,
        notes: 'Ecosistema de formación y empleos en acción climática.'
      },
      {
        id: 'src-climatedrift',
        name: 'Climate Drift',
        type: 'job_board',
        url: 'https://www.climatedrift.com/',
        priority: 'Alta',
        frequency: 'Diario',
        status: 'Activo',
        lastScraped: '2026-08-19 18:00',
        offersExtracted: 7,
        notes: 'Transición de carrera profesional hacia el sector del clima.'
      }
    ]
  },
  {
    sectorName: '🌿 Sostenibilidad y Medio Ambiente',
    description: 'Portales especializados en ingeniería ambiental, ciencias del suelo, agua y biodiversidad.',
    icon: 'Leaf',
    sources: [
      {
        id: 'src-enviroo',
        name: 'Enviroo (Empleo Verde España)',
        type: 'job_board',
        url: 'https://enviroo.com/',
        priority: 'Alta',
        frequency: 'Diario',
        status: 'Activo',
        lastScraped: '2026-08-19 18:00',
        offersExtracted: 14,
        notes: 'Portal líder en empleo ambiental, sostenibilidad y economía circular en España.'
      },
      {
        id: 'src-greenjobs',
        name: 'Green Jobs España',
        type: 'job_board',
        url: 'https://www.greenjobs.es/',
        priority: 'Alta',
        frequency: 'Diario',
        status: 'Activo',
        lastScraped: '2026-08-19 18:00',
        offersExtracted: 10,
        notes: 'Bolsa especializada en renovables, ecología e ingeniería ambiental.'
      },
      {
        id: 'src-ambientum',
        name: 'Ambientum Empleo',
        type: 'job_board',
        url: 'https://www.ambientum.com/empleo/',
        priority: 'Alta',
        frequency: 'Diario',
        status: 'Activo',
        lastScraped: '2026-08-19 18:00',
        offersExtracted: 12,
        notes: 'Portal de noticias y empleo en gestión ambiental en España.'
      }
    ]
  },
  {
    sectorName: '🌟 Plataformas Especializadas en Trabajo Remoto',
    description: 'Buscadores globales y europeos de puestos 100% remotos e híbridos.',
    icon: 'Globe',
    sources: [
      {
        id: 'src-weworkremotely',
        name: 'We Work Remotely',
        type: 'job_board',
        url: 'https://weworkremotely.com/',
        priority: 'Alta',
        frequency: 'Diario',
        status: 'Activo',
        lastScraped: '2026-08-19 18:00',
        offersExtracted: 16,
        notes: 'Plataforma pionera en empleos remotos internacionales.'
      },
      {
        id: 'src-flexjobs',
        name: 'FlexJobs',
        type: 'job_board',
        url: 'https://www.flexjobs.com/',
        priority: 'Alta',
        frequency: 'Diario',
        status: 'Activo',
        lastScraped: '2026-08-19 18:00',
        offersExtracted: 13,
        notes: 'Puestos remotos verificados sin spam.'
      },
      {
        id: 'src-remoteco',
        name: 'Remote.co',
        type: 'job_board',
        url: 'https://remote.co/',
        priority: 'Alta',
        frequency: 'Diario',
        status: 'Activo',
        lastScraped: '2026-08-19 18:00',
        offersExtracted: 11,
        notes: 'Oportunidades laborales 100% remotas.'
      },
      {
        id: 'src-workingnomads',
        name: 'Working Nomads',
        type: 'job_board',
        url: 'https://www.workingnomads.com/jobs',
        priority: 'Alta',
        frequency: 'Diario',
        status: 'Activo',
        lastScraped: '2026-08-19 18:00',
        offersExtracted: 9,
        notes: 'Vacantes para nómadas digitales y especialistas remotos.'
      }
    ]
  },
  {
    sectorName: '🎓 Primer Empleo y Jóvenes Profesionales',
    description: 'Portales para talento joven, becas de investigación y programas de posgrado.',
    icon: 'GraduationCap',
    sources: [
      {
        id: 'src-primerempleo',
        name: 'Primer Empleo',
        type: 'job_board',
        url: 'https://www.primerempleo.com/',
        priority: 'Alta',
        frequency: 'Diario',
        status: 'Activo',
        lastScraped: '2026-08-19 18:00',
        offersExtracted: 10,
        notes: 'Puestos para graduados y másters en España.'
      },
      {
        id: 'src-jobteaser',
        name: 'JobTeaser España',
        type: 'job_board',
        url: 'https://www.jobteaser.com/es',
        priority: 'Alta',
        frequency: 'Diario',
        status: 'Activo',
        lastScraped: '2026-08-19 18:00',
        offersExtracted: 8,
        notes: 'Red universitaria europea de empleo para estudiantes y graduados.'
      },
      {
        id: 'src-talentoteca',
        name: 'Talentoteca (Fundación Universidad-Empresa)',
        type: 'job_board',
        url: 'https://www.talentoteca.es/',
        priority: 'Alta',
        frequency: 'Diario',
        status: 'Activo',
        lastScraped: '2026-08-19 18:00',
        offersExtracted: 7,
        notes: 'Prácticas y contratos para jóvenes profesionales en España.'
      }
    ]
  },
  {
    sectorName: '🌎 Oportunidades para Profesionales Latinoamericanos',
    description: 'Redes y portales con fuerte presencia en América Latina y talento global.',
    icon: 'Globe2',
    sources: [
      {
        id: 'src-torre',
        name: 'Torre.ai',
        type: 'job_board',
        url: 'https://torre.ai/search/jobs',
        priority: 'Alta',
        frequency: 'Diario',
        status: 'Activo',
        lastScraped: '2026-08-19 18:00',
        offersExtracted: 14,
        notes: 'Plataforma global impulsada por IA para conectar talento de LatAm y Europa.'
      },
      {
        id: 'src-getonbrd',
        name: 'Get on Board',
        type: 'job_board',
        url: 'https://www.getonbrd.com/',
        priority: 'Alta',
        frequency: 'Diario',
        status: 'Activo',
        lastScraped: '2026-08-19 18:00',
        offersExtracted: 12,
        notes: 'Empleos tecnológicos e interdisciplinarios en América Latina y remoto.'
      }
    ]
  },
  {
    sectorName: '💡 Portales Generales de Empleo en España',
    description: 'Las mayores bolsas de trabajo corporativas y públicas de España.',
    icon: 'Search',
    sources: [
      {
        id: 'src-infojobs',
        name: 'InfoJobs España',
        type: 'job_board',
        url: 'https://www.infojobs.net/',
        priority: 'Alta',
        frequency: 'Diario',
        status: 'Activo',
        lastScraped: '2026-08-19 18:00',
        offersExtracted: 25,
        notes: 'El portal de empleo con mayor volumen en España.'
      },
      {
        id: 'src-indeed',
        name: 'Indeed España',
        type: 'job_board',
        url: 'https://es.indeed.com/',
        priority: 'Alta',
        frequency: 'Diario',
        status: 'Activo',
        lastScraped: '2026-08-19 18:00',
        offersExtracted: 30,
        notes: 'Metabuscador masivo de empleo en España.'
      },
      {
        id: 'src-infoempleo',
        name: 'Infoempleo',
        type: 'job_board',
        url: 'https://www.infoempleo.com/',
        priority: 'Alta',
        frequency: 'Diario',
        status: 'Activo',
        lastScraped: '2026-08-19 18:00',
        offersExtracted: 18,
        notes: 'Portal clásico de empleo en España.'
      }
    ]
  },
  {
    sectorName: '📈 Perfiles Profesionales y Corporativos',
    description: 'Red social profesional y búsqueda de vacantes en empresas internacionales.',
    icon: 'Building2',
    sources: [
      {
        id: 'src-linkedin',
        name: 'LinkedIn Jobs España & Remoto',
        type: 'job_board',
        url: 'https://www.linkedin.com/jobs/',
        priority: 'Alta',
        frequency: 'Diario',
        status: 'Activo',
        lastScraped: '2026-08-19 18:00',
        offersExtracted: 40,
        notes: 'Red profesional líder en el mundo.'
      }
    ]
  },
  {
    sectorName: '🔎 Sectores Específicos y Empleo Rápido',
    description: 'Bolsas para perfiles técnicos, tecnológicos y de incorporación rápida.',
    icon: 'Zap',
    sources: [
      {
        id: 'src-tecnoempleo',
        name: 'Tecnoempleo',
        type: 'job_board',
        url: 'https://www.tecnoempleo.com/',
        priority: 'Alta',
        frequency: 'Diario',
        status: 'Activo',
        lastScraped: '2026-08-19 18:00',
        offersExtracted: 15,
        notes: 'Portal especializado en perfiles tecnológicos e informática.'
      },
      {
        id: 'src-jobtoday',
        name: 'Job Today España',
        type: 'job_board',
        url: 'https://jobtoday.com/es',
        priority: 'Alta',
        frequency: 'Diario',
        status: 'Activo',
        lastScraped: '2026-08-19 18:00',
        offersExtracted: 10,
        notes: 'Postulaciones ágiles en España.'
      }
    ]
  },
  {
    sectorName: '📅 Canales Públicos y Agencias (ETT)',
    description: 'Servicio público de empleo estatal (SEPE/Empléate) y agencias de selección.',
    icon: 'FileText',
    sources: [
      {
        id: 'src-empleate',
        name: 'Empléate (Gobierno de España / SEPE)',
        type: 'public_admin',
        url: 'https://empleate.gob.es/',
        priority: 'Alta',
        frequency: 'Diario',
        status: 'Activo',
        lastScraped: '2026-08-19 18:00',
        offersExtracted: 20,
        notes: 'Portal público oficial de empleo de España.'
      },
      {
        id: 'src-randstad',
        name: 'Randstad España',
        type: 'job_board',
        url: 'https://www.randstad.es/',
        priority: 'Alta',
        frequency: 'Diario',
        status: 'Activo',
        lastScraped: '2026-08-19 18:00',
        offersExtracted: 16,
        notes: 'Agencia de colocación y ETT líder en España.'
      }
    ]
  }
];
