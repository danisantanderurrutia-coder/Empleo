import React, { useState } from 'react';
import { 
  Zap, 
  Target, 
  ExternalLink,
  Award
} from 'lucide-react';
import { getStoredOffers } from '../../services/db';

interface ConstellationNode {
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

  // Selected node for interactive inspector HUD
  const [selectedNodeId, setSelectedNodeId] = useState<string>('n1-gee');

  const nodes: ConstellationNode[] = [
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
      cx: 330,
      cy: 220,
      description: 'Automatización de pipelines espaciales, análisis estadístico y series temporales biofísicas.',
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
      cx: 240,
      cy: 230,
      description: 'Sondajes geoeléctricos, gravimetría y procesamiento de señales de subsuelo en la U. de Chile.',
      evidenceTitle: 'Lámina 007: Licenciatura en Geofísica (Distinción)',
      evidenceAnchor: '#titulaciones-academicas'
    },
    {
      id: 'n1-qgis',
      name: 'QGIS Avanzado & Cartografía Táctica',
      shortName: 'QGIS Vector',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'geophysics',
      xp: 980,
      cx: 220,
      cy: 145,
      description: 'Integración multicriterio de coberturas de suelo, pendientes, cuencas hidrográficas y riesgo de fuego.',
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
      cx: 140,
      cy: 130,
      description: 'Monitoreo multiespectral de reflectancia de dosel, estrés hídrico de vegetación e incendios.',
      evidenceTitle: 'Lámina 002: Sensores de Laboratorio & Teledetección',
      evidenceAnchor: '#capacidades-computacionales'
    },
    {
      id: 'n1-gee',
      name: 'Google Earth Engine (Cloud Analytics)',
      shortName: 'GEE Cloud',
      level: 4,
      maxLevel: 5,
      status: 'ACTIVE',
      branch: 'geophysics',
      xp: 850,
      cx: 90,
      cy: 75,
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
      shortName: 'Carbono Turberas',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'biogeo',
      xp: 1000,
      cx: 590,
      cy: 220,
      description: 'Modelación de sumideros de carbono y balances de gases de efecto invernadero en humedales europeos.',
      evidenceTitle: 'Lámina 001: Dinámica de GEI en Turberas (Polonia/Alemania)',
      evidenceAnchor: '#investigacion-cuantitativa'
    },
    {
      id: 'n2-hydro',
      name: 'Balances Hidrológicos de Cuencas',
      shortName: 'Hidrología Cuencas',
      level: 4,
      maxLevel: 5,
      status: 'ACTIVE',
      branch: 'biogeo',
      xp: 890,
      cx: 680,
      cy: 230,
      description: 'Modelación de flujos de escorrentía, evapotranspiración y recarga de acuíferos templados.',
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
      cx: 700,
      cy: 145,
      description: 'Medición de cámaras de flujo in-situ y calibración de balances biogeoquímicos.',
      evidenceTitle: 'Lámina 001: Modelación Cuantitativa CAU Kiel',
      evidenceAnchor: '#investigacion-cuantitativa'
    },
    {
      id: 'n2-soil-lab',
      name: 'Sensores e Instrumentación de Suelos',
      shortName: 'Lab de Suelos',
      level: 4,
      maxLevel: 5,
      status: 'ACTIVE',
      branch: 'biogeo',
      xp: 820,
      cx: 780,
      cy: 130,
      description: 'Análisis de textura, retención de humedad, carbono orgánico total e impedancia eléctrica de suelos.',
      evidenceTitle: 'Lámina 002: Laboratorio de Suelos CAU Kiel',
      evidenceAnchor: '#capacidades-computacionales'
    },
    {
      id: 'n2-water-quality',
      name: 'Ecología Lacustre & Eutrofización',
      shortName: 'Calidad del Agua',
      level: 4,
      maxLevel: 5,
      status: 'ACTIVE',
      branch: 'biogeo',
      xp: 840,
      cx: 830,
      cy: 75,
      description: 'Diagnóstico biogeoquímico de fósforo, nitrógeno y dinámica trófica en cuencas de captación.',
      evidenceTitle: 'Lámina 001: Ecosistemas Acuáticos Poznań',
      evidenceAnchor: '#investigacion-cuantitativa'
    },

    // -------------------------------------------------------------
    // RAMA 3: POLÍTICAS UE & GOBERNANZA (AMBER, BOTTOM-LEFT)
    // -------------------------------------------------------------
    {
      id: 'n3-congreso',
      name: 'Asesoría Parlamentaria & Gestión de Riesgo',
      shortName: 'Congreso Nacional',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'policy',
      xp: 1000,
      cx: 330,
      cy: 400,
      description: 'Exposición como perito técnico ante la Comisión de Emergencia y Desastres de la Cámara de Diputados.',
      evidenceTitle: 'Lámina 003: Comparecencia en Cámara de Diputados',
      evidenceAnchor: '#gobernanza-politicas'
    },
    {
      id: 'n3-epn',
      name: 'Directiva RED II & Biomasa Forestal',
      shortName: 'EPN & Bioenergía',
      level: 4,
      maxLevel: 5,
      status: 'ACTIVE',
      branch: 'policy',
      xp: 890,
      cx: 240,
      cy: 390,
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
      cx: 220,
      cy: 475,
      description: 'Diseño de estrategias de regeneración biofísica de cuencas mediterráneas en Aljezur (Portugal).',
      evidenceTitle: 'Lámina 004: Rewilding Aljezur (Portugal)',
      evidenceAnchor: '#publicaciones-tecnicas'
    },
    {
      id: 'n3-soil-law',
      name: 'EU Soil Monitoring Law (Directiva 2024)',
      shortName: 'Directiva Suelos',
      level: 3,
      maxLevel: 5,
      status: 'IN_TRAINING',
      branch: 'policy',
      xp: 650,
      cx: 140,
      cy: 490,
      description: 'Adaptación metodológica de indicadores edáficos a los nuevos estándares de certificación de la UE.',
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
      cx: 90,
      cy: 545,
      description: 'Articulación de estándares ambientales internacionales con comunidades territoriales y bomberos.',
      evidenceTitle: 'Lámina 003: Salvaguardas & Convención Constitucional',
      evidenceAnchor: '#gobernanza-politicas'
    },

    // -------------------------------------------------------------
    // RAMA 4: IDIOMAS & DIPLOMACIA (PURPLE, BOTTOM-RIGHT)
    // -------------------------------------------------------------
    {
      id: 'n4-es',
      name: 'Español Nativo (C2 / Oratoria de Alto Impacto)',
      shortName: 'Español C2',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'languages',
      xp: 1000,
      cx: 590,
      cy: 400,
      description: 'Dominio de oratoria parlamentaria, vocería pública y redacción de informes técnicos de rigor.',
      evidenceTitle: 'Lámina 003: Vocería Técnica Congreso Nacional',
      evidenceAnchor: '#gobernanza-politicas'
    },
    {
      id: 'n4-plp',
      name: 'Dirección Editorial de Medios (+700k)',
      shortName: 'PLP (+700k)',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'languages',
      xp: 1000,
      cx: 680,
      cy: 390,
      description: 'Fundador y director de Primera Línea Prensa: liderazgo editorial y comunicación en tiempo real.',
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
      cx: 700,
      cy: 475,
      description: 'Doble titulación impartida íntegramente en inglés, conferencias en Bonn y redacción para EPN.',
      evidenceTitle: 'Lámina 005: Conferencias Bonn, Oslo y Bogotá',
      evidenceAnchor: '#conferencias-internacionales'
    },
    {
      id: 'n4-de',
      name: 'Alemán (§20 AufenthG / B1→B2)',
      level: 3,
      maxLevel: 5,
      status: 'IN_TRAINING',
      shortName: 'Deutsch B1/B2',
      branch: 'languages',
      xp: 680,
      cx: 780,
      cy: 490,
      description: 'Residencia académica en Kiel, comprensión técnica de normativa ambiental y vida en Alemania.',
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
      cx: 830,
      cy: 545,
      description: 'Participación en cumbres internacionales de justicia climática y articulación intercontinental.',
      evidenceTitle: 'Lámina 005: Foros de Oslo, Bonn y Bogotá',
      evidenceAnchor: '#conferencias-internacionales'
    }
  ];

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  const branchStyles = {
    geophysics: { color: '#10b981', label: 'GEOFÍSICA & SENSORES REMOTOS', bg: 'bg-emerald-950/40', border: 'border-emerald-500' },
    biogeo: { color: '#0ea5e9', label: 'BIOGEOQUÍMICA & AGUA', bg: 'bg-sky-950/40', border: 'border-sky-500' },
    policy: { color: '#f59e0b', label: 'POLÍTICAS UE & GOBERNANZA', bg: 'bg-amber-950/40', border: 'border-amber-500' },
    languages: { color: '#a855f7', label: 'IDIOMAS & DIPLOMACIA', bg: 'bg-purple-950/40', border: 'border-purple-500' }
  };

  const currentBranchStyle = branchStyles[selectedNode.branch];

  // Training Bounties connected to Radar demand
  const activeBounties = [
    {
      id: 'b-1',
      title: 'Despliegue de Algoritmos GEE en Python para Balance Hídrico',
      branch: 'geophysics',
      boost: '+18% Coincidencia en DACH & Euskadi',
      xp: '+250 XP',
      reason: 'El 42% de los institutos (BC3, Tecnalia, Helmholtz) solicitan teledetección continua de suelos.',
      status: 'EN CURSO'
    },
    {
      id: 'b-2',
      title: 'Módulo EU Soil Health Directive & Auditoría de Carbono',
      branch: 'policy',
      boost: '+22% Coincidencia en Consultoría UE',
      xp: '+300 XP',
      reason: 'Creciente demanda en licitaciones del Basque Green Deal y programas Horizonte Europa.',
      status: 'DISPONIBLE'
    },
    {
      id: 'b-3',
      title: 'Sprachdiplom Deutsch B2 (Fachsprache Umwelt & Geodaten)',
      branch: 'languages',
      boost: '+25% Coincidencia en Institutos Públicos Alemanes',
      xp: '+400 XP',
      reason: 'Requisito para plazas de carrera científica permanente bajo §20 AufenthG en Alemania.',
      status: 'DISPONIBLE'
    }
  ];

  return (
    <div className="space-y-6 text-slate-100 font-mono animate-fadeIn select-none">
      
      {/* =========================================================================
       * 1. HEADER HUD: CONSTELLATION OVERVIEW & OPERATOR LEVEL
       * ========================================================================= */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#070d18] via-[#091424] to-[#040811] border border-slate-700 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                <Zap className="h-3 w-3 text-emerald-400 animate-pulse" />
                <span>CONSTELLATION MAP // GRAFO NEURONAL DE COMPETENCIAS</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                TOTAL NODES: 20 // OVERALL PROFICIENCY: 96%
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white font-sans uppercase tracking-tight">
              ÁRBOL DE HABILIDADES & EVIDENCIA COMPROBADA
            </h1>
            <p className="text-xs text-slate-300 font-sans mt-1 max-w-2xl">
              Mapa visual didáctico del Operative Core. Cada nodo está directamente interconectado con un proyecto real verificado de tu Portafolio. Haz clic en cualquier nodo para inspeccionar sus proyectos de soporte.
            </p>
          </div>

          {/* Level 50 Emblem Badge */}
          <div className="flex items-center gap-3 bg-slate-950/90 px-4 py-2.5 rounded-2xl border border-slate-800 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 font-black text-lg shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              50
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">RANGO DE OPERADOR</div>
              <div className="text-sm font-black text-white font-sans">ELITE SCIENTIST</div>
              <div className="text-[9px] text-emerald-400 font-mono">18.500 / 18.500 XP</div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
       * 2. INTERACTIVE SVG CONSTELLATION GRAPH & NODE INSPECTOR (MAIN STAGE)
       * ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: THE CONSTELLATION CANVAS (8 COLS) */}
        <div className="lg:col-span-8 p-4 rounded-3xl bg-[#070c17]/95 border border-slate-700/80 shadow-2xl relative overflow-hidden">
          
          {/* Branch Legend Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-3 text-[10px] font-mono">
            <span className="text-slate-400 font-bold uppercase">4 CUADRANTES DE DOMINIO:</span>
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Geofísica & GIS</span>
              </span>
              <span className="flex items-center gap-1.5 text-sky-400 font-bold">
                <span className="h-2 w-2 rounded-full bg-sky-400" />
                <span>Biogeoquímica & Suelos</span>
              </span>
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span>Políticas UE</span>
              </span>
              <span className="flex items-center gap-1.5 text-purple-400 font-bold">
                <span className="h-2 w-2 rounded-full bg-purple-400" />
                <span>Idiomas & Medios</span>
              </span>
            </div>
          </div>

          {/* SVG Constellation Canvas */}
          <div className="relative w-full overflow-x-auto">
            <svg 
              viewBox="0 0 920 620" 
              className="w-full min-w-[750px] h-auto select-none drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]"
            >
              <defs>
                {/* Background Radar Rings */}
                <radialGradient id="trunkGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                  <stop offset="60%" stopColor="#0ea5e9" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Background Concentric Radar Guidance Rings */}
              <circle cx="460" cy="310" r="120" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
              <circle cx="460" cy="310" r="220" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 5" opacity="0.3" />
              <circle cx="460" cy="310" r="320" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="2 6" opacity="0.2" />

              {/* Central Trunk Glow Aura */}
              <circle cx="460" cy="310" r="85" fill="url(#trunkGlow)" />

              {/* -------------------------------------------------------------
               * 4 MAIN BRANCHING CIRCUIT TRUNKS (BEZIER ARCS FROM CORE)
               * ------------------------------------------------------------- */}
              {/* Branch 1 to Top-Left: Geophysics (Emerald) */}
              <path d="M 460 310 Q 380 260 330 220" fill="none" stroke="#10b981" strokeWidth="3" opacity="0.75" />
              <path d="M 330 220 L 240 230 L 220 145 L 140 130 L 90 75" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="5 3" opacity="0.8" />

              {/* Branch 2 to Top-Right: Biogeochemistry (Cyan) */}
              <path d="M 460 310 Q 540 260 590 220" fill="none" stroke="#0ea5e9" strokeWidth="3" opacity="0.75" />
              <path d="M 590 220 L 680 230 L 700 145 L 780 130 L 830 75" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="5 3" opacity="0.8" />

              {/* Branch 3 to Bottom-Left: Policy (Amber) */}
              <path d="M 460 310 Q 380 360 330 400" fill="none" stroke="#f59e0b" strokeWidth="3" opacity="0.75" />
              <path d="M 330 400 L 240 390 L 220 475 L 140 490 L 90 545" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 3" opacity="0.8" />

              {/* Branch 4 to Bottom-Right: Diplomacy & Comms (Purple) */}
              <path d="M 460 310 Q 540 360 590 400" fill="none" stroke="#a855f7" strokeWidth="3" opacity="0.75" />
              <path d="M 590 400 L 680 390 L 700 475 L 780 490 L 830 545" fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="5 3" opacity="0.8" />

              {/* -------------------------------------------------------------
               * CENTER TRUNK NODE: DANIEL SANTANDER // OPERATIVE CORE
               * ------------------------------------------------------------- */}
              <g className="cursor-pointer" onClick={() => setSelectedNodeId('n1-gee')}>
                <circle cx="460" cy="310" r="32" fill="#0f172a" stroke="#f59e0b" strokeWidth="3" className="animate-pulse" />
                <circle cx="460" cy="310" r="38" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 2" />
                <text x="460" y="306" fill="#ffffff" fontSize="9" fontWeight="black" fontFamily="monospace" textAnchor="middle">
                  OPERATIVE CORE
                </text>
                <text x="460" y="320" fill="#f59e0b" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                  D. SANTANDER
                </text>
              </g>

              {/* -------------------------------------------------------------
               * CONSTELLATION NODES RENDERING
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
                    {/* Glowing Selection Halo */}
                    {isSelected && (
                      <circle 
                        cx={node.cx} 
                        cy={node.cy} 
                        r="22" 
                        fill={strokeColor} 
                        fillOpacity="0.25" 
                        className="animate-ping" 
                      />
                    )}

                    {/* Outer Orbit Ring */}
                    <circle 
                      cx={node.cx} 
                      cy={node.cy} 
                      r={isSelected ? "18" : "15"} 
                      fill="#0b1324" 
                      stroke={strokeColor} 
                      strokeWidth={isSelected ? "2.5" : "1.5"} 
                      className="transition-all"
                    />

                    {/* Inner Core Pip */}
                    <circle 
                      cx={node.cx} 
                      cy={node.cy} 
                      r="5" 
                      fill={strokeColor} 
                    />

                    {/* Node Text Label (Floating) */}
                    <text 
                      x={node.cx} 
                      y={node.cy + 27} 
                      fill={isSelected ? '#ffffff' : '#94a3b8'} 
                      fontSize="8" 
                      fontWeight="bold" 
                      fontFamily="monospace" 
                      textAnchor="middle"
                      className="group-hover:fill-white transition"
                    >
                      {node.shortName}
                    </text>
                    <text 
                      x={node.cx} 
                      y={node.cy + 37} 
                      fill={strokeColor} 
                      fontSize="7" 
                      fontFamily="monospace" 
                      textAnchor="middle"
                    >
                      Lvl {node.level}/5
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE NODE INSPECTOR HUD (4 COLS) */}
        <div className="lg:col-span-4 space-y-4">
          <div className={`p-5 rounded-3xl border shadow-2xl relative ${currentBranchStyle.bg} ${currentBranchStyle.border}`}>
            
            {/* Inspector Header */}
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-3 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                INSPECTOR DE HABILIDAD // TELEMETRÍA
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-black/60 text-white border border-slate-600 font-black">
                ID: {selectedNode.id}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400 font-mono">
                  {currentBranchStyle.label}
                </div>
                <h3 className="text-base font-black text-white font-sans tracking-tight mt-0.5">
                  {selectedNode.name}
                </h3>
              </div>

              {/* Mastery Level & XP Gauge */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono font-bold">NIVEL DE DOMINIO:</span>
                  <span className="text-emerald-400 font-mono font-black">{selectedNode.level} / {selectedNode.maxLevel}</span>
                </div>
                {/* 5 Pip Meter */}
                <div className="grid grid-cols-5 gap-1.5 h-2 w-full bg-slate-900 rounded-full p-0.5 border border-slate-800">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-full rounded-full ${
                        i < selectedNode.level 
                          ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' 
                          : 'bg-slate-800'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono pt-1">
                  <span>EXPERIENCIA ACUMULADA:</span>
                  <span className="text-white font-bold">{selectedNode.xp} XP</span>
                </div>
              </div>

              {/* Technical Description */}
              <div className="text-xs text-slate-200 font-sans leading-relaxed">
                {selectedNode.description}
              </div>

              {/* Evidence Link to Portafolio App */}
              <div className="pt-2 border-t border-slate-700/80 space-y-1.5">
                <div className="text-[10px] font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-amber-400" />
                  <span>RESPALDO EN PORTAFOLIO VERIFICADO</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between group">
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-white truncate font-sans">
                      {selectedNode.evidenceTitle}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Prueba documental & audiovisual
                    </div>
                  </div>
                  <a
                    href={`https://danisantanderurrutia-coder.github.io/Portafolio/${selectedNode.evidenceAnchor}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white transition shrink-0 ml-2 shadow"
                    title="Abrir evidencia en la app Portafolio"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Active Training Bounties HUD */}
          <div className="p-4 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase text-amber-400 flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5" />
                <span>BOUNTIES // MISIONES DE CALIBRACIÓN</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                {offers.length} OFERTAS
              </span>
            </div>

            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              Misiones para cerrar brechas de radar y aumentar afinidad en DACH y Euskadi:
            </p>

            <div className="space-y-2.5">
              {activeBounties.map(b => (
                <div 
                  key={b.id} 
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/80 transition space-y-1.5 cursor-pointer"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-amber-400 font-bold">{b.status}</span>
                    <span className="text-emerald-400 font-mono font-bold">{b.xp}</span>
                  </div>
                  <div className="text-xs font-bold text-white font-sans">{b.title}</div>
                  <div className="text-[10px] text-sky-300 font-mono">{b.boost}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
