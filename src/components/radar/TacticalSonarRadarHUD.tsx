import React, { useState } from 'react';
import { 
  Radio, 
  Sparkles, 
  Globe2, 
  Target,
  Filter
} from 'lucide-react';

export type TacticalSector = 'ALL' | 'GERMANY' | 'BILBAO' | 'EUSKADI' | 'REMOTE_ONLY' | 'HIGH_MATCH';

interface TacticalSonarRadarHUDProps {
  activeSector: TacticalSector;
  onSelectSector: (sector: TacticalSector) => void;
  offersCount: number;
  highMatchCount: number;
}

export const TacticalSonarRadarHUD: React.FC<TacticalSonarRadarHUDProps> = ({
  activeSector,
  onSelectSector,
  offersCount,
  highMatchCount
}) => {
  const [selectedBlip, setSelectedBlip] = useState<{ id: string; name: string; sector: string; coords: string; legal: string } | null>(null);

  // Tactical Radar Target Blips positioned relative to origin (50%, 50%)
  const RADAR_BLIPS = [
    // Alemania Sector (North / North-East)
    { id: 'de-1', x: 58, y: 18, name: 'Euraxess DE (Helmholtz / Thünen)', sector: 'GERMANY' as TacticalSector, coords: '54.32° N, 10.12° E (Kiel)', legal: 'AufenthG §20', color: '#38bdf8' },
    { id: 'de-2', x: 68, y: 28, name: 'DAAD Research & Postgrad', sector: 'GERMANY' as TacticalSector, coords: '52.52° N, 13.40° E (Berlin)', legal: 'AufenthG §20', color: '#38bdf8' },
    { id: 'de-3', x: 52, y: 32, name: 'StepStone DE (Umwelt & Data)', sector: 'GERMANY' as TacticalSector, coords: '51.22° N, 6.77° E (NRW)', legal: 'AufenthG §20', color: '#38bdf8' },
    { id: 'de-4', x: 62, y: 38, name: 'XING DACH Professional Hub', sector: 'GERMANY' as TacticalSector, coords: '48.13° N, 11.58° E (München)', legal: 'AufenthG §20', color: '#38bdf8' },
    
    // Euskadi / Bilbao Sector (South-West)
    { id: 'eus-1', x: 34, y: 64, name: 'BC3 Basque Centre for Climate Change', sector: 'BILBAO' as TacticalSector, coords: '43.33° N, 2.99° W (Leioa/Bilbao)', legal: 'Ley 14/2013 UGE', color: '#34d399' },
    { id: 'eus-2', x: 26, y: 72, name: 'Tecnalia Research & Innovation', sector: 'BILBAO' as TacticalSector, coords: '43.29° N, 2.87° W (Derio/Bizkaia)', legal: 'Ley 14/2013 UGE', color: '#34d399' },
    { id: 'eus-3', x: 38, y: 78, name: 'Neiker (Suelos & Edafología)', sector: 'EUSKADI' as TacticalSector, coords: '42.85° N, 2.62° W (Arkaute/Araba)', legal: 'Ley 14/2013 UGE', color: '#34d399' },
    { id: 'eus-4', x: 42, y: 68, name: 'IDOM Zorrotzaurre (Consultoría & Aguas)', sector: 'BILBAO' as TacticalSector, coords: '43.26° N, 2.93° W (Bilbao)', legal: 'Ley 14/2013 UGE', color: '#34d399' },
    
    // Remote / Global Sector (South-East / East)
    { id: 'rem-1', x: 80, y: 62, name: 'Environmental Paper Network (EPN)', sector: 'REMOTE_ONLY' as TacticalSector, coords: '100% Remoto UE', legal: 'Teletrabajo Transfronterizo', color: '#fbbf24' },
    { id: 'rem-2', x: 74, y: 76, name: 'Global Forest Coalition', sector: 'REMOTE_ONLY' as TacticalSector, coords: '100% Remoto Global', legal: 'Consultoría Internacional', color: '#fbbf24' },
    { id: 'rem-3', x: 84, y: 46, name: 'Eurobrussels (Políticas Públicas UE)', sector: 'REMOTE_ONLY' as TacticalSector, coords: '50.85° N, 4.35° E (Bruselas/Remoto)', legal: 'EU Directives', color: '#fbbf24' },
  ];

  return (
    <div className="relative rounded-2xl bg-[#080d19]/95 border border-slate-700/80 shadow-2xl p-5 overflow-hidden text-slate-100 font-sans">
      {/* Background Grid Pattern & Tactical Glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(rgba(56, 189, 248, 0.25) 1px, transparent 1px), radial-gradient(rgba(239, 68, 68, 0.2) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px'
        }}
      />

      {/* Top Header: Tactical Readout */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 mb-4 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="h-8 w-8 rounded-lg bg-red-600/20 border border-red-500/50 flex items-center justify-center text-red-400">
            <Radio className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-black text-white uppercase tracking-wider">
                SONAR RADAR HUD // BARRIDO DE FRECUENCIAS
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-600 font-bold">
                EN VIVO
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-300">
              ORIGEN TÁCTICO: KIEL (CAU) & BILBAO (BIZKAIA) • ALCANCE TOTAL: 350+ SEÑALES
            </p>
          </div>
        </div>

        {/* Tactical Coordinates & Metrics Badge */}
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <div className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5 text-sky-400" />
            <span>INTERCEPTADAS: <strong className="text-white">{offersCount}</strong></span>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>AFINIDAD &gt;70%: <strong className="text-emerald-400">{highMatchCount}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Radar Screen + Command Sector Panel */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* =========================================================
         * LEFT / CENTER (7 COLS): CIRCULAR HOLOGRAPHIC SONAR RADAR
         * ========================================================= */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div className="relative w-[300px] h-[300px] sm:w-[340px] sm:h-[340px] rounded-full border-2 border-slate-700 bg-radial from-[#0d1728] via-[#090e1a] to-[#05070f] shadow-[0_0_40px_rgba(14,165,233,0.15)] flex items-center justify-center overflow-hidden">
            
            {/* Concentric Metric Range Rings */}
            <div className="absolute w-[90%] h-[90%] rounded-full border border-slate-700/60 pointer-events-none" />
            <div className="absolute w-[68%] h-[68%] rounded-full border border-sky-500/25 pointer-events-none" />
            <div className="absolute w-[44%] h-[44%] rounded-full border border-emerald-500/30 pointer-events-none" />
            <div className="absolute w-[20%] h-[20%] rounded-full border border-slate-600/70 pointer-events-none" />

            {/* Polar Grid Crosshairs */}
            <div className="absolute w-full h-[1px] bg-slate-700/60 pointer-events-none" />
            <div className="absolute h-full w-[1px] bg-slate-700/60 pointer-events-none" />
            <div className="absolute w-[80%] h-[1px] bg-slate-800/80 rotate-45 pointer-events-none" />
            <div className="absolute w-[80%] h-[1px] bg-slate-800/80 -rotate-45 pointer-events-none" />

            {/* Cardinal Range Markers */}
            <span className="absolute top-2 text-[9px] font-mono font-bold text-sky-400 pointer-events-none">
              N // ALEMANIA (DACH)
            </span>
            <span className="absolute bottom-2 text-[9px] font-mono font-bold text-emerald-400 pointer-events-none">
              SW // EUSKADI (BILBAO)
            </span>
            <span className="absolute right-2 text-[9px] font-mono font-bold text-amber-400 pointer-events-none">
              E // REMOTO UE
            </span>
            <span className="absolute left-2 text-[9px] font-mono font-bold text-slate-500 pointer-events-none">
              W // GLOBAL
            </span>

            {/* Central Origin Reticle: Daniel Santander Operative Core */}
            <div className="absolute z-20 w-4 h-4 rounded-full bg-red-600 border-2 border-white shadow-[0_0_12px_rgba(239,68,68,0.8)] flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            </div>

            {/* Rotating Sonar Sweep Beam */}
            <div 
              className="absolute inset-0 rounded-full pointer-events-none animate-spin"
              style={{
                animationDuration: '6s',
                background: 'conic-gradient(from 0deg, rgba(56, 189, 248, 0.35) 0deg, rgba(56, 189, 248, 0.08) 45deg, transparent 90deg, transparent 360deg)'
              }}
            />

            {/* Pulse Radiating Ping */}
            <div className="absolute w-24 h-24 rounded-full border border-sky-400/40 animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />

            {/* Interactive Target Blips on Radar */}
            {RADAR_BLIPS.map((blip) => {
              const isSelected = activeSector === blip.sector;
              return (
                <button
                  key={blip.id}
                  onClick={() => {
                    setSelectedBlip(blip);
                    onSelectSector(blip.sector);
                  }}
                  onMouseEnter={() => setSelectedBlip(blip)}
                  style={{ left: `${blip.x}%`, top: `${blip.y}%` }}
                  className="absolute z-30 -translate-x-1/2 -translate-y-1/2 group cursor-pointer p-1 transition"
                  title={`${blip.name} [${blip.legal}]`}
                >
                  <span className="relative flex h-3 w-3">
                    <span 
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        isSelected ? 'bg-red-400' : 'bg-sky-400'
                      }`} 
                    />
                    <span 
                      className="relative inline-flex rounded-full h-3 w-3 border border-white/80 shadow-[0_0_8px_currentColor]"
                      style={{ backgroundColor: isSelected ? '#ef4444' : blip.color }}
                    />
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Target Dossier Snippet below Sonar */}
          <div className="mt-3 text-center min-h-[38px] w-full max-w-md">
            {selectedBlip ? (
              <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-700 text-xs font-mono flex items-center justify-between animate-fadeIn">
                <div className="text-left overflow-hidden">
                  <div className="font-bold text-white truncate flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
                    <span>{selectedBlip.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-300">
                    {selectedBlip.coords} • <strong className="text-sky-300">{selectedBlip.legal}</strong>
                  </div>
                </div>
                <button
                  onClick={() => onSelectSector(selectedBlip.sector as TacticalSector)}
                  className="px-2 py-1 rounded bg-red-600 hover:bg-red-500 text-white text-[10px] font-extrabold uppercase shrink-0 transition"
                >
                  Filtrar »
                </button>
              </div>
            ) : (
              <div className="text-[11px] font-mono text-slate-300 flex items-center justify-center gap-1.5 py-1">
                <span>Pasa el cursor sobre un eco de radar o selecciona un sector táctico a la derecha »</span>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================
         * RIGHT (5 COLS): TACTICAL SECTOR COMMAND SWITCHES
         * ========================================================= */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="text-xs font-mono font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
            <Filter className="h-3.5 w-3.5 text-red-500" />
            <span>SELECTORES DE SECTOR TÁCTICO</span>
          </div>

          {/* Switch 0: Barrido Total */}
          <button
            onClick={() => onSelectSector('ALL')}
            className={`w-full p-2.5 rounded-xl border text-left font-mono transition flex items-center justify-between cursor-pointer group ${
              activeSector === 'ALL'
                ? 'bg-red-600 text-white border-red-500 shadow-lg font-black'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-700/80 hover:border-slate-500'
            }`}
          >
            <div>
              <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Globe2 className="h-3.5 w-3.5" />
                <span>BARRIDO GLOBAL (350+ SEÑALES)</span>
              </div>
              <div className="text-[10px] opacity-80 mt-0.5">
                Alemania + Euskadi + Remoto Internacional
              </div>
            </div>
            <span className="text-xs font-bold">{offersCount}</span>
          </button>

          {/* Switch 1: Sector Alpha (Alemania / DACH) */}
          <button
            onClick={() => onSelectSector('GERMANY')}
            className={`w-full p-2.5 rounded-xl border text-left font-mono transition flex items-center justify-between cursor-pointer group ${
              activeSector === 'GERMANY'
                ? 'bg-sky-600 text-white border-sky-400 shadow-lg font-black'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-700/80 hover:border-sky-500'
            }`}
          >
            <div>
              <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span>🇩🇪</span>
                <span>SECTOR ALPHA // ALEMANIA (DACH)</span>
              </div>
              <div className="text-[10px] opacity-80 mt-0.5">
                AufenthG §20 • CAU Kiel • Helmholtz • Thünen
              </div>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 border border-white/20">
              §20 PRIORIDAD
            </span>
          </button>

          {/* Switch 2: Sector Bravo (Euskadi / Bilbao) */}
          <button
            onClick={() => onSelectSector('BILBAO')}
            className={`w-full p-2.5 rounded-xl border text-left font-mono transition flex items-center justify-between cursor-pointer group ${
              activeSector === 'BILBAO' || activeSector === 'EUSKADI'
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg font-black'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-700/80 hover:border-emerald-500'
            }`}
          >
            <div>
              <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span>🇪🇸</span>
                <span>SECTOR BRAVO // BILBAO & EUSKADI</span>
              </div>
              <div className="text-[10px] opacity-80 mt-0.5">
                Ley 14/2013 UGE • BC3 • Tecnalia • IDOM • Neiker
              </div>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 border border-white/20">
              LEY 14 UGE
            </span>
          </button>

          {/* Switch 3: Sector Charlie (Remoto) */}
          <button
            onClick={() => onSelectSector('REMOTE_ONLY')}
            className={`w-full p-2.5 rounded-xl border text-left font-mono transition flex items-center justify-between cursor-pointer group ${
              activeSector === 'REMOTE_ONLY'
                ? 'bg-amber-600 text-white border-amber-400 shadow-lg font-black'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-700/80 hover:border-amber-500'
            }`}
          >
            <div>
              <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span>🌐</span>
                <span>SECTOR CHARLIE // 100% REMOTO UE</span>
              </div>
              <div className="text-[10px] opacity-80 mt-0.5">
                Gobernanza • EPN • Forest Coalition • Datos Espaciales
              </div>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 border border-white/20">
              TELETRABAJO
            </span>
          </button>

          {/* Switch 4: Sector Delta (Alta Afinidad >70%) */}
          <button
            onClick={() => onSelectSector('HIGH_MATCH')}
            className={`w-full p-2.5 rounded-xl border text-left font-mono transition flex items-center justify-between cursor-pointer group ${
              activeSector === 'HIGH_MATCH'
                ? 'bg-red-700 text-white border-red-400 shadow-lg font-black'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-700/80 hover:border-red-500'
            }`}
          >
            <div>
              <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
                <span>SECTOR DELTA // ALTA AFINIDAD (&gt;70%)</span>
              </div>
              <div className="text-[10px] opacity-80 mt-0.5">
                Máxima compatibilidad con perfil M.Sc. Daniel Santander
              </div>
            </div>
            <span className="text-xs font-bold text-yellow-300">{highMatchCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
