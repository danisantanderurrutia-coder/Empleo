import React, { useState } from 'react';
import { Crosshair, Satellite } from 'lucide-react';

interface TacticalGlobeHUDProps {
  onDeploySector?: (sector: string) => void;
}

export const TacticalGlobeHUD: React.FC<TacticalGlobeHUDProps> = ({ onDeploySector }) => {
  const [activeNode, setActiveNode] = useState<'bilbao' | 'kiel' | 'santiago'>('bilbao');

  const nodes = {
    bilbao: {
      name: 'BILBAO TACTICAL HQ',
      region: 'Euskadi / España (Ley 14/2013)',
      coords: '43.2630° N, 2.9350° W',
      targets: '120+ Vacantes • 12 Centros I+D',
      priority: 'OBJETIVO NACIONALIDAD (2 AÑOS)',
      color: '#10b981',
      cx: 175,
      cy: 135
    },
    kiel: {
      name: 'KIEL / BERLIN FORWARD BASE',
      region: 'Alemania (§20 AufenthG)',
      coords: '54.3233° N, 10.1228° E',
      targets: '180+ Vacantes • CAU Kiel / Helmholtz',
      priority: 'VISADO INMEDIATO 18 MESES',
      color: '#0ea5e9',
      cx: 195,
      cy: 110
    },
    santiago: {
      name: 'SANTIAGO CITADEL (ALMA MATER)',
      region: 'Chile (FCFM U. de Chile)',
      coords: '33.4489° S, 70.6693° W',
      targets: 'Convenio Iberoamericano • Geofísica',
      priority: 'PASAPORTE CHILENO DE ORIGEN',
      color: '#f59e0b',
      cx: 110,
      cy: 220
    }
  };

  const currentNode = nodes[activeNode];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-700/80 bg-gradient-to-br from-[#070d18] via-[#0a1426] to-[#040810] p-5 shadow-2xl text-slate-100 font-mono">
      {/* IMF / R6 Tactical Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
        <div className="flex items-center space-x-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-950/80 border border-red-500/50 text-red-400 font-mono text-[10px] font-black tracking-wider uppercase">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
            <span>IMF DATALINK: ACTIVE</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
            SUBNET: SCHENGEN-08 // ENCLVL-2
          </span>
        </div>

        <div className="flex items-center space-x-3 text-[11px]">
          <span className="text-slate-400 font-mono">
            COORD: <strong className="text-emerald-400">{currentNode.coords}</strong>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-sky-400 font-mono flex items-center gap-1">
            <Satellite className="h-3 w-3 text-sky-400 animate-pulse" />
            ORBIT PASS: G74/3
          </span>
        </div>
      </div>

      {/* Main Tactical Grid: Globe Visualizer + Telemetry Callouts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4 items-center">
        {/* Left Column: Interactive Vector Globe (SVG Wireframe with Trajectory Arcs) */}
        <div className="lg:col-span-7 relative flex items-center justify-center p-2 min-h-[290px]">
          {/* Background Radar Rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="w-64 h-64 rounded-full border border-dashed border-emerald-500/40" />
            <div className="w-80 h-80 rounded-full border border-slate-700/60" />
          </div>

          <svg 
            viewBox="0 0 320 280" 
            className="w-full max-w-[340px] h-auto drop-shadow-[0_0_25px_rgba(16,185,129,0.2)] select-none"
          >
            <defs>
              <radialGradient id="globeAtmosphere" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.12" />
                <stop offset="70%" stopColor="#059669" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.7" />
              </radialGradient>
              <linearGradient id="arcChileBilbao" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="1" />
              </linearGradient>
              <linearGradient id="arcBilbaoKiel" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="1" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="1" />
              </linearGradient>
            </defs>

            {/* Globe Sphere Base */}
            <circle cx="160" cy="140" r="110" fill="url(#globeAtmosphere)" stroke="#1e293b" strokeWidth="1.5" />

            {/* Latitude Parallels */}
            <ellipse cx="160" cy="140" rx="110" ry="25" fill="none" stroke="#334155" strokeWidth="0.75" strokeDasharray="3 3" />
            <ellipse cx="160" cy="95" rx="98" ry="18" fill="none" stroke="#334155" strokeWidth="0.75" strokeDasharray="2 3" />
            <ellipse cx="160" cy="185" rx="98" ry="18" fill="none" stroke="#334155" strokeWidth="0.75" strokeDasharray="2 3" />

            {/* Longitude Meridians */}
            <ellipse cx="160" cy="140" rx="40" ry="110" fill="none" stroke="#334155" strokeWidth="0.75" />
            <ellipse cx="160" cy="140" rx="80" ry="110" fill="none" stroke="#334155" strokeWidth="0.75" strokeDasharray="3 3" />
            <line x1="160" y1="30" x2="160" y2="250" stroke="#334155" strokeWidth="1" strokeDasharray="4 2" />

            {/* Orbit Satellite Ring */}
            <ellipse 
              cx="160" 
              cy="140" 
              rx="125" 
              ry="50" 
              fill="none" 
              stroke="#0ea5e9" 
              strokeWidth="0.75" 
              strokeDasharray="6 4"
              transform={`rotate(-25 160 140)`}
              opacity="0.6"
            />

            {/* Geodesic Flight Arcs */}
            {/* Arc 1: Santiago -> Bilbao */}
            <path 
              d="M 110 220 Q 120 160 175 135" 
              fill="none" 
              stroke="url(#arcChileBilbao)" 
              strokeWidth="2.5" 
              strokeDasharray="5 3"
              className="animate-pulse"
            />

            {/* Arc 2: Bilbao -> Kiel */}
            <path 
              d="M 175 135 Q 185 118 195 110" 
              fill="none" 
              stroke="url(#arcBilbaoKiel)" 
              strokeWidth="3" 
            />

            {/* TARGET NODE 1: SANTIAGO (Chile) */}
            <g 
              className="cursor-pointer group" 
              onClick={() => setActiveNode('santiago')}
            >
              <circle cx="110" cy="220" r="8" fill="#f59e0b" fillOpacity="0.2" className="animate-ping" />
              <circle cx="110" cy="220" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
              <text x="50" y="235" fill="#f59e0b" fontSize="8" fontWeight="bold" fontFamily="monospace">
                SANTIAGO [CHL]
              </text>
            </g>

            {/* TARGET NODE 2: BILBAO (Bizkaia HQ) */}
            <g 
              className="cursor-pointer group" 
              onClick={() => setActiveNode('bilbao')}
            >
              <circle cx="175" cy="135" r="12" fill="#10b981" fillOpacity="0.25" className="animate-ping" />
              <circle cx="175" cy="135" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
              {/* Tactical Crosshair over Bilbao */}
              <circle cx="175" cy="135" r="14" fill="none" stroke="#10b981" strokeWidth="0.75" strokeDasharray="3 3" />
              <line x1="175" y1="117" x2="175" y2="153" stroke="#10b981" strokeWidth="0.75" />
              <line x1="157" y1="135" x2="193" y2="135" stroke="#10b981" strokeWidth="0.75" />
              <text x="188" y="140" fill="#34d399" fontSize="9" fontWeight="bold" fontFamily="monospace">
                BILBAO [HQ]
              </text>
            </g>

            {/* TARGET NODE 3: KIEL (Alemania) */}
            <g 
              className="cursor-pointer group" 
              onClick={() => setActiveNode('kiel')}
            >
              <circle cx="195" cy="110" r="9" fill="#0ea5e9" fillOpacity="0.2" className="animate-ping" />
              <circle cx="195" cy="110" r="5" fill="#0ea5e9" stroke="#ffffff" strokeWidth="1.5" />
              <text x="208" y="112" fill="#38bdf8" fontSize="8" fontWeight="bold" fontFamily="monospace">
                KIEL [§20]
              </text>
            </g>

            {/* Coordinate Overlay Box */}
            <rect x="15" y="15" width="90" height="32" rx="4" fill="#0f172a" fillOpacity="0.8" stroke="#334155" strokeWidth="0.75" />
            <text x="22" y="28" fill="#94a3b8" fontSize="7" fontFamily="monospace">TACTICAL SECTOR</text>
            <text x="22" y="40" fill="#f8fafc" fontSize="8" fontWeight="bold" fontFamily="monospace">EU-IBERO GRID</text>
          </svg>
        </div>

        {/* Right Column: Active Node Telemetry & IMF/R6 Mission Target */}
        <div className="lg:col-span-5 space-y-3">
          <div className="p-4 rounded-xl border border-slate-700/80 bg-slate-900/90 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                PUESTO SELECCIONADO
              </span>
              <div className="flex gap-1">
                {(['bilbao', 'kiel', 'santiago'] as const).map(n => (
                  <button
                    key={n}
                    onClick={() => setActiveNode(n)}
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold transition ${
                      activeNode === n
                        ? 'bg-emerald-500 text-slate-950 shadow'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <h3 className="text-base font-black text-white tracking-tight flex items-center gap-1.5 font-sans">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: currentNode.color }} />
              <span>{currentNode.name}</span>
            </h3>

            <div className="text-xs text-slate-300 font-medium">
              {currentNode.region}
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950/90 border border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">OBJETIVOS / CAPACIDAD:</span>
                <span className="text-emerald-400 font-bold">{currentNode.targets}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">VENTAJA TÁCTICA:</span>
                <span className="text-sky-300 font-bold">{currentNode.priority}</span>
              </div>
            </div>

            {onDeploySector && (
              <button
                onClick={() => onDeploySector(activeNode)}
                className="w-full mt-2 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition uppercase tracking-wider"
              >
                <Crosshair className="h-3.5 w-3.5" />
                <span>Desplegar Reconocimiento en este Sector</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
