import type { JobSource } from '../types/sources';

export interface SectorCategory {
  sectorName: string;
  description: string;
  icon: string;
  sources: JobSource[];
}

export const MASTER_SECTORAL_SOURCES: SectorCategory[] = [
  {
    sectorName: '🌿 Centros de I+D+i y Gobernanza en Euskadi & España (Radar Prioritario)',
    description: 'Centros de investigación de excelencia, fundaciones científicas y entidades públicas ambientales en Euskadi y ámbito estatal.',
    icon: 'Compass',
    sources: [
      {
        id: 'src-bc3',
        name: 'BC3 - Basque Centre for Climate Change (Bilbao / Leioa)',
        type: 'research_center',
        url: 'https://www.bc3research.org/careers.html',
        priority: 'Alta',
        frequency: 'Semanal',
        status: 'Activo',
        lastScraped: '2026-10-24 12:00',
        offersExtracted: 0,
        notes: 'Centro de referencia mundial en cambio climático (Campus UPV/EHU). Plazas predoctorales, postdocs y project management.',
        region: 'Euskadi / España',
        typicalDeadlinesNotes: 'Convocatorias continuas y proyectos europeos (Horizon Europe / LIFE).',
        countryFocus: 'Euskadi / España'
      },
      {
        id: 'src-tecnalia',
        name: 'Tecnalia Research & Innovation (Parque Tecnológico Zamudio / Bilbao)',
        type: 'research_center',
        url: 'https://www.tecnalia.com/empleo',
        priority: 'Alta',
        frequency: 'Semanal',
        status: 'Activo',
        lastScraped: '2026-10-24 12:00',
        offersExtracted: 0,
        notes: 'Mayor centro de investigación aplicada y desarrollo tecnológico de España. Áreas de transición energética, clima y digitalización.',
        region: 'Euskadi / España',
        typicalDeadlinesNotes: 'Bolsa activa permanente y convocatorias por proyecto.',
        countryFocus: 'Euskadi / España'
      },
      {
        id: 'src-neiker',
        name: 'NEIKER - Instituto Vasco de I+D Agrario & Edafología (Arkaute)',
        type: 'research_center',
        url: 'https://neiker.eus/es/empleo/',
        priority: 'Alta',
        frequency: 'Semanal',
        status: 'Activo',
        lastScraped: '2026-10-24 12:00',
        offersExtracted: 0,
        notes: 'Investigación puntera en ciencias del suelo, conservación edáfica, balance de carbono y gestión agroforestal sostenible.',
        region: 'Euskadi / España',
        typicalDeadlinesNotes: 'Ofertas públicas de empleo y contrataciones temporales de investigación.',
        countryFocus: 'Euskadi'
      },
      {
        id: 'src-ihobe',
        name: 'IHOBE - Sociedad Pública de Gestión Ambiental del Gobierno Vasco',
        type: 'public_admin',
        url: 'https://www.ihobe.eus/empleo',
        priority: 'Alta',
        frequency: 'Semanal',
        status: 'Activo',
        lastScraped: '2026-10-24 12:00',
        offersExtracted: 0,
        notes: 'Despliegue de políticas ambientales de Euskadi, resiliencia climática, suelos contaminados y economía circular.',
        region: 'Euskadi / España',
        typicalDeadlinesNotes: 'Procesos de selección reglados del sector público vasco.',
        countryFocus: 'Euskadi'
      },
      {
        id: 'src-azti',
        name: 'AZTI - Centro Científico y Tecnológico (Pasaia / Sukarrieta)',
        type: 'research_center',
        url: 'https://www.azti.es/empleo/',
        priority: 'Alta',
        frequency: 'Semanal',
        status: 'Activo',
        lastScraped: '2026-10-24 12:00',
        offersExtracted: 0,
        notes: 'Investigación marina y costera, servicios ecosistémicos, teledetección y cambio global.',
        region: 'Euskadi / España',
        typicalDeadlinesNotes: 'Convocatorias de I+D y plazas predoc/postdoc.',
        countryFocus: 'Euskadi'
      },
      {
        id: 'src-idom',
        name: 'IDOM Consulting, Engineering & Architecture (Sede Central Bilbao)',
        type: 'company_portal',
        url: 'https://www.idom.com/unete-a-idom/',
        priority: 'Alta',
        frequency: 'Semanal',
        status: 'Activo',
        lastScraped: '2026-10-24 12:00',
        offersExtracted: 0,
        notes: 'Multinacional vasca de consultoría e ingeniería. Proyectos de hidrología, cuencas, cambio climático y ordenación territorial.',
        region: 'Euskadi / España',
        typicalDeadlinesNotes: 'Publicación periódica de vacantes técnicas para consultoría ambiental.',
        countryFocus: 'Bilbao / Global'
      },
      {
        id: 'src-ikerbasque',
        name: 'Ikerbasque - Basque Foundation for Science',
        type: 'research_center',
        url: 'https://www.ikerbasque.net/es/convocatorias',
        priority: 'Alta',
        frequency: 'Cada 2 días',
        status: 'Activo',
        lastScraped: '2026-10-24 12:00',
        offersExtracted: 0,
        notes: 'Atracción de talento investigador al País Vasco. Convocatorias emblemáticas: Research Fellows y Research Associates.',
        region: 'Euskadi / España',
        typicalDeadlinesNotes: 'Plazos anuales estrictos: Research Fellows habitualmente en marzo.',
        countryFocus: 'Euskadi'
      },
      {
        id: 'src-aclima',
        name: 'Aclima - Basque Environment Cluster',
        type: 'job_board',
        url: 'https://aclima.eus/empleo/',
        priority: 'Alta',
        frequency: 'Semanal',
        status: 'Activo',
        lastScraped: '2026-10-24 12:00',
        offersExtracted: 0,
        notes: 'Clúster que agrupa a más de 100 empresas e instituciones del sector ambiental y ecológico vasco.',
        region: 'Euskadi / España',
        typicalDeadlinesNotes: 'Bolsa de empleo sectorial activa.',
        countryFocus: 'Euskadi'
      }
    ]
  },
  {
    sectorName: '🏛️ Investigación Federal y Sector Público en Alemania (TVöD / BMEL / BMUV)',
    description: 'Institutos federales de investigación científica, agencias ambientales y bolsas oficiales de empleo público en Alemania.',
    icon: 'Building2',
    sources: [
      {
        id: 'src-thuenen',
        name: 'Thünen-Institut Karriereportal (Braunschweig & Bundesweit)',
        type: 'research_center',
        url: 'https://www.karriere-thuenen.de/',
        priority: 'Alta',
        frequency: 'Semanal',
        status: 'Activo',
        lastScraped: '2026-10-24 12:00',
        offersExtracted: 1,
        notes: 'Bundesforschungsinstitut für Ländliche Räume, Wald und Fischerei. Máximo interés: Institut für Agrarklimaschutz y Edafología (TVöD E13/E14).',
        region: 'Alemania / DACH',
        typicalDeadlinesNotes: 'Plazos de 3 a 4 semanas tras publicación oficial.',
        countryFocus: 'Alemania (Braunschweig / Bund)'
      },
      {
        id: 'src-uba',
        name: 'Umweltbundesamt (UBA) - Stellenangebote (Dessau / Leipzig / Berlin)',
        type: 'public_admin',
        url: 'https://www.umweltbundesamt.de/das-uba/das-uba-als-arbeitgeber/stellenangebote',
        priority: 'Alta',
        frequency: 'Semanal',
        status: 'Activo',
        lastScraped: '2026-10-24 12:00',
        offersExtracted: 1,
        notes: 'Agencia Federal de Medio Ambiente de Alemania. Puestos de investigación, laboratorios de IA (KI-Lab) y gobernanza climática.',
        region: 'Alemania / DACH',
        typicalDeadlinesNotes: 'Publicación oficial simultánea en Interamt.',
        countryFocus: 'Alemania'
      },
      {
        id: 'src-interamt',
        name: 'Interamt (Das Stellenportal des Öffentlichen Dienstes)',
        type: 'public_admin',
        url: 'https://interamt.de/',
        priority: 'Alta',
        frequency: 'Semanal',
        status: 'Activo',
        lastScraped: '2026-10-24 12:00',
        offersExtracted: 1,
        notes: 'Portal principal de empleo público de Bund, Länder y Kommunen. Búsquedas recomendadas: "Boden", "Klimaschutz", "Umwelt".',
        region: 'Alemania / DACH',
        typicalDeadlinesNotes: 'Plazos estrictos y seguimiento con cuenta ciudadana / BundID.',
        countryFocus: 'Alemania'
      },
      {
        id: 'src-bund',
        name: 'Service.bund.de (Stellenangebote des Bundes)',
        type: 'public_admin',
        url: 'https://www.service.bund.de/Content/DE/Stellen/Suche/Formular.html',
        priority: 'Alta',
        frequency: 'Semanal',
        status: 'Activo',
        lastScraped: '2026-10-24 12:00',
        offersExtracted: 1,
        notes: 'Bolsa centralizada de convocatorias del Gobierno Federal de Alemania.',
        region: 'Alemania / DACH',
        typicalDeadlinesNotes: 'Actualización diaria vía feed y web.',
        countryFocus: 'Alemania'
      },
      {
        id: 'src-helmholtz',
        name: 'Helmholtz-Gemeinschaft (Stellenangebote Forschung & Klima)',
        type: 'research_center',
        url: 'https://www.helmholtz.de/karriere/stellenangebote/',
        priority: 'Alta',
        frequency: 'Semanal',
        status: 'Activo',
        lastScraped: '2026-10-24 12:00',
        offersExtracted: 0,
        notes: 'La mayor organización científica de Alemania (UFZ Leipzig, KIT, AWI, GFZ). Centros líderes en investigación ambiental y geofísica.',
        region: 'Alemania / DACH',
        typicalDeadlinesNotes: 'Plazas de doctorado, postdoctorado y scientists en proyectos internacionales.',
        countryFocus: 'Alemania'
      },
      {
        id: 'src-gfz',
        name: 'GFZ Helmholtz-Zentrum Potsdam (Deutsches GeoForschungsZentrum)',
        type: 'research_center',
        url: 'https://www.gfz-potsdam.de/karriere/stellenangebote',
        priority: 'Alta',
        frequency: 'Semanal',
        status: 'Activo',
        lastScraped: '2026-10-24 12:00',
        offersExtracted: 0,
        notes: 'Centro nacional de investigación geocientífica y geofísica en Potsdam. Teledetección, modelación de cuencas y sensores.',
        region: 'Alemania / DACH',
        typicalDeadlinesNotes: 'Convocatorias abiertas regulares para científicos/as de la tierra.',
        countryFocus: 'Alemania (Potsdam)'
      }
    ]
  },
  {
    sectorName: '🌍 Movilidad Científica, Unión Europea y Redes de Investigación',
    description: 'Portales oficiales de la Comisión Europea y redes internacionales para investigadores y científicos.',
    icon: 'Globe2',
    sources: [
      {
        id: 'src-euraxess',
        name: 'EURAXESS - Researchers in Motion (Comisión Europea)',
        type: 'job_board',
        url: 'https://euraxess.ec.europa.eu/jobs/search',
        priority: 'Alta',
        frequency: 'Semanal',
        status: 'Activo',
        lastScraped: '2026-10-24 12:00',
        offersExtracted: 0,
        notes: 'Portal oficial de la UE para movilidad de investigadores. Proyectos Marie Skłodowska-Curie (MSCA), ERC y contratos doctorales en Europa.',
        region: 'Europa / Global',
        typicalDeadlinesNotes: 'Convocatorias con plazos de 30 a 60 días.',
        countryFocus: 'Unión Europea'
      },
      {
        id: 'src-eures',
        name: 'EURES - Portal Europeo de la Movilidad Profesional',
        type: 'public_admin',
        url: 'https://eures.europa.eu/index_es',
        priority: 'Media',
        frequency: 'Semanal',
        status: 'Activo',
        lastScraped: '2026-10-24 12:00',
        offersExtracted: 0,
        notes: 'Red de cooperación de servicios de empleo europeos para facilitar la libre circulación de trabajadores.',
        region: 'Europa / Global',
        typicalDeadlinesNotes: 'Actualizado continuamente por las agencias públicas de empleo europeas.',
        countryFocus: 'Europa'
      },
      {
        id: 'src-academic-positions',
        name: 'Academic Positions (European Academic Jobs)',
        type: 'job_board',
        url: 'https://academicpositions.com/',
        priority: 'Media',
        frequency: 'Semanal',
        status: 'Activo',
        lastScraped: '2026-10-24 12:00',
        offersExtracted: 0,
        notes: 'Bolsa europea especializada en plazas universitarias, centros de investigación y postdoctorados en Alemania, Países Bajos y Nórdicos.',
        region: 'Europa / Global',
        typicalDeadlinesNotes: 'Filtros directos por ciencias ambientales y geociencias.',
        countryFocus: 'Europa / DACH'
      }
    ]
  },
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
