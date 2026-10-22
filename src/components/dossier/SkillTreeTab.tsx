import React, { useState } from 'react';
import { 
  Network, 
  ExternalLink,
  Award,
  TrendingUp,
  GraduationCap
} from 'lucide-react';
import { getStoredOffers } from '../../services/db';

interface CapabilityNode {
  id: string;
  name: string;
  shortName: string;
  level: number; // 1 to 5
  maxLevel: 5;
  status: 'MASTERED' | 'ACTIVE' | 'IN_TRAINING' | 'MARKET_GAP';
  branch: 'geophysics' | 'biogeo' | 'policy' | 'languages';
  xp: number;
  cx: number;
  cy: number;
  description: string;
  evidenceTitle: string;
  evidenceAnchor: string;
  isMarketGap?: boolean;
  gapDemand?: string;
  gapImpact?: string;
  gapRoadmap?: string[];
}

export const SkillTreeTab: React.FC = () => {
  const offers = getStoredOffers();

  // Selected filter mode
  const [filterMode, setFilterMode] = useState<'all' | 'mastered' | 'training' | 'gaps'>('all');

  // Selected node for technical inspector
  const [selectedNodeId, setSelectedNodeId] = useState<string>('n1-gee');

  const nodes: CapabilityNode[] = [
    // -------------------------------------------------------------
    // RAMA 1: GEOFÍSICA & SENSORES REMOTOS (EMERALD, TOP-LEFT)
    // -------------------------------------------------------------
    {
      id: 'n1-geo-math',
      name: 'Modelación Geoespacial (R & Python)',
      shortName: 'R & Python',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'geophysics',
      xp: 1000,
      cx: 290,
      cy: 130,
      description: 'Automatización de pipelines espaciales, análisis estadístico multivariable y series temporales biofísicas.',
      evidenceTitle: 'Lámina 002: Smart Food Parks & Teledetección',
      evidenceAnchor: '#capacidades-computacionales'
    },
    {
      id: 'n1-sismica',
      name: 'Geofísica de Campo & Prospección',
      shortName: 'Prospección',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'geophysics',
      xp: 1000,
      cx: 215,
      cy: 140,
      description: 'Sondajes geoeléctricos, gravimetría y procesamiento de señales de subsuelo en la Universidad de Chile.',
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
      cx: 185,
      cy: 85,
      description: 'Integración multicriterio de coberturas de suelo, pendientes topográficas, cuencas y riesgo de incendios.',
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
      cx: 115,
      cy: 75,
      description: 'Monitoreo multiespectral de reflectancia de dosel, índices NDVI/NDWI y estrés hídrico de vegetación.',
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
      cx: 65,
      cy: 40,
      description: 'Procesamiento masivo de petabytes de datos planetarios en la nube para detección de cambios ambientales.',
      evidenceTitle: 'Lámina 006: Modelado Geoespacial & Gemelos Digitales',
      evidenceAnchor: '#liderazgo-innovacion'
    },

    // -------------------------------------------------------------
    // RAMA 2: BIOGEOQUÍMICA & SUELOS (CYAN, TOP-RIGHT)
    // -------------------------------------------------------------
    {
      id: 'n2-peatlands',
      name: 'Dinámica de Carbono & Turberas',
      shortName: 'Carbono Suelos',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'biogeo',
      xp: 1000,
      cx: 450,
      cy: 130,
      description: 'Modelación de sumideros de carbono y balances de gases de efecto invernadero en humedales templados europeos.',
      evidenceTitle: 'Lámina 001: Dinámica de GEI en Turberas (Polonia/Alemania)',
      evidenceAnchor: '#investigacion-cuantitativa'
    },
    {
      id: 'n2-hydro',
      name: 'Balances Hidrológicos de Cuencas',
      shortName: 'Hidrología',
      level: 4,
      maxLevel: 5,
      status: 'ACTIVE',
      branch: 'biogeo',
      xp: 890,
      cx: 525,
      cy: 140,
      description: 'Modelación cuantitativa de escorrentía, evapotranspiración y recarga de acuíferos en cuencas de captación.',
      evidenceTitle: 'Lámina 001: Balances en Lagos Góreckie y Durowskie',
      evidenceAnchor: '#investigacion-cuantitativa'
    },
    {
      id: 'n2-ghg',
      name: 'Cuantificación de Emisiones CO2 & CH4',
      shortName: 'Flujos GEI',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'biogeo',
      xp: 960,
      cx: 555,
      cy: 85,
      description: 'Medición de cámaras de flujo in-situ, calibración de balances biogeoquímicos y modelos de emisión.',
      evidenceTitle: 'Lámina 001: Modelación Cuantitativa CAU Kiel',
      evidenceAnchor: '#investigacion-cuantitativa'
    },
    {
      id: 'n2-soil-lab',
      name: 'Sensores e Instrumentación de Suelos',
      shortName: 'Lab Suelos',
      level: 4,
      maxLevel: 5,
      status: 'ACTIVE',
      branch: 'biogeo',
      xp: 820,
      cx: 625,
      cy: 75,
      description: 'Análisis de textura, retención hídrica, carbono orgánico total (TOC) e impedancia edáfica.',
      evidenceTitle: 'Lámina 002: Laboratorio de Suelos CAU Kiel',
      evidenceAnchor: '#capacidades-computacionales'
    },
    {
      id: 'n2-water-quality',
      name: 'Ecología Lacustre & Eutrofización',
      shortName: 'Calidad Agua',
      level: 4,
      maxLevel: 5,
      status: 'ACTIVE',
      branch: 'biogeo',
      xp: 840,
      cx: 675,
      cy: 40,
      description: 'Diagnóstico biogeoquímico de fósforo, nitrógeno y dinámica trófica en lagos y humedales de Europa Central.',
      evidenceTitle: 'Lámina 001: Ecosistemas Acuáticos Poznań',
      evidenceAnchor: '#investigacion-cuantitativa'
    },

    // -------------------------------------------------------------
    // RAMA 3: POLÍTICAS UE & GOBERNANZA (AMBER, BOTTOM-LEFT)
    // -------------------------------------------------------------
    {
      id: 'n3-congreso',
      name: 'Asesoría Parlamentaria & Gestión de Riesgo',
      shortName: 'Congreso Nac.',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'policy',
      xp: 1000,
      cx: 290,
      cy: 220,
      description: 'Exposición como perito técnico ante la Comisión de Emergencia y Desastres de la Cámara de Diputados.',
      evidenceTitle: 'Lámina 003: Comparecencia en Cámara de Diputados',
      evidenceAnchor: '#gobernanza-politicas'
    },
    {
      id: 'n3-epn',
      name: 'Directiva RED II & Biomasa Forestal',
      shortName: 'EPN Bioenergía',
      level: 4,
      maxLevel: 5,
      status: 'ACTIVE',
      branch: 'policy',
      xp: 890,
      cx: 215,
      cy: 210,
      description: 'Autor principal de informes técnicos para la red internacional Environmental Paper Network (EPN).',
      evidenceTitle: 'Lámina 004: Informe EPN Biomasa & Taxonomía UE',
      evidenceAnchor: '#publicaciones-tecnicas'
    },
    {
      id: 'n3-rewilding',
      name: 'Restauración Ecológica & Rewilding',
      shortName: 'Rewilding UE',
      level: 4,
      maxLevel: 5,
      status: 'ACTIVE',
      branch: 'policy',
      xp: 850,
      cx: 185,
      cy: 265,
      description: 'Diseño de estrategias de regeneración biofísica de cuencas mediterráneas en Aljezur (Portugal).',
      evidenceTitle: 'Lámina 004: Rewilding Aljezur (Portugal)',
      evidenceAnchor: '#publicaciones-tecnicas'
    },
    {
      id: 'n3-soil-law',
      name: 'EU Soil Monitoring Law (Directiva 2024)',
      shortName: 'Directiva Suelo',
      level: 3,
      maxLevel: 5,
      status: 'IN_TRAINING',
      branch: 'policy',
      xp: 650,
      cx: 115,
      cy: 275,
      description: 'Adaptación metodológica de indicadores edáficos a los nuevos estándares de certificación ambiental de la UE.',
      evidenceTitle: 'Lámina 004: Policy Briefs Ambientales',
      evidenceAnchor: '#publicaciones-tecnicas'
    },
    {
      id: 'n3-safeguards',
      name: 'Salvaguardas Socio-Ecológicas',
      shortName: 'Salvaguardas',
      level: 4,
      maxLevel: 5,
      status: 'ACTIVE',
      branch: 'policy',
      xp: 870,
      cx: 65,
      cy: 310,
      description: 'Articulación de estándares ambientales internacionales con comunidades territoriales y brigadas de emergencia.',
      evidenceTitle: 'Lámina 003: Salvaguardas & Convención Constitucional',
      evidenceAnchor: '#gobernanza-politicas'
    },

    // -------------------------------------------------------------
    // RAMA 4: IDIOMAS & DIPLOMACIA (PURPLE, BOTTOM-RIGHT)
    // -------------------------------------------------------------
    {
      id: 'n4-es',
      name: 'Español Nativo (C2 / Oratoria de Alto Nivel)',
      shortName: 'Español C2',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'languages',
      xp: 1000,
      cx: 450,
      cy: 220,
      description: 'Dominio de oratoria técnica parlamentaria, vocería en medios y redacción de informes técnicos de rigor.',
      evidenceTitle: 'Lámina 003: Vocería Técnica Congreso Nacional',
      evidenceAnchor: '#gobernanza-politicas'
    },
    {
      id: 'n4-plp',
      name: 'Dirección Editorial de Medios (+700k)',
      shortName: 'Medios (+700k)',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'languages',
      xp: 1000,
      cx: 525,
      cy: 210,
      description: 'Fundador y director de Primera Línea Prensa: liderazgo editorial y comunicación ciudadana en tiempo real.',
      evidenceTitle: 'Prensa Ciudadana: Primera Línea Prensa (+700k)',
      evidenceAnchor: '#primera-linea-prensa'
    },
    {
      id: 'n4-en',
      name: 'Inglés Profesional Científico (C1 CEMS)',
      shortName: 'English C1',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'languages',
      xp: 960,
      cx: 555,
      cy: 265,
      description: 'Doble titulación cursada íntegramente en inglés, conferencias en Bonn y redacción para redes europeas.',
      evidenceTitle: 'Lámina 005: Conferencias Bonn, Oslo y Bogotá',
      evidenceAnchor: '#conferencias-internacionales'
    },
    {
      id: 'n4-de',
      name: 'Alemán Técnico (§20 AufenthG / B1→B2)',
      level: 3,
      maxLevel: 5,
      status: 'IN_TRAINING',
      shortName: 'Deutsch B1/B2',
      branch: 'languages',
      xp: 680,
      cx: 625,
      cy: 275,
      description: 'Residencia académica en Kiel, comprensión técnica de normativa ambiental alemana y vinculación en DACH.',
      evidenceTitle: 'Lámina 007: Doble M.Sc. en CAU Kiel (Alemania)',
      evidenceAnchor: '#titulaciones-academicas'
    },
    {
      id: 'n4-diplomacy',
      name: 'Diplomacia Científica & Redes Globales',
      shortName: 'Diplomacia',
      level: 4,
      maxLevel: 5,
      status: 'ACTIVE',
      branch: 'languages',
      xp: 880,
      cx: 675,
      cy: 310,
      description: 'Participación en cumbres internacionales de justicia climática y articulación intercontinental Europa-Latinoamérica.',
      evidenceTitle: 'Lámina 005: Foros de Oslo, Bonn y Bogotá',
      evidenceAnchor: '#conferencias-internacionales'
    },

    // =============================================================
    // VACÍOS DE MERCADO DETECTADOS (SKILL GAPS ESTRATÉGICOS)
    // =============================================================
    {
      id: 'gap-swat',
      name: 'Modelación Hidrológica SWAT / Iber',
      shortName: 'SWAT/Iber',
      level: 2,
      maxLevel: 5,
      status: 'MARKET_GAP',
      branch: 'biogeo',
      xp: 400,
      cx: 600,
      cy: 160,
      description: 'Brecha detectada en consultoras hidrológicas y agencias de cuencas en Alemania (LUBW, BfG) y Euskadi (URA).',
      evidenceTitle: 'Extensión Metodológica a Modelos de Transporte Fluvial',
      evidenceAnchor: '#investigacion-cuantitativa',
      isMarketGap: true,
      gapDemand: '42% vacantes de modelación hidrológica en DACH y Euskadi',
      gapImpact: '+18% coincidencia en vacantes de modelador de cuencas',
      gapRoadmap: [
        'Calibrar cuenca piloto en QSWAT+ usando datos de Sentinel-2',
        'Validar balances hídricos frente a series de caudal existentes',
        'Publicar mini-estudio de caso en Portafolio'
      ]
    },
    {
      id: 'gap-docker-gis',
      name: 'Docker & MLOps Geoespacial',
      shortName: 'Docker Geo',
      level: 2,
      maxLevel: 5,
      status: 'MARKET_GAP',
      branch: 'geophysics',
      xp: 450,
      cx: 140,
      cy: 35,
      description: 'Contenedorización de scripts Python/GEE e inferencia automática de imágenes satelitales en la nube.',
      evidenceTitle: 'Modernización DevOps para Teledetección',
      evidenceAnchor: '#capacidades-computacionales',
      isMarketGap: true,
      gapDemand: '38% vacantes de geoinformática y centros tecnológicos (Tecnalia, DLR)',
      gapImpact: '+22% atractivo en roles de especialista geoespacial',
      gapRoadmap: [
        'Contenedorizar pipeline GEE Python en Dockerfile ligero',
        'Automatizar descarga y procesamiento de teledetección con GitHub Actions',
        'Integrar API FastAPI para servir capas ráster GeoTIFF'
      ]
    },
    {
      id: 'gap-csrd-audit',
      name: 'Auditoría de Carbono Corporativo & CSRD',
      shortName: 'CSRD Audit',
      level: 3,
      maxLevel: 5,
      status: 'MARKET_GAP',
      branch: 'policy',
      xp: 550,
      cx: 150,
      cy: 320,
      description: 'Directiva de Sostenibilidad Corporativa UE: huella de carbono Scope 1, 2 y 3 bajo GHG Protocol.',
      evidenceTitle: 'Transición de Huella Científica a Auditoría Corporativa',
      evidenceAnchor: '#publicaciones-tecnicas',
      isMarketGap: true,
      gapDemand: '50% ofertas de consultoría de sostenibilidad empresarial',
      gapImpact: '+25% rango salarial en consultoría de transición climática',
      gapRoadmap: [
        'Completar análisis comparativo de métricas ESRS E1 (Clima)',
        'Estructurar plantilla Python/Excel para cálculo de Scope 1-3',
        'Redactar artículo de análisis de impacto de CSRD en pymes industriales'
      ]
    },
    {
      id: 'gap-de-c1',
      name: 'Alemán C1 (Licitaciones Públicas / DACH)',
      shortName: 'Deutsch C1',
      level: 3,
      maxLevel: 5,
      status: 'MARKET_GAP',
      branch: 'languages',
      xp: 620,
      cx: 600,
      cy: 330,
      description: 'Comprensión y redacción de pliegos técnicos de proyectos ambientales en Alemania (§20 AufenthG).',
      evidenceTitle: 'Consolidación Lingüística para Plazas Permanentes (§20 AufenthG)',
      evidenceAnchor: '#titulaciones-academicas',
      isMarketGap: true,
      gapDemand: '60% plazas permanentes en institutos federales y estatales alemanes',
      gapImpact: '+35% probabilidad de contratación directa en sector público DACH',
      gapRoadmap: [
        'Estudio de vocabulario técnico de pliegos públicos (VOL/VOB)',
        'Simulaciones de entrevistas técnicas en alemán con colegas de Kiel',
        'Certificación Goethe/Telc C1 Beruf'
      ]
    }
  ];

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  const branchStyles = {
    geophysics: { color: '#10b981', label: 'GEOFÍSICA & SENSORES REMOTOS', bg: 'bg-emerald-500/10', border: 'border-emerald-500/40' },
    biogeo: { color: '#0ea5e9', label: 'BIOGEOQUÍMICA & AGUA', bg: 'bg-sky-500/10', border: 'border-sky-500/40' },
    policy: { color: '#f59e0b', label: 'POLÍTICAS UE & GOBERNANZA', bg: 'bg-amber-500/10', border: 'border-amber-500/40' },
    languages: { color: '#a855f7', label: 'IDIOMAS & DIPLOMACIA', bg: 'bg-purple-500/10', border: 'border-purple-500/40' }
  };

  const currentBranchStyle = branchStyles[selectedNode.branch];

  // Counts for filter pills
  const totalCount = nodes.length;
  const masteredCount = nodes.filter(n => n.status === 'MASTERED').length;
  const trainingCount = nodes.filter(n => n.status === 'ACTIVE' || n.status === 'IN_TRAINING').length;
  const gapsCount = nodes.filter(n => n.isMarketGap).length;

  // Strategic R&D Focus Areas (Replacing bounties)
  const rdFocusAreas = [
    {
      id: 'rd-1',
      title: 'Modelación GEE en Python para Balance Hídrico',
      demand: '+18% Coincidencia en DACH & Euskadi',
      focus: 'Tecnalia, BC3 & Helmholtz',
      status: 'En Desarrollo Activo'
    },
    {
      id: 'rd-2',
      title: 'Módulo EU Soil Health Directive & Auditoría de Carbono',
      demand: '+22% Coincidencia en Consultoría UE',
      focus: 'Basque Green Deal & Horizonte Europa',
      status: 'Prioridad Estratégica'
    },
    {
      id: 'rd-3',
      title: 'Certificación Alemán B2/C1 Fachsprache Geodaten',
      demand: '+25% Plazas Permanentes en Alemania',
      focus: 'Institutos Públicos DACH (§20 AufenthG)',
      status: 'En Preparación'
    }
  ];

  return (
    <div className="space-y-5 text-[var(--text-primary)] font-sans animate-fadeIn select-none">
      
      {/* =========================================================================
       * 1. HEADER: GRAFO DE CAPACIDADES CIENTÍFICAS (KNOWLEDGE GRAPH & GAPS)
       * ========================================================================= */}
      <div 
        className="p-5 rounded-2xl border shadow-xl relative overflow-hidden transition-colors"
        style={{ 
          backgroundColor: 'var(--card-bg)', 
          borderColor: 'var(--card-border)' 
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Network className="h-3.5 w-3.5" />
                <span>KNOWLEDGE GRAPH // RED CIENTÍFICA & RADAR DE VACÍOS</span>
              </span>
              <span className="text-[11px] text-[var(--text-muted)] font-mono">
                {nodes.length} NODOS ACTIVOS • 4 BRECHAS DE MERCADO IDENTIFICADAS
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] uppercase tracking-tight">
              Árbol de Aptitudes & Detección de Vacíos de Mercado
            </h1>
            <p className="text-xs text-[var(--text-secondary)] max-w-2xl leading-relaxed">
              Mapeo de convergencia entre Geofísica, Biogeoquímica de Suelos y Políticas Europeas. Incluye radar de vacíos formativos para maximizar afinidad con institutos y consultoras en Alemania y Euskadi.
            </p>
          </div>

          {/* Academic Rank Emblem */}
          <div 
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl border shrink-0"
            style={{ 
              backgroundColor: 'var(--panel-bg)', 
              borderColor: 'var(--panel-border)' 
            }}
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[9px] text-[var(--text-muted)] font-mono font-bold uppercase">PERFIL ACADÉMICO</div>
              <div className="text-xs font-bold text-[var(--text-primary)]">DOBLE M.SC. & LIC. GEOFÍSICA</div>
              <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-mono">CAU Kiel • AMU Poznań • U. de Chile</div>
            </div>
          </div>
        </div>

        {/* Filter Pills Bar */}
        <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-3.5 border-t border-[var(--panel-border)]">
          <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase font-bold mr-1">
            FILTRAR GRAFO:
          </span>
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 ${
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
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 ${
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
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 ${
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
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 ${
              filterMode === 'gaps'
                ? 'bg-rose-600 text-white shadow ring-2 ring-rose-500/40'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 border border-rose-500/30'
            }`}
          >
            <span>⚡ Vacíos de Mercado (Skill Gaps)</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-rose-600 text-white font-extrabold">{gapsCount}</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
       * 2. MAIN STAGE: SCIENTIFIC KNOWLEDGE GRAPH & CAPABILITY INSPECTOR
       * ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT COLUMN: THE KNOWLEDGE GRAPH CANVAS (8 COLS) */}
        <div 
          className="lg:col-span-8 p-4 rounded-2xl border shadow-xl relative overflow-hidden transition-colors"
          style={{ 
            backgroundColor: 'var(--card-bg)', 
            borderColor: 'var(--card-border)' 
          }}
        >
          {/* Discipline Legend Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--panel-border)] pb-2.5 mb-2.5 text-[10px] font-mono">
            <span className="text-[var(--text-muted)] font-bold uppercase">4 DOMINIOS + BRECHAS DE MERCADO:</span>
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Geofísica</span>
              </span>
              <span className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400 font-medium">
                <span className="h-2 w-2 rounded-full bg-sky-500" />
                <span>Biogeoquímica</span>
              </span>
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span>Políticas UE</span>
              </span>
              <span className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-medium">
                <span className="h-2 w-2 rounded-full bg-purple-500" />
                <span>Idiomas</span>
              </span>
              <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold">
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                <span>⚡ Brecha (Gap)</span>
              </span>
            </div>
          </div>

          {/* SVG Scientific Knowledge Graph */}
          <div className="relative w-full overflow-x-auto">
            <svg 
              viewBox="0 0 740 370" 
              className="w-full min-w-[650px] h-auto select-none"
            >
              <defs>
                <radialGradient id="centerAura" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.20" />
                  <stop offset="60%" stopColor="#0ea5e9" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                </radialGradient>
                <pattern id="cleanGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.12" />
                </pattern>
              </defs>

              {/* Clean Background Grid */}
              <rect x="0" y="0" width="740" height="370" fill="url(#cleanGrid)" className="text-slate-400 dark:text-slate-700" />

              {/* Central Core Ambient Glow */}
              <circle cx="370" cy="185" r="70" fill="url(#centerAura)" />

              {/* Concentric Alignment Rings */}
              <circle cx="370" cy="185" r="80" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
              <circle cx="370" cy="185" r="160" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" />
              <circle cx="370" cy="185" r="240" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="3 6" opacity="0.15" />

              {/* Cross-Domain Synergy Bridges */}
              <path d="M 115 75 Q 280 40 450 130" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 3" opacity="0.4" />
              <path d="M 555 85 Q 400 200 115 275" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 3" opacity="0.4" />
              <path d="M 555 265 Q 420 280 290 220" fill="none" stroke="#a855f7" strokeWidth="1" strokeDasharray="4 3" opacity="0.4" />

              {/* Gap Connections */}
              <path d="M 525 140 L 600 160" fill="none" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
              <path d="M 115 75 L 140 35" fill="none" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
              <path d="M 185 265 L 150 320" fill="none" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
              <path d="M 625 275 L 600 330" fill="none" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />

              {/* Main Domain Hub Trunks */}
              <path d="M 370 185 Q 320 155 290 130" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.75" />
              <path d="M 290 130 L 215 140 L 185 85 L 115 75 L 65 40" fill="none" stroke="#10b981" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />

              <path d="M 370 185 Q 420 155 450 130" fill="none" stroke="#0ea5e9" strokeWidth="2" opacity="0.75" />
              <path d="M 450 130 L 525 140 L 555 85 L 625 75 L 675 40" fill="none" stroke="#0ea5e9" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />

              <path d="M 370 185 Q 320 215 290 220" fill="none" stroke="#f59e0b" strokeWidth="2" opacity="0.75" />
              <path d="M 290 220 L 215 210 L 185 265 L 115 275 L 65 310" fill="none" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />

              <path d="M 370 185 Q 420 215 450 220" fill="none" stroke="#a855f7" strokeWidth="2" opacity="0.75" />
              <path d="M 450 220 L 525 210 L 555 265 L 625 275 L 675 310" fill="none" stroke="#a855f7" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />

              {/* Center Trunk Hub: Daniel Santander */}
              <g className="cursor-pointer group" onClick={() => setSelectedNodeId('n1-gee')}>
                <circle cx="370" cy="185" r="26" fill="#091322" stroke="#38bdf8" strokeWidth="2" />
                <circle cx="370" cy="185" r="31" fill="none" stroke="#64748b" strokeWidth="0.8" strokeDasharray="3 3" />
                <circle cx="370" cy="185" r="3.5" fill="#38bdf8" />
                <text x="370" y="182" fill="#ffffff" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
                  D. SANTANDER
                </text>
                <text x="370" y="193" fill="#94a3b8" fontSize="6" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                  SCIENTIFIC CORE
                </text>
              </g>

              {/* Nodes Rendering */}
              {nodes.map(node => {
                const isSelected = selectedNodeId === node.id;
                
                // Dim nodes that don't match active filter
                const matchesFilter = 
                  filterMode === 'all' ||
                  (filterMode === 'mastered' && node.status === 'MASTERED') ||
                  (filterMode === 'training' && (node.status === 'ACTIVE' || node.status === 'IN_TRAINING')) ||
                  (filterMode === 'gaps' && node.isMarketGap);

                const strokeColor = node.isMarketGap 
                  ? '#ef4444' 
                  : node.branch === 'geophysics' ? '#10b981' 
                  : node.branch === 'biogeo' ? '#0ea5e9' 
                  : node.branch === 'policy' ? '#f59e0b' : '#a855f7';

                return (
                  <g 
                    key={node.id} 
                    className="cursor-pointer group transition-opacity"
                    style={{ opacity: matchesFilter ? 1 : 0.2 }}
                    onClick={() => setSelectedNodeId(node.id)}
                  >
                    {/* Selected Halo Ring */}
                    {isSelected && (
                      <circle 
                        cx={node.cx} 
                        cy={node.cy} 
                        r="18" 
                        fill={strokeColor} 
                        fillOpacity="0.2" 
                        stroke={strokeColor}
                        strokeWidth="1.5"
                        strokeDasharray={node.isMarketGap ? "3 3" : undefined}
                      />
                    )}

                    {/* Node Circle */}
                    <circle 
                      cx={node.cx} 
                      cy={node.cy} 
                      r={isSelected ? "12" : "9.5"} 
                      fill="#0b1329" 
                      stroke={strokeColor} 
                      strokeWidth={isSelected ? "2.5" : "1.5"} 
                      strokeDasharray={node.isMarketGap ? "2 2" : undefined}
                      className="transition-all"
                    />

                    {/* Inner Core Pip */}
                    <circle 
                      cx={node.cx} 
                      cy={node.cy} 
                      r={node.isMarketGap ? "3" : node.status === 'MASTERED' ? "3.5" : "2.5"} 
                      fill={strokeColor} 
                    />

                    {/* Floating Node Label */}
                    <text 
                      x={node.cx} 
                      y={node.cy + (node.cy > 185 ? 18 : -13)} 
                      fontSize="7" 
                      fontWeight="bold" 
                      fontFamily="sans-serif" 
                      textAnchor="middle"
                      className={`transition-colors ${
                        isSelected 
                          ? 'fill-sky-700 dark:fill-sky-300 font-black' 
                          : 'fill-slate-800 dark:fill-slate-200 group-hover:fill-sky-600 dark:group-hover:fill-sky-400'
                      }`}
                    >
                      {node.shortName}
                    </text>
                    <text 
                      x={node.cx} 
                      y={node.cy + (node.cy > 185 ? 25 : -6)} 
                      fill={strokeColor} 
                      fontSize="6" 
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

        {/* RIGHT COLUMN: TECHNICAL CAPABILITY & GAP INSPECTOR (4 COLS) */}
        <div className="lg:col-span-4 space-y-3.5">
          
          {/* Main Selected Capability Inspector Card */}
          <div 
            className={`p-4 rounded-2xl border shadow-xl relative transition-colors ${
              selectedNode.isMarketGap 
                ? 'bg-rose-500/10 border-rose-500/50' 
                : `${currentBranchStyle.bg} ${currentBranchStyle.border}`
            }`}
          >
            <div className="flex items-center justify-between border-b border-[var(--panel-border)] pb-2 mb-2.5">
              <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1">
                {selectedNode.isMarketGap ? (
                  <>
                    <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-rose-600 dark:text-rose-400 font-extrabold">RADAR DE VACÍO DE MERCADO</span>
                  </>
                ) : (
                  <span>FICHA TÉCNICA DE COMPETENCIA</span>
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

            <div className="space-y-2.5">
              <div>
                <div className="text-[8.5px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  {currentBranchStyle.label}
                </div>
                <h3 className="text-sm font-bold text-[var(--text-primary)] tracking-tight mt-0.5">
                  {selectedNode.name}
                </h3>
              </div>

              {/* If it's a Market Gap: Show Actionable Impact & Roadmap */}
              {selectedNode.isMarketGap ? (
                <div className="space-y-2.5">
                  <div 
                    className="p-3 rounded-xl border space-y-1.5"
                    style={{ 
                      backgroundColor: 'var(--panel-bg)', 
                      borderColor: 'var(--panel-border)' 
                    }}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[var(--text-muted)] font-mono">Demanda en Ofertas:</span>
                      <span className="text-rose-600 dark:text-rose-400 font-mono font-bold text-[10px]">
                        {selectedNode.gapDemand}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[var(--panel-border)]">
                      <span className="text-[var(--text-muted)] font-mono">Impacto en Match:</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold text-[10px]">
                        {selectedNode.gapImpact}
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-[var(--text-secondary)] leading-relaxed font-sans">
                    {selectedNode.description}
                  </div>

                  {/* Immediate Action Roadmap */}
                  {selectedNode.gapRoadmap && (
                    <div className="pt-2 border-t border-[var(--panel-border)] space-y-1.5">
                      <div className="text-[9.5px] font-mono font-bold text-[var(--text-primary)] uppercase flex items-center gap-1.5">
                        <TrendingUp className="h-3.5 w-3.5 text-rose-500" />
                        <span>HOJA DE RUTA PARA CERRAR LA BRECHA</span>
                      </div>
                      <div className="space-y-1">
                        {selectedNode.gapRoadmap.map((step, idx) => (
                          <div 
                            key={idx} 
                            className="p-2 rounded-xl border text-[10.5px] flex items-start gap-2"
                            style={{ 
                              backgroundColor: 'var(--panel-bg)', 
                              borderColor: 'var(--card-border)' 
                            }}
                          >
                            <span className="h-4 w-4 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400 font-mono text-[9px] font-bold flex items-center justify-center shrink-0">
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
                <div className="space-y-2.5">
                  <div 
                    className="p-2.5 rounded-xl border space-y-1.5"
                    style={{ 
                      backgroundColor: 'var(--panel-bg)', 
                      borderColor: 'var(--panel-border)' 
                    }}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[var(--text-muted)] font-mono">Nivel de Dominio:</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">{selectedNode.level} de {selectedNode.maxLevel} (Avanzado)</span>
                    </div>
                    {/* 5 Pip Progress Bar */}
                    <div className="grid grid-cols-5 gap-1.5 h-1.5 w-full bg-slate-300 dark:bg-slate-900 rounded-full p-0.5 border border-slate-200 dark:border-slate-800">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-full rounded-full ${
                            i < selectedNode.level 
                              ? 'bg-emerald-500 shadow-[0_0_6px_rgba(52,211,153,0.4)]' 
                              : 'bg-transparent'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-[9px] text-[var(--text-muted)] font-mono pt-0.5">
                      <span>Horas de Vuelo & Respaldo:</span>
                      <span className="text-[var(--text-primary)] font-medium">{selectedNode.xp} XP</span>
                    </div>
                  </div>

                  {/* Technical Description */}
                  <div className="text-[11px] text-[var(--text-secondary)] leading-relaxed font-sans">
                    {selectedNode.description}
                  </div>

                  {/* Evidence Link to Portafolio App */}
                  <div className="pt-2 border-t border-[var(--panel-border)] space-y-1.5">
                    <div className="text-[9.5px] font-mono font-bold text-[var(--text-primary)] uppercase flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5 text-sky-500" />
                      <span>RESPALDO AUDITADO EN PORTAFOLIO</span>
                    </div>
                    <div 
                      className="p-2 rounded-xl border flex items-center justify-between group"
                      style={{ 
                        backgroundColor: 'var(--panel-bg)', 
                        borderColor: 'var(--card-border)' 
                      }}
                    >
                      <div className="overflow-hidden">
                        <div className="text-[11px] font-bold text-[var(--text-primary)] truncate">
                          {selectedNode.evidenceTitle}
                        </div>
                        <div className="text-[9px] text-[var(--text-muted)] font-mono">
                          Prueba documental verificada
                        </div>
                      </div>
                      <a
                        href={`https://danisantanderurrutia-coder.github.io/Portafolio/${selectedNode.evidenceAnchor}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white transition shrink-0 ml-2 shadow"
                        title="Abrir evidencia en la app Portafolio"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Strategic R&D Focus Areas Card */}
          <div 
            className="p-3.5 rounded-2xl border shadow-xl space-y-2 transition-colors"
            style={{ 
              backgroundColor: 'var(--card-bg)', 
              borderColor: 'var(--card-border)' 
            }}
          >
            <div className="flex items-center justify-between border-b border-[var(--panel-border)] pb-1.5">
              <span className="text-[11px] font-bold uppercase text-[var(--text-primary)] flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-sky-500" />
                <span>DEMANDA EN CENTROS I+D (DACH & EUSKADI)</span>
              </span>
              <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                {offers.length} OFERTAS ACTIVAS
              </span>
            </div>

            <p className="text-[10px] text-[var(--text-muted)] leading-snug">
              Líneas de investigación y tecnologías prioritarias identificadas en el mercado:
            </p>

            <div className="space-y-1.5">
              {rdFocusAreas.map(item => (
                <div 
                  key={item.id} 
                  className="p-2 rounded-xl border transition space-y-0.5"
                  style={{ 
                    backgroundColor: 'var(--panel-bg)', 
                    borderColor: 'var(--card-border)' 
                  }}
                >
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="text-sky-600 dark:text-sky-400 font-medium">{item.focus}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">{item.demand}</span>
                  </div>
                  <div className="text-[11px] font-semibold text-[var(--text-primary)] line-clamp-1">{item.title}</div>
                  <div className="text-[8.5px] text-[var(--text-muted)] font-mono">{item.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

