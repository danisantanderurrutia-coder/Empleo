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

            {/* Clip Path to ensure all landmasses stay within the sphere */}
            <clipPath id="globeSphereClip">
              <circle cx="160" cy="140" r="110" />
            </clipPath>

            {/* Globe Sphere Base */}
            <circle cx="160" cy="140" r="110" fill="url(#globeAtmosphere)" stroke="#1e293b" strokeWidth="1.5" />

            {/* CONTINENT VECTOR LANDMASSES (Holographic IMF World Map) */}
            <g clipPath="url(#globeSphereClip)" className="opacity-90">
              {/* Tactical Continent Fill Pattern & Atmosphere */}
              <g 
                fill="#047857" 
                fillOpacity="0.28" 
                stroke="#10b981" 
                strokeWidth="0.9" 
                strokeOpacity="0.8" 
                strokeLinejoin="round"
                strokeLinecap="round"
              >
                {/* 1. SOUTH AMERICA (Encompassing Santiago node at 110, 220) */}
                <path 
                  d="M 97 162 C 105 158, 122 159, 134 165 C 144 172, 152 184, 149 198 C 145 212, 132 226, 126 235 C 120 243, 116 248, 113 245 C 110 236, 107 222, 105 208 C 101 195, 95 182, 96 172 Z" 
                />

                {/* 2. NORTH AMERICA & CENTRAL AMERICA */}
                <path 
                  d="M 97 162 C 90 155, 76 142, 65 130 C 58 118, 55 100, 60 85 C 52 75, 58 60, 72 58 C 85 52, 105 50, 118 62 C 112 70, 105 72, 110 80 C 120 75, 128 85, 124 94 C 118 106, 112 118, 106 126 C 104 132, 100 138, 97 136 C 92 138, 85 142, 90 152 C 94 156, 96 160, 97 162 Z" 
                />

                {/* GREENLAND */}
                <path 
                  d="M 130 50 C 136 44, 148 46, 150 54 C 151 62, 142 68, 134 66 C 128 62, 126 55, 130 50 Z" 
                />

                {/* 3. EUROPE & SCANDINAVIA (Encompassing Bilbao at 175, 135 and Kiel at 195, 110) */}
                {/* Iberian Peninsula, France & Central Europe */}
                <path 
                  d="M 170 144 C 166 140, 165 134, 168 129 C 172 131, 178 133, 180 128 C 178 122, 176 115, 180 114 C 185 115, 192 113, 195 110 C 196 104, 199 102, 197 108 C 202 112, 212 114, 218 116 C 216 124, 214 132, 210 136 C 204 138, 198 135, 194 132 C 188 136, 182 140, 178 143 C 174 145, 171 146, 170 144 Z" 
                />
                {/* Scandinavia (Norway & Sweden) */}
                <path 
                  d="M 194 95 C 190 85, 193 70, 202 62 C 208 65, 215 75, 212 90 C 206 95, 198 96, 194 95 Z" 
                />
                {/* British Isles */}
                <path 
                  d="M 164 108 C 168 104, 173 108, 172 118 C 170 123, 166 122, 164 116 Z" 
                />
                <path 
                  d="M 158 112 C 161 110, 163 114, 162 119 C 159 121, 157 117, 158 112 Z" 
                />
                {/* Italy Peninsula */}
                <path 
                  d="M 194 132 C 197 136, 201 142, 200 146 C 197 146, 195 140, 192 134 Z" 
                />
                {/* Greece & Aegean */}
                <path 
                  d="M 204 134 C 209 135, 213 140, 211 145 C 207 144, 205 139, 204 134 Z" 
                />

                {/* 4. AFRICA */}
                <path 
                  d="M 172 147 C 185 148, 205 149, 222 152 C 225 156, 228 168, 232 182 C 236 186, 234 195, 228 202 C 224 212, 218 226, 210 238 C 205 246, 198 248, 194 242 C 188 232, 185 215, 182 200 C 175 195, 158 196, 152 185 C 148 175, 155 162, 164 154 C 168 150, 170 148, 172 147 Z" 
                />
                {/* Madagascar */}
                <path 
                  d="M 233 222 C 236 218, 239 224, 237 232 C 234 235, 231 230, 233 222 Z" 
                />

                {/* 5. EURASIA (Eastern Europe, Russia, Middle East & Asia) */}
                {/* Arabian Peninsula */}
                <path 
                  d="M 224 155 C 230 156, 236 162, 234 172 C 230 176, 225 170, 224 162 Z" 
                />
                {/* Russia / Siberia / Northern Asia */}
                <path 
                  d="M 215 65 C 230 62, 250 68, 265 78 C 266 95, 255 105, 242 108 C 230 102, 218 90, 215 65 Z" 
                />
                {/* Central & Eastern Asia */}
                <path 
                  d="M 218 116 C 230 112, 245 110, 260 114 C 265 125, 262 145, 250 155 C 240 158, 232 154, 225 148 C 220 140, 216 128, 218 116 Z" 
                />
              </g>

              {/* Tactical Topographic Dots / Coordinates on Continents */}
              <g fill="#34d399" opacity="0.6">
                <circle cx="108" cy="215" r="1" />
                <circle cx="125" cy="195" r="1" />
                <circle cx="135" cy="180" r="1" />
                <circle cx="85" cy="115" r="1" />
                <circle cx="102" cy="95" r="1" />
                <circle cx="178" cy="125" r="1" />
                <circle cx="190" cy="118" r="1" />
                <circle cx="205" cy="85" r="1" />
                <circle cx="190" cy="180" r="1" />
                <circle cx="210" cy="210" r="1" />
                <circle cx="240" cy="100" r="1" />
              </g>
            </g>

            {/* Latitude Parallels */}
            <ellipse cx="160" cy="140" rx="110" ry="25" fill="none" stroke="#334155" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.7" />
            <ellipse cx="160" cy="95" rx="98" ry="18" fill="none" stroke="#334155" strokeWidth="0.75" strokeDasharray="2 3" opacity="0.6" />
            <ellipse cx="160" cy="185" rx="98" ry="18" fill="none" stroke="#334155" strokeWidth="0.75" strokeDasharray="2 3" opacity="0.6" />

            {/* Longitude Meridians */}
            <ellipse cx="160" cy="140" rx="40" ry="110" fill="none" stroke="#334155" strokeWidth="0.75" opacity="0.7" />
            <ellipse cx="160" cy="140" rx="80" ry="110" fill="none" stroke="#334155" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.6" />
            <line x1="160" y1="30" x2="160" y2="250" stroke="#334155" strokeWidth="1" strokeDasharray="4 2" opacity="0.7" />

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
