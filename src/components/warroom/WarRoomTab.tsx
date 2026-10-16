import React from 'react';
import { 
  Award, 
  ChevronRight, 
  Tv, 
  KanbanSquare
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

  // Locker stages
  const colRadar = applications.filter(a => a.currentStage <= 2 && a.status === 'En Progreso');
  const colPrep = applications.filter(a => a.currentStage >= 3 && a.currentStage <= 5 && a.status === 'En Progreso');
  const colSent = applications.filter(a => (a.currentStage >= 6 && a.currentStage <= 7) || a.status === 'Enviada');
  const colInterviews = applications.filter(a => a.currentStage === 8 || a.status === 'Entrevista');
  const activeApplications = applications.filter(a => a.status !== 'Desestimada');

  // Photographic Assets from Unsplash for realistic tactical work & science environments
  const backgroundWall = 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1920&q=80';
  const professionalResearcher = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80';
  const droneScreen = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80';
  const earthObservation = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80';
  const biogeoLab = 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80';
  const germanyTech = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80';
  const euskadiTech = 'https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&w=800&q=80';
  const missionControlScreen = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80';

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

        {/* Live Status Indicator (Uncluttered, redundant header buttons removed) */}
        <div className="flex items-center space-x-2 text-[11px] font-mono">
          <div className="px-3.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-300 flex items-center gap-2 shadow">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-emerald-400 font-bold">IMF HQ:</span>
            <span>RECONOCIMIENTO & DESPACHO ACTIVO</span>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
       * EXACT RAINBOW SIX SIEGE 3-COLUMN CAREER GRID (IMAGE 4)
       * ------------------------------------------------------------- */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* =========================================================
         * COLUMN 1 (LEFT, 3 COLS): CLEARANCE LEVEL + REPLAYS
         * ========================================================= */}
        <div className="md:col-span-3 space-y-4 flex flex-col justify-between">
          {/* Tile 1.1: CLEARANCE LEVEL */}
          <div 
            onClick={() => onSelectStation('agent_dossier', 'showcase')}
            className="bg-[#121927]/95 backdrop-blur-md rounded-xl p-5 border border-slate-600 shadow-2xl flex flex-col justify-between min-h-[195px] relative overflow-hidden group hover:border-sky-400 hover:shadow-[0_0_20px_rgba(56,189,248,0.25)] transition cursor-pointer"
            title="Click para ver el Expediente del Operador"
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
                {/* SVG Tactical Laurel Wreath */}
                <svg viewBox="0 0 100 100" className="w-20 h-20 text-slate-100 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
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

            {/* XP Progress Bar */}
            <div className="space-y-1">
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div className="h-full bg-slate-100 w-full" />
              </div>
              <div className="text-[11px] font-mono font-bold text-slate-200 flex items-center justify-between">
                <span>1000 / 1000 XP</span>
                <span className="text-sky-300 font-mono text-[10px]">VER SKIN »</span>
              </div>
            </div>
          </div>

          {/* Tile 1.2: REPLAYS [BETA] */}
          <div 
            onClick={onLaunchRadar}
            className="rounded-xl p-5 border border-slate-600 shadow-2xl min-h-[195px] flex flex-col justify-between relative overflow-hidden group cursor-pointer hover:border-sky-400 transition"
            style={{
              backgroundImage: `linear-gradient(to top, rgba(10, 16, 26, 0.95), rgba(10, 16, 26, 0.55)), url('${droneScreen}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="flex items-center space-x-1.5 z-10">
              <span className="text-xs font-mono font-black uppercase tracking-wider text-white drop-shadow">
                REPLAYS
              </span>
              <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded bg-red-600 text-white shadow">
                LIVE
              </span>
            </div>

            <div className="flex flex-col items-center justify-center my-3 z-10 text-center">
              <Tv className="h-10 w-10 text-slate-200 group-hover:text-sky-300 transition mb-1 drop-shadow" />
              <span className="text-sm font-mono font-black text-white uppercase tracking-wider drop-shadow">
                RADAR: {offers.length} VACANTES
              </span>
              <span className="text-[11px] text-slate-200 font-mono font-medium drop-shadow mt-0.5">
                {germanyOffers.length} Alemania • {euskadiOffers.length} Euskadi • {remoteOffers.length} Remoto
              </span>
            </div>

            <div className="text-[11px] font-mono font-bold text-sky-300 flex items-center justify-between z-10 border-t border-slate-700 pt-2">
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
            onClick={() => onSelectStation('agent_dossier', 'showcase')}
            className="rounded-xl p-5 border-2 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.35)] min-h-[195px] flex flex-col justify-between relative overflow-hidden group cursor-pointer hover:border-white hover:scale-[1.01] transition"
            title="Click para ver el Operador Daniel Santander y sus Atributos"
            style={{
              backgroundImage: `linear-gradient(to top, rgba(220, 38, 38, 0.95) 0%, rgba(185, 28, 28, 0.6) 35%, rgba(10, 14, 22, 0.65) 100%), url('${professionalResearcher}')`,
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

            {/* Tactical Shield Emblem & Rank Title */}
            <div className="flex flex-col items-center justify-center my-2 z-10">
              <div className="w-14 h-14 rounded-xl bg-black/60 border-2 border-white flex items-center justify-center shadow-2xl mb-1.5 group-hover:scale-110 transition">
                {/* Military Rank Chevron Shield */}
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-white drop-shadow">
                  <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="2.5" />
                  <path d="M8 11l4 3 4-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M8 8l4 3 4-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>

              <h3 className="text-lg font-black text-white uppercase tracking-wider font-sans drop-shadow-lg text-center">
                ELITE FIELD SCIENTIST
              </h3>
              <span className="text-xs font-mono text-white font-extrabold uppercase tracking-widest drop-shadow bg-black/40 px-2 py-0.5 rounded mt-0.5">
                AUFENTHG §20 & LEY 14
              </span>
            </div>

            <div className="text-[11px] font-mono font-black text-white text-center z-10 border-t border-red-300/40 pt-1.5 drop-shadow flex items-center justify-between">
              <span>TRANSICIÓN ACTIVA A EU BLUE CARD</span>
              <span>EXPEDIENTE »</span>
            </div>
          </div>

          {/* Tile 2.2: REPUTATION */}
          <div 
            onClick={() => onSelectStation('mission_control', 'applications')}
            className="bg-[#121927]/95 backdrop-blur-md rounded-xl p-5 border border-slate-600 shadow-2xl min-h-[195px] flex flex-col justify-between relative overflow-hidden group hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] transition cursor-pointer"
            title="Click para ver Locker y Despacho Asistido"
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
            <div className="flex flex-col items-center justify-center my-2 text-center">
              <div className="w-12 h-12 rounded-lg bg-slate-800 border-2 border-slate-400 flex items-center justify-center shadow-lg mb-1.5 group-hover:scale-105 transition">
                <Award className="h-7 w-7 text-white" />
              </div>
              <h4 className="text-base font-black text-white uppercase tracking-wider">
                RESPECTABLE
              </h4>
              <span className="text-xs font-mono font-bold text-slate-200">
                {colSent.length > 0 ? `${colSent.length} Envíos Confirmados por Ti` : '100% Despacho Mediado por Ti'}
              </span>
            </div>

            <div className="text-[11px] font-mono font-bold text-slate-200 text-center border-t border-slate-700 pt-1.5 flex items-center justify-between">
              <span>CERO BOTS • AUDITORÍA LIMPIA</span>
              <span className="text-emerald-400 font-mono text-[10px]">LOCKER »</span>
            </div>
          </div>
        </div>

        {/* =========================================================
         * COLUMN 3 (RIGHT, 5 COLS): FULL-HEIGHT STATISTICS CARD
         * ========================================================= */}
        <div className="md:col-span-5 bg-[#121927]/95 backdrop-blur-md rounded-xl p-6 border border-slate-600 shadow-2xl flex flex-col justify-between space-y-4">
          {/* Header */}
          <div className="border-b border-slate-700 pb-2">
            <h3 className="text-sm font-mono font-black text-white uppercase tracking-wider drop-shadow">
              STATISTICS
            </h3>
            <span className="text-[10px] font-mono text-slate-300 font-bold uppercase tracking-widest">
              ACCOUNT & OPERATIONAL METRICS
            </span>
          </div>

          {/* Row 1: Big 3 Numbers */}
          <div className="grid grid-cols-3 gap-2 border-b border-slate-700 pb-3">
            <button 
              onClick={() => onSelectStation('market_radar', 'offers', 'ALL')}
              className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-red-500 transition text-left cursor-pointer group"
              title="Click para ver todas las vacantes en el Radar"
            >
              <div className="text-[11px] font-mono text-slate-300 font-bold uppercase tracking-wider group-hover:text-red-400 transition">Targets Radar</div>
              <div className="text-2xl font-black text-white font-sans drop-shadow">{offers.length}</div>
            </button>

            <button 
              onClick={() => onSelectStation('market_radar', 'companies')}
              className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500 transition text-left cursor-pointer group"
              title="Click para ver los Centros I+D e Institutos"
            >
              <div className="text-[11px] font-mono text-slate-300 font-bold uppercase tracking-wider group-hover:text-emerald-400 transition">Centros I+D</div>
              <div className="text-2xl font-black text-white font-sans drop-shadow">{companies.length}</div>
            </button>

            <button 
              onClick={() => onSelectStation('market_radar', 'offers', 'HIGH_MATCH')}
              className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-400 transition text-left cursor-pointer group"
              title="Click para ver vacantes con >70% de afinidad"
            >
              <div className="text-[11px] font-mono text-slate-300 font-bold uppercase tracking-wider group-hover:text-emerald-300 transition">Alta Afinidad</div>
              <div className="text-2xl font-black text-emerald-400 font-sans drop-shadow">{highMatchOffers.length}</div>
            </button>
          </div>

          {/* Row 1.5: LIVE LOCKER PIPELINE TRACKER */}
          <div className="space-y-1.5 border-b border-slate-700 pb-3">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <KanbanSquare className="h-3.5 w-3.5 text-sky-400" />
                <span>LOCKER // MISIÓN KANBAN EN VIVO</span>
              </span>
              <button
                onClick={() => onSelectStation('mission_control', 'applications')}
                className="text-[10px] text-sky-400 hover:text-white cursor-pointer font-bold"
              >
                ABRIR TABLERO »
              </button>
            </div>

            <div className="grid grid-cols-4 gap-1.5 font-mono text-xs">
              <button
                onClick={() => onSelectStation('mission_control', 'applications')}
                className="p-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-500 transition text-left cursor-pointer group"
                title="Ofertas en Radar / Guardadas en Locker"
              >
                <div className="text-[10px] text-slate-400 truncate group-hover:text-slate-200">En Radar</div>
                <div className="font-black text-white text-base">{colRadar.length}</div>
              </button>

              <button
                onClick={() => onSelectStation('mission_control', 'applications')}
                className="p-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-sky-500 transition text-left cursor-pointer group"
                title="Candidaturas en Preparación (CV / Carta)"
              >
                <div className="text-[10px] text-slate-400 truncate group-hover:text-sky-300">En Prep</div>
                <div className="font-black text-sky-400 text-base">{colPrep.length}</div>
              </button>

              <button
                onClick={() => onSelectStation('mission_control', 'applications')}
                className="p-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500 transition text-left cursor-pointer group"
                title="Postulaciones Despachadas con Aprobación Humana"
              >
                <div className="text-[10px] text-slate-400 truncate group-hover:text-emerald-300">Enviadas</div>
                <div className="font-black text-emerald-400 text-base">{colSent.length}</div>
              </button>

              <button
                onClick={() => onSelectStation('mission_control', 'applications')}
                className="p-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-purple-500 transition text-left cursor-pointer group"
                title="Entrevistas Activas"
              >
                <div className="text-[10px] text-slate-400 truncate group-hover:text-purple-300">Entrevistas</div>
                <div className="font-black text-purple-400 text-base">{colInterviews.length}</div>
              </button>
            </div>
          </div>

          {/* Row 2: Most Targeted Sectors (Dossiers) */}
          <div className="space-y-1.5 border-b border-slate-700 pb-3">
            <div className="text-[11px] font-mono text-slate-300 font-bold uppercase tracking-wider">
              Teatros de Operación Activos
            </div>

            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              <button 
                onClick={() => onSelectStation('market_radar', 'offers', 'BILBAO')}
                className="p-2.5 rounded-lg border border-slate-700 hover:border-emerald-500 transition text-left cursor-pointer group relative overflow-hidden shadow"
                style={{
                  backgroundImage: `linear-gradient(to top, rgba(15, 23, 42, 0.92) 0%, rgba(15, 23, 42, 0.72) 100%), url('${euskadiTech}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
                title="Filtrar por I+D+i Euskadi (BC3, Tecnalia, Neiker)"
              >
                <div className="text-[11px] text-slate-300 font-medium truncate group-hover:text-emerald-300">📍 Euskadi Ley 14</div>
                <div className="font-bold text-white text-base">{euskadiOffers.length} vacantes</div>
              </button>

              <button 
                onClick={() => onSelectStation('market_radar', 'offers', 'GERMANY')}
                className="p-2.5 rounded-lg border border-slate-700 hover:border-sky-500 transition text-left cursor-pointer group relative overflow-hidden shadow"
                style={{
                  backgroundImage: `linear-gradient(to top, rgba(15, 23, 42, 0.92) 0%, rgba(15, 23, 42, 0.72) 100%), url('${germanyTech}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
                title="Filtrar por Alemania / DACH (§20 AufenthG)"
              >
                <div className="text-[11px] text-slate-300 font-medium truncate group-hover:text-sky-300">🇩🇪 DACH §20</div>
                <div className="font-bold text-white text-base">{germanyOffers.length} vacantes</div>
              </button>

              <button 
                onClick={() => onSelectStation('market_radar', 'offers', 'REMOTE')}
                className="p-2.5 rounded-lg border border-slate-700 hover:border-amber-500 transition text-left cursor-pointer group relative overflow-hidden shadow"
                style={{
                  backgroundImage: `linear-gradient(to top, rgba(15, 23, 42, 0.92) 0%, rgba(15, 23, 42, 0.72) 100%), url('${earthObservation}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
                title="Filtrar por 100% Remoto UE"
              >
                <div className="text-[11px] text-slate-300 font-medium truncate group-hover:text-amber-300">🌐 Remoto UE</div>
                <div className="font-bold text-white text-base">{remoteOffers.length} vacantes</div>
              </button>
            </div>
          </div>

          {/* Row 3: Specialist Profile Configurations */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono text-slate-300 font-bold uppercase tracking-wider">
              Especialidades del Operador Daniel Santander
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Operator 1: Geofísica & Modelación */}
              <button 
                onClick={() => onSelectStation('agent_dossier', 'showcase')}
                className="p-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-sky-500 transition flex items-center space-x-3 text-left cursor-pointer group shadow"
                title="Click para ver Showcase del Operador"
              >
                <img 
                  src={earthObservation} 
                  alt="Geofísica Spec" 
                  className="w-10 h-10 rounded-lg object-cover border border-slate-500 group-hover:border-sky-400 shrink-0" 
                />
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-white truncate drop-shadow group-hover:text-sky-300">GEOFÍSICA & GIS</div>
                  <div className="text-[10px] font-mono text-slate-300 font-semibold">U. de Chile</div>
                  <div className="text-[10px] font-mono text-emerald-400 font-bold">R • Python • QGIS</div>
                </div>
              </button>

              {/* Operator 2: Biofísica & CAU Kiel */}
              <button 
                onClick={() => onSelectStation('agent_dossier', 'showcase')}
                className="p-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500 transition flex items-center space-x-3 text-left cursor-pointer group shadow"
                title="Click para ver Showcase del Operador"
              >
                <img 
                  src={biogeoLab} 
                  alt="Gestión Ambiental Spec" 
                  className="w-10 h-10 rounded-lg object-cover border border-slate-500 group-hover:border-emerald-400 shrink-0" 
                />
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-white truncate drop-shadow group-hover:text-emerald-300">GESTIÓN AMBIENTAL</div>
                  <div className="text-[10px] font-mono text-slate-300 font-semibold">Doble M.Sc. CAU Kiel</div>
                  <div className="text-[10px] font-mono text-sky-400 font-bold">Políticas • Suelos • Clima</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
       * TACTICAL PIPELINE MODULE: 3 FASES MEDIADAS POR EL USUARIO
       * ------------------------------------------------------------- */}
      <div className="relative z-10 mt-6 p-5 rounded-2xl bg-[#0a0f1d]/90 border border-slate-700/80 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 mb-4 gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-black text-red-500 uppercase tracking-wider flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              PIPELINE OPERATIVO // 3 FASES MEDIADAS POR EL USUARIO
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700 font-bold">
              100% HUMAN-IN-THE-LOOP
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-300 font-medium">
            Operador: {profile.fullName || 'Daniel Santander'} (Doble M.Sc. Kiel • Geofísica U. de Chile)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* FASE 1 */}
          <div 
            onClick={() => onSelectStation('market_radar', 'offers', 'ALL')}
            className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-red-500 transition cursor-pointer group flex flex-col justify-between shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-black text-white uppercase tracking-wider group-hover:text-red-400 transition">
                  FASE 1: RECONOCIMIENTO
                </span>
                <span className="text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                  {offers.length} VACANTES
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans mb-3">
                Revisión táctica de {offers.length} vacantes verificadas ({germanyOffers.length} DACH §20, {euskadiOffers.length} Euskadi Ley 14 y {remoteOffers.length} Remoto UE).
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-red-400 font-bold flex items-center justify-between">
              <span>EXPLORAR VACANTES & FUENTES</span>
              <span className="group-hover:translate-x-1 transition">»</span>
            </div>
          </div>

          {/* FASE 2 */}
          <div 
            onClick={() => onSelectStation('agent_dossier', 'showcase')}
            className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-amber-500 transition cursor-pointer group flex flex-col justify-between shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-black text-white uppercase tracking-wider group-hover:text-amber-400 transition">
                  FASE 2: SELECCIÓN & ARMERÍA
                </span>
                <span className="text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                  3 LOADOUTS
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans mb-3">
                Armamento curricular listo: Español para Euskadi, Inglés para organismos internacionales y Lebenslauf para Alemania.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-amber-400 font-bold flex items-center justify-between">
              <span>CONFIGURAR ARMAMENTO CV</span>
              <span className="group-hover:translate-x-1 transition">»</span>
            </div>
          </div>

          {/* FASE 3 */}
          <div 
            onClick={() => onSelectStation('mission_control', 'applications')}
            className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-sky-500 transition cursor-pointer group flex flex-col justify-between shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-black text-white uppercase tracking-wider group-hover:text-sky-400 transition">
                  FASE 3: PREPARACIÓN & DESPACHO
                </span>
                <span className="text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                  {activeApplications.length} EN LOCKER
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans mb-3">
                Locker táctico: {colPrep.length} en preparación, {colSent.length} despachadas con tu confirmación y {colInterviews.length} entrevistas activas.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-sky-400 font-bold flex items-center justify-between">
              <span>TABLERO KANBAN & DESPACHO</span>
              <span className="group-hover:translate-x-1 transition">»</span>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
       * TACTICAL MODE LAUNCH CARDS (RAINBOW SIX SIEGE STYLE)
       * ------------------------------------------------------------- */}
      <div className="relative z-10 mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          onClick={() => onSelectStation('market_radar', 'offers', 'GERMANY')}
          className="p-4 rounded-xl border border-slate-700 hover:border-red-500 transition text-left flex items-center justify-between group cursor-pointer shadow-xl relative overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(to top, rgba(15, 23, 42, 0.94) 0%, rgba(15, 23, 42, 0.65) 100%), url('${germanyTech}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="z-10">
            <div className="text-xs font-mono font-bold text-white uppercase group-hover:text-red-400 transition drop-shadow">
              PLAY RANKED // ALEMANIA
            </div>
            <div className="text-[11px] text-slate-200 font-mono font-medium drop-shadow mt-0.5">
              {germanyOffers.length} Vacantes §20 AufenthG • DACH
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-red-400 group-hover:translate-x-1 transition z-10" />
        </button>

        <button
          onClick={() => onSelectStation('market_radar', 'offers', 'BILBAO')}
          className="p-4 rounded-xl border border-slate-700 hover:border-emerald-500 transition text-left flex items-center justify-between group cursor-pointer shadow-xl relative overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(to top, rgba(15, 23, 42, 0.94) 0%, rgba(15, 23, 42, 0.65) 100%), url('${euskadiTech}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="z-10">
            <div className="text-xs font-mono font-bold text-white uppercase group-hover:text-emerald-400 transition drop-shadow">
              PLAY STANDARD // EUSKADI
            </div>
            <div className="text-[11px] text-slate-200 font-mono font-medium drop-shadow mt-0.5">
              {euskadiOffers.length} Vacantes Ley 14 • Centros I+D
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-400 group-hover:translate-x-1 transition z-10" />
        </button>

        <button
          onClick={() => onSelectStation('agent_dossier', 'showcase')}
          className="p-4 rounded-xl border border-slate-700 hover:border-amber-500 transition text-left flex items-center justify-between group cursor-pointer shadow-xl relative overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(to top, rgba(15, 23, 42, 0.94) 0%, rgba(15, 23, 42, 0.65) 100%), url('${earthObservation}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="z-10">
            <div className="text-xs font-mono font-bold text-white uppercase group-hover:text-amber-400 transition drop-shadow">
              OPERATORS // SHOWCASE
            </div>
            <div className="text-[11px] text-slate-200 font-mono font-medium drop-shadow mt-0.5">
              Daniel Santander • Clearance 50
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-amber-400 group-hover:translate-x-1 transition z-10" />
        </button>

        <button
          onClick={() => onSelectStation('mission_control', 'applications')}
          className="p-4 rounded-xl border border-slate-700 hover:border-sky-500 transition text-left flex items-center justify-between group cursor-pointer shadow-xl relative overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(to top, rgba(15, 23, 42, 0.94) 0%, rgba(15, 23, 42, 0.65) 100%), url('${missionControlScreen}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="z-10">
            <div className="text-xs font-mono font-bold text-white uppercase group-hover:text-sky-400 transition drop-shadow">
              LOCKER // MISIÓN KANBAN
            </div>
            <div className="text-[11px] text-slate-200 font-mono font-medium drop-shadow mt-0.5">
              {activeApplications.length} Candidaturas en Seguimiento
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-sky-400 group-hover:translate-x-1 transition z-10" />
        </button>
      </div>

      {/* -------------------------------------------------------------
       * TACTICAL GLOBE HUD (IMF / GLOBO PLANETARIO PERMANENTE)
       * ------------------------------------------------------------- */}
      <div className="relative z-10 mt-6">
        <TacticalGlobeHUD 
          onDeploySector={(sector) => {
            if (sector === 'kiel') onSelectStation('market_radar', 'offers', 'GERMANY');
            else if (sector === 'bilbao') onSelectStation('market_radar', 'offers', 'BILBAO');
            else onSelectStation('market_radar', 'offers', 'ALL');
          }}
        />
      </div>
    </div>
  );
};
