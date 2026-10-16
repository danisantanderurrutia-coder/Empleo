import React from 'react';
import { 
  ChevronRight, 
  Radio,
  FileText,
  Globe2,
  Sparkles,
  MapPin,
  Building2,
  ShieldCheck,
  Send,
  GraduationCap
} from 'lucide-react';
import { getStoredProfile, getStoredOffers, getStoredApplications, getStoredCompanies } from '../../services/db';
import { TacticalGlobeHUD } from './TacticalGlobeHUD';

interface WarRoomTabProps {
  onSelectStation: (stationId: string, subTab?: string, filter?: string) => void;
  onLaunchRadar?: () => void;
}

export const WarRoomTab: React.FC<WarRoomTabProps> = ({ onSelectStation, onLaunchRadar: _onLaunchRadar }) => {
  const profile = getStoredProfile();
  const offers = getStoredOffers();
  const applications = getStoredApplications();
  const companies = getStoredCompanies();

  // Compute live data metrics
  const highMatchOffers = offers
    .filter(o => (o.matchScore?.totalScore || 0) >= 70)
    .sort((a, b) => (b.matchScore?.totalScore || 0) - (a.matchScore?.totalScore || 0));

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

  // Stages
  const colRadar = applications.filter(a => a.currentStage <= 2 && a.status === 'En Progreso');
  const colPrep = applications.filter(a => a.currentStage >= 3 && a.currentStage <= 5 && a.status === 'En Progreso');
  const colSent = applications.filter(a => (a.currentStage >= 6 && a.currentStage <= 7) || a.status === 'Enviada');
  const colInterviews = applications.filter(a => a.currentStage === 8 || a.status === 'Entrevista');
  const activeApplications = applications.filter(a => a.status !== 'Desestimada');

  // Photographic Assets
  const earthObservation = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80';
  const germanyTech = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80';
  const euskadiTech = 'https://images.unsplash.com/photo-1498084393753-b411b2d26b34?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="space-y-6 text-[var(--text-primary)] font-sans select-none animate-fadeIn">
      
      {/* =========================================================================
       * 1. HEADER HERO: CONSOLA OPERATIVA DE CARRERA (SIN TEXTO DE RELLENO)
       * ========================================================================= */}
      <div className="p-6 rounded-2xl bg-[var(--panel-bg)] border border-[var(--panel-border)] shadow-sm backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold tracking-wider uppercase text-sky-600 mb-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>EXPEDIENTE ACTIVO // {profile.fullName || 'DANIEL SANTANDER'}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[var(--text-primary)] font-sans">
            Consola de Operaciones Profesionales
          </h1>
          <p className="text-xs text-[var(--text-muted)] font-medium mt-0.5">
            Doble M.Sc. en Gestión y Protección Ambiental (CAU Kiel) • Licenciado en Geofísica (U. de Chile)
          </p>
        </div>

        {/* Live Metrics Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-600 text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm">
            <Radio className="h-3.5 w-3.5" />
            <span>{offers.length} Vacantes en Radar</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm">
            <Send className="h-3.5 w-3.5" />
            <span>{activeApplications.length} Procesos Activos</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-500/10 border border-slate-500/20 text-[var(--text-muted)] text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm">
            <Building2 className="h-3.5 w-3.5" />
            <span>{companies.length} Institutos I+D</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
       * 2. STEPPER VISUAL INTERACTIVO (EL CICLO DE TRABAJO EN 3 ESTACIONES)
       * ========================================================================= */}
      <div className="p-5 rounded-2xl bg-[var(--panel-bg)] border border-[var(--panel-border)] shadow-sm backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-[var(--panel-border)] pb-3 mb-4">
          <span className="text-xs font-mono font-black uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-sky-600" />
            <span>FLUJO OPERATIVO INTEGRADO // 3 ESTACIONES DE TRABAJO</span>
          </span>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">
            SISTEMA LOCAL 100% PRIVADO
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Estación 01: Mercado */}
          <button
            onClick={() => onSelectStation('market_radar', 'offers', 'ALL')}
            className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-sky-500 hover:shadow-md transition text-left cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-black text-sky-600 uppercase tracking-wider">
                  01 // MERCADO & RADAR
                </span>
                <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-600 border border-sky-500/20">
                  {offers.length} Vacantes
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 my-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[var(--text-secondary)] font-bold">
                  🇩🇪 {germanyOffers.length} DACH
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[var(--text-secondary)] font-bold">
                  🇪🇸 {euskadiOffers.length} Euskadi
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[var(--text-secondary)] font-bold">
                  🌐 {remoteOffers.length} Remoto
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-[var(--card-border)] text-[11px] font-mono font-bold text-sky-600 flex items-center justify-between group-hover:text-sky-500">
              <span>Explorar Ofertas & Filtros</span>
              <span className="group-hover:translate-x-1 transition">»</span>
            </div>
          </button>

          {/* Estación 02: Perfil & CV Modular */}
          <button
            onClick={() => onSelectStation('agent_dossier', 'gunsmith')}
            className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-sky-500 hover:shadow-md transition text-left cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-black text-sky-600 uppercase tracking-wider">
                  02 // TALLER DE CV MODULAR
                </span>
                <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  Puzzle Listo
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 my-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[var(--text-secondary)] font-bold">
                  Suelos & Carbono
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[var(--text-secondary)] font-bold">
                  Geofísica & GIS
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[var(--text-secondary)] font-bold">
                  Políticas UE
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-[var(--card-border)] text-[11px] font-mono font-bold text-sky-600 flex items-center justify-between group-hover:text-sky-500">
              <span>Calibrar CV en 1 Página</span>
              <span className="group-hover:translate-x-1 transition">»</span>
            </div>
          </button>

          {/* Estación 03: Seguimiento & Candidaturas */}
          <button
            onClick={() => onSelectStation('mission_control', 'applications')}
            className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-sky-500 hover:shadow-md transition text-left cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-black text-sky-600 uppercase tracking-wider">
                  03 // CANDIDATURAS & KANBAN
                </span>
                <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 border border-purple-500/20">
                  {activeApplications.length} Activas
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 my-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[var(--text-secondary)] font-bold">
                  {colRadar.length} En Radar
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[var(--text-secondary)] font-bold">
                  {colPrep.length} En Prep
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[var(--text-secondary)] font-bold">
                  {colSent.length} Enviadas
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 font-bold">
                  {colInterviews.length} Entrevistas
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-[var(--card-border)] text-[11px] font-mono font-bold text-sky-600 flex items-center justify-between group-hover:text-sky-500">
              <span>Ver Tablero de Procesos</span>
              <span className="group-hover:translate-x-1 transition">»</span>
            </div>
          </button>
        </div>
      </div>

      {/* =========================================================================
       * 3. TEATROS ESTRATÉGICOS (FOTOGRAFÍA + MICRO-CHIPS + ACCESO 1-CLICK)
       * ========================================================================= */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs font-mono font-black text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
            <Globe2 className="h-4 w-4 text-sky-600" />
            <span>TEATROS DE CONTRATACIÓN ESTRATÉGICA</span>
          </h2>
          <span className="text-[11px] text-[var(--text-muted)] font-mono">
            Alemania • Euskadi • Remoto Internacional
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Alemania / DACH */}
          <div
            onClick={() => onSelectStation('market_radar', 'offers', 'GERMANY')}
            className="rounded-2xl p-5 border border-[var(--card-border)] hover:border-sky-500 transition shadow-sm hover:shadow-md cursor-pointer group relative overflow-hidden flex flex-col justify-between min-h-[170px]"
            style={{
              backgroundImage: `linear-gradient(to top, rgba(15, 23, 42, 0.92) 0%, rgba(15, 23, 42, 0.55) 100%), url('${germanyTech}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="z-10 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span>🇩🇪</span>
                <span>ALEMANIA / DACH</span>
              </span>
              <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-sky-500 text-white">
                §20 AUFENTHG
              </span>
            </div>

            <div className="z-10 my-2">
              <div className="text-3xl font-black text-white font-sans drop-shadow-md">
                {germanyOffers.length} <span className="text-sm font-mono font-medium text-slate-200">vacantes</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/20 text-white backdrop-blur-sm">
                  Centros Helmholtz
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/20 text-white backdrop-blur-sm">
                  Kiel • Potsdam • Berlín
                </span>
              </div>
            </div>

            <div className="z-10 pt-2 border-t border-white/20 text-[11px] font-mono font-bold text-sky-300 flex items-center justify-between group-hover:text-white">
              <span>Filtrar DACH</span>
              <span className="group-hover:translate-x-1 transition">»</span>
            </div>
          </div>

          {/* Card 2: Euskadi / Ley 14 */}
          <div
            onClick={() => onSelectStation('market_radar', 'offers', 'BILBAO')}
            className="rounded-2xl p-5 border border-[var(--card-border)] hover:border-emerald-500 transition shadow-sm hover:shadow-md cursor-pointer group relative overflow-hidden flex flex-col justify-between min-h-[170px]"
            style={{
              backgroundImage: `linear-gradient(to top, rgba(15, 23, 42, 0.92) 0%, rgba(15, 23, 42, 0.55) 100%), url('${euskadiTech}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="z-10 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span>🇪🇸</span>
                <span>EUSKADI / BILBAO</span>
              </span>
              <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-emerald-600 text-white">
                LEY 14 UGE
              </span>
            </div>

            <div className="z-10 my-2">
              <div className="text-3xl font-black text-white font-sans drop-shadow-md">
                {euskadiOffers.length} <span className="text-sm font-mono font-medium text-slate-200">vacantes</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/20 text-white backdrop-blur-sm">
                  BC3 • Tecnalia • IDOM
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/20 text-white backdrop-blur-sm">
                  I+D+i País Vasco
                </span>
              </div>
            </div>

            <div className="z-10 pt-2 border-t border-white/20 text-[11px] font-mono font-bold text-emerald-300 flex items-center justify-between group-hover:text-white">
              <span>Filtrar Euskadi</span>
              <span className="group-hover:translate-x-1 transition">»</span>
            </div>
          </div>

          {/* Card 3: 100% Remoto UE */}
          <div
            onClick={() => onSelectStation('market_radar', 'offers', 'REMOTE')}
            className="rounded-2xl p-5 border border-[var(--card-border)] hover:border-amber-500 transition shadow-sm hover:shadow-md cursor-pointer group relative overflow-hidden flex flex-col justify-between min-h-[170px]"
            style={{
              backgroundImage: `linear-gradient(to top, rgba(15, 23, 42, 0.92) 0%, rgba(15, 23, 42, 0.55) 100%), url('${earthObservation}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="z-10 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span>🌐</span>
                <span>REMOTO EUROPEO</span>
              </span>
              <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-amber-600 text-white">
                100% TELETRABAJO
              </span>
            </div>

            <div className="z-10 my-2">
              <div className="text-3xl font-black text-white font-sans drop-shadow-md">
                {remoteOffers.length} <span className="text-sm font-mono font-medium text-slate-200">vacantes</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/20 text-white backdrop-blur-sm">
                  Remotive • Jobicy • Arbeitnow
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/20 text-white backdrop-blur-sm">
                  Flexibilidad Total
                </span>
              </div>
            </div>

            <div className="z-10 pt-2 border-t border-white/20 text-[11px] font-mono font-bold text-amber-300 flex items-center justify-between group-hover:text-white">
              <span>Filtrar Remoto</span>
              <span className="group-hover:translate-x-1 transition">»</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
       * 4. RADIOGRAFÍA TÉCNICA: EXPEDIENTE VS. TOP VACANTES AFINES
       * ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Col 1 (5 cols): Nivel de Expediente & Capacidades */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[var(--panel-bg)] border border-[var(--panel-border)] shadow-sm backdrop-blur-md flex flex-col justify-between space-y-4">
          <div className="border-b border-[var(--panel-border)] pb-2 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-mono font-black text-[var(--text-primary)] uppercase tracking-wider">
                EXPEDIENTE PROFESIONAL VERIFICADO
              </h3>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">
                DANIEL SANTANDER • CAU KIEL / U. DE CHILE
              </span>
            </div>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </div>

          {/* SVG Circular Gauge of Completion */}
          <div className="flex items-center space-x-5 py-2">
            <div className="relative flex items-center justify-center shrink-0">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" className="text-slate-200 dark:text-slate-800" fill="transparent" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  stroke="currentColor" 
                  strokeWidth="8" 
                  strokeDasharray="251.2" 
                  strokeDashoffset="0" 
                  strokeLinecap="round" 
                  className="text-emerald-500 transition-all duration-1000" 
                  fill="transparent" 
                />
              </svg>
              <span className="absolute text-base font-mono font-black text-[var(--text-primary)]">
                100%
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold text-[var(--text-primary)]">
                Expediente Modular Calibrado
              </h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Titulaciones contrastadas y catálogo de evidencias STAR listo para ensamblar en 1 página ejecutiva.
              </p>
            </div>
          </div>

          {/* Specialization Branches Quick Pills */}
          <div className="space-y-2 border-t border-[var(--panel-border)] pt-3">
            <div className="text-[11px] font-mono text-[var(--text-muted)] font-bold uppercase">
              Ramas Nucleares Dominadas
            </div>

            <div className="space-y-1.5">
              <div className="p-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-between text-xs">
                <span className="font-bold flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5 text-sky-600" />
                  <span>Suelos & Dinámica de Carbono</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-600 font-bold">
                  CAU Kiel (DAAD)
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-between text-xs">
                <span className="font-bold flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Geofísica & Modelación (R / GIS)</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold">
                  U. de Chile (Distinción)
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-between text-xs">
                <span className="font-bold flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5 text-purple-600" />
                  <span>Gobernanza & Políticas UE</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 font-bold">
                  Comparecencia Técnica
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectStation('agent_dossier', 'gunsmith')}
            className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-mono font-black text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Abrir Taller Modular de CV (Puzzle)</span>
          </button>
        </div>

        {/* Col 2 (7 cols): Top Vacantes de Alta Afinidad */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-[var(--panel-bg)] border border-[var(--panel-border)] shadow-sm backdrop-blur-md flex flex-col justify-between space-y-4">
          <div className="border-b border-[var(--panel-border)] pb-2 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-mono font-black text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-emerald-500" />
                <span>VACANTES CON MAYOR AFINIDAD TÉCNICA (&gt;70%)</span>
              </h3>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">
                CÁLCULO DETERMINISTA SEGÚN TUS HABILIDADES, SALARIO Y UBICACIÓN
              </span>
            </div>
            <button
              onClick={() => onSelectStation('market_radar', 'offers', 'ALL')}
              className="text-xs text-sky-600 hover:underline font-mono font-bold cursor-pointer"
            >
              Ver Todas ({offers.length}) »
            </button>
          </div>

          {/* List of Top 3 Offers */}
          <div className="space-y-2.5">
            {highMatchOffers.slice(0, 3).map(offer => {
              const score = offer.matchScore?.totalScore || 70;
              const isGermany = (offer.location || '').toLowerCase().includes('alemania') || (offer.location || '').toLowerCase().includes('kiel');
              const isBilbao = (offer.location || '').toLowerCase().includes('bilbao') || (offer.location || '').toLowerCase().includes('euskadi');

              return (
                <div
                  key={offer.id}
                  onClick={() => onSelectStation('market_radar', 'offers', 'ALL')}
                  className="p-3.5 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-sky-500 hover:shadow-sm transition cursor-pointer group flex items-center justify-between gap-3"
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    {/* Compact Score Gauge */}
                    <div className="h-11 w-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 flex flex-col items-center justify-center shrink-0">
                      <span className="font-mono font-black text-sm leading-none">{score}%</span>
                      <span className="text-[8px] font-mono font-bold uppercase tracking-tighter">Match</span>
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <h4 className="text-xs sm:text-sm font-bold text-[var(--text-primary)] truncate group-hover:text-sky-600 transition">
                        {offer.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-[var(--text-muted)]">
                        <span className="flex items-center gap-1 font-semibold text-[var(--text-secondary)]">
                          <Building2 className="h-3 w-3 text-sky-600" />
                          {offer.company}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-emerald-500" />
                          {offer.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {isGermany && (
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-sky-500/10 text-sky-600 border border-sky-500/20 hidden sm:inline-block">
                        DACH §20
                      </span>
                    )}
                    {isBilbao && (
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 hidden sm:inline-block">
                        Ley 14
                      </span>
                    )}
                    <ChevronRight className="h-4 w-4 text-[var(--text-muted)] group-hover:text-sky-600 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Filter Access */}
          <div className="p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-[11px] font-mono text-[var(--text-muted)] font-semibold">
              Filtro rápido de vacantes:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onSelectStation('market_radar', 'offers', 'GERMANY')}
                className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-600 hover:bg-sky-500/20 text-[11px] font-mono font-bold transition cursor-pointer"
              >
                🇩🇪 Alemania ({germanyOffers.length})
              </button>
              <button
                onClick={() => onSelectStation('market_radar', 'offers', 'BILBAO')}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 text-[11px] font-mono font-bold transition cursor-pointer"
              >
                🇪🇸 Euskadi ({euskadiOffers.length})
              </button>
              <button
                onClick={() => onSelectStation('market_radar', 'offers', 'REMOTE')}
                className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 text-[11px] font-mono font-bold transition cursor-pointer"
              >
                🌐 Remoto ({remoteOffers.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
       * 5. GLOBO GEOESPACIAL INTERACTIVO (VISUALIZACIÓN PLANETARIA)
       * ========================================================================= */}
      <div className="p-4 rounded-2xl bg-[var(--panel-bg)] border border-[var(--panel-border)] shadow-sm backdrop-blur-md">
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
