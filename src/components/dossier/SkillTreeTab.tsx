import React, { useState } from 'react';
import { 
  Zap, 
  Target, 
  TrendingUp 
} from 'lucide-react';
import { getStoredOffers } from '../../services/db';

interface SkillNode {
  id: string;
  name: string;
  level: number; // 1 to 5
  maxLevel: 5;
  status: 'MASTERED' | 'ACTIVE' | 'IN_TRAINING' | 'LOCKED';
  category: 'geophysics' | 'biogeo' | 'policy' | 'languages';
  xp: number;
  description: string;
  associatedProjects: string[];
}

export const SkillTreeTab: React.FC = () => {
  const offers = getStoredOffers();

  // Active branch tab
  const [activeBranch, setActiveBranch] = useState<'all' | 'geophysics' | 'biogeo' | 'policy' | 'languages'>('all');

  const skills: SkillNode[] = [
    // Branch 1: Geofísica & Teledetección
    {
      id: 'sk-1',
      name: 'Modelación Geoespacial (R & Python)',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      category: 'geophysics',
      xp: 1000,
      description: 'Automatización de análisis espacial, raster, vector y series de tiempo geoestadísticas.',
      associatedProjects: ['Smart Food Parks', 'Turberas de Polonia']
    },
    {
      id: 'sk-2',
      name: 'Google Earth Engine & Sentinel-2',
      level: 4,
      maxLevel: 5,
      status: 'ACTIVE',
      category: 'geophysics',
      xp: 850,
      description: 'Procesamiento en la nube de índices de vegetación (NDVI, NDWI) y humedad de suelo.',
      associatedProjects: ['Teledetección CAU Kiel', 'Maule Satelital']
    },
    {
      id: 'sk-3',
      name: 'Sondajes Geoeléctricos & Sísmica',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      category: 'geophysics',
      xp: 1000,
      description: 'Adquisición e inversión de datos geofísicos de resistividad e impedancia de suelos.',
      associatedProjects: ['Licenciatura FCFM U. de Chile']
    },
    {
      id: 'sk-4',
      name: 'Digital Twins Agroambientales',
      level: 3,
      maxLevel: 5,
      status: 'IN_TRAINING',
      category: 'geophysics',
      xp: 600,
      description: 'Integración de modelos hidrológicos continuos con sensores IoT en tiempo real.',
      associatedProjects: ['Smart Food Parks Prototype']
    },

    // Branch 2: Biogeoquímica & Suelos
    {
      id: 'sk-5',
      name: 'Dinámica de Carbono & GEI en Turberas',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      category: 'biogeo',
      xp: 1000,
      description: 'Cálculo de balances de carbono y flujos de CH4/CO2 en ecosistemas templados húmedos.',
      associatedProjects: ['Doble M.Sc. CAU Kiel & Poznań']
    },
    {
      id: 'sk-6',
      name: 'Balances Hidrológicos de Cuencas',
      level: 4,
      maxLevel: 5,
      status: 'ACTIVE',
      category: 'biogeo',
      xp: 880,
      description: 'Modelación de precipitaciones, escorrentía, evapotranspiración y recarga de acuíferos.',
      associatedProjects: ['Lakes Góreckie & Durowskie']
    },
    {
      id: 'sk-7',
      name: 'Análisis de Laboratorio de Suelos',
      level: 4,
      maxLevel: 5,
      status: 'ACTIVE',
      category: 'biogeo',
      xp: 800,
      description: 'Manejo de espectroscopía, textura, pH y conductividad en laboratorios certificados.',
      associatedProjects: ['Laboratorio de Suelos Kiel']
    },

    // Branch 3: Gobernanza & Políticas UE
    {
      id: 'sk-8',
      name: 'Directivas UE (RED II & Taxonomía Verde)',
      level: 4,
      maxLevel: 5,
      status: 'ACTIVE',
      category: 'policy',
      xp: 850,
      description: 'Evaluación de criterios de sostenibilidad para biomasa y proyectos de rewilding.',
      associatedProjects: ['Environmental Paper Network (EPN)']
    },
    {
      id: 'sk-9',
      name: 'Asesoría Parlamentaria & Gestión de Riesgo',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      category: 'policy',
      xp: 1000,
      description: 'Defensa de evidencia científica ante comisiones parlamentarias y tomadores de decisión.',
      associatedProjects: ['Comisión Emergencia Congreso Nacional']
    },
    {
      id: 'sk-10',
      name: 'EU Soil Monitoring Law (Directiva 2024)',
      level: 3,
      maxLevel: 5,
      status: 'IN_TRAINING',
      category: 'policy',
      xp: 550,
      description: 'Adaptación de planes territoriales al nuevo marco legal europeo de salud del suelo.',
      associatedProjects: ['Policy Briefs 2026']
    },

    // Branch 4: Idiomas & Comunicación
    {
      id: 'sk-11',
      name: 'Español (C2 Nativo / Oratoria de Impacto)',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      category: 'languages',
      xp: 1000,
      description: 'Redacción académica de excelencia, vocería pública y dirección editorial (+700k).',
      associatedProjects: ['Primera Línea Prensa', 'Congreso Nacional']
    },
    {
      id: 'sk-12',
      name: 'Inglés Profesional Científico (C1 CEMS)',
      level: 5,
      maxLevel: 5,
      status: 'MASTERED',
      category: 'languages',
      xp: 950,
      description: 'Ponencias en foros de Bonn y Oslo, redacción de informes internacionales en inglés.',
      associatedProjects: ['Conferencias Internacionales', 'EPN']
    },
    {
      id: 'sk-13',
      name: 'Alemán (§20 AufenthG / B1→B2)',
      level: 3,
      maxLevel: 5,
      status: 'IN_TRAINING',
      category: 'languages',
      xp: 620,
      description: 'Capacidad de interacción técnica en institutos alemanes (Kiel, Helmholtz, Potsdam).',
      associatedProjects: ['Residencia Académica en Alemania']
    }
  ];

  const filteredSkills = activeBranch === 'all' 
    ? skills 
    : skills.filter(s => s.category === activeBranch);

  // Misiones Secundarias / Bounties detectadas a partir de la demanda del Radar
  const activeBounties = [
    {
      id: 'bounty-1',
      title: 'Validación Avanzada en Google Earth Engine (Python API)',
      rewardXP: '+250 XP',
      matchBoost: '+18% Coincidencia en DACH & Euskadi',
      reason: 'El 42% de las vacantes en BC3 y Helmholtz valoran procesamiento satelital automatizado.',
      status: 'EN CURSO',
      deadline: '7 Días'
    },
    {
      id: 'bounty-2',
      title: 'Módulo EU Soil Health Directive & Carbon Removal Certification',
      rewardXP: '+300 XP',
      matchBoost: '+22% Coincidencia en Consultoría UE',
      reason: 'Creciente demanda en licitaciones del Basque Green Deal y programas Horizonte Europa.',
      status: 'DISPONIBLE',
      deadline: '14 Días'
    },
    {
      id: 'bounty-3',
      title: 'Insignia Lebenslauf Deutsch B2 (Fachsprache Umwelt)',
      rewardXP: '+400 XP',
      matchBoost: '+25% Coincidencia en Institutos Públicos Alemanes',
      reason: 'Requisito para plazas de carrera científica permanente en el sistema DACH.',
      status: 'DISPONIBLE',
      deadline: '30 Días'
    }
  ];

  return (
    <div className="space-y-6 text-slate-100 font-mono animate-fadeIn">
      {/* Top Banner: Skill Tree Overview */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0d1627] via-[#0b1424] to-[#0d1627] border border-slate-700/80 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-bold uppercase tracking-widest text-emerald-400 mb-1">
            <Zap className="h-4 w-4 text-emerald-400 animate-pulse" />
            <span>SKILL TREE // ÁRBOL DE HABILIDADES & PERFECCIONAMIENTO</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">
              NIVEL 50 ALCANZADO
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-sans uppercase tracking-tight">
            ARQUITECTURA DE COMPETENCIAS DEL OPERADOR
          </h2>
          <p className="text-xs text-slate-300 font-sans mt-0.5">
            Evoluciona tu perfil hacia la máxima competitividad europea mediante calibración continua frente a {offers.length} vacantes activas.
          </p>
        </div>

        {/* Global Competency Gauge */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
          <div className="h-10 w-10 rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black text-sm">
            96%
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">COMPETENCIA GENERAL</div>
            <div className="text-xs font-bold text-white">CIENTÍFICO DE ÉLITE</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Branches (Left 8 Cols) + Active Bounties (Right 4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* =========================================================
         * LEFT: SKILL BRANCHES & NODES (8 COLS)
         * ========================================================= */}
        <div className="lg:col-span-8 space-y-4">
          {/* Branch Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-950 rounded-xl border border-slate-800">
            {[
              { id: 'all', label: 'TODAS LAS RAMAS' },
              { id: 'geophysics', label: '🛰️ GEOFÍSICA & GIS' },
              { id: 'biogeo', label: '🌿 BIOGEOQUÍMICA & SUELOS' },
              { id: 'policy', label: '🏛️ POLÍTICAS UE' },
              { id: 'languages', label: '🌐 IDIOMAS' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveBranch(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeBranch === tab.id
                    ? 'bg-emerald-600 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Skill Nodes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredSkills.map(skill => {
              const isMastered = skill.status === 'MASTERED';
              const inTraining = skill.status === 'IN_TRAINING';
              return (
                <div
                  key={skill.id}
                  className={`p-4 rounded-xl border transition relative overflow-hidden flex flex-col justify-between ${
                    isMastered
                      ? 'bg-slate-900/95 border-emerald-500/70 shadow-md'
                      : inTraining
                      ? 'bg-slate-900/90 border-amber-500/70 shadow-md'
                      : 'bg-slate-900/90 border-sky-500/70 shadow-md'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white font-sans">
                        {skill.name}
                      </span>
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border uppercase ${
                        isMastered
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                          : inTraining
                          ? 'bg-amber-950 text-amber-300 border-amber-700'
                          : 'bg-sky-950 text-sky-300 border-sky-700'
                      }`}>
                        {skill.status === 'MASTERED' ? 'MAESTRÍA' : skill.status === 'IN_TRAINING' ? 'EN MEJORA' : 'ACTIVO'}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 font-sans leading-relaxed mb-3">
                      {skill.description}
                    </p>
                  </div>

                  <div>
                    {/* Mastery Level Pips */}
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span>NIVEL {skill.level} / {skill.maxLevel}</span>
                      <span className="text-emerald-400 font-bold">{skill.xp} XP</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1 h-1.5 w-full bg-slate-950 rounded-full p-0.5 border border-slate-800 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-full rounded-full ${
                            i < skill.level 
                              ? isMastered ? 'bg-emerald-400' : 'bg-amber-400'
                              : 'bg-slate-800'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="text-[9px] text-slate-400 font-mono truncate">
                      Evidencia: {skill.associatedProjects.join(' • ')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================================
         * RIGHT: BOUNTIES & TRAINING MISSIONS (4 COLS)
         * ========================================================= */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-700 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase text-amber-400 flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5" />
                <span>MISIONES DE ENTRENAMIENTO (BOUNTIES)</span>
              </span>
              <span className="text-[10px] text-slate-400">EN VIVO</span>
            </div>

            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              Misiones sugeridas para cerrar brechas específicas detectadas en las {offers.length} vacantes del radar y elevar la afinidad:
            </p>

            <div className="space-y-3">
              {activeBounties.map(bounty => (
                <div
                  key={bounty.id}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/80 transition space-y-2 group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                      {bounty.status}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400">
                      {bounty.rewardXP}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition">
                    {bounty.title}
                  </h4>

                  <p className="text-[10px] text-slate-300 font-sans leading-relaxed">
                    {bounty.reason}
                  </p>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                    <span className="text-sky-300 font-bold">{bounty.matchBoost}</span>
                    <span className="text-slate-500">{bounty.deadline}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Strategic Career Outlook Note */}
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-[10px] text-slate-300 space-y-1">
              <div className="text-emerald-400 font-bold uppercase flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span>TRANSICIÓN ESTRATÉGICA A 24 MESES</span>
              </div>
              <p className="font-sans leading-snug">
                El completamiento de estas 3 misiones consolida el perfil para la solicitud directa de <strong>Nacionalidad Española (Ley 14)</strong> o <strong>Niederlassungserlaubnis (Alemania)</strong> con cero fricción burocrática.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
