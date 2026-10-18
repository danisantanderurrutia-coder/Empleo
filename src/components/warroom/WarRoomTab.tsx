import React from 'react';
import { 
  Tv, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { getStoredProfile, getStoredOffers, getStoredApplications, getStoredCompanies } from '../../services/db';
import { FUNDING_CATALOG } from '../../data/fundingCatalog';
import { TacticalGlobeHUD } from './TacticalGlobeHUD';
import { resolveAsset } from '../../utils/assets';

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

  // Funding metrics
  const totalFundingCount = FUNDING_CATALOG.length;
  const germanyFunding = FUNDING_CATALOG.filter(f => f.region === 'germany').length;
  const europeFunding = FUNDING_CATALOG.filter(f => f.region === 'europe').length;
  const euskadiFunding = FUNDING_CATALOG.filter(f => f.region === 'euskadi').length;

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
       * 1. TITULO PRINCIPAL DE PÁGINA (CAREER)
       * ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200/90 dark:border-slate-800 pb-4 gap-3">
        <div className="flex items-center space-x-3.5">
          <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl overflow-hidden shadow-md border border-cyan-500/40 shrink-0 bg-[#090b0e] flex items-center justify-center p-0.5 group">
            <img 
              src={resolveAsset('/empleo_master_logo.jpg')} 
              alt="Empleo Master Radar Logo" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div>
            <div className="flex items-center space-x-2 text-[11px] font-mono tracking-wider uppercase text-red-500 font-bold mb-1">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span>EXPEDIENTE PROFESIONAL // {profile.fullName || 'DANIEL SANTANDER'}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight font-sans drop-shadow-xs">
              CAREER
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono">
          <div className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">RADAR ACTIVO:</span>
            <span>DACH • EUSKADI • REMOTO</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
       * 2. VISOR PLANETARIO (MAPA MUNDI REALISTA THREE.JS NASA 4K)
       * ========================================================================= */}
      <div>
        <TacticalGlobeHUD 
          onDeploySector={(sector) => {
            if (sector === 'kiel') onSelectStation('market_radar', 'sources');
            else if (sector === 'bilbao') onSelectStation('market_radar', 'companies');
            else onSelectStation('market_radar', 'offers');
          }}
        />
      </div>

      {/* =========================================================================
       * 3. THE AUTHENTIC CAREER DASHBOARD (EXPEDIENTE PROFESIONAL)
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

        {/* -------------------------------------------------------------
         * 3-COLUMN CAREER GRID (IMAGE INSPIRATION)
         * ------------------------------------------------------------- */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-5">
          
          {/* =========================================================
           * COLUMN 1 (LEFT, 3 COLS): CLEARANCE LEVEL + RADAR FEED
           * ========================================================= */}
          <div className="md:col-span-3 flex flex-col justify-between gap-4">
            
            {/* Tile 1.1: FONDOS I+D (CONVOCATORIAS & PROGRAMAS) */}
            <div 
              onClick={() => onSelectStation('funding')}
              className="bg-[#121a2a]/95 backdrop-blur-md rounded-2xl p-5 border border-slate-700 shadow-xl flex flex-col justify-between min-h-[195px] relative overflow-hidden group hover:border-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.25)] transition cursor-pointer"
              title="Click para explorar Convocatorias y Subvenciones I+D"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black uppercase tracking-wider text-slate-100 group-hover:text-amber-300 transition flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>FONDOS I+D</span>
                </span>
                <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-600">
                  {totalFundingCount} CONVOCATORIAS
                </span>
              </div>

              {/* Funding Telemetry Display */}
              <div className="flex flex-col items-center justify-center my-1.5 text-center">
                <div className="text-3xl font-black text-amber-400 font-sans tracking-tight drop-shadow-md">
                  €2.8M+
                </div>
                <div className="text-[11px] font-mono font-black text-white uppercase tracking-wider mt-0.5">
                  BOLSA DE FONDOS DISPONIBLES
                </div>
                <div className="text-[10px] font-mono text-slate-300 mt-1">
                  {germanyFunding} DACH • {europeFunding} Horizon UE • {euskadiFunding} Euskadi
                </div>
              </div>

              {/* Progress / Status Bar */}
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700 flex">
                  <div className="h-full bg-amber-400" style={{ width: '45%' }} title="DACH / DFG / DAAD" />
                  <div className="h-full bg-sky-400" style={{ width: '35%' }} title="Horizon Europe" />
                  <div className="h-full bg-emerald-400" style={{ width: '20%' }} title="Euskadi Hazitek" />
                </div>
                <div className="text-[10px] font-mono font-bold text-slate-300 flex items-center justify-between">
                  <span>HORIZON • DAAD • EUSKADI</span>
                  <span className="text-amber-400 font-mono group-hover:translate-x-0.5 transition-transform">VER CONVOCATORIAS »</span>
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
           * COLUMN 2 (CENTER, 4 COLS): MY RANK + TRACK RECORD (RADAR STYLE)
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

            {/* Tile 2.2: TRACK RECORD & CANDIDATURAS (REDISEÑADO EN ESTILO RADAR HUD) */}
            <div 
              onClick={() => onSelectStation('mission_control', 'applications')}
              className="rounded-2xl p-5 border border-slate-700 shadow-xl min-h-[195px] flex flex-col justify-between relative overflow-hidden group cursor-pointer hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] transition"
              style={{
                backgroundImage: `linear-gradient(to top, rgba(8, 20, 16, 0.95), rgba(8, 20, 16, 0.65)), url('https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              title="Click para ver Locker y Candidaturas"
            >
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-mono font-black uppercase tracking-wider text-white drop-shadow">
                    TRACK RECORD
                  </span>
                  <span className="text-[9px] font-mono font-black px-1.5 py-0.5 rounded bg-emerald-600 text-white shadow">
                    AUDITADO
                  </span>
                </div>
                <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                  100% REAL
                </span>
              </div>

              {/* Center Radar Telemetry Readout */}
              <div className="flex flex-col items-center justify-center my-2 z-10 text-center">
                <ShieldCheck className="h-9 w-9 text-emerald-400 group-hover:scale-110 transition mb-1 drop-shadow" />
                <span className="text-sm font-mono font-black text-white uppercase tracking-wider drop-shadow">
                  0 ALUCINACIONES // VERIFICADO
                </span>
                <span className="text-[11px] text-slate-200 font-mono font-medium drop-shadow mt-0.5">
                  {colSent.length > 0 ? `${colSent.length} Envíos Confirmados` : 'Postulaciones con Fuentes Oficiales'}
                </span>
              </div>

              <div className="text-[11px] font-mono font-bold text-emerald-400 flex items-center justify-between z-10 border-t border-slate-700/80 pt-2">
                <span>LOCKER KANBAN</span>
                <span>DESPACHO »</span>
              </div>
            </div>
          </div>

          {/* =========================================================
           * COLUMN 3 (RIGHT, 5 COLS): STATISTICS (EXPEDIENTE CON TEXTO AGRUPADO)
           * ========================================================= */}
          <div className="md:col-span-5 bg-[#121a2a]/95 backdrop-blur-md rounded-2xl p-5 border border-slate-700 shadow-xl flex flex-col justify-between gap-3.5">
            
            {/* Header with Clear Contextual Narrative */}
            <div className="border-b border-slate-700/80 pb-2.5 flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-mono font-black text-white uppercase tracking-wider">
                    STATISTICS
                  </h3>
                  <span className="text-[9px] font-mono text-emerald-400 font-bold px-1.5 py-0.2 rounded bg-emerald-950/60 border border-emerald-800">
                    EN VIVO
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-sans mt-0.5 leading-tight">
                  Telemetría calculada cruzando tu Doble M.Sc. de Kiel y Geofísica U. de Chile con vacantes indexadas.
                </p>
              </div>
            </div>

            {/* Block 1: Big 3 Numbers with Explanatory Criteria */}
            <div className="space-y-1.5 border-b border-slate-700/80 pb-3">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                <span>ÍNDICE DE AFINIDAD & TARGETS</span>
                <span className="text-emerald-400">CORRESPONDENCIA &gt;70%</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => onSelectStation('market_radar', 'offers', 'ALL')}
                  className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-red-500 transition text-left cursor-pointer group"
                  title="Ver vacantes del Radar"
                >
                  <div className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider group-hover:text-red-400 transition">Targets</div>
                  <div className="text-2xl font-black text-white font-sans">{offers.length}</div>
                  <div className="text-[9px] text-slate-400 font-mono mt-0.5 truncate">Total indexado</div>
                </button>

                <button 
                  onClick={() => onSelectStation('market_radar', 'companies')}
                  className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500 transition text-left cursor-pointer group"
                  title="Ver Centros I+D"
                >
                  <div className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider group-hover:text-emerald-400 transition">Centros I+D</div>
                  <div className="text-2xl font-black text-white font-sans">{companies.length}</div>
                  <div className="text-[9px] text-slate-400 font-mono mt-0.5 truncate">BRTA • DACH</div>
                </button>

                <button 
                  onClick={() => onSelectStation('market_radar', 'offers', 'HIGH_MATCH')}
                  className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-sky-400 transition text-left cursor-pointer group"
                  title="Ver vacantes de alta afinidad"
                >
                  <div className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider group-hover:text-sky-300 transition">Afinidad ≥70%</div>
                  <div className="text-2xl font-black text-emerald-400 font-sans">{highMatchOffers.length}</div>
                  <div className="text-[9px] text-emerald-400/80 font-mono mt-0.5 truncate">Perfil prioritario</div>
                </button>
              </div>
            </div>

            {/* Block 2: Geographical Distribution with Strategic Legal Context */}
            <div className="space-y-1.5 border-b border-slate-700/80 pb-3">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                <span>TEATROS DE OPERACIONES & MARCO LEGAL</span>
                <span className="text-sky-300">MOVILIDAD UE</span>
              </div>

              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                <button 
                  onClick={() => onSelectStation('market_radar', 'offers', 'BILBAO')}
                  className="p-2 rounded-xl border border-slate-700 hover:border-emerald-500 transition text-left cursor-pointer relative overflow-hidden shadow group"
                  style={{
                    backgroundImage: `linear-gradient(to top, rgba(15, 23, 42, 0.94) 0%, rgba(15, 23, 42, 0.75) 100%), url('${euskadiTech}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                  title="Filtrar por Euskadi"
                >
                  <div className="text-[10px] text-slate-300 font-bold truncate">📍 Euskadi</div>
                  <div className="font-bold text-white text-sm">{euskadiOffers.length} vacantes</div>
                  <div className="text-[8.5px] text-emerald-400 font-mono truncate mt-0.5">Ley 14/2013 • PAC</div>
                </button>

                <button 
                  onClick={() => onSelectStation('market_radar', 'offers', 'GERMANY')}
                  className="p-2 rounded-xl border border-slate-700 hover:border-sky-500 transition text-left cursor-pointer relative overflow-hidden shadow group"
                  style={{
                    backgroundImage: `linear-gradient(to top, rgba(15, 23, 42, 0.94) 0%, rgba(15, 23, 42, 0.75) 100%), url('${germanyTech}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                  title="Filtrar por Alemania / DACH"
                >
                  <div className="text-[10px] text-slate-300 font-bold truncate">🇩🇪 DACH §20</div>
                  <div className="font-bold text-white text-sm">{germanyOffers.length} vacantes</div>
                  <div className="text-[8.5px] text-sky-400 font-mono truncate mt-0.5">Visado 18m • Blue Card</div>
                </button>

                <button 
                  onClick={() => onSelectStation('market_radar', 'offers', 'REMOTE')}
                  className="p-2 rounded-xl border border-slate-700 hover:border-amber-500 transition text-left cursor-pointer relative overflow-hidden shadow group"
                  style={{
                    backgroundImage: `linear-gradient(to top, rgba(15, 23, 42, 0.94) 0%, rgba(15, 23, 42, 0.75) 100%), url('${earthObservation}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                  title="Filtrar por Remoto"
                >
                  <div className="text-[10px] text-slate-300 font-bold truncate">🌐 Remoto UE</div>
                  <div className="font-bold text-white text-sm">{remoteOffers.length} vacantes</div>
                  <div className="text-[8.5px] text-amber-400 font-mono truncate mt-0.5">Consultoría climática</div>
                </button>
              </div>
            </div>

            {/* Block 3: Operator Specialization Cards with Evidence Backing */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                <span>ESPECIALIDADES ACREDITADAS</span>
                <span className="text-slate-400">PORTAFOLIO ACTIVO</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button 
                  onClick={() => onSelectStation('agent_dossier', 'showcase')}
                  className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-sky-500 transition flex items-center space-x-2.5 text-left cursor-pointer group shadow"
                  title="Geofísica & GIS"
                >
                  <img 
                    src={earthObservation} 
                    alt="Geofísica Spec" 
                    className="w-10 h-10 rounded-lg object-cover border border-slate-600 group-hover:border-sky-400 shrink-0" 
                  />
                  <div className="overflow-hidden">
                    <div className="text-[11px] font-bold text-white truncate group-hover:text-sky-300">GEOFÍSICA & GIS</div>
                    <div className="text-[9.5px] font-mono text-slate-400 truncate">U. de Chile • 2018</div>
                    <div className="text-[9.5px] font-mono text-emerald-400 font-bold truncate">R • Python • QGIS • GEE</div>
                  </div>
                </button>

                <button 
                  onClick={() => onSelectStation('agent_dossier', 'showcase')}
                  className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500 transition flex items-center space-x-2.5 text-left cursor-pointer group shadow"
                  title="Gestión Ambiental"
                >
                  <img 
                    src={biogeoLab} 
                    alt="Gestión Ambiental Spec" 
                    className="w-10 h-10 rounded-lg object-cover border border-slate-600 group-hover:border-emerald-400 shrink-0" 
                  />
                  <div className="overflow-hidden">
                    <div className="text-[11px] font-bold text-white truncate group-hover:text-emerald-300">GESTIÓN AMBIENTAL</div>
                    <div className="text-[9.5px] font-mono text-slate-400 truncate">M.Sc. CAU Kiel • 2024</div>
                    <div className="text-[9.5px] font-mono text-sky-400 font-bold truncate">Suelos • Carbono • Directivas</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
