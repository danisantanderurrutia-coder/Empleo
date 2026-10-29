import React, { useState } from 'react';
import { 
  ExternalLink,
  Award,
  TrendingUp,
  Sparkles,
  Target,
  Compass,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { getStoredOffers } from '../../services/db';

export type SkillBranch = 
  | 'geophysics'   // 1. Geofísica & Sensores Remotos
  | 'biogeo'       // 2. Biogeoquímica, Suelos & Agua
  | 'comms'        // 3. Comunicaciones, Prensa & Campañas
  | 'culture'      // 4. Cultura, Comunidades & Políticas
  | 'grassroots'   // 5. Grassroots, Territorio & Regeneración
  | 'pm'           // 6. Gestión de Proyectos, I+D & Cooperación
  | 'software';    // 7. Product Owner, Software & IA

export type ProfileArchetype = 
  | 'all'
  | 'rd-scientist'   // Investigador Científico I+D (Helmholtz, CAU Kiel, BC3, AZTI)
  | 'ai-product'     // AI Product Owner & Climate-Tech Architect
  | 'campaign-lead'  // Director de Campañas & Grassroots
  | 'policy-advisor'; // Consultor en Políticas Ambientales & CSRD

export interface SynergyBridge {
  from: string;
  to: string;
  label: string;
}

export interface CapabilityNode {
  id: string;
  name: string;
  shortName: string;
  level: number; // 1 to 5
  maxLevel: 5;
  status: 'MASTERED' | 'ACTIVE' | 'IN_TRAINING' | 'MARKET_GAP';
  branch: SkillBranch;
  xp: number;
  cx: number;
  cy: number;
  description: string;
  evidenceTitle: string;
  evidenceAnchor: string;
  archetypes: ProfileArchetype[];
  synergies?: string[]; // IDs of connected nodes
  isMarketGap?: boolean;
  gapDemand?: string;
  gapImpact?: string;
  gapRoadmap?: string[];
}

export const SkillTreeTab: React.FC = () => {
  const offers = getStoredOffers();

  // Selected filter mode
  const [filterMode, setFilterMode] = useState<'all' | 'mastered' | 'training' | 'gaps'>('all');

  // Selected Archetype Simulator
  const [selectedArchetype, setSelectedArchetype] = useState<ProfileArchetype>('all');

  // Hovered node for synapsis lighting
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Selected node for technical inspector
  const [selectedNodeId, setSelectedNodeId] = useState<string>('n7-wetland');

  // --------------------------------------------------------------------------
  // PUENTES DE SINERGIA TRANSDISCIPLINARIOS (CABLES BIOLUMINISCENTES)
  // --------------------------------------------------------------------------
  const synergyBridges: SynergyBridge[] = [
    { from: 'n7-agritwin', to: 'n1-sentinel', label: 'IoT LoRaWAN + NDVI Sentinel-2' },
    { from: 'n7-agritwin', to: 'n2-soil-lab', label: 'Potencial mátrico & sensores de suelo' },
    { from: 'n7-agritwin', to: 'n5-keyline', label: 'Riego predictivo con hidrología Keyline' },
    { from: 'n7-wetland', to: 'n2-peatlands', label: 'Gemelo digital de turbera Wallener Au' },
    { from: 'n7-wetland', to: 'n2-ghg', label: 'Visualización de flujos Eddy Covariance' },
    { from: 'n7-docker', to: 'n1-gee', label: 'Contenedorización de pipelines GEE' },
    { from: 'n7-rewilding-suite', to: 'n5-rewilding', label: 'PWA de campo en Aljezur (Portugal)' },
    { from: 'n4-congreso', to: 'n5-incendios', label: 'Alegato pericial sobre megaincendios' },
    { from: 'n4-congreso', to: 'n3-plp', label: 'Fiscalización legislativa en medios independientes' },
    { from: 'n4-congreso', to: 'n3-epn-report', label: 'Evidencia técnica de monocultivo & RED III' },
    { from: 'n3-apruebo-rural', to: 'n5-apr', label: 'Articulación con comités de agua potable APR' },
    { from: 'n4-cuarentena-rap', to: 'n7-ai-agents', label: 'Comunidades +12k, Discord bots & agentes' },
    { from: 'n6-consorcios', to: 'n2-peatlands', label: 'Investigación bilateral CAU Kiel & AMU Poznań' },
    { from: 'n6-epn-lead', to: 'n3-epn-report', label: 'Liderazgo de informe internacional EPN' },
    { from: 'n5-permaculture', to: 'n2-hydro', label: 'Líneas clave de infiltración de cuencas' }
  ];

  // --------------------------------------------------------------------------
  // CATÁLOGO DE 40+ NODOS DISTRIBUIDOS EN 7 POLOS BIOLUMINISCENTES
  // Centro: (430, 260)
  // --------------------------------------------------------------------------
  const nodes: CapabilityNode[] = [
    // ========================================================================
    // POLO 1: GEOFÍSICA & SENSORES REMOTOS (Top, Esmeralda Neón)
    // ========================================================================
    {
      id: 'n1-geo-math',
      name: 'Modelación Geoespacial (R & Python)',
      shortName: 'R & Python',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'geophysics',
      xp: 1000,
      cx: 375,
      cy: 120,
      archetypes: ['rd-scientist', 'ai-product'],
      description: 'Automatización de pipelines espaciales (GeoPandas, Rasterio, GDAL), análisis estadístico multivariable y series temporales biofísicas.',
      evidenceTitle: 'Lámina 002: Smart Food Parks & Teledetección',
      evidenceAnchor: '#capacidades-computacionales'
    },
    {
      id: 'n1-sismica',
      name: 'Prospección Geoeléctrica Syscal Pro (ERT)',
      shortName: 'Syscal ERT',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'geophysics',
      xp: 1000,
      cx: 430,
      cy: 95,
      archetypes: ['rd-scientist'],
      description: 'Sondeos Eléctricos Verticales (SEV) y Tomografía de Resistividad Eléctrica con Iris Instruments. Detección de nivel freático y acuíferos en U. de Chile.',
      evidenceTitle: 'Lámina 007: Licenciatura en Geofísica (Distinción)',
      evidenceAnchor: '#titulaciones-academicas'
    },
    {
      id: 'n1-qgis',
      name: 'QGIS Avanzado & Cartografía Técnica',
      shortName: 'QGIS Vector',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'geophysics',
      xp: 980,
      cx: 485,
      cy: 120,
      archetypes: ['rd-scientist', 'policy-advisor'],
      description: 'Integración multicriterio de coberturas de suelo, DEMs LiDAR, pendientes topográficas, delimitación de cuencas y riesgo de incendios.',
      evidenceTitle: 'Lámina 003: Modelos Hidrológicos ante Congreso',
      evidenceAnchor: '#gobernanza-politicas'
    },
    {
      id: 'n1-sentinel',
      name: 'Observación Satelital Sentinel-2 & Landsat',
      shortName: 'Sentinel-2',
      level: 4,
      maxLevel: 5,
      status: 'ACTIVE',
      branch: 'geophysics',
      xp: 880,
      cx: 400,
      cy: 50,
      archetypes: ['rd-scientist', 'ai-product'],
      synergies: ['n7-agritwin'],
      description: 'Monitoreo multiespectral de reflectancia de dosel, índices NDVI/NDRE, cálculo de estrés hídrico de vegetación y cicatrices de quema.',
      evidenceTitle: 'Lámina 002: Sensores de Laboratorio & Teledetección',
      evidenceAnchor: '#capacidades-computacionales'
    },
    {
      id: 'n1-gee',
      name: 'Google Earth Engine (Cloud Big Data)',
      shortName: 'GEE Cloud',
      level: 4,
      maxLevel: 5,
      status: 'ACTIVE',
      branch: 'geophysics',
      xp: 850,
      cx: 460,
      cy: 45,
      archetypes: ['rd-scientist', 'ai-product'],
      synergies: ['n7-docker'],
      description: 'Procesamiento masivo de petabytes de datos planetarios en la nube para detección de cambios ambientales y balances hídricos territoriales.',
      evidenceTitle: 'Lámina 006: Modelado Geoespacial & Gemelos Digitales',
      evidenceAnchor: '#liderazgo-innovacion'
    },
    {
      id: 'gap-swat',
      name: 'Modelación Hidrológica SWAT+ / Iber',
      shortName: 'SWAT+ Fluvial',
      level: 2,
      maxLevel: 5,
      status: 'MARKET_GAP',
      branch: 'geophysics',
      xp: 400,
      cx: 525,
      cy: 65,
      archetypes: ['rd-scientist'],
      isMarketGap: true,
      gapDemand: '42% vacantes de modelación de cuencas en DACH (LUBW, BfG) y Euskadi (URA)',
      gapImpact: '+18% coincidencia en vacantes de consultoría hidrológica e institutos',
      description: 'Simulación de transporte de sedimentos, caudales extremos y dinámica fluvial acoplada a SIG.',
      evidenceTitle: 'Extensión Metodológica a Modelos de Transporte Fluvial',
      evidenceAnchor: '#investigacion-cuantitativa',
      gapRoadmap: [
        'Calibrar cuenca piloto en QSWAT+ con datos Sentinel-2 y ERA5',
        'Validar balances hídricos frente a estaciones de aforo oficiales',
        'Publicar mini-estudio reproducible en repositorio abierto'
      ]
    },

    // ========================================================================
    // POLO 2: BIOGEOQUÍMICA, SUELOS & AGUA (Top-Right, Cian Hídrico)
    // ========================================================================
    {
      id: 'n2-peatlands',
      name: 'Dinámica de Carbono & Turberas (Wallener Au)',
      shortName: 'Turberas GEI',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'biogeo',
      xp: 1000,
      cx: 550,
      cy: 155,
      archetypes: ['rd-scientist', 'policy-advisor'],
      synergies: ['n7-wetland', 'n6-consorcios'],
      description: 'Tesis de M.Sc. en CAU Kiel: sumideros de carbono, transición sumidero-fuente de CH4, paludicultura y tensión de preconsolidación edáfica (62,4 kPa).',
      evidenceTitle: 'Lámina 001: Dinámica de GEI en Turberas (Polonia/Alemania)',
      evidenceAnchor: '#investigacion-cuantitativa'
    },
    {
      id: 'n2-ghg',
      name: 'Eddy Covariance & Analizadores LI-COR',
      shortName: 'LI-COR Flux',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'biogeo',
      xp: 970,
      cx: 620,
      cy: 125,
      archetypes: ['rd-scientist'],
      synergies: ['n7-wetland'],
      description: 'Operación de torres de flujo micrometeorológico con analizadores infrarrojos LI-COR LI-7500/LI-7700 y cámaras de respiración de suelo cerradas.',
      evidenceTitle: 'Lámina 001: Modelación Cuantitativa CAU Kiel',
      evidenceAnchor: '#investigacion-cuantitativa'
    },
    {
      id: 'n2-hydro',
      name: 'Balances Hidrológicos & Limnología (Poznań)',
      shortName: 'Hidrología Cuencas',
      level: 4,
      maxLevel: 5,
      status: 'ACTIVE',
      branch: 'biogeo',
      xp: 890,
      cx: 600,
      cy: 180,
      archetypes: ['rd-scientist'],
      synergies: ['n5-permaculture'],
      description: 'Modelación cuantitativa de escorrentía, balance de fósforo/nitrógeno y dinámica trófica en los lagos Góreckie y Durowskie (Polonia).',
      evidenceTitle: 'Lámina 001: Balances en Lagos Góreckie y Durowskie',
      evidenceAnchor: '#investigacion-cuantitativa'
    },
    {
      id: 'n2-soil-lab',
      name: 'Instrumentación Edáfica & Testigos Inalterados',
      shortName: 'Lab Suelos',
      level: 4,
      maxLevel: 5,
      status: 'ACTIVE',
      branch: 'biogeo',
      xp: 850,
      cx: 675,
      cy: 140,
      archetypes: ['rd-scientist', 'ai-product'],
      synergies: ['n7-agritwin'],
      description: 'Ensayos de compresión edáfica, retención hídrica (curvas pF), carbono orgánico total (TOC) y sondeos con barrenas Edelman.',
      evidenceTitle: 'Lámina 002: Laboratorio de Suelos CAU Kiel',
      evidenceAnchor: '#capacidades-computacionales'
    },
    {
      id: 'n2-water-quality',
      name: 'Directiva Marco del Agua & Bioindicadores UE',
      shortName: 'Directiva Agua',
      level: 4,
      maxLevel: 5,
      status: 'ACTIVE',
      branch: 'biogeo',
      xp: 860,
      cx: 695,
      cy: 95,
      archetypes: ['rd-scientist', 'policy-advisor'],
      description: 'Evaluación del estado ecológico de masas de agua continentales bajo estándares WFD de la Unión Europea y macroinvertebrados.',
      evidenceTitle: 'Lámina 001: Ecosistemas Acuáticos Poznań',
      evidenceAnchor: '#investigacion-cuantitativa'
    },
    {
      id: 'gap-soil-directive',
      name: 'EU Soil Monitoring Law (Protocolos 2024)',
      shortName: 'Directiva Suelo UE',
      level: 2,
      maxLevel: 5,
      status: 'MARKET_GAP',
      branch: 'biogeo',
      xp: 450,
      cx: 750,
      cy: 130,
      archetypes: ['policy-advisor', 'rd-scientist'],
      isMarketGap: true,
      gapDemand: '48% centros de investigación ambiental y consultorías del Green Deal',
      gapImpact: '+24% afinidad en proyectos europeos de resiliencia de suelos',
      description: 'Estandarización de métricas de salud del suelo, compactación y contaminación bajo el nuevo marco regulatorio vinculante de la UE.',
      evidenceTitle: 'Marco Regulatorio Europeo de Salud del Suelo',
      evidenceAnchor: '#investigacion-cuantitativa',
      gapRoadmap: [
        'Completar el módulo oficial de la Comisión Europea sobre Soil Health',
        'Alinear los datos de tensión de preconsolidación de Wallener Au con los descriptores de la Directiva',
        'Publicar documento de síntesis sobre monitoreo edáfico estandarizado'
      ]
    },

    // ========================================================================
    // POLO 3: COMUNICACIONES, PRENSA & CAMPAÑAS (Mid-Right, Naranja Fuego)
    // ========================================================================
    {
      id: 'n3-plp',
      name: 'Dirección Editorial: Primera Línea Prensa (+700k)',
      shortName: 'PLP Prensa (+700k)',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'comms',
      xp: 1000,
      cx: 615,
      cy: 260,
      archetypes: ['campaign-lead'],
      synergies: ['n4-congreso'],
      description: 'Fundador y director de medio digital independiente con más de 700.000 seguidores orgánicos. Reportajes de investigación y coberturas en tiempo real.',
      evidenceTitle: 'Prensa Ciudadana: Primera Línea Prensa (+700k)',
      evidenceAnchor: '#primera-linea-prensa'
    },
    {
      id: 'n3-apruebo-rural',
      name: 'Dirección de Campaña Nacional "Apruebo Rural"',
      shortName: 'Apruebo Rural',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'comms',
      xp: 990,
      cx: 680,
      cy: 240,
      archetypes: ['campaign-lead'],
      synergies: ['n5-apr'],
      description: 'Dirección general de campaña transmedia de alcance nacional: movilización campesina, webinars cívicos masivos y combate a la desinformación en el agro.',
      evidenceTitle: 'Campaña Nacional: Apruebo Rural Transmedia',
      evidenceAnchor: '#apruebo-rural'
    },
    {
      id: 'n3-epn-report',
      name: 'Periodismo de Datos & Biomasa Forestal (EPN)',
      shortName: 'Informe EPN RED III',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'comms',
      xp: 940,
      cx: 665,
      cy: 305,
      archetypes: ['campaign-lead', 'policy-advisor'],
      synergies: ['n4-congreso', 'n6-epn-lead'],
      description: 'Autor técnico principal del informe "Spotlight on Burning Biomass" para Environmental Paper Network y Global Forest Coalition sobre vacíos en RED III.',
      evidenceTitle: 'Lámina 004: Informe EPN Biomasa & Taxonomía UE',
      evidenceAnchor: '#publicaciones-tecnicas'
    },
    {
      id: 'n3-maule-radio',
      name: 'Red Comunitaria Maule Sur & Radio Cristalina',
      shortName: 'Radio Comunitaria',
      level: 4,
      maxLevel: 5,
      status: 'ACTIVE',
      branch: 'comms',
      xp: 880,
      cx: 740,
      cy: 275,
      archetypes: ['campaign-lead'],
      description: 'Locución en vivo, vocería técnica y diseño de la plataforma digital para alertas tempranas de emergencia rural y noticias locales.',
      evidenceTitle: 'Red de Medios Comunitaria Maule Sur',
      evidenceAnchor: '#primera-linea-prensa'
    },
    {
      id: 'gap-media-b2b',
      name: 'Media Relations B2B & Lobbying Científico en Europa',
      shortName: 'B2B Media UE',
      level: 2,
      maxLevel: 5,
      status: 'MARKET_GAP',
      branch: 'comms',
      xp: 420,
      cx: 785,
      cy: 325,
      archetypes: ['campaign-lead', 'policy-advisor'],
      isMarketGap: true,
      gapDemand: '35% ONGs internacionales y consorcios de incidencia en Bruselas y Berlín',
      gapImpact: '+20% proyección en roles de relaciones públicas científicas',
      description: 'Articulación de notas de prensa institucionales para agencias alemanas y redes de periodismo ambiental europeo.',
      evidenceTitle: 'Consolidación de Relaciones con Medios en DACH',
      evidenceAnchor: '#publicaciones-tecnicas',
      gapRoadmap: [
        'Mapear bases de datos de periodistas ambientales en Alemania y Bruselas',
        'Redactar un policy brief bilingüe (EN/DE) sobre contabilidad de carbono',
        'Establecer contacto con redes como Clean Energy Wire (CLEW)'
      ]
    },

    // ========================================================================
    // POLO 4: CULTURA, COMUNIDADES & POLÍTICAS (Bottom-Right, Púrpura)
    // ========================================================================
    {
      id: 'n4-congreso',
      name: 'Comparecencia Pericial ante el Congreso Nacional',
      shortName: 'Congreso Nacional',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'culture',
      xp: 1000,
      cx: 555,
      cy: 375,
      archetypes: ['policy-advisor', 'campaign-lead'],
      synergies: ['n5-incendios', 'n3-plp', 'n3-epn-report'],
      description: 'Exposición como perito técnico ante la Comisión de Emergencia, Desastres y Bomberos de la Cámara de Diputadas y Diputados de Chile.',
      evidenceTitle: 'Lámina 003: Comparecencia en Cámara de Diputados',
      evidenceAnchor: '#gobernanza-politicas'
    },
    {
      id: 'n4-cuarentena-rap',
      name: 'Comunidades Digitales: Cuarentena Rap (+12k)',
      shortName: 'Discord (+12k)',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'culture',
      xp: 970,
      cx: 625,
      cy: 395,
      archetypes: ['campaign-lead', 'ai-product'],
      synergies: ['n7-ai-agents'],
      description: 'Arquitectura de comunidad digital en Discord y Twitch durante la pandemia: +12.000 miembros activos en 8 países, bots de matchmaking y baja latencia de audio.',
      evidenceTitle: 'Cultura & Comunidad: Cuarentena Rap (+12k)',
      evidenceAnchor: '#liderazgo-innovacion'
    },
    {
      id: 'n4-rap-beauchef',
      name: 'Producción Ejecutiva: Rap Beauchef',
      shortName: 'Rap Beauchef',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'culture',
      xp: 950,
      cx: 580,
      cy: 445,
      archetypes: ['campaign-lead'],
      description: 'Producción de eventos en vivo, ingeniería de sonido en anfiteatros de la Universidad de Chile, gestión de auspicios y ligas universitarias de hip-hop.',
      evidenceTitle: 'Producción Cultural: Rap Beauchef U. de Chile',
      evidenceAnchor: '#liderazgo-innovacion'
    },
    {
      id: 'n4-languages',
      name: 'Dominio Lingüístico: ES (C2), EN (C1), DE (B1/B2)',
      shortName: 'Idiomas C2/C1/B2',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'culture',
      xp: 980,
      cx: 655,
      cy: 455,
      archetypes: ['rd-scientist', 'policy-advisor', 'campaign-lead'],
      description: 'Español nativo (oratoria parlamentaria), Inglés científico C1 (CEMS, ponencias en Bonn/Oslo/Davos) y Alemán académico B1-B2 (§20 AufenthG).',
      evidenceTitle: 'Lámina 005: Conferencias Bonn, Oslo y Bogotá',
      evidenceAnchor: '#conferencias-internacionales'
    },
    {
      id: 'n4-artivismo',
      name: 'Agitación Gráfica & Xilografía Popular',
      shortName: 'Xilografía & Murale',
      level: 4,
      maxLevel: 5,
      status: 'ACTIVE',
      branch: 'culture',
      xp: 880,
      cx: 515,
      cy: 460,
      archetypes: ['campaign-lead'],
      description: 'Grabado en linóleo, cartelería de memoria histórica y muralismo con la Brigada Paulina Aguirre por la defensa de los derechos del agua y la tierra.',
      evidenceTitle: 'Artivismo & Memoria Popular',
      evidenceAnchor: '#gobernanza-politicas'
    },
    {
      id: 'gap-de-c1',
      name: 'Alemán Profesional C1 (Fachsprache Geodaten)',
      shortName: 'Deutsch C1 Beruf',
      level: 3,
      maxLevel: 5,
      status: 'MARKET_GAP',
      branch: 'culture',
      xp: 620,
      cx: 715,
      cy: 480,
      archetypes: ['rd-scientist', 'policy-advisor'],
      isMarketGap: true,
      gapDemand: '60% plazas públicas permanentes en DACH (BfG, UBA, LfU)',
      gapImpact: '+35% probabilidad de contratación directa como funcionario/científico permanente',
      description: 'Vocabulario jurídico-ambiental de licitaciones públicas (VOL/VOB) y redacción técnica formal en instituciones federales alemanas.',
      evidenceTitle: 'Consolidación Lingüística para Plazas Permanentes (§20 AufenthG)',
      evidenceAnchor: '#titulaciones-academicas',
      gapRoadmap: [
        'Estudio sistemático de pliegos técnicos VOL/VOB en portales Bund.de',
        'Simulación de entrevistas técnicas en alemán para institutos públicos',
        'Certificación Telc C1 Hochschule / Goethe C1'
      ]
    },
    {
      id: 'gap-csrd',
      name: 'Auditoría de Carbono Corporativo & CSRD',
      shortName: 'CSRD Scope 1-3',
      level: 3,
      maxLevel: 5,
      status: 'MARKET_GAP',
      branch: 'culture',
      xp: 550,
      cx: 610,
      cy: 495,
      archetypes: ['policy-advisor'],
      isMarketGap: true,
      gapDemand: '50% ofertas de consultoría ambiental en Euskadi y DACH',
      gapImpact: '+25% rango salarial en consultoría de transición ecológica',
      description: 'Cálculo y auditoría de huella de carbono bajo estándares GHG Protocol y directiva europea CSRD (normas ESRS E1).',
      evidenceTitle: 'Transición de Huella Científica a Auditoría Corporativa',
      evidenceAnchor: '#publicaciones-tecnicas',
      gapRoadmap: [
        'Completar capacitación en estándares ESRS E1 del GHG Protocol',
        'Crear plantilla automatizada en Python para reporte de Alcance 1, 2 y 3',
        'Elaborar estudio de caso de descarbonización para pymes industriales'
      ]
    },

    // ========================================================================
    // POLO 5: GRASSROOTS, TERRITORIO & REGENERACIÓN (Bottom-Left, Lima/Tierra)
    // ========================================================================
    {
      id: 'n5-incendios',
      name: 'Respuesta Operativa ante Megaincendios',
      shortName: 'Respuesta Incendios',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'grassroots',
      xp: 1000,
      cx: 305,
      cy: 375,
      archetypes: ['campaign-lead'],
      synergies: ['n4-congreso'],
      description: 'Despliegue territorial directo en la zona centro-sur (Maule y Biobío): articulación de brigadas comunitarias, centros de acopio y ayuda mutua.',
      evidenceTitle: 'Catástrofes & Solidaridad: Respuesta ante Megaincendios',
      evidenceAnchor: '#catastrofes-solidaridad'
    },
    {
      id: 'n5-apr',
      name: 'Articulación con Comités de Agua Potable Rural (APR)',
      shortName: 'Comités APR Agua',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'grassroots',
      xp: 970,
      cx: 235,
      cy: 395,
      archetypes: ['campaign-lead', 'policy-advisor'],
      synergies: ['n3-apruebo-rural'],
      description: 'Acompañamiento técnico a asambleas hídricas campesinas frente a la sequía, el desvío de cauces y el impacto de las plantaciones forestales.',
      evidenceTitle: 'Lámina 003: Salvaguardas & Comités de Agua Potable',
      evidenceAnchor: '#gobernanza-politicas'
    },
    {
      id: 'n5-permaculture',
      name: 'Diseño en Permacultura Certificado (EPAC, 80 h)',
      shortName: 'Permacultura EPAC',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'grassroots',
      xp: 920,
      cx: 280,
      cy: 445,
      archetypes: ['rd-scientist', 'campaign-lead'],
      synergies: ['n2-hydro'],
      description: 'Certificación oficial de diseño regenerativo: zonificación biofísica, captura hídrica pasiva, agroforestería sintrópica y suelos vivos.',
      evidenceTitle: 'Curso Certificado de Diseño en Permacultura (EPAC Chile)',
      evidenceAnchor: '#capacidades-computacionales'
    },
    {
      id: 'n5-keyline',
      name: 'Diseño Hidrológico Keyline & Zanjas de Infiltración',
      shortName: 'Keyline Cuencas',
      level: 4,
      maxLevel: 5,
      status: 'ACTIVE',
      branch: 'grassroots',
      xp: 890,
      cx: 205,
      cy: 455,
      archetypes: ['rd-scientist', 'ai-product'],
      synergies: ['n7-agritwin'],
      description: 'Ingeniería de líneas clave topográficas para redistribución de agua de escorrentía hacia laderas secas y recarga natural de acuíferos.',
      evidenceTitle: 'Diseño Hidrológico Keyline y Restauración de Cuencas',
      evidenceAnchor: '#capacidades-computacionales'
    },
    {
      id: 'n5-rewilding',
      name: 'Restauración Ecológica & Rewilding (Aljezur, Portugal)',
      shortName: 'Rewilding Aljezur',
      level: 4,
      maxLevel: 5,
      status: 'ACTIVE',
      branch: 'grassroots',
      xp: 870,
      cx: 345,
      cy: 460,
      archetypes: ['rd-scientist', 'policy-advisor'],
      synergies: ['n7-rewilding-suite'],
      description: 'Estrategias de regeneración biofísica en cuencas mediterráneas portuguesas: mosaicos nativos cortafuegos y reducción de combustible forestal.',
      evidenceTitle: 'Lámina 004: Rewilding Aljezur (Portugal)',
      evidenceAnchor: '#publicaciones-tecnicas'
    },
    {
      id: 'gap-grassroots-funds',
      name: 'Gestión de Fondos Filantrópicos & Cooperación Internacional',
      shortName: 'Fondos Grassroots',
      level: 2,
      maxLevel: 5,
      status: 'MARKET_GAP',
      branch: 'grassroots',
      xp: 440,
      cx: 145,
      cy: 480,
      archetypes: ['campaign-lead'],
      isMarketGap: true,
      gapDemand: '40% redes de solidaridad climática y fondos de justicia ambiental',
      gapImpact: '+22% autonomía en financiamiento de iniciativas comunitarias',
      description: 'Postulación a subvenciones internacionales de fundaciones filantrópicas (Patagonia Action Works, Global Greengrants Fund, Rainforest Action).',
      evidenceTitle: 'Financiamiento y Sostenibilidad de Redes Comunitarias',
      evidenceAnchor: '#gobernanza-politicas',
      gapRoadmap: [
        'Estructurar banco de proyectos comunitarios con métricas de impacto territorial',
        'Mapear convocatorias activas de fondos filantrópicos globales para el Sur Global',
        'Enviar propuesta piloto para fondos de restauración de cuencas comunitarias'
      ]
    },

    // ========================================================================
    // POLO 6: GESTIÓN DE PROYECTOS, I+D & COOPERACIÓN (Mid-Left, Ámbar)
    // ========================================================================
    {
      id: 'n6-consorcios',
      name: 'Coordinación de Consorcios I+D Internacionales',
      shortName: 'Consorcios I+D',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'pm',
      xp: 1000,
      cx: 245,
      cy: 260,
      archetypes: ['rd-scientist', 'ai-product'],
      synergies: ['n2-peatlands'],
      description: 'Liderazgo y articulación de proyectos de investigación entre instituciones de Alemania (CAU Kiel), Polonia (AMU Poznań) y Chile (U. de Chile).',
      evidenceTitle: 'Lámina 007: Doble M.Sc. Internacional en Gestión Ambiental',
      evidenceAnchor: '#titulaciones-academicas'
    },
    {
      id: 'n6-epn-lead',
      name: 'Liderazgo de Proyecto Internacional EPN',
      shortName: 'Liderazgo EPN',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'pm',
      xp: 960,
      cx: 180,
      cy: 240,
      archetypes: ['rd-scientist', 'policy-advisor', 'campaign-lead'],
      synergies: ['n3-epn-report'],
      description: 'Gestión de investigación transnacional con la coalición global Environmental Paper Network: coordinación de autores, revisión por pares y publicación.',
      evidenceTitle: 'Lámina 004: Informe EPN Biomasa & Taxonomía UE',
      evidenceAnchor: '#publicaciones-tecnicas'
    },
    {
      id: 'n6-supervision',
      name: 'Planificación de Hitos Científicos & Entregables',
      shortName: 'Hitos & Entregables',
      level: 4,
      maxLevel: 5,
      status: 'ACTIVE',
      branch: 'pm',
      xp: 880,
      cx: 195,
      cy: 305,
      archetypes: ['rd-scientist', 'ai-product'],
      description: 'Control riguroso de cronogramas, aseguramiento de calidad de datos experimentales de campo y presentación ante comités evaluadores.',
      evidenceTitle: 'Lámina 006: Liderazgo e Innovación Científica',
      evidenceAnchor: '#liderazgo-innovacion'
    },
    {
      id: 'gap-pm2',
      name: 'Metodología PM² de la Comisión Europea / PRINCE2',
      shortName: 'Metodología PM²',
      level: 2,
      maxLevel: 5,
      status: 'MARKET_GAP',
      branch: 'pm',
      xp: 430,
      cx: 120,
      cy: 275,
      archetypes: ['rd-scientist', 'ai-product'],
      isMarketGap: true,
      gapDemand: '55% puestos de Project Manager en consorcios europeos y centros tecnológicos',
      gapImpact: '+28% elegibilidad para liderar paquetes de trabajo en Horizonte Europa',
      description: 'Estándar metodológico oficial de gestión de proyectos de la UE: gobernanza, gestión de riesgos, artefactos y fases del ciclo de vida.',
      evidenceTitle: 'Certificación en Gestión de Proyectos Europeos',
      evidenceAnchor: '#liderazgo-innovacion',
      gapRoadmap: [
        'Completar el curso oficial gratuito de PM² Essentials en EU Academy',
        'Estudiar la Guía Metodológica Abierta PM² de la Comisión Europea',
        'Obtener la certificación abierta PM² Foundation'
      ]
    },
    {
      id: 'gap-horizon',
      name: 'Redacción de Propuestas Horizon Europe (Grant Writing)',
      shortName: 'Horizonte Europa',
      level: 2,
      maxLevel: 5,
      status: 'MARKET_GAP',
      branch: 'pm',
      xp: 460,
      cx: 75,
      cy: 325,
      archetypes: ['rd-scientist'],
      isMarketGap: true,
      gapDemand: '62% institutos de investigación (Helmholtz, Max Planck, Tecnalia, BC3)',
      gapImpact: '+32% valor estratégico para instituciones al atraer financiación pública',
      description: 'Estructuración de propuestas competitivas: excelencia científica, impacto de mercado, plan de difusión y paquetes de trabajo (Work Packages).',
      evidenceTitle: 'Especialización en Formulación de Proyectos Europeos',
      evidenceAnchor: '#liderazgo-innovacion',
      gapRoadmap: [
        'Analizar plantillas estándar de Horizonte Europa para consorcios RIA e IA',
        'Diseñar propuesta simulada de consorcio para monitoreo de humedales con IA',
        'Revisar convocatorias activas en el Funding & Tenders Portal de la UE'
      ]
    },

    // ========================================================================
    // POLO 7: PRODUCT OWNER, SOFTWARE & IA (Top-Left, Violeta Neón)
    // ========================================================================
    {
      id: 'n7-wetland',
      name: 'Wetland Monitor: Gemelo Digital 3D (WebGL / Three.js)',
      shortName: 'Wetland Monitor',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'software',
      xp: 1000,
      cx: 310,
      cy: 155,
      archetypes: ['ai-product', 'rd-scientist'],
      synergies: ['n2-peatlands', 'n2-ghg'],
      description: 'Arquitectura y desarrollo de aplicación web 3D interactiva que simula la hidrología y los flujos de GEI de Wallener Au en tiempo real.',
      evidenceTitle: 'Lámina 006: Gemelo Digital Wetland Monitor 3D',
      evidenceAnchor: '#liderazgo-innovacion'
    },
    {
      id: 'n7-agritwin',
      name: 'AgriTwin: Plataforma AgTech IoT & Satélites',
      shortName: 'AgriTwin IoT',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'software',
      xp: 990,
      cx: 240,
      cy: 125,
      archetypes: ['ai-product'],
      synergies: ['n1-sentinel', 'n2-soil-lab', 'n5-keyline'],
      description: 'Plataforma que integra telemetría de suelo LoRaWAN con índices satelitales Sentinel-2 (NDVI/NDRE) para prevención de estrés hídrico en viñedos.',
      evidenceTitle: 'Lámina 006: Chile Agrotech & Plataforma AgriTwin',
      evidenceAnchor: '#liderazgo-innovacion'
    },
    {
      id: 'n7-rewilding-suite',
      name: 'Rewilding Field Suite: PWA Offline-First (IndexedDB)',
      shortName: 'Field Suite PWA',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'software',
      xp: 960,
      cx: 260,
      cy: 180,
      archetypes: ['ai-product', 'rd-scientist'],
      synergies: ['n5-rewilding'],
      description: 'PWA de campo con almacenamiento local sin conexión (IndexedDB), capas GIS integradas y cálculo de biomasa para rewilding en Aljezur (Portugal).',
      evidenceTitle: 'Software Ambiental: Rewilding Field Suite (Portugal)',
      evidenceAnchor: '#liderazgo-innovacion'
    },
    {
      id: 'n7-fastapi-postgis',
      name: 'FastAPI, PostgreSQL & PostGIS Geo-Bases',
      shortName: 'FastAPI & PostGIS',
      level: 4,
      maxLevel: 5,
      status: 'ACTIVE',
      branch: 'software',
      xp: 880,
      cx: 185,
      cy: 140,
      archetypes: ['ai-product'],
      description: 'Desarrollo de microservicios asíncronos REST para consulta espacial indexada, filtrado poligonal y servicio de capas GeoTIFF y GeoJSON.',
      evidenceTitle: 'Stack de Programación & Software Espacial (Portafolio)',
      evidenceAnchor: '#capacidades-computacionales'
    },
    {
      id: 'n7-docker',
      name: 'Docker & CI/CD para Modelación Geoespacial',
      shortName: 'Docker 90%',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'software',
      xp: 940,
      cx: 165,
      cy: 95,
      archetypes: ['ai-product', 'rd-scientist'],
      synergies: ['n1-gee'],
      description: 'Microservicios reproducibles, imágenes CI/CD automatizadas en GitHub Actions y contenedorización de modelos numéricos y teledetección.',
      evidenceTitle: 'Stack Tecnológico: Docker (90% en Portafolio)',
      evidenceAnchor: '#capacidades-computacionales'
    },
    {
      id: 'n7-ai-agents',
      name: 'Ingeniería de Sistemas de IA & Headhunter OS',
      shortName: 'Agentes IA / OS',
      level: 4,
      maxLevel: 5,
      status: 'ACTIVE',
      branch: 'software',
      xp: 900,
      cx: 210,
      cy: 50,
      archetypes: ['ai-product'],
      synergies: ['n4-cuarentena-rap'],
      description: 'Diseño de agentes de inteligencia corporativa, parsers locales de expedientes y algoritmos de cruce curricular con privacidad total (localStorage).',
      evidenceTitle: 'Headhunter OS: Inteligencia de Postulación & IA',
      evidenceAnchor: '#liderazgo-innovacion'
    },
    {
      id: 'gap-pspo-ai',
      name: 'Certificación PSPO I Scrum & AI Systems Evaluation',
      shortName: 'Product Owner IA',
      level: 2,
      maxLevel: 5,
      status: 'MARKET_GAP',
      branch: 'software',
      xp: 450,
      cx: 110,
      cy: 130,
      archetypes: ['ai-product'],
      isMarketGap: true,
      gapDemand: '58% startups de Climate-Tech y agencias de software de IA en DACH y Euskadi',
      gapImpact: '+25% credibilidad formal como Technical Product Owner',
      description: 'Gestión ágil de backlog de producto, métricas de valor de usuario y protocolos de evaluación y observabilidad de agentes de IA.',
      evidenceTitle: 'Especialización en Gestión de Producto de IA',
      evidenceAnchor: '#liderazgo-innovacion',
      gapRoadmap: [
        'Aprobar el Open Assessment de Scrum.org para Product Owner',
        'Obtener la credencial oficial PSPO I (Professional Scrum Product Owner)',
        'Implementar marco de evaluación de agentes en un repositorio público'
      ]
    }
  ];

  // --------------------------------------------------------------------------
  // ESTILOS VISUALES DE LOS 7 DOMINIOS BIOLUMINISCENTES
  // --------------------------------------------------------------------------
  const branchStyles: Record<SkillBranch, { 
    color: string; 
    glow: string; 
    label: string; 
    icon: string;
    bg: string; 
    border: string;
  }> = {
    geophysics: { 
      color: '#10b981', 
      glow: 'rgba(16,185,129,0.3)', 
      label: 'GEOFÍSICA & SENSORES REMOTOS', 
      icon: '🛰️',
      bg: 'bg-emerald-500/10', 
      border: 'border-emerald-500/40' 
    },
    biogeo: { 
      color: '#06b6d4', 
      glow: 'rgba(6,182,212,0.3)', 
      label: 'BIOGEOQUÍMICA, SUELOS & AGUA', 
      icon: '💧',
      bg: 'bg-cyan-500/10', 
      border: 'border-cyan-500/40' 
    },
    comms: { 
      color: '#f97316', 
      glow: 'rgba(249,115,22,0.3)', 
      label: 'COMUNICACIONES, PRENSA & CAMPAÑAS', 
      icon: '📢',
      bg: 'bg-orange-500/10', 
      border: 'border-orange-500/40' 
    },
    culture: { 
      color: '#a855f7', 
      glow: 'rgba(168,85,247,0.3)', 
      label: 'CULTURA, COMUNIDADES & POLÍTICAS', 
      icon: '🏛️',
      bg: 'bg-purple-500/10', 
      border: 'border-purple-500/40' 
    },
    grassroots: { 
      color: '#84cc16', 
      glow: 'rgba(132,204,22,0.3)', 
      label: 'GRASSROOTS, TERRITORIO & REGENERACIÓN', 
      icon: '🌱',
      bg: 'bg-lime-500/10', 
      border: 'border-lime-500/40' 
    },
    pm: { 
      color: '#f59e0b', 
      glow: 'rgba(245,158,11,0.3)', 
      label: 'GESTIÓN DE PROYECTOS, I+D & COOPERACIÓN', 
      icon: '🧭',
      bg: 'bg-amber-500/10', 
      border: 'border-amber-500/40' 
    },
    software: { 
      color: '#6366f1', 
      glow: 'rgba(99,102,241,0.35)', 
      label: 'PRODUCT OWNER, SOFTWARE & IA', 
      icon: '⚡',
      bg: 'bg-indigo-500/10', 
      border: 'border-indigo-500/40' 
    }
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];
  const currentBranchStyle = branchStyles[selectedNode.branch];

  // Active synergy links when hovering or selecting a node
  const activeFocusId = hoveredNodeId || selectedNodeId;
  const activeSynergies = synergyBridges.filter(
    b => b.from === activeFocusId || b.to === activeFocusId
  );
  const activeSynergyNodeIds = new Set([
    ...activeSynergies.map(s => s.from),
    ...activeSynergies.map(s => s.to)
  ]);

  // Counts for filter pills
  const totalCount = nodes.length;
  const masteredCount = nodes.filter(n => n.status === 'MASTERED').length;
  const trainingCount = nodes.filter(n => n.status === 'ACTIVE' || n.status === 'IN_TRAINING').length;
  const gapsCount = nodes.filter(n => n.isMarketGap).length;

  // Archetype Data for Dynamic Fit
  const archetypeDefinitions = {
    all: {
      name: 'Todos los Dominios',
      match: '100% Cobertura',
      description: 'Vista holística transdisciplinaria de los 7 polos de conocimiento y sus sinergias.',
      targets: 'Institutos de I+D, Centros Tecnológicos, Startups de Impacto, Agencias Públicas'
    },
    'rd-scientist': {
      name: 'Investigador Científico I+D',
      match: '92% Afinidad',
      description: 'Perfil centrado en física de la Tierra, flujos de carbono, modelación numérica y publicaciones.',
      targets: 'Helmholtz GFZ, CAU Kiel, BC3 Basque Centre, AZTI, Thünen Institut'
    },
    'ai-product': {
      name: 'AI Product Owner & Climate-Tech',
      match: '88% Afinidad',
      description: 'Ingeniería de producto, gemelos digitales, IoT agrícola, APIs geoespaciales y agentes de IA.',
      targets: 'Startups de Clima en Berlín/Munich, Tecnalia, Euskadi Digital, Agrotech Europa'
    },
    'campaign-lead': {
      name: 'Director de Campañas & Grassroots',
      match: '95% Afinidad',
      description: 'Dirección de medios de gran alcance (+700k), movilización campesina, vocería y comunidades.',
      targets: 'Coaliciones Europeas (EPN), Fondos de Justicia Climática, Redes Territoriales'
    },
    'policy-advisor': {
      name: 'Consultor en Políticas & CSRD',
      match: '86% Afinidad',
      description: 'Articulación de directivas europeas (RED III, Directiva del Suelo), auditoría y comparecencia legislativa.',
      targets: 'Consultoras de Transición Energética, Agencias Ambientales Estatales, Think Tanks'
    }
  };

  const currentArchetypeInfo = archetypeDefinitions[selectedArchetype];

  return (
    <div className="space-y-5 text-[var(--text-primary)] font-sans animate-fadeIn select-none">
      
      {/* =========================================================================
       * 1. TOP BANNER: NEURAL BIO-CONSTELLATION & HEPTAGONAL MATRIX
       * ========================================================================= */}
      <div 
        className="p-5 rounded-2xl border shadow-2xl relative overflow-hidden transition-colors"
        style={{ 
          backgroundColor: 'var(--card-bg)', 
          borderColor: 'var(--card-border)' 
        }}
      >
        {/* Subtle background ambient pulse */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20 border border-cyan-500/40 text-cyan-400 text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
                <span>NEURAL BIO-CONSTELLATION // 7 POLOS TRANSDISCIPLINARIOS</span>
              </span>
              <span className="text-[11px] text-[var(--text-muted)] font-mono">
                {nodes.length} NODOS AUDITADOS • 7 VACÍOS ESTRATÉGICOS DETECTADOS
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight flex items-center gap-2">
              <span>Árbol de Aptitudes & Red Sináptica Viva</span>
            </h1>
            <p className="text-xs text-[var(--text-secondary)] max-w-3xl leading-relaxed">
              Mapeo integral que articula <strong>Ciencia Biofísica</strong> (Geofísica, Biogeoquímica, Suelos), <strong>Ingeniería de Software & IA</strong> (Gemelos Digitales, IoT), <strong>Gestión de Consorcios</strong> y <strong>Acción Comunitaria</strong> (Grassroots, Medios +700k y Políticas).
            </p>
          </div>

          {/* Academic & Professional Core Badge */}
          <div 
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl border shrink-0 backdrop-blur-md shadow-lg"
            style={{ 
              backgroundColor: 'var(--panel-bg)', 
              borderColor: 'var(--panel-border)' 
            }}
          >
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Compass className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="text-[9px] text-[var(--text-muted)] font-mono font-bold uppercase tracking-wider">NÚCLEO TRANSDISCIPLINARIO</div>
              <div className="text-xs font-black text-[var(--text-primary)]">DANIEL SANTANDER URRUTIA</div>
              <div className="text-[9.5px] text-cyan-400 font-mono">Doble M.Sc. Kiel/Poznań • Geofísica U. de Chile</div>
            </div>
          </div>
        </div>

        {/* =====================================================================
         * 2. ARCHETYPE MATRIX SIMULATOR (CALIBRACIÓN POR ROL PROFESIONAL)
         * ===================================================================== */}
        <div className="mt-4 pt-3.5 border-t border-[var(--panel-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase font-bold mr-1 flex items-center gap-1">
              <Target className="h-3 w-3 text-cyan-400" />
              <span>SIMULADOR DE ROL:</span>
            </span>

            {[
              { id: 'all', label: 'Todos los Polos', icon: '🌐' },
              { id: 'rd-scientist', label: 'Investigador I+D (Helmholtz/BC3)', icon: '🔬' },
              { id: 'ai-product', label: 'AI Product Owner & Climate-Tech', icon: '⚡' },
              { id: 'campaign-lead', label: 'Dirección de Campañas & Grassroots', icon: '📢' },
              { id: 'policy-advisor', label: 'Consultor Políticas & CSRD', icon: '🏛️' }
            ].map(arch => (
              <button
                key={arch.id}
                onClick={() => setSelectedArchetype(arch.id as ProfileArchetype)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  selectedArchetype === arch.id
                    ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md shadow-cyan-500/20 border border-cyan-400'
                    : 'bg-[var(--panel-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--card-border)]'
                }`}
              >
                <span>{arch.icon}</span>
                <span>{arch.label}</span>
              </button>
            ))}
          </div>

          {/* Dynamic Match readout badge */}
          <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-[11px] px-2.5 py-1 rounded-lg bg-black/30 border border-white/10 shrink-0">
            <span className="text-[var(--text-muted)]">Afinidad con Perfil:</span>
            <span className="text-emerald-400 font-bold">{currentArchetypeInfo.match}</span>
          </div>
        </div>

        {/* Filter Pills Bar (Mastered / Training / Gaps) */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2.5 border-t border-[var(--panel-border)]/60 text-[11px]">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase font-bold mr-1">
              FILTRAR ESTADO:
            </span>
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 ${
                filterMode === 'all'
                  ? 'bg-sky-600 text-white shadow'
                  : 'bg-[var(--panel-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--card-border)]'
              }`}
            >
              <span>Todas</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-black/20">{totalCount}</span>
            </button>

            <button
              onClick={() => setFilterMode('mastered')}
              className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 ${
                filterMode === 'mastered'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-[var(--panel-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--card-border)]'
              }`}
            >
              <span>Dominadas (Senior)</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-black/20">{masteredCount}</span>
            </button>

            <button
              onClick={() => setFilterMode('training')}
              className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 ${
                filterMode === 'training'
                  ? 'bg-amber-600 text-white shadow'
                  : 'bg-[var(--panel-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--card-border)]'
              }`}
            >
              <span>En Desarrollo</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-black/20">{trainingCount}</span>
            </button>

            <button
              onClick={() => {
                setFilterMode('gaps');
                setSelectedNodeId('gap-swat');
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 ${
                filterMode === 'gaps'
                  ? 'bg-rose-600 text-white shadow ring-2 ring-rose-500/40'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 border border-rose-500/30'
              }`}
            >
              <span>⚡ Vacíos de Mercado</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-rose-600 text-white font-extrabold">{gapsCount}</span>
            </button>
          </div>

          <div className="text-[10px] font-mono text-[var(--text-muted)] italic hidden md:inline-block">
            * Pasa el ratón sobre un nodo para iluminar sus cables de sinergia entre disciplinas
          </div>
        </div>
      </div>

      {/* =========================================================================
       * 3. MAIN STAGE: THE NEURAL BIO-CONSTELLATION CANVAS & DOSSIER DRAWER
       * ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT CANVAS: THE NEURAL CONSTELLATION GRAPH (8 COLS) */}
        <div 
          className="lg:col-span-8 p-4 rounded-2xl border shadow-2xl relative overflow-hidden transition-colors"
          style={{ 
            backgroundColor: 'var(--card-bg)', 
            borderColor: 'var(--card-border)' 
          }}
        >
          {/* 7 Domains Legend Bar */}
          <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-[var(--panel-border)] pb-2.5 mb-2.5 text-[9.5px] font-mono">
            <span className="text-[var(--text-muted)] font-bold uppercase">7 POLOS BIOLUMINISCENTES:</span>
            <div className="flex flex-wrap items-center gap-2.5">
              {(Object.keys(branchStyles) as SkillBranch[]).map(b => (
                <span 
                  key={b} 
                  className="flex items-center gap-1 font-semibold"
                  style={{ color: branchStyles[b].color }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: branchStyles[b].color }} />
                  <span>{branchStyles[b].icon} {branchStyles[b].label.split('&')[0].trim()}</span>
                </span>
              ))}
              <span className="flex items-center gap-1 text-rose-500 font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
                <span>⚡ Gap</span>
              </span>
            </div>
          </div>

          {/* SVG Neural Bio-Constellation Visualizer */}
          <div className="relative w-full overflow-x-auto">
            <svg 
              viewBox="0 0 860 520" 
              className="w-full min-w-[750px] h-auto select-none rounded-xl"
              style={{ backgroundColor: '#060913' }}
            >
              <defs>
                {/* Central Celestial Nebula Glow */}
                <radialGradient id="centerNebula" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
                  <stop offset="35%" stopColor="#6366f1" stopOpacity="0.15" />
                  <stop offset="70%" stopColor="#a855f7" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                </radialGradient>

                {/* Starlight Grid Pattern */}
                <pattern id="starlightGrid" width="25" height="25" patternUnits="userSpaceOnUse">
                  <circle cx="12.5" cy="12.5" r="0.5" fill="#38bdf8" fillOpacity="0.15" />
                </pattern>

                {/* Branch Glow Filters */}
                <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Cosmic Starlight Canvas */}
              <rect x="0" y="0" width="860" height="520" fill="url(#starlightGrid)" />

              {/* Ambient Nebula Fog */}
              <circle cx="430" cy="260" r="160" fill="url(#centerNebula)" />

              {/* Concentric Neural Orbital Rings */}
              <circle cx="430" cy="260" r="85" fill="none" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="3 5" opacity="0.25" />
              <circle cx="430" cy="260" r="170" fill="none" stroke="#6366f1" strokeWidth="0.8" strokeDasharray="4 6" opacity="0.20" />
              <circle cx="430" cy="260" r="245" fill="none" stroke="#a855f7" strokeWidth="0.8" strokeDasharray="2 7" opacity="0.15" />

              {/* =============================================================
               * CROSS-DOMAIN SYNERGY BRIDGES (LIGHT UP ON HOVER / SELECTION)
               * ============================================================= */}
              {synergyBridges.map((bridge, bIdx) => {
                const nodeFrom = nodes.find(n => n.id === bridge.from);
                const nodeTo = nodes.find(n => n.id === bridge.to);
                if (!nodeFrom || !nodeTo) return null;

                const isConnected = 
                  activeFocusId === bridge.from || activeFocusId === bridge.to;

                return (
                  <path
                    key={`bridge-${bIdx}`}
                    d={`M ${nodeFrom.cx} ${nodeFrom.cy} Q 430 260 ${nodeTo.cx} ${nodeTo.cy}`}
                    fill="none"
                    stroke={isConnected ? '#38bdf8' : '#334155'}
                    strokeWidth={isConnected ? 2 : 0.8}
                    strokeDasharray={isConnected ? 'none' : '3 4'}
                    opacity={isConnected ? 0.95 : 0.25}
                    filter={isConnected ? 'url(#glowEffect)' : undefined}
                    className="transition-all duration-300"
                  />
                );
              })}

              {/* =============================================================
               * MAIN RADIAL TRUNKS (7 DOMAIN NERVE SPINES)
               * ============================================================= */}
              {/* Spine 0: Geophysics (Top) */}
              <path d="M 430 260 Q 430 180 430 95" fill="none" stroke="#10b981" strokeWidth="2.2" opacity="0.75" />
              <path d="M 430 160 L 375 120 L 400 50 M 430 95 L 485 120 L 460 45 L 525 65" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />

              {/* Spine 1: Biogeo (Top-Right) */}
              <path d="M 430 260 Q 510 200 620 125" fill="none" stroke="#06b6d4" strokeWidth="2.2" opacity="0.75" />
              <path d="M 550 155 L 600 180 L 675 140 L 695 95 L 750 130" fill="none" stroke="#06b6d4" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />

              {/* Spine 2: Comms (Mid-Right) */}
              <path d="M 430 260 Q 540 270 665 305" fill="none" stroke="#f97316" strokeWidth="2.2" opacity="0.75" />
              <path d="M 615 260 L 680 240 L 740 275 L 785 325" fill="none" stroke="#f97316" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />

              {/* Spine 3: Culture & Policy (Bottom-Right) */}
              <path d="M 430 260 Q 510 340 580 445" fill="none" stroke="#a855f7" strokeWidth="2.2" opacity="0.75" />
              <path d="M 555 375 L 625 395 L 655 455 L 715 480 M 580 445 L 515 460 L 610 495" fill="none" stroke="#a855f7" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />

              {/* Spine 4: Grassroots & Territory (Bottom-Left) */}
              <path d="M 430 260 Q 340 340 280 445" fill="none" stroke="#84cc16" strokeWidth="2.2" opacity="0.75" />
              <path d="M 305 375 L 235 395 L 205 455 L 145 480 M 280 445 L 345 460" fill="none" stroke="#84cc16" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />

              {/* Spine 5: Project Management & Consortia (Mid-Left) */}
              <path d="M 430 260 Q 320 270 195 305" fill="none" stroke="#f59e0b" strokeWidth="2.2" opacity="0.75" />
              <path d="M 245 260 L 180 240 L 120 275 L 75 325" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />

              {/* Spine 6: Software, Product Owner & AI (Top-Left) */}
              <path d="M 430 260 Q 340 190 240 125" fill="none" stroke="#6366f1" strokeWidth="2.2" opacity="0.75" />
              <path d="M 310 155 L 260 180 L 185 140 L 165 95 L 210 50 M 185 140 L 110 130" fill="none" stroke="#6366f1" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />

              {/* =============================================================
               * CENTRAL NUCLEUS: DANIEL SANTANDER (TRANSDISCIPLINARY CORE)
               * ============================================================= */}
              <g 
                className="cursor-pointer group"
                onClick={() => setSelectedNodeId('n7-wetland')}
              >
                {/* Outer Rotating Halo */}
                <circle cx="430" cy="260" r="34" fill="#091325" stroke="#38bdf8" strokeWidth="2" filter="url(#glowEffect)" />
                <circle cx="430" cy="260" r="40" fill="none" stroke="#6366f1" strokeWidth="1" strokeDasharray="3 4" opacity="0.6" />
                <circle cx="430" cy="260" r="4.5" fill="#38bdf8" />
                
                <text x="430" y="256" fill="#ffffff" fontSize="8" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="0.5">
                  D. SANTANDER
                </text>
                <text x="430" y="268" fill="#38bdf8" fontSize="6.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                  CORE TRANSDISCIPLINAR
                </text>
                <text x="430" y="277" fill="#94a3b8" fontSize="5" fontFamily="monospace" textAnchor="middle">
                  7 POLOS EN SINERGIA
                </text>
              </g>

              {/* =============================================================
               * NODES RENDERING (WITH BIOLUMINESCENT PARTICLES & GAP ALERTS)
               * ============================================================= */}
              {nodes.map(node => {
                const isSelected = selectedNodeId === node.id;
                const isHovered = hoveredNodeId === node.id;
                const isSynergyActive = activeSynergyNodeIds.has(node.id);

                // Filter check: Mastered, Training, Gaps
                const matchesStatusFilter = 
                  filterMode === 'all' ||
                  (filterMode === 'mastered' && node.status === 'MASTERED') ||
                  (filterMode === 'training' && (node.status === 'ACTIVE' || node.status === 'IN_TRAINING')) ||
                  (filterMode === 'gaps' && node.isMarketGap);

                // Archetype check
                const matchesArchetype = 
                  selectedArchetype === 'all' || 
                  node.archetypes.includes(selectedArchetype) ||
                  (node.isMarketGap && node.archetypes.includes(selectedArchetype));

                const isVisible = matchesStatusFilter && matchesArchetype;
                const nodeColor = node.isMarketGap 
                  ? '#ef4444' 
                  : branchStyles[node.branch].color;

                const opacity = isVisible ? (isHovered || isSelected || isSynergyActive ? 1 : 0.85) : 0.15;

                return (
                  <g 
                    key={node.id} 
                    className="cursor-pointer group transition-all duration-300"
                    style={{ opacity }}
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    onClick={() => setSelectedNodeId(node.id)}
                  >
                    {/* Pulsing Alert Ring for Market Gaps */}
                    {node.isMarketGap && (
                      <circle 
                        cx={node.cx} 
                        cy={node.cy} 
                        r="16" 
                        fill="none" 
                        stroke="#ef4444" 
                        strokeWidth="1.2"
                        strokeDasharray="2 3"
                        className="animate-spin"
                        style={{ animationDuration: '6s' }}
                      />
                    )}

                    {/* Selected or Synergy Halo Ring */}
                    {(isSelected || isHovered || isSynergyActive) && (
                      <circle 
                        cx={node.cx} 
                        cy={node.cy} 
                        r={isSelected ? "17" : "14"} 
                        fill={nodeColor} 
                        fillOpacity="0.25" 
                        stroke={nodeColor}
                        strokeWidth={isSelected ? "2" : "1.2"}
                        filter="url(#glowEffect)"
                      />
                    )}

                    {/* Node Main Body */}
                    <circle 
                      cx={node.cx} 
                      cy={node.cy} 
                      r={isSelected ? "10.5" : "8"} 
                      fill="#070d1e" 
                      stroke={nodeColor} 
                      strokeWidth={isSelected ? "2.5" : "1.6"} 
                      strokeDasharray={node.isMarketGap ? "2 2" : undefined}
                    />

                    {/* Inner Core Pip */}
                    <circle 
                      cx={node.cx} 
                      cy={node.cy} 
                      r={node.isMarketGap ? "2.5" : node.status === 'MASTERED' ? "3" : "2"} 
                      fill={nodeColor} 
                    />

                    {/* Node Floating Label */}
                    <text 
                      x={node.cx} 
                      y={node.cy + (node.cy > 260 ? 17 : -12)} 
                      fontSize="6.8" 
                      fontWeight="bold" 
                      fontFamily="sans-serif" 
                      textAnchor="middle"
                      fill={isSelected ? '#38bdf8' : isHovered ? '#ffffff' : '#cbd5e1'}
                      className="transition-colors"
                    >
                      {node.shortName}
                    </text>
                    <text 
                      x={node.cx} 
                      y={node.cy + (node.cy > 260 ? 24 : -5)} 
                      fill={nodeColor} 
                      fontSize="5.5" 
                      fontFamily="monospace" 
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      {node.isMarketGap ? '⚡ GAP' : `Nvl ${node.level}/5`}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* RIGHT COLUMN: THE DEEP DOSSIER DRAWER (4 COLS) */}
        <div className="lg:col-span-4 space-y-3.5">
          
          {/* Main Selected Capability Inspector Card */}
          <div 
            className={`p-4 rounded-2xl border shadow-2xl relative transition-all duration-300 ${
              selectedNode.isMarketGap 
                ? 'bg-rose-500/10 border-rose-500/50 shadow-rose-950/30' 
                : `${currentBranchStyle.bg} ${currentBranchStyle.border}`
            }`}
          >
            <div className="flex items-center justify-between border-b border-[var(--panel-border)] pb-2 mb-2.5">
              <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                {selectedNode.isMarketGap ? (
                  <>
                    <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-rose-400 font-extrabold">RADAR DE VACÍO DE MERCADO</span>
                  </>
                ) : (
                  <>
                    <span>{currentBranchStyle.icon}</span>
                    <span>FICHA TÉCNICA VERIFICADA</span>
                  </>
                )}
              </span>
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded border font-bold ${
                selectedNode.isMarketGap 
                  ? 'bg-rose-600 text-white border-rose-500' 
                  : 'bg-[var(--panel-bg)] text-[var(--text-primary)] border-[var(--card-border)]'
              }`}>
                {selectedNode.isMarketGap ? '⚡ VACÍO DETECTADO' : `ID: ${selectedNode.id}`}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div 
                  className="text-[9px] font-mono font-bold uppercase tracking-wider"
                  style={{ color: currentBranchStyle.color }}
                >
                  {currentBranchStyle.label}
                </div>
                <h3 className="text-sm sm:text-base font-black text-[var(--text-primary)] tracking-tight mt-0.5">
                  {selectedNode.name}
                </h3>
              </div>

              {/* If it's a Market Gap: Show Market Demand, Impact & Actionable Roadmap */}
              {selectedNode.isMarketGap ? (
                <div className="space-y-2.5">
                  <div 
                    className="p-3 rounded-xl border space-y-1.5 backdrop-blur-sm"
                    style={{ 
                      backgroundColor: 'var(--panel-bg)', 
                      borderColor: 'var(--panel-border)' 
                    }}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[var(--text-muted)] font-mono">Demanda en Ofertas:</span>
                      <span className="text-rose-400 font-mono font-bold text-[10px]">
                        {selectedNode.gapDemand}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[var(--panel-border)]">
                      <span className="text-[var(--text-muted)] font-mono">Impacto Salarial/Match:</span>
                      <span className="text-emerald-400 font-mono font-bold text-[10px]">
                        {selectedNode.gapImpact}
                      </span>
                    </div>
                  </div>

                  <div className="text-[11.5px] text-[var(--text-secondary)] leading-relaxed font-sans">
                    {selectedNode.description}
                  </div>

                  {/* Immediate 3-step Action Roadmap */}
                  {selectedNode.gapRoadmap && (
                    <div className="pt-2 border-t border-[var(--panel-border)] space-y-2">
                      <div className="text-[9.5px] font-mono font-bold text-[var(--text-primary)] uppercase flex items-center gap-1.5">
                        <TrendingUp className="h-3.5 w-3.5 text-rose-500" />
                        <span>HOJA DE RUTA PARA CERRAR LA BRECHA</span>
                      </div>
                      <div className="space-y-1.5">
                        {selectedNode.gapRoadmap.map((step, idx) => (
                          <div 
                            key={idx} 
                            className="p-2 rounded-xl border text-[10.5px] flex items-start gap-2 backdrop-blur-sm"
                            style={{ 
                              backgroundColor: 'var(--panel-bg)', 
                              borderColor: 'var(--card-border)' 
                            }}
                          >
                            <span className="h-4 w-4 rounded-full bg-rose-500/20 text-rose-400 font-mono text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="text-[var(--text-secondary)] leading-snug">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Regular Mastered/Active Node Inspector */
                <div className="space-y-3">
                  <div 
                    className="p-3 rounded-xl border space-y-1.5 backdrop-blur-sm"
                    style={{ 
                      backgroundColor: 'var(--panel-bg)', 
                      borderColor: 'var(--panel-border)' 
                    }}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[var(--text-muted)] font-mono">Nivel de Dominio:</span>
                      <span className="text-emerald-400 font-mono font-bold">
                        {selectedNode.level} de {selectedNode.maxLevel} ({selectedNode.level === 5 ? 'Senior / Mastered' : 'Activo'})
                      </span>
                    </div>

                    {/* 5 Pip Progress Bar */}
                    <div className="grid grid-cols-5 gap-1.5 h-1.5 w-full bg-black/40 rounded-full p-0.5 border border-white/10">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-full rounded-full transition-all duration-500 ${
                            i < selectedNode.level 
                              ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' 
                              : 'bg-transparent'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="flex justify-between items-center text-[9px] text-[var(--text-muted)] font-mono pt-0.5">
                      <span>Horas de Vuelo & Respaldo:</span>
                      <span className="text-[var(--text-primary)] font-bold">{selectedNode.xp} XP</span>
                    </div>
                  </div>

                  {/* Technical Description */}
                  <div className="text-[11.5px] text-[var(--text-secondary)] leading-relaxed font-sans">
                    {selectedNode.description}
                  </div>

                  {/* Connected Synergy Bridges for this Node */}
                  {activeSynergies.length > 0 && (
                    <div className="pt-2 border-t border-[var(--panel-border)] space-y-1.5">
                      <div className="text-[9.5px] font-mono font-bold text-cyan-400 uppercase flex items-center gap-1.5">
                        <Layers className="h-3.5 w-3.5" />
                        <span>SINERGIAS ACTIVAS CON OTROS POLOS</span>
                      </div>
                      <div className="space-y-1">
                        {activeSynergies.map((s, idx) => (
                          <div 
                            key={idx}
                            className="p-1.5 rounded-lg border text-[10px] font-mono flex items-center justify-between text-cyan-300 bg-cyan-950/20 border-cyan-500/20"
                          >
                            <span>⚡ {s.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Direct Evidence Anchor to Portafolio App */}
                  <div className="pt-2 border-t border-[var(--panel-border)] space-y-1.5">
                    <div className="text-[9.5px] font-mono font-bold text-[var(--text-primary)] uppercase flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5 text-cyan-400" />
                      <span>RESPALDO AUDITADO EN PORTAFOLIO</span>
                    </div>
                    <div 
                      className="p-2.5 rounded-xl border flex items-center justify-between group shadow"
                      style={{ 
                        backgroundColor: 'var(--panel-bg)', 
                        borderColor: 'var(--card-border)' 
                      }}
                    >
                      <div className="overflow-hidden pr-2">
                        <div className="text-[11.5px] font-bold text-[var(--text-primary)] truncate">
                          {selectedNode.evidenceTitle}
                        </div>
                        <div className="text-[9.5px] text-emerald-400 font-mono flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Evidencia documental verificable</span>
                        </div>
                      </div>
                      <a
                        href={`https://danisantanderurrutia-coder.github.io/portafolio/${selectedNode.evidenceAnchor}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition shrink-0 shadow-lg shadow-cyan-600/30 flex items-center gap-1"
                        title="Abrir evidencia directa en el Portafolio"
                      >
                        <span className="text-[10px] font-mono font-bold hidden sm:inline">VER</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Archetype Target Context Card */}
          <div 
            className="p-3.5 rounded-2xl border shadow-xl space-y-2 transition-colors"
            style={{ 
              backgroundColor: 'var(--card-bg)', 
              borderColor: 'var(--card-border)' 
            }}
          >
            <div className="flex items-center justify-between border-b border-[var(--panel-border)] pb-1.5">
              <span className="text-[11px] font-bold uppercase text-[var(--text-primary)] flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5 text-cyan-400" />
                <span>MERCADO DIANA: {currentArchetypeInfo.name.toUpperCase()}</span>
              </span>
              <span className="text-[9px] font-mono text-emerald-400 font-bold">
                {offers.length} OFERTAS ACTIVAS
              </span>
            </div>

            <p className="text-[10.5px] text-[var(--text-secondary)] leading-relaxed">
              {currentArchetypeInfo.description}
            </p>

            <div 
              className="p-2.5 rounded-xl border text-[10px] font-mono space-y-1"
              style={{ 
                backgroundColor: 'var(--panel-bg)', 
                borderColor: 'var(--panel-border)' 
              }}
            >
              <div className="text-[var(--text-muted)] font-bold">ENTIDADES Y CENTROS OBJETIVO:</div>
              <div className="text-cyan-400 leading-snug">{currentArchetypeInfo.targets}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
