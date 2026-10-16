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
      cx: 290,
      cy: 135,
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
      cx: 215,
      cy: 145,
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
      cx: 185,
      cy: 90,
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
      cx: 115,
      cy: 80,
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
      cx: 65,
      cy: 45,
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
      cx: 450,
      cy: 135,
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
      cx: 525,
      cy: 145,
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
      cx: 555,
      cy: 90,
      description: 'Medición de cámaras de flujo in-situ y calibración de balances biogeoquímicos.',
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
      cy: 80,
      description: 'Análisis de textura, retención de humedad, carbono orgánico total e impedancia eléctrica de suelos.',
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
      cy: 45,
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
      shortName: 'Congreso Nac.',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      branch: 'policy',
      xp: 1000,
      cx: 290,
      cy: 235,
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
      cy: 225,
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
      cy: 280,
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
      cy: 290,
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
      cx: 65,
      cy: 325,
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
      cx: 450,
      cy: 235,
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
      cx: 525,
      cy: 225,
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
      cx: 555,
      cy: 280,
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
      cx: 625,
      cy: 290,
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
      cx: 675,
      cy: 325,
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
    <div className="space-y-4 text-slate-100 font-mono animate-fadeIn select-none">
      
      {/* =========================================================================
       * 1. HEADER HUD: COMPACT CONSTELLATION OVERVIEW & OPERATOR LEVEL
       * ========================================================================= */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#060c18] via-[#091424] to-[#040811] border border-slate-700/80 shadow-xl relative overflow-hidden">
        {/* Subtle grid watermark */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-10" 
          style={{
            backgroundImage: `linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                <Zap className="h-3 w-3 text-emerald-400 animate-pulse" />
                <span>CONSTELLATION MAP // GRAFO NEURONAL DE COMPETENCIAS</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                20 NODOS VERIFICADOS • AFINIDAD: <strong className="text-emerald-400">96% ATS</strong>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white font-sans uppercase tracking-tight">
              ÁRBOL DE HABILIDADES & EVIDENCIA COMPROBADA
            </h1>
            <p className="text-[11px] text-slate-300 font-sans mt-0.5 max-w-2xl leading-relaxed">
              Cada nodo representa una capacidad científica demostrada e interconectada directamente con tu Portafolio verificado. Haz clic en cualquier nodo para inspeccionar sus pruebas documentales.
            </p>
          </div>

          {/* Compact Level 50 Operator Badge */}
          <div className="flex items-center gap-3 bg-slate-950/90 px-3 py-2 rounded-xl border border-slate-800 shrink-0">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 font-black text-base shadow-[0_0_12px_rgba(16,185,129,0.3)]">
              50
            </div>
            <div>
              <div className="text-[9px] text-slate-400 font-bold uppercase">RANGO DE OPERADOR</div>
              <div className="text-xs font-black text-white font-sans">ELITE SCIENTIST</div>
              <div className="text-[8px] text-emerald-400 font-mono">18.500 / 18.500 XP</div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
       * 2. INTERACTIVE SVG CONSTELLATION GRAPH & NODE INSPECTOR (MAIN STAGE)
       * ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* LEFT COLUMN: THE CONSTELLATION CANVAS (8 COLS) */}
        <div className="lg:col-span-8 p-3 rounded-2xl bg-[#070c17]/95 border border-slate-700/80 shadow-2xl relative overflow-hidden">
          
          {/* Branch Legend Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2 mb-2 text-[9px] font-mono">
            <span className="text-slate-400 font-bold uppercase">4 CUADRANTES DE DOMINIO:</span>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Geofísica & GIS</span>
              </span>
              <span className="flex items-center gap-1 text-sky-400 font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                <span>Biogeoquímica & Suelos</span>
              </span>
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                <span>Políticas UE</span>
              </span>
              <span className="flex items-center gap-1 text-purple-400 font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                <span>Idiomas & Medios</span>
              </span>
            </div>
          </div>

          {/* SVG Constellation Canvas (Compact 740x370 format with advanced sci-fi aesthetics) */}
          <div className="relative w-full overflow-x-auto">
            <svg 
              viewBox="0 0 740 370" 
              className="w-full min-w-[650px] h-auto select-none drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]"
            >
              <defs>
                <filter id="neonGlowEmerald" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="neonGlowSky" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="neonGlowAmber" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="neonGlowPurple" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <radialGradient id="trunkGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                </radialGradient>
                <pattern id="constellationGrid" width="16" height="16" patternUnits="userSpaceOnUse">
                  <circle cx="8" cy="8" r="0.6" fill="#334155" opacity="0.4" />
                </pattern>
              </defs>

              {/* Background Matrix Dot Pattern */}
              <rect x="0" y="0" width="740" height="370" fill="url(#constellationGrid)" />

              {/* Background Concentric Radar Guidance Rings centered at (370, 185) */}
              <circle cx="370" cy="185" r="75" fill="none" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5" />
              <circle cx="370" cy="185" r="150" fill="none" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.4" />
              <circle cx="370" cy="185" r="230" fill="none" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="3 5" opacity="0.3" />
              <circle cx="370" cy="185" r="310" fill="none" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="2 6" opacity="0.2" />

              {/* Radial Cardinal Axis Lines */}
              <line x1="60" y1="185" x2="680" y2="185" stroke="#1e293b" strokeWidth="0.7" strokeDasharray="5 5" opacity="0.4" />
              <line x1="370" y1="20" x2="370" y2="350" stroke="#1e293b" strokeWidth="0.7" strokeDasharray="5 5" opacity="0.4" />

              {/* Radar Degree Angle Markers */}
              <text x="370" y="16" fill="#475569" fontSize="6.5" fontFamily="monospace" textAnchor="middle">000° NORTH</text>
              <text x="730" y="188" fill="#475569" fontSize="6.5" fontFamily="monospace" textAnchor="end">090° EAST</text>
              <text x="370" y="362" fill="#475569" fontSize="6.5" fontFamily="monospace" textAnchor="middle">180° SOUTH</text>
              <text x="12" y="188" fill="#475569" fontSize="6.5" fontFamily="monospace">270° WEST</text>

              {/* Central Trunk Glow Aura */}
              <circle cx="370" cy="185" r="60" fill="url(#trunkGlow)" />

              {/* -------------------------------------------------------------
               * 4 MAIN BRANCHING CIRCUIT TRUNKS (COMPACT BEZIER CURVES)
               * ------------------------------------------------------------- */}
              {/* Branch 1 to Top-Left: Geophysics (Emerald) */}
              <path d="M 370 185 Q 325 155 290 135" fill="none" stroke="#10b981" strokeWidth="2.5" opacity="0.8" />
              <path d="M 290 135 L 215 145 L 185 90 L 115 80 L 65 45" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.85" />

              {/* Branch 2 to Top-Right: Biogeochemistry (Cyan) */}
              <path d="M 370 185 Q 415 155 450 135" fill="none" stroke="#0ea5e9" strokeWidth="2.5" opacity="0.8" />
              <path d="M 450 135 L 525 145 L 555 90 L 625 80 L 675 45" fill="none" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.85" />

              {/* Branch 3 to Bottom-Left: Policy (Amber) */}
              <path d="M 370 185 Q 325 215 290 235" fill="none" stroke="#f59e0b" strokeWidth="2.5" opacity="0.8" />
              <path d="M 290 235 L 215 225 L 185 280 L 115 290 L 65 325" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.85" />

              {/* Branch 4 to Bottom-Right: Diplomacy & Comms (Purple) */}
              <path d="M 370 185 Q 415 215 450 235" fill="none" stroke="#a855f7" strokeWidth="2.5" opacity="0.8" />
              <path d="M 450 235 L 525 225 L 555 280 L 625 290 L 675 325" fill="none" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.85" />

              {/* -------------------------------------------------------------
               * CENTER TRUNK NODE: DANIEL SANTANDER // OPERATIVE CORE
               * ------------------------------------------------------------- */}
              <g className="cursor-pointer group" onClick={() => setSelectedNodeId('n1-gee')}>
                {/* Rotating dashed outer ring */}
                <circle cx="370" cy="185" r="28" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 2" className="animate-spin" />
                <circle cx="370" cy="185" r="23" fill="#091322" stroke="#f59e0b" strokeWidth="2" />
                
                {/* Tech Reticle Crosshair Marks */}
                <line x1="370" y1="156" x2="370" y2="162" stroke="#f59e0b" strokeWidth="1.5" />
                <line x1="370" y1="208" x2="370" y2="214" stroke="#f59e0b" strokeWidth="1.5" />
                <line x1="341" y1="185" x2="347" y2="185" stroke="#f59e0b" strokeWidth="1.5" />
                <line x1="393" y1="185" x2="399" y2="185" stroke="#f59e0b" strokeWidth="1.5" />

                <circle cx="370" cy="185" r="4" fill="#38bdf8" />
                <text x="370" y="181" fill="#ffffff" fontSize="7" fontWeight="black" fontFamily="monospace" textAnchor="middle">
                  CORE
                </text>
                <text x="370" y="193" fill="#f59e0b" fontSize="6.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
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

                const filterUrl = 
                  node.branch === 'geophysics' ? 'url(#neonGlowEmerald)' :
                  node.branch === 'biogeo' ? 'url(#neonGlowSky)' :
                  node.branch === 'policy' ? 'url(#neonGlowAmber)' : 'url(#neonGlowPurple)';

                return (
                  <g 
                    key={node.id} 
                    className="cursor-pointer group"
                    onClick={() => setSelectedNodeId(node.id)}
                  >
                    {/* Animated HUD Targeting Brackets when Selected */}
                    {isSelected && (
                      <g>
                        <circle 
                          cx={node.cx} 
                          cy={node.cy} 
                          r="18" 
                          fill={strokeColor} 
                          fillOpacity="0.2" 
                          className="animate-ping" 
                        />
                        <path 
                          d={`M ${node.cx - 16} ${node.cy - 8} L ${node.cx - 16} ${node.cy - 16} L ${node.cx - 8} ${node.cy - 16}`} 
                          stroke="#38bdf8" 
                          strokeWidth="1.5" 
                          fill="none" 
                        />
                        <path 
                          d={`M ${node.cx + 16} ${node.cy - 8} L ${node.cx + 16} ${node.cy - 16} L ${node.cx + 8} ${node.cy - 16}`} 
                          stroke="#38bdf8" 
                          strokeWidth="1.5" 
                          fill="none" 
                        />
                        <path 
                          d={`M ${node.cx - 16} ${node.cy + 8} L ${node.cx - 16} ${node.cy + 16} L ${node.cx - 8} ${node.cy + 16}`} 
                          stroke="#38bdf8" 
                          strokeWidth="1.5" 
                          fill="none" 
                        />
                        <path 
                          d={`M ${node.cx + 16} ${node.cy + 8} L ${node.cx + 16} ${node.cy + 16} L ${node.cx + 8} ${node.cy + 16}`} 
                          stroke="#38bdf8" 
                          strokeWidth="1.5" 
                          fill="none" 
                        />
                      </g>
                    )}

                    {/* Outer Node Orbit Shell */}
                    <circle 
                      cx={node.cx} 
                      cy={node.cy} 
                      r={isSelected ? "13" : "10"} 
                      fill="#070e1b" 
                      stroke={strokeColor} 
                      strokeWidth={isSelected ? "2" : "1.2"} 
                      filter={isSelected ? filterUrl : undefined}
                      className="transition-all"
                    />

                    {/* Inner Jewel / Pip */}
                    <circle 
                      cx={node.cx} 
                      cy={node.cy} 
                      r={node.status === 'MASTERED' ? "4" : "3"} 
                      fill={strokeColor} 
                    />

                    {/* High-Tech Diamond Glyph for Mastered Nodes */}
                    {node.status === 'MASTERED' && (
                      <polygon 
                        points={`${node.cx},${node.cy - 7} ${node.cx + 7},${node.cy} ${node.cx},${node.cy + 7} ${node.cx - 7},${node.cy}`}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth="0.8"
                        strokeOpacity="0.7"
                      />
                    )}

                    {/* Floating Text Label */}
                    <text 
                      x={node.cx} 
                      y={node.cy + (node.cy > 185 ? 18 : -14)} 
                      fill={isSelected ? '#ffffff' : '#cbd5e1'} 
                      fontSize="7" 
                      fontWeight="bold" 
                      fontFamily="monospace" 
                      textAnchor="middle"
                      className="group-hover:fill-white transition"
                    >
                      {node.shortName}
                    </text>
                    <text 
                      x={node.cx} 
                      y={node.cy + (node.cy > 185 ? 26 : -6)} 
                      fill={strokeColor} 
                      fontSize="6" 
                      fontFamily="monospace" 
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      [L{node.level}]
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE NODE INSPECTOR HUD (4 COLS) */}
        <div className="lg:col-span-4 space-y-3">
          <div className={`p-4 rounded-2xl border shadow-xl relative ${currentBranchStyle.bg} ${currentBranchStyle.border}`}>
            
            {/* Inspector Header */}
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-2 mb-2.5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-300">
                INSPECTOR DE HABILIDAD // TELEMETRÍA
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-black/60 text-white border border-slate-600 font-black">
                ID: {selectedNode.id}
              </span>
            </div>

            <div className="space-y-2.5">
              <div>
                <div className="text-[8.5px] font-bold uppercase tracking-widest text-slate-400 font-mono">
                  {currentBranchStyle.label}
                </div>
                <h3 className="text-sm font-black text-white font-sans tracking-tight mt-0.5">
                  {selectedNode.name}
                </h3>
              </div>

              {/* Mastery Level & XP Gauge */}
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-mono font-bold">NIVEL DE DOMINIO:</span>
                  <span className="text-emerald-400 font-mono font-black">{selectedNode.level} / {selectedNode.maxLevel}</span>
                </div>
                {/* 5 Pip Meter */}
                <div className="grid grid-cols-5 gap-1.5 h-1.5 w-full bg-slate-900 rounded-full p-0.5 border border-slate-800">
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
                <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono pt-0.5">
                  <span>EXPERIENCIA ACUMULADA:</span>
                  <span className="text-white font-bold">{selectedNode.xp} XP</span>
                </div>
              </div>

              {/* Technical Description */}
              <div className="text-[11px] text-slate-200 font-sans leading-relaxed">
                {selectedNode.description}
              </div>

              {/* Evidence Link to Portafolio App */}
              <div className="pt-2 border-t border-slate-700/80 space-y-1">
                <div className="text-[9px] font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
                  <Award className="h-3 w-3 text-amber-400" />
                  <span>RESPALDO EN PORTAFOLIO VERIFICADO</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between group">
                  <div className="overflow-hidden">
                    <div className="text-[11px] font-bold text-white truncate font-sans">
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

          {/* Active Training Bounties HUD */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="text-[11px] font-bold uppercase text-amber-400 flex items-center gap-1.5">
                <Target className="h-3 w-3" />
                <span>BOUNTIES // MISIONES DE CALIBRACIÓN</span>
              </span>
              <span className="text-[9px] font-mono text-emerald-400 font-bold">
                {offers.length} OFERTAS
              </span>
            </div>

            <p className="text-[10px] text-slate-300 font-sans leading-snug">
              Misiones para cerrar brechas de radar y aumentar afinidad en DACH y Euskadi:
            </p>

            <div className="space-y-1.5">
              {activeBounties.map(b => (
                <div 
                  key={b.id} 
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/80 transition space-y-1 cursor-pointer"
                >
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="text-amber-400 font-bold">{b.status}</span>
                    <span className="text-emerald-400 font-mono font-bold">{b.xp}</span>
                  </div>
                  <div className="text-[11px] font-bold text-white font-sans line-clamp-1">{b.title}</div>
                  <div className="text-[9px] text-sky-300 font-mono">{b.boost}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
