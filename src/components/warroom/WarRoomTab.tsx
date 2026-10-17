import React from 'react';
import { 
  Award, 
  Tv, 
  Globe2 
} from 'lucide-react';
import { getStoredProfile, getStoredOffers, getStoredApplications, getStoredCompanies } from '../../services/db';
import { TacticalGlobeHUD } from './TacticalGlobeHUD';

interface WarRoomTabProps {
  onSelectStation: (stationId: string, subTab?: string, filter?: string) => void;
  onLaunchRadar: () => void;
}

export const WarRoomTab: React.FC<WarRoomTabProps> = ({ onSelectStation, onLaunchRadar }) => {
  const profile = getStoredProfile();
  const offers = getStoredOffers();
  const applications = getStoredApplications();
  const companies = getStoredCompanies();

  // Compute live data metrics
  const highMatchOffers = offers.filter(o => (o.matchScore?.totalScore || 0) >= 70);
  const germanyOffers = offers.filter(o => {
    const loc = (o.location || '').toLowerCase();
    return loc.includes('alemania') || loc.includes('germany') || loc.includes('potsdam') || loc.includes('kiel') || loc.includes('berlin') || loc.includes('berlín');
  });
  const euskadiOffers = offers.filter(o => {
    const loc = (o.location || '').toLowerCase();
    return loc.includes('bilbao') || loc.includes('bizkaia') || loc.includes('donostia') || loc.includes('euskadi');
  });
  const remoteOffers = offers.filter(o => {
    const loc = (o.location || '').toLowerCase();
    return loc.includes('remoto') || loc.includes('remote');
  });

  // Application stages
  const colSent = applications.filter(a => (a.currentStage >= 6 && a.currentStage <= 7) || a.status === 'Enviada');

  // High-fidelity photographic assets
  const backgroundWall = 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1920&q=80';
  const professionalResearcher = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80';
  const droneScreen = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80';
  const earthObservation = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80';
  const biogeoLab = 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80';
  const germanyTech = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80';
  const euskadiTech = 'https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      
      {/* =========================================================================
       * 1. THE AUTHENTIC CAREER DASHBOARD (RAINBOW SIX SIEGE EXACT LAYOUT)
       * ========================================================================= */}
      <div 
        className="relative rounded-3xl overflow-hidden p-6 md:p-8 text-white font-sans border border-slate-700/80 shadow-2xl"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(11, 18, 32, 0.92), rgba(7, 11, 20, 0.96)), url('${backgroundWall}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Subtle Vignette & Grid */}
        <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-40 mix-blend-overlay" />

        {/* Screen Title: CAREER */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-700/80 pb-4 mb-6 gap-3">
          <div>
            <div className="flex items-center space-x-2 text-[11px] font-mono tracking-wider uppercase text-red-500 font-bold mb-1">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span>EXPEDIENTE PROFESIONAL // {profile.fullName || 'DANIEL SANTANDER'}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tight font-sans drop-shadow-md">
              CAREER
            </h1>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono">
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-300 flex items-center gap-2 shadow">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-emerald-400 font-bold">RADAR ACTIVO:</span>
              <span>DACH • EUSKADI • REMOTO</span>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------
         * 3-COLUMN CAREER GRID (IMAGE INSPIRATION)
         * ------------------------------------------------------------- */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-5">
          
          {/* =========================================================
           * COLUMN 1 (LEFT, 3 COLS): CLEARANCE LEVEL + RADAR FEED
           * ========================================================= */}
          <div className="md:col-span-3 flex flex-col justify-between gap-4">
            
            {/* Tile 1.1: CLEARANCE LEVEL */}
            <div 
              onClick={() => onSelectStation('agent_dossier', 'showcase')}
              className="bg-[#121a2a]/95 backdrop-blur-md rounded-2xl p-5 border border-slate-700 shadow-xl flex flex-col justify-between min-h-[195px] relative overflow-hidden group hover:border-sky-400 hover:shadow-[0_0_20px_rgba(56,189,248,0.25)] transition cursor-pointer"
              title="Click para ver el Expediente y Atributos"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black uppercase tracking-wider text-slate-100 group-hover:text-sky-300 transition">
                  CLEARANCE LEVEL
                </span>
                <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600">
                  MAX ACCESO
                </span>
              </div>

              {/* Silver Laurel Wreath with 50 */}
              <div className="flex flex-col items-center justify-center my-2">
                <div className="relative flex items-center justify-center group-hover:scale-105 transition">
                  <svg viewBox="0 0 100 100" className="w-20 h-20 text-slate-100 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                    <path 
                      d="M 28 65 C 22 55, 22 35, 35 25 C 40 22, 45 20, 50 20 C 55 20, 60 22, 65 25 C 78 35, 78 55, 72 65" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="3.5" 
                      strokeDasharray="4 2"
                    />
                    <path 
                      d="M 20 60 Q 25 45 35 38 M 80 60 Q 75 45 65 38" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                    />
                  </svg>
                  <span className="absolute text-2xl font-black text-white font-sans tracking-tight drop-shadow-md">
                    50
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                  <div className="h-full bg-slate-100 w-full" />
                </div>
                <div className="text-[10px] font-mono font-bold text-slate-300 flex items-center justify-between">
                  <span>EXPEDIENTE VERIFICADO</span>
                  <span className="text-sky-300 font-mono">VER PERFIL »</span>
                </div>
              </div>
            </div>

            {/* Tile 1.2: RADAR FEED */}
            <div 
              onClick={onLaunchRadar}
              className="rounded-2xl p-5 border border-slate-700 shadow-xl min-h-[195px] flex flex-col justify-between relative overflow-hidden group cursor-pointer hover:border-sky-400 transition"
              style={{
                backgroundImage: `linear-gradient(to top, rgba(10, 16, 26, 0.95), rgba(10, 16, 26, 0.55)), url('${droneScreen}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="flex items-center space-x-1.5 z-10">
                <span className="text-xs font-mono font-black uppercase tracking-wider text-white drop-shadow">
                  RADAR FEED
                </span>
                <span className="text-[9px] font-mono font-black px-1.5 py-0.5 rounded bg-red-600 text-white shadow">
                  LIVE
                </span>
              </div>

              <div className="flex flex-col items-center justify-center my-2 z-10 text-center">
                <Tv className="h-9 w-9 text-slate-200 group-hover:text-sky-300 transition mb-1 drop-shadow" />
                <span className="text-sm font-mono font-black text-white uppercase tracking-wider drop-shadow">
                  {offers.length} VACANTES ACTIVAS
                </span>
                <span className="text-[11px] text-slate-200 font-mono font-medium drop-shadow mt-0.5">
                  {germanyOffers.length} DACH • {euskadiOffers.length} Euskadi • {remoteOffers.length} Remoto
                </span>
              </div>

              <div className="text-[11px] font-mono font-bold text-sky-300 flex items-center justify-between z-10 border-t border-slate-700/80 pt-2">
                <span>CANAL SEGURO</span>
                <span>EXPLORAR »</span>
              </div>
            </div>
          </div>

          {/* =========================================================
           * COLUMN 2 (CENTER, 4 COLS): MY RANK + REPUTATION
           * ========================================================= */}
          <div className="md:col-span-4 flex flex-col justify-between gap-4">
            
            {/* Tile 2.1: MY RANK (Hero Card with Red Angle Fade) */}
            <div 
              onClick={() => onSelectStation('agent_dossier', 'showcase')}
              className="rounded-2xl p-5 border-2 border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.35)] min-h-[195px] flex flex-col justify-between relative overflow-hidden group cursor-pointer hover:border-white hover:scale-[1.01] transition"
              title="Click para ver Atributos y Titulaciones"
              style={{
                backgroundImage: `linear-gradient(to top, rgba(220, 38, 38, 0.95) 0%, rgba(185, 28, 28, 0.55) 35%, rgba(10, 14, 22, 0.65) 100%), url('${professionalResearcher}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="flex items-center justify-between z-10">
                <span className="text-xs font-mono font-black uppercase tracking-wider text-white drop-shadow">
                  MY RANK
                </span>
                <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-black/70 text-white border border-red-400">
                  TIER-1 MINT
                </span>
              </div>

              {/* Shield & Rank Title */}
              <div className="flex flex-col items-center justify-center my-1 z-10">
                <div className="w-12 h-12 rounded-xl bg-black/60 border-2 border-white flex items-center justify-center shadow-xl mb-1 group-hover:scale-105 transition">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 text-white drop-shadow">
                    <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="2.5" />
                    <path d="M8 11l4 3 4-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M8 8l4 3 4-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>

                <h3 className="text-base font-black text-white uppercase tracking-wider font-sans drop-shadow text-center">
                  ELITE FIELD SCIENTIST
                </h3>
                <span className="text-[10.5px] font-mono text-white font-extrabold uppercase tracking-widest drop-shadow bg-black/40 px-2 py-0.5 rounded mt-0.5">
                  §20 AUFENTHG • LEY 14
                </span>
              </div>

              <div className="text-[11px] font-mono font-black text-white text-center z-10 border-t border-red-300/40 pt-1.5 drop-shadow flex items-center justify-between">
                <span>HABILITADO PARA EU BLUE CARD</span>
                <span>EXPEDIENTE »</span>
              </div>
            </div>

            {/* Tile 2.2: REPUTATION */}
            <div 
              onClick={() => onSelectStation('mission_control', 'applications')}
              className="bg-[#121a2a]/95 backdrop-blur-md rounded-2xl p-5 border border-slate-700 shadow-xl min-h-[195px] flex flex-col justify-between relative overflow-hidden group hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] transition cursor-pointer"
              title="Click para ver Locker y Candidaturas"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black uppercase tracking-wider text-slate-100 group-hover:text-emerald-300 transition">
                  REPUTATION
                </span>
                <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600">
                  VERIFICADO
                </span>
              </div>

              {/* Silver Reputation Badge */}
              <div className="flex flex-col items-center justify-center my-1 text-center">
                <div className="w-11 h-11 rounded-lg bg-slate-800 border-2 border-slate-400 flex items-center justify-center shadow-md mb-1 group-hover:scale-105 transition">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-sm font-black text-white uppercase tracking-wider">
                  RESPECTABLE
                </h4>
                <span className="text-xs font-mono text-slate-300">
                  {colSent.length > 0 ? `${colSent.length} Envíos Confirmados` : '100% Candidaturas Validadas'}
                </span>
              </div>

              <div className="text-[11px] font-mono font-bold text-emerald-400 flex items-center justify-between border-t border-slate-700/80 pt-1.5">
                <span>LOCKER KANBAN</span>
                <span>DESPACHO »</span>
              </div>
            </div>
          </div>

          {/* =========================================================
           * COLUMN 3 (RIGHT, 5 COLS): STATISTICS (FULL TALL HEIGHT)
           * ========================================================= */}
          <div className="md:col-span-5 bg-[#121a2a]/95 backdrop-blur-md rounded-2xl p-5 border border-slate-700 shadow-xl flex flex-col justify-between gap-3.5">
            
            {/* Header */}
            <div className="border-b border-slate-700/80 pb-2 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-mono font-black text-white uppercase tracking-wider">
                  STATISTICS
                </h3>
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                  METRICAS OPERATIVAS & MERCADO
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800">
                EN VIVO
              </span>
            </div>

            {/* Row 1: Big 3 Numbers */}
            <div className="grid grid-cols-3 gap-2 border-b border-slate-700/80 pb-3">
              <button 
                onClick={() => onSelectStation('market_radar', 'offers', 'ALL')}
                className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-red-500 transition text-left cursor-pointer group"
                title="Ver vacantes del Radar"
              >
                <div className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider group-hover:text-red-400 transition">Targets</div>
                <div className="text-2xl font-black text-white font-sans">{offers.length}</div>
              </button>

              <button 
                onClick={() => onSelectStation('market_radar', 'companies')}
                className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500 transition text-left cursor-pointer group"
                title="Ver Centros I+D"
              >
                <div className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider group-hover:text-emerald-400 transition">Centros I+D</div>
                <div className="text-2xl font-black text-white font-sans">{companies.length}</div>
              </button>

              <button 
                onClick={() => onSelectStation('market_radar', 'offers', 'HIGH_MATCH')}
                className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-sky-400 transition text-left cursor-pointer group"
                title="Ver vacantes de alta afinidad"
              >
                <div className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider group-hover:text-sky-300 transition">Afinidad &gt;70%</div>
                <div className="text-2xl font-black text-emerald-400 font-sans">{highMatchOffers.length}</div>
              </button>
            </div>

            {/* Row 2: Most Targeted Regions */}
            <div className="space-y-1.5 border-b border-slate-700/80 pb-3">
              <div className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                DISTRIBUCIÓN GEOGRÁFICA DE VACANTES
              </div>

              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                <button 
                  onClick={() => onSelectStation('market_radar', 'offers', 'BILBAO')}
                  className="p-2 rounded-xl border border-slate-700 hover:border-emerald-500 transition text-left cursor-pointer relative overflow-hidden shadow"
                  style={{
                    backgroundImage: `linear-gradient(to top, rgba(15, 23, 42, 0.92) 0%, rgba(15, 23, 42, 0.7) 100%), url('${euskadiTech}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                  title="Filtrar por Euskadi"
                >
                  <div className="text-[10px] text-slate-300 font-bold truncate">📍 Euskadi</div>
                  <div className="font-bold text-white text-sm">{euskadiOffers.length} vacantes</div>
                </button>

                <button 
                  onClick={() => onSelectStation('market_radar', 'offers', 'GERMANY')}
                  className="p-2 rounded-xl border border-slate-700 hover:border-sky-500 transition text-left cursor-pointer relative overflow-hidden shadow"
                  style={{
                    backgroundImage: `linear-gradient(to top, rgba(15, 23, 42, 0.92) 0%, rgba(15, 23, 42, 0.7) 100%), url('${germanyTech}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                  title="Filtrar por Alemania / DACH"
                >
                  <div className="text-[10px] text-slate-300 font-bold truncate">🇩🇪 DACH §20</div>
                  <div className="font-bold text-white text-sm">{germanyOffers.length} vacantes</div>
                </button>

                <button 
                  onClick={() => onSelectStation('market_radar', 'offers', 'REMOTE')}
                  className="p-2 rounded-xl border border-slate-700 hover:border-amber-500 transition text-left cursor-pointer relative overflow-hidden shadow"
                  style={{
                    backgroundImage: `linear-gradient(to top, rgba(15, 23, 42, 0.92) 0%, rgba(15, 23, 42, 0.7) 100%), url('${earthObservation}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                  title="Filtrar por Remoto"
                >
                  <div className="text-[10px] text-slate-300 font-bold truncate">🌐 Remoto UE</div>
                  <div className="font-bold text-white text-sm">{remoteOffers.length} vacantes</div>
                </button>
              </div>
            </div>

            {/* Row 3: Operator Specialization Cards (Exact R6 Attacker / Defender visual layout) */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                ESPECIALIDADES ACTIVAS DEL OPERADOR
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button 
                  onClick={() => onSelectStation('agent_dossier', 'showcase')}
                  className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-sky-500 transition flex items-center space-x-2.5 text-left cursor-pointer group shadow"
                  title="Geofísica & GIS"
                >
                  <img 
                    src={earthObservation} 
                    alt="Geofísica Spec" 
                    className="w-9 h-9 rounded-lg object-cover border border-slate-600 group-hover:border-sky-400 shrink-0" 
                  />
                  <div className="overflow-hidden">
                    <div className="text-[11px] font-bold text-white truncate group-hover:text-sky-300">GEOFÍSICA & GIS</div>
                    <div className="text-[9.5px] font-mono text-slate-400">U. de Chile</div>
                    <div className="text-[9.5px] font-mono text-emerald-400 font-bold">R • Python • QGIS</div>
                  </div>
                </button>

                <button 
                  onClick={() => onSelectStation('agent_dossier', 'showcase')}
                  className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500 transition flex items-center space-x-2.5 text-left cursor-pointer group shadow"
                  title="Gestión Ambiental"
                >
                  <img 
                    src={biogeoLab} 
                    alt="Gestión Ambiental Spec" 
                    className="w-9 h-9 rounded-lg object-cover border border-slate-600 group-hover:border-emerald-400 shrink-0" 
                  />
                  <div className="overflow-hidden">
                    <div className="text-[11px] font-bold text-white truncate group-hover:text-emerald-300">GESTIÓN AMBIENTAL</div>
                    <div className="text-[9.5px] font-mono text-slate-400">M.Sc. CAU Kiel</div>
                    <div className="text-[9.5px] font-mono text-sky-400 font-bold">Suelos • Carbono</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
       * 2. VISOR PLANETARIO HUD (SIEMPRE DESPLEGADO EN EL FONDO)
       * ========================================================================= */}
      <div className="pt-1">
        <div className="flex items-center justify-between px-2 mb-2">
          <span className="text-xs font-mono font-bold uppercase text-[var(--text-secondary)] flex items-center gap-1.5">
            <Globe2 className="h-4 w-4 text-sky-500" />
            <span>VISOR PLANETARIO // RED GEOGRÁFICA DE EMPLEO</span>
          </span>
          <span className="text-[11px] font-mono text-[var(--text-muted)]">
            Santiago • Bilbao • Kiel
          </span>
        </div>
        <TacticalGlobeHUD 
          onDeploySector={(sector) => {
            if (sector === 'kiel') onSelectStation('market_radar', 'sources');
            else if (sector === 'bilbao') onSelectStation('market_radar', 'companies');
            else onSelectStation('market_radar', 'offers');
          }}
        />
      </div>
    </div>
  );
};
