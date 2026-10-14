import React from 'react';
import { 
  Crosshair, 
  ShieldCheck, 
  FileText, 
  Radio, 
  Award, 
  ChevronRight, 
  Building2, 
  Target,
  Globe2
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

  const highMatchOffers = offers.filter(o => o.matchScore?.totalScore >= 70);
  const activeApplications = applications.filter(a => a.status !== 'Desestimada');

  return (
    <div className="space-y-6 text-slate-100 font-mono animate-fadeIn select-none">
      {/* -------------------------------------------------------------
       * TIER 0: R6 SIEGE STYLE SUB-NAV / CAREER BANNER (IMAGE 4 & 6)
       * ------------------------------------------------------------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-3 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest font-mono flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
              OPERATOR INTELLIGENCE
            </span>
            <span className="text-slate-600">//</span>
            <span className="text-xs text-slate-400">SCHENGEN JOB-SEEKING DIRECTIVE</span>
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight font-sans mt-0.5 flex flex-wrap items-center gap-2">
            <span>CAREER:</span>
            <span className="text-emerald-400">{profile.fullName || 'DANIEL SANTANDER'}</span>
          </h1>
        </div>

        {/* Top-Right Resource / Currency Counters (R6 Siege Wind Bastion style) */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2 shadow-inner">
            <Target className="h-4 w-4 text-emerald-400" />
            <span className="text-slate-400 font-medium">TARGETS:</span>
            <span className="font-bold text-white">{offers.length}</span>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2 shadow-inner">
            <Building2 className="h-4 w-4 text-sky-400" />
            <span className="text-slate-400 font-medium">INSTITUTOS:</span>
            <span className="font-bold text-white">{companies.length}</span>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2 shadow-inner">
            <ShieldCheck className="h-4 w-4 text-amber-400" />
            <span className="text-slate-400 font-medium">VISA:</span>
            <span className="font-bold text-amber-300">§20 / LEY 14</span>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
       * TIER 1: RAINBOW SIX SIEGE 4-BLOCK CAREER GRID (IMAGE 4)
       * ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Block 1: CLEARANCE LEVEL */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-700/80 bg-gradient-to-b from-[#10192e] to-[#0a1122] flex flex-col justify-between space-y-4 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              CLEARANCE LEVEL
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
              TIER 1
            </span>
          </div>

          <div className="flex flex-col items-center justify-center my-1 space-y-1">
            {/* Tactical Laurel Wreath Badge */}
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-emerald-500/60 flex items-center justify-center bg-slate-950/80 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <span className="text-2xl font-black text-white font-sans">50</span>
              </div>
              <div className="absolute -inset-1 rounded-full border border-emerald-400/30 pointer-events-none" />
            </div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              MAX OPERATIONAL
            </span>
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>EXP TRANSICIÓN</span>
              <span className="text-slate-200 font-bold">1000 / 1000 XP</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 w-full" />
            </div>
          </div>
        </div>

        {/* Block 2: MY RANK (with dramatic R6 red gradient and operator badge) */}
        <div className="glass-panel p-5 rounded-2xl border border-red-500/40 bg-gradient-to-b from-[#181116] via-[#1f1018] to-[#12080d] flex flex-col justify-between space-y-3 shadow-xl relative overflow-hidden group">
          {/* Angular red ambient background */}
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-red-600/15 rounded-full blur-2xl pointer-events-none" />

          <div className="flex justify-between items-start z-10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">
              MY OPERATIVE RANK
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-800/80">
              TOP 1%
            </span>
          </div>

          <div className="flex flex-col items-center justify-center space-y-1 z-10 py-1">
            <div className="w-14 h-14 rounded-xl bg-red-950/80 border border-red-500/60 flex items-center justify-center shadow-lg group-hover:scale-105 transition">
              <Crosshair className="h-7 w-7 text-red-400" />
            </div>
            <h3 className="text-xs font-black text-white uppercase text-center mt-1">
              ELITE FIELD SCIENTIST
            </h3>
            <span className="text-[10px] text-red-300 font-sans font-medium text-center">
              Geofísica & M.Sc. Kiel/Poznań
            </span>
          </div>

          {/* Red angular bottom banner */}
          <div className="z-10 py-1 px-2 rounded bg-gradient-to-r from-red-600 to-rose-700 text-white text-[10px] font-bold text-center uppercase tracking-wider shadow">
            MINT-QUALIFIED EU BLUE CARD
          </div>
        </div>

        {/* Block 3: REPUTATION */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-700/80 bg-gradient-to-b from-[#101b22] to-[#081217] flex flex-col justify-between space-y-3 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              INTELLIGENCE REPUTATION
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              VERIFIED
            </span>
          </div>

          <div className="flex flex-col items-center justify-center space-y-1 py-1">
            <div className="w-14 h-14 rounded-xl bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-center shadow">
              <Award className="h-7 w-7 text-emerald-400" />
            </div>
            <h3 className="text-xs font-black text-white uppercase mt-1">
              RESPECTABLE & VERIFIED
            </h3>
            <span className="text-[10px] text-emerald-400/90 text-center">
              100% Human-in-the-Loop
            </span>
          </div>

          <div className="py-1 px-2 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[10px] text-center">
            0% BOTS SIMULADOS • AUDITORÍA LIMPIA
          </div>
        </div>

        {/* Block 4: STATISTICS (Account Based Intelligence) */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-700/80 bg-gradient-to-b from-[#121829] to-[#0a0f1d] flex flex-col justify-between space-y-2 shadow-xl">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              STATISTICS
            </span>
            <span className="text-[10px] text-amber-400 font-bold">TELEMETRÍA REAL</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs py-1">
            <div className="p-2 rounded bg-slate-950/70 border border-slate-800">
              <div className="text-[9px] text-slate-400 uppercase">ALTA AFINIDAD</div>
              <div className="text-sm font-black text-emerald-400">{highMatchOffers.length} VACANTES</div>
              <div className="text-[9px] text-slate-500">&gt; 70% Match Fit</div>
            </div>

            <div className="p-2 rounded bg-slate-950/70 border border-slate-800">
              <div className="text-[9px] text-slate-400 uppercase">EN VUELO</div>
              <div className="text-sm font-black text-sky-400">{activeApplications.length} APPS</div>
              <div className="text-[9px] text-slate-500">Misiones</div>
            </div>

            <div className="p-2 rounded bg-slate-950/70 border border-slate-800">
              <div className="text-[9px] text-slate-400 uppercase">ALEMANIA §20</div>
              <div className="text-sm font-black text-amber-400">18 MESES</div>
              <div className="text-[9px] text-slate-500">Búsqueda</div>
            </div>

            <div className="p-2 rounded bg-slate-950/70 border border-slate-800">
              <div className="text-[9px] text-slate-400 uppercase">ESPAÑA LEY 14</div>
              <div className="text-sm font-black text-rose-400">2 AÑOS</div>
              <div className="text-[9px] text-slate-500">Nacionalidad</div>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
       * TIER 2: INTERACTIVE IMF PLANETARY HUD + DAILY MISSION HUD
       * ------------------------------------------------------------- */}
      <div className="space-y-4">
        {/* Interactive Tactical Vector Globe HUD (Image 1 & 3) */}
        <TacticalGlobeHUD 
          onDeploySector={(sector) => {
            if (sector === 'kiel') onSelectStation('market_radar', 'sources');
            else if (sector === 'bilbao') onSelectStation('market_radar', 'companies');
            else onSelectStation('market_radar', 'offers');
          }}
        />

        {/* Daily Field Directives Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Directive 1 */}
          <div className="p-4 rounded-xl border border-sky-500/30 bg-gradient-to-br from-[#0c162a] to-[#070e1c] space-y-2 relative group hover:border-sky-400 transition shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800">
                DIRECTIVA 01 // ALEMANIA
              </span>
              <span className="text-xs text-sky-400 font-bold">§20 AufenthG</span>
            </div>
            <h4 className="font-bold text-white text-xs">
              Euraxess Germany & Thünen / Helmholtz
            </h4>
            <p className="text-[11px] text-slate-300 leading-snug">
              Tu doble máster en CAU Kiel otorga visado legal de búsqueda de 18 meses a tiempo completo y pase a EU Blue Card MINT.
            </p>
            <button
              onClick={() => onSelectStation('market_radar', 'sources')}
              className="mt-2 text-xs font-bold text-sky-400 group-hover:text-sky-300 flex items-center gap-1 transition"
            >
              <span>Abrir Cuadrante Alpha</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          {/* Directive 2 */}
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-gradient-to-br from-[#0c1f1a] to-[#071310] space-y-2 relative group hover:border-emerald-400 transition shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                DIRECTIVA 02 // EUSKADI
              </span>
              <span className="text-xs text-emerald-400 font-bold">Ley 14/2013 UGE</span>
            </div>
            <h4 className="font-bold text-white text-xs">
              BC3, Tecnalia, Neiker & IDOM Bilbao
            </h4>
            <p className="text-[11px] text-slate-300 leading-snug">
              Pasaporte chileno reduce a 2 años de residencia para nacionalidad española. Centros de I+D y multinacionales gestionan visado de profesional altamente cualificado.
            </p>
            <button
              onClick={() => onSelectStation('market_radar', 'companies')}
              className="mt-2 text-xs font-bold text-emerald-400 group-hover:text-emerald-300 flex items-center gap-1 transition"
            >
              <span>Ver Fichas de Empresa</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          {/* Directive 3 */}
          <div className="p-4 rounded-xl border border-amber-500/30 bg-gradient-to-br from-[#1c180e] to-[#0f0c05] space-y-2 relative group hover:border-amber-400 transition shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                DIRECTIVA 03 // GLOBAL & REMOTO
              </span>
              <span className="text-xs text-amber-400 font-bold">ONGs / Think Tanks</span>
            </div>
            <h4 className="font-bold text-white text-xs">
              EPN, Global Forest Coalition & ECODES
            </h4>
            <p className="text-[11px] text-slate-300 leading-snug">
              Investigación en gobernanza ambiental, auditoría de biomasa y contabilidad de carbono en organizaciones de incidencia internacional.
            </p>
            <button
              onClick={() => onSelectStation('agent_dossier', 'cvs')}
              className="mt-2 text-xs font-bold text-amber-400 group-hover:text-amber-300 flex items-center gap-1 transition"
            >
              <span>Adaptar CV Académico/ONG</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
       * TIER 3: R6 SIEGE TACTICAL MODE SELECTION BAR (IMAGE 5)
       * ------------------------------------------------------------- */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            DESPLIEGUE TÁCTICO INMEDIATO // SELECT OPERATIVE MODE
          </span>
          <span className="text-[10px] text-emerald-400">STATUS: SISTEMA LISTO</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Action 1 */}
          <button
            onClick={onLaunchRadar}
            className="p-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs uppercase tracking-wider flex items-center justify-between shadow-xl transition border border-emerald-400/40 group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Radio className="h-5 w-5" />
              <div className="text-left">
                <div>RADAR DE VACANTES</div>
                <div className="text-[10px] font-normal text-emerald-200">350+ Ofertas Reales</div>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition" />
          </button>

          {/* Action 2 */}
          <button
            onClick={() => onSelectStation('market_radar', 'sources')}
            className="p-4 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white font-black text-xs uppercase tracking-wider flex items-center justify-between shadow-xl transition border border-sky-400/40 group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Globe2 className="h-5 w-5" />
              <div className="text-left">
                <div>CUADRANTES DE VISADO</div>
                <div className="text-[10px] font-normal text-sky-200">Alpha • Beta • Gamma</div>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition" />
          </button>

          {/* Action 3 */}
          <button
            onClick={() => onSelectStation('market_radar', 'companies')}
            className="p-4 rounded-xl bg-gradient-to-r from-teal-700 to-slate-800 hover:from-teal-600 hover:to-slate-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-between shadow-xl transition border border-teal-500/40 group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Building2 className="h-5 w-5" />
              <div className="text-left">
                <div>EMPRESAS & CENTROS</div>
                <div className="text-[10px] font-normal text-teal-200">18 Fichas Verificadas</div>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition" />
          </button>

          {/* Action 4 */}
          <button
            onClick={() => onSelectStation('agent_dossier', 'cvs')}
            className="p-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-500 hover:to-orange-600 text-white font-black text-xs uppercase tracking-wider flex items-center justify-between shadow-xl transition border border-amber-400/40 group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <FileText className="h-5 w-5" />
              <div className="text-left">
                <div>ARMERÍA DE CVS</div>
                <div className="text-[10px] font-normal text-amber-200">ES • EN • Lebenslauf</div>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition" />
          </button>
        </div>
      </div>
    </div>
  );
};
