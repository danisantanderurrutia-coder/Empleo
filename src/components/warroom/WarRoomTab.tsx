import React, { useState } from 'react';
import { 
  Award, 
  ChevronRight, 
  Globe2,
  Tv,
  Sparkles
} from 'lucide-react';
import { getStoredProfile, getStoredOffers, getStoredApplications, getStoredCompanies } from '../../services/db';
import { TacticalGlobeHUD } from './TacticalGlobeHUD';

interface WarRoomTabProps {
  onSelectStation: (stationId: string, subTab?: string) => void;
  onLaunchRadar: () => void;
}

export const WarRoomTab: React.FC<WarRoomTabProps> = ({ onSelectStation, onLaunchRadar }) => {
  const profile = getStoredProfile();
  const offers = getStoredOffers();
  const applications = getStoredApplications();
  const companies = getStoredCompanies();

  const [showPlanetaryHUD, setShowPlanetaryHUD] = useState(false);

  const highMatchOffers = offers.filter(o => o.matchScore?.totalScore >= 70);
  const activeApplications = applications.filter(a => a.status !== 'Desestimada');

  // Photographic Assets from Unsplash for realistic tactical atmosphere
  const backgroundWall = 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1920&q=80';
  const tacticalOperative = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80';
  const droneScreen = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80';
  const operatorIana = 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80';
  const operatorEla = 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=400&q=80';

  return (
    <div 
      className="relative min-h-[calc(100vh-100px)] rounded-3xl overflow-hidden p-6 text-slate-100 font-sans select-none border border-slate-800 shadow-2xl"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(12, 17, 26, 0.88), rgba(9, 13, 20, 0.94)), url('${backgroundWall}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Cinematic Fog & Scanline Vignette */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-40 mix-blend-overlay" />

      {/* Screen Title: CAREER (Exact Rainbow Six Siege style) */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-700/60 pb-3 mb-6 gap-3">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-mono tracking-wider uppercase text-red-500 font-bold mb-1">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span>OPERATIVE RECORD // {profile.fullName || 'DANIEL SANTANDER'}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter font-sans drop-shadow-md">
            CAREER
          </h1>
        </div>

        {/* Tactical Planetary Toggle & Mode Switcher */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowPlanetaryHUD(!showPlanetaryHUD)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 border transition cursor-pointer ${
              showPlanetaryHUD 
                ? 'bg-sky-600 text-white border-sky-400 shadow-lg' 
                : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-slate-500'
            }`}
          >
            <Globe2 className="h-4 w-4 text-sky-400" />
            <span>{showPlanetaryHUD ? 'Ocultar Visor Planetario' : '🛰️ Visor IMF / Globo'}</span>
          </button>

          <button
            onClick={onLaunchRadar}
            className="px-4 py-1.5 rounded-lg text-xs font-mono font-extrabold bg-red-600 hover:bg-red-500 text-white shadow-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>DESPLEGAR RADAR (350+)</span>
          </button>
        </div>
      </div>

      {/* Optional Top Tier: IMF Planetary Holographic Vector Globe (if toggled) */}
      {showPlanetaryHUD && (
        <div className="relative z-10 mb-6 animate-fadeIn">
          <TacticalGlobeHUD 
            onDeploySector={(sector) => {
              if (sector === 'kiel') onSelectStation('market_radar', 'sources');
              else if (sector === 'bilbao') onSelectStation('market_radar', 'companies');
              else onSelectStation('market_radar', 'offers');
            }}
          />
        </div>
      )}

      {/* -------------------------------------------------------------
       * EXACT RAINBOW SIX SIEGE 3-COLUMN CAREER GRID (IMAGE 4)
       * ------------------------------------------------------------- */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* =========================================================
         * COLUMN 1 (LEFT, 3 COLS): CLEARANCE LEVEL + REPLAYS
         * ========================================================= */}
        <div className="md:col-span-3 space-y-4 flex flex-col justify-between">
          {/* Tile 1.1: CLEARANCE LEVEL */}
          <div className="bg-[#121927]/90 backdrop-blur-md rounded-xl p-5 border border-slate-700/80 shadow-2xl flex flex-col justify-between min-h-[195px] relative overflow-hidden group hover:border-slate-500 transition">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-black uppercase tracking-wider text-slate-300">
                CLEARANCE LEVEL
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                MAX ACCESO
              </span>
            </div>

            {/* Silver Laurel Wreath with 50 */}
            <div className="flex flex-col items-center justify-center my-2">
              <div className="relative flex items-center justify-center">
                {/* SVG Tactical Laurel Wreath */}
                <svg viewBox="0 0 100 100" className="w-20 h-20 text-slate-300 drop-shadow-lg">
                  <path 
                    d="M 28 65 C 22 55, 22 35, 35 25 C 40 22, 45 20, 50 20 C 55 20, 60 22, 65 25 C 78 35, 78 55, 72 65" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="3" 
                    strokeDasharray="4 2"
                  />
                  <path 
                    d="M 20 60 Q 25 45 35 38 M 80 60 Q 75 45 65 38" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                  />
                </svg>
                <span className="absolute text-2xl font-black text-white font-sans tracking-tight">
                  50
                </span>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="space-y-1">
              <div className="h-1.5 w-full bg-slate-800/90 rounded-full overflow-hidden">
                <div className="h-full bg-slate-300 w-full" />
              </div>
              <div className="text-[10px] font-mono text-slate-400 text-left">
                0/1000
              </div>
            </div>
          </div>

          {/* Tile 1.2: REPLAYS [BETA] */}
          <div 
            onClick={onLaunchRadar}
            className="rounded-xl p-5 border border-slate-700/80 shadow-2xl min-h-[195px] flex flex-col justify-between relative overflow-hidden group cursor-pointer hover:border-sky-500/80 transition"
            style={{
              backgroundImage: `linear-gradient(to top, rgba(10, 16, 26, 0.95), rgba(10, 16, 26, 0.6)), url('${droneScreen}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="flex items-center space-x-1.5 z-10">
              <span className="text-[11px] font-mono font-black uppercase tracking-wider text-white">
                REPLAYS
              </span>
              <span className="text-[9px] font-mono font-black px-1.5 py-0.2 rounded bg-slate-800/90 text-slate-300 border border-slate-600">
                BETA
              </span>
            </div>

            <div className="flex flex-col items-center justify-center my-3 z-10">
              <Tv className="h-9 w-9 text-slate-400 group-hover:text-sky-400 transition mb-1" />
              <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                RADAR: 350+ VACANTES
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Click para desplegar telemetría
              </span>
            </div>

            <div className="text-[10px] font-mono text-sky-400 flex items-center justify-between z-10 border-t border-slate-800/80 pt-2">
              <span>CANAL SEGURO</span>
              <span>LIVE FEED »</span>
            </div>
          </div>
        </div>

        {/* =========================================================
         * COLUMN 2 (CENTER, 4 COLS): MY RANK + REPUTATION
         * ========================================================= */}
        <div className="md:col-span-4 space-y-4 flex flex-col justify-between">
          {/* Tile 2.1: MY RANK (Hero Card with Red Angle Fade) */}
          <div 
            className="rounded-xl p-5 border border-red-500/70 shadow-[0_0_25px_rgba(239,68,68,0.25)] min-h-[195px] flex flex-col justify-between relative overflow-hidden group"
            style={{
              backgroundImage: `linear-gradient(to top, rgba(220, 38, 38, 0.92) 0%, rgba(153, 27, 27, 0.5) 30%, rgba(10, 14, 22, 0.7) 100%), url('${tacticalOperative}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="flex items-center justify-between z-10">
              <span className="text-[11px] font-mono font-black uppercase tracking-wider text-white drop-shadow">
                MY RANK
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/60 text-red-300 border border-red-500/50">
                TIER-1 MINT
              </span>
            </div>

            {/* Tactical Shield Emblem & Rank Title */}
            <div className="flex flex-col items-center justify-center my-2 z-10">
              <div className="w-14 h-14 rounded-xl bg-black/50 border-2 border-white/80 flex items-center justify-center shadow-2xl mb-1.5 group-hover:scale-105 transition">
                {/* Military Rank Chevron Shield */}
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-white drop-shadow">
                  <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" />
                  <path d="M8 11l4 3 4-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M8 8l4 3 4-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>

              <h3 className="text-base font-black text-white uppercase tracking-wider font-sans drop-shadow">
                ELITE FIELD SCIENTIST
              </h3>
              <span className="text-[10px] font-mono text-red-100 font-bold uppercase tracking-widest drop-shadow">
                AUFENTHG §20 & LEY 14
              </span>
            </div>

            <div className="text-[10px] font-mono font-bold text-white text-center z-10 border-t border-red-400/30 pt-1.5">
              TRANSICIÓN ACTIVA A EU BLUE CARD
            </div>
          </div>

          {/* Tile 2.2: REPUTATION */}
          <div className="bg-[#121927]/90 backdrop-blur-md rounded-xl p-5 border border-slate-700/80 shadow-2xl min-h-[195px] flex flex-col justify-between relative overflow-hidden group hover:border-slate-500 transition">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-black uppercase tracking-wider text-slate-300">
                REPUTATION
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                VERIFICADO
              </span>
            </div>

            {/* Silver Reputation Badge */}
            <div className="flex flex-col items-center justify-center my-2">
              <div className="w-12 h-12 rounded-lg bg-slate-800/80 border border-slate-600 flex items-center justify-center shadow-lg mb-1.5">
                <Award className="h-6 w-6 text-slate-200" />
              </div>
              <h4 className="text-sm font-black text-white uppercase tracking-wider">
                RESPECTABLE
              </h4>
              <span className="text-[10px] font-mono text-slate-400">
                100% Postulación Asistida por Ti
              </span>
            </div>

            <div className="text-[10px] font-mono text-slate-400 text-center border-t border-slate-800/80 pt-1.5">
              CERO BOTS • AUDITORÍA LIMPIA
            </div>
          </div>
        </div>

        {/* =========================================================
         * COLUMN 3 (RIGHT, 5 COLS): FULL-HEIGHT STATISTICS CARD
         * ========================================================= */}
        <div className="md:col-span-5 bg-[#121927]/90 backdrop-blur-md rounded-xl p-6 border border-slate-700/80 shadow-2xl flex flex-col justify-between space-y-4">
          {/* Header */}
          <div className="border-b border-slate-800 pb-2">
            <h3 className="text-sm font-mono font-black text-white uppercase tracking-wider">
              STATISTICS
            </h3>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
              ACCOUNT BASED STATISTICS
            </span>
          </div>

          {/* Row 1: Big 3 Numbers */}
          <div className="grid grid-cols-3 gap-2 border-b border-slate-800 pb-4">
            <div>
              <div className="text-[10px] font-mono text-slate-400">Targets Found</div>
              <div className="text-2xl font-black text-white font-sans">{offers.length}</div>
            </div>

            <div>
              <div className="text-[10px] font-mono text-slate-400">Centros I+D</div>
              <div className="text-2xl font-black text-white font-sans">{companies.length}</div>
            </div>

            <div>
              <div className="text-[10px] font-mono text-slate-400">Alta Afinidad</div>
              <div className="text-2xl font-black text-emerald-400 font-sans">{highMatchOffers.length}</div>
            </div>
          </div>

          {/* Row 2: Most Played Specialists (Rounds) */}
          <div className="space-y-1.5 border-b border-slate-800 pb-4">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Most Targeted Sectors (Dossiers)
            </div>

            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              <div className="p-2 rounded bg-slate-900/90 border border-slate-800">
                <div className="text-[10px] text-slate-400 truncate">I+D+i Euskadi</div>
                <div className="font-bold text-white text-sm">6</div>
              </div>

              <div className="p-2 rounded bg-slate-900/90 border border-slate-800">
                <div className="text-[10px] text-slate-400 truncate">Consultoría</div>
                <div className="font-bold text-white text-sm">5</div>
              </div>

              <div className="p-2 rounded bg-slate-900/90 border border-slate-800">
                <div className="text-[10px] text-slate-400 truncate">Gobernanza</div>
                <div className="font-bold text-white text-sm">7</div>
              </div>
            </div>
          </div>

          {/* Row 3: Ranked, Unranked & Quick Match (Operator Cards) */}
          <div className="space-y-2">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Specialist Profile Configurations
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Operator 1: Geofísica & Modelación */}
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center space-x-3">
                <img 
                  src={operatorIana} 
                  alt="Iana Spec" 
                  className="w-10 h-10 rounded-full object-cover border border-slate-600 shrink-0" 
                />
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-white truncate">GEOFÍSICA</div>
                  <div className="text-[10px] font-mono text-slate-400">U. de Chile</div>
                  <div className="text-[10px] font-mono text-emerald-400 font-bold">73.8% Win Rate</div>
                </div>
              </div>

              {/* Operator 2: Biofísica & CAU Kiel */}
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center space-x-3">
                <img 
                  src={operatorEla} 
                  alt="Ela Spec" 
                  className="w-10 h-10 rounded-full object-cover border border-slate-600 shrink-0" 
                />
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-white truncate">BIOFÍSICA</div>
                  <div className="text-[10px] font-mono text-slate-400">CAU Kiel / Poznań</div>
                  <div className="text-[10px] font-mono text-sky-400 font-bold">81.0% Win Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
       * TACTICAL MODE LAUNCH CARDS (RAINBOW SIX SIEGE STYLE)
       * ------------------------------------------------------------- */}
      <div className="relative z-10 mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          onClick={onLaunchRadar}
          className="p-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-red-500 transition text-left flex items-center justify-between group cursor-pointer"
        >
          <div>
            <div className="text-xs font-mono font-bold text-white uppercase group-hover:text-red-400 transition">
              PLAY RANKED // ALEMANIA
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Euraxess • §20 AufenthG
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-red-400 group-hover:translate-x-1 transition" />
        </button>

        <button
          onClick={() => onSelectStation('market_radar', 'companies')}
          className="p-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500 transition text-left flex items-center justify-between group cursor-pointer"
        >
          <div>
            <div className="text-xs font-mono font-bold text-white uppercase group-hover:text-emerald-400 transition">
              PLAY STANDARD // EUSKADI
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              BC3 • Tecnalia • IDOM
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition" />
        </button>

        <button
          onClick={() => onSelectStation('agent_dossier', 'cvs')}
          className="p-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-amber-500 transition text-left flex items-center justify-between group cursor-pointer"
        >
          <div>
            <div className="text-xs font-mono font-bold text-white uppercase group-hover:text-amber-400 transition">
              OPERATORS // ARMERÍA CV
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              ES • EN • Lebenslauf
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition" />
        </button>

        <button
          onClick={() => onSelectStation('mission_control', 'applications')}
          className="p-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-sky-500 transition text-left flex items-center justify-between group cursor-pointer"
        >
          <div>
            <div className="text-xs font-mono font-bold text-white uppercase group-hover:text-sky-400 transition">
              LOCKER // MISIÓN KANBAN
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              {activeApplications.length} Postulaciones en Curso
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-1 transition" />
        </button>
      </div>
    </div>
  );
};
