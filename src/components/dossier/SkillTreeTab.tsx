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
  status: 'MASTERED' | 'ACTIVE' | 'IN_TRAINING';
  branch: 'geophysics' | 'biogeo' | 'policy' | 'languages';
  xp: number;
  cx: number;
  cy: number;
  description: string;
  evidenceTitle: string;
  evidenceAnchor: string;
}

export const SkillTreeTab: React.FC = () => {
  const offers = getStoredOffers();

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
    }
  ];

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  const branchStyles = {
    geophysics: { color: '#10b981', label: 'GEOFÍSICA & SENSORES REMOTOS', bg: 'bg-emerald-950/30', border: 'border-emerald-600/60' },
    biogeo: { color: '#0ea5e9', label: 'BIOGEOQUÍMICA & AGUA', bg: 'bg-sky-950/30', border: 'border-sky-600/60' },
    policy: { color: '#f59e0b', label: 'POLÍTICAS UE & GOBERNANZA', bg: 'bg-amber-950/30', border: 'border-amber-600/60' },
    languages: { color: '#a855f7', label: 'IDIOMAS & DIPLOMACIA', bg: 'bg-purple-950/30', border: 'border-purple-600/60' }
  };

  const currentBranchStyle = branchStyles[selectedNode.branch];

  // Strategic R&D Focus Areas (Replacing bounties)
  const rdFocusAreas = [
    {
      id: 'rd-1',
      title: 'Modelación GEE en Python para Balance Hídrico',
      branch: 'geophysics',
      demand: '+18% Coincidencia en DACH & Euskadi',
      focus: 'Tecnalia, BC3 & Helmholtz',
      status: 'En Desarrollo Activo'
    },
    {
      id: 'rd-2',
      title: 'Módulo EU Soil Health Directive & Auditoría de Carbono',
      branch: 'policy',
      demand: '+22% Coincidencia en Consultoría UE',
      focus: 'Basque Green Deal & Horizonte Europa',
      status: 'Prioridad Estratégica'
    },
    {
      id: 'rd-3',
      title: 'Certificación Alemán B2 Fachsprache Geodaten',
      branch: 'languages',
      demand: '+25% Plazas Permanentes en Alemania',
      focus: 'Institutos Públicos DACH (§20 AufenthG)',
      status: 'En Preparación'
    }
  ];

  return (
    <div className="space-y-5 text-slate-100 font-sans animate-fadeIn select-none">
      
      {/* =========================================================================
       * 1. HEADER: GRAFO DE CAPACIDADES CIENTÍFICAS (KNOWLEDGE GRAPH)
       * ========================================================================= */}
      <div className="p-5 rounded-2xl bg-[#0f172a]/95 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Network className="h-3.5 w-3.5 text-emerald-400" />
                <span>KNOWLEDGE GRAPH // RED CIENTÍFICA INTERDISCIPLINARIA</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                20 CAPACIDADES VERIFICADAS • DOMINIO SENIOR (4.8/5.0)
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              Grafo de Competencias & Sinergias Metodológicas
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Mapeo de alta fidelidad que demuestra la convergencia real entre Geofísica, Biogeoquímica de Suelos y Políticas Ambientales Europeas. Haz clic en cualquier nodo para consultar su respaldo en el Portafolio.
            </p>
          </div>

          {/* Academic Rank Emblem */}
          <div className="flex items-center gap-3 bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800 shrink-0">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[9px] text-slate-400 font-mono font-bold uppercase">PERFIL ACADÉMICO</div>
              <div className="text-xs font-bold text-white">DOBLE M.SC. & LIC. GEOFÍSICA</div>
              <div className="text-[9px] text-emerald-400 font-mono">CAU Kiel • AMU Poznań • U. de Chile</div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
       * 2. MAIN STAGE: SCIENTIFIC KNOWLEDGE GRAPH & CAPABILITY INSPECTOR
       * ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT COLUMN: THE KNOWLEDGE GRAPH CANVAS (8 COLS) */}
        <div className="lg:col-span-8 p-4 rounded-2xl bg-[#0f172a]/95 border border-slate-800 shadow-xl relative overflow-hidden">
          
          {/* Discipline Legend Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5 mb-2.5 text-[10px] font-mono">
            <span className="text-slate-400 font-bold uppercase">4 DOMINIOS CIENTÍFICOS:</span>
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Geofísica & GIS</span>
              </span>
              <span className="flex items-center gap-1.5 text-sky-400 font-medium">
                <span className="h-2 w-2 rounded-full bg-sky-400" />
                <span>Biogeoquímica & Agua</span>
              </span>
              <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span>Políticas UE</span>
              </span>
              <span className="flex items-center gap-1.5 text-purple-400 font-medium">
                <span className="h-2 w-2 rounded-full bg-purple-400" />
                <span>Idiomas & Medios</span>
              </span>
            </div>
          </div>

          {/* SVG Scientific Knowledge Graph */}
          <div className="relative w-full overflow-x-auto">
            <svg 
              viewBox="0 0 740 340" 
              className="w-full min-w-[650px] h-auto select-none"
            >
              <defs>
                <radialGradient id="centerAura" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
                  <stop offset="60%" stopColor="#0ea5e9" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                </radialGradient>
                <pattern id="cleanGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeOpacity="0.5" />
                </pattern>
              </defs>

              {/* Clean Background Grid */}
              <rect x="0" y="0" width="740" height="340" fill="url(#cleanGrid)" />

              {/* Central Core Ambient Glow */}
              <circle cx="370" cy="175" r="70" fill="url(#centerAura)" />

              {/* Subtle Concentric Alignment Rings */}
              <circle cx="370" cy="175" r="80" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
              <circle cx="370" cy="175" r="160" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
              <circle cx="370" cy="175" r="240" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 6" opacity="0.3" />

              {/* -------------------------------------------------------------
               * CROSS-DOMAIN SYNERGY LINES (GENUINE INTERDISCIPLINARY BRIDGES)
               * ------------------------------------------------------------- */}
              {/* Synergy 1: Satellite Observation (Geophys) -> Carbon Modeling (Biogeo) */}
              <path d="M 115 75 Q 280 40 450 130" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 3" opacity="0.35" />
              
              {/* Synergy 2: GHG Emission Fluxes (Biogeo) -> EU Soil Directive (Policy) */}
              <path d="M 555 85 Q 400 200 115 275" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 3" opacity="0.35" />

              {/* Synergy 3: English C1 (Languages) -> Bonn/Oslo Conferences (Policy) */}
              <path d="M 555 265 Q 420 280 290 220" fill="none" stroke="#a855f7" strokeWidth="1" strokeDasharray="4 3" opacity="0.35" />

              {/* -------------------------------------------------------------
               * MAIN DOMAIN HUB TRUNKS (FROM CORE TO HUBS)
               * ------------------------------------------------------------- */}
              {/* Branch 1 to Top-Left: Geophysics (Emerald) */}
              <path d="M 370 175 Q 320 145 290 130" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.75" />
              <path d="M 290 130 L 215 140 L 185 85 L 115 75 L 65 40" fill="none" stroke="#10b981" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.7" />

              {/* Branch 2 to Top-Right: Biogeochemistry (Cyan) */}
              <path d="M 370 175 Q 420 145 450 130" fill="none" stroke="#0ea5e9" strokeWidth="2" opacity="0.75" />
              <path d="M 450 130 L 525 140 L 555 85 L 625 75 L 675 40" fill="none" stroke="#0ea5e9" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.7" />

              {/* Branch 3 to Bottom-Left: Policy (Amber) */}
              <path d="M 370 175 Q 320 205 290 220" fill="none" stroke="#f59e0b" strokeWidth="2" opacity="0.75" />
              <path d="M 290 220 L 215 210 L 185 265 L 115 275 L 65 310" fill="none" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.7" />

              {/* Branch 4 to Bottom-Right: Languages (Purple) */}
              <path d="M 370 175 Q 420 205 450 220" fill="none" stroke="#a855f7" strokeWidth="2" opacity="0.75" />
              <path d="M 450 220 L 525 210 L 555 265 L 625 275 L 675 310" fill="none" stroke="#a855f7" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.7" />

              {/* -------------------------------------------------------------
               * CENTER TRUNK HUB: DANIEL SANTANDER // SCIENTIFIC CORE
               * ------------------------------------------------------------- */}
              <g className="cursor-pointer group" onClick={() => setSelectedNodeId('n1-gee')}>
                <circle cx="370" cy="175" r="26" fill="#091322" stroke="#38bdf8" strokeWidth="2" />
                <circle cx="370" cy="175" r="31" fill="none" stroke="#64748b" strokeWidth="0.8" strokeDasharray="3 3" />
                <circle cx="370" cy="175" r="3.5" fill="#38bdf8" />
                <text x="370" y="172" fill="#ffffff" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
                  D. SANTANDER
                </text>
                <text x="370" y="183" fill="#94a3b8" fontSize="6" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                  SCIENTIFIC CORE
                </text>
              </g>

              {/* -------------------------------------------------------------
               * KNOWLEDGE GRAPH NODES RENDERING
               * ------------------------------------------------------------- */}
              {nodes.map(node => {
                const isSelected = selectedNodeId === node.id;
                const strokeColor = 
                  node.branch === 'geophysics' ? '#10b981' :
                  node.branch === 'biogeo' ? '#0ea5e9' :
                  node.branch === 'policy' ? '#f59e0b' : '#a855f7';

                return (
                  <g 
                    key={node.id} 
                    className="cursor-pointer group"
                    onClick={() => setSelectedNodeId(node.id)}
                  >
                    {/* Selected Halo Ring */}
                    {isSelected && (
                      <circle 
                        cx={node.cx} 
                        cy={node.cy} 
                        r="16" 
                        fill={strokeColor} 
                        fillOpacity="0.15" 
                        stroke={strokeColor}
                        strokeWidth="1"
                        strokeDasharray="2 2"
                      />
                    )}

                    {/* Node Circle */}
                    <circle 
                      cx={node.cx} 
                      cy={node.cy} 
                      r={isSelected ? "11" : "9"} 
                      fill="#0b1329" 
                      stroke={strokeColor} 
                      strokeWidth={isSelected ? "2" : "1.2"} 
                      className="transition-all"
                    />

                    {/* Inner Core Pip */}
                    <circle 
                      cx={node.cx} 
                      cy={node.cy} 
                      r={node.status === 'MASTERED' ? "3.5" : "2.5"} 
                      fill={strokeColor} 
                    />

                    {/* Floating Node Label */}
                    <text 
                      x={node.cx} 
                      y={node.cy + (node.cy > 175 ? 17 : -12)} 
                      fill={isSelected ? '#ffffff' : '#cbd5e1'} 
                      fontSize="7" 
                      fontWeight="bold" 
                      fontFamily="sans-serif" 
                      textAnchor="middle"
                      className="group-hover:fill-white transition"
                    >
                      {node.shortName}
                    </text>
                    <text 
                      x={node.cx} 
                      y={node.cy + (node.cy > 175 ? 24 : -5)} 
                      fill={strokeColor} 
                      fontSize="6" 
                      fontFamily="monospace" 
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      Nvl {node.level}/5
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* RIGHT COLUMN: TECHNICAL CAPABILITY INSPECTOR (4 COLS) */}
        <div className="lg:col-span-4 space-y-3.5">
          
          {/* Main Selected Capability Inspector Card */}
          <div className={`p-4 rounded-2xl border shadow-xl relative ${currentBranchStyle.bg} ${currentBranchStyle.border}`}>
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-2 mb-2.5">
              <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-slate-300">
                FICHA TÉCNICA DE COMPETENCIA
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-900 text-white border border-slate-700">
                ID: {selectedNode.id}
              </span>
            </div>

            <div className="space-y-2.5">
              <div>
                <div className="text-[8.5px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  {currentBranchStyle.label}
                </div>
                <h3 className="text-sm font-bold text-white tracking-tight mt-0.5">
                  {selectedNode.name}
                </h3>
              </div>

              {/* Proficiency Gauge */}
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-mono">Nivel de Dominio:</span>
                  <span className="text-emerald-400 font-mono font-bold">{selectedNode.level} de {selectedNode.maxLevel} (Avanzado)</span>
                </div>
                {/* 5 Pip Progress Bar */}
                <div className="grid grid-cols-5 gap-1.5 h-1.5 w-full bg-slate-900 rounded-full p-0.5 border border-slate-800">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-full rounded-full ${
                        i < selectedNode.level 
                          ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.4)]' 
                          : 'bg-slate-800'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono pt-0.5">
                  <span>Horas de Vuelo & Respaldo:</span>
                  <span className="text-white font-medium">{selectedNode.xp} XP</span>
                </div>
              </div>

              {/* Technical Description */}
              <div className="text-[11px] text-slate-300 leading-relaxed font-sans">
                {selectedNode.description}
              </div>

              {/* Evidence Link to Portafolio App */}
              <div className="pt-2 border-t border-slate-700/80 space-y-1.5">
                <div className="text-[9.5px] font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-sky-400" />
                  <span>RESPALDO AUDITADO EN PORTAFOLIO</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between group">
                  <div className="overflow-hidden">
                    <div className="text-[11px] font-bold text-white truncate">
                      {selectedNode.evidenceTitle}
                    </div>
                    <div className="text-[9px] text-slate-400 font-mono">
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
          </div>

          {/* Strategic R&D Focus Areas Card */}
          <div className="p-3.5 rounded-2xl bg-[#0f172a]/95 border border-slate-800 shadow-xl space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="text-[11px] font-bold uppercase text-slate-200 flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-sky-400" />
                <span>DEMANDA EN CENTROS I+D (DACH & EUSKADI)</span>
              </span>
              <span className="text-[9px] font-mono text-emerald-400 font-bold">
                {offers.length} OFERTAS ACTIVAS
              </span>
            </div>

            <p className="text-[10px] text-slate-400 leading-snug">
              Líneas de investigación y tecnologías prioritarias identificadas en el mercado:
            </p>

            <div className="space-y-1.5">
              {rdFocusAreas.map(item => (
                <div 
                  key={item.id} 
                  className="p-2 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-slate-700 transition space-y-0.5"
                >
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="text-sky-400 font-medium">{item.focus}</span>
                    <span className="text-emerald-400 font-mono font-bold">{item.demand}</span>
                  </div>
                  <div className="text-[11px] font-semibold text-white line-clamp-1">{item.title}</div>
                  <div className="text-[8.5px] text-slate-400 font-mono">{item.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
