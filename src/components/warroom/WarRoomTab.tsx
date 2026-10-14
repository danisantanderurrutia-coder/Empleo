import React from 'react';
import { 
  Crosshair, 
  ShieldCheck, 
  FileText, 
  Send, 
  Radio, 
  CheckCircle2, 
  MapPin, 
  ChevronRight,
  Award,
  Zap
} from 'lucide-react';
import { getStoredProfile, getStoredOffers, getStoredApplications, getStoredSources } from '../../services/db';

interface WarRoomTabProps {
  onSelectStation: (stationId: string, subTab?: string) => void;
  onLaunchRadar: () => void;
}

export const WarRoomTab: React.FC<WarRoomTabProps> = ({ onSelectStation, onLaunchRadar }) => {
  const profile = getStoredProfile();
  const offers = getStoredOffers();
  const applications = getStoredApplications();
  const sources = getStoredSources();

  const highMatchOffers = offers.filter(o => o.matchScore?.totalScore >= 70);
  const activeApplications = applications.filter(a => a.status !== 'Desestimada');

  return (
    <div className="space-y-6 text-slate-100 animate-fadeIn">
      {/* Tactical Mission Header Banner */}
      <div className="relative overflow-hidden glass-panel p-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-[#0d1527] via-[#111e38] to-[#0a1224] shadow-2xl">
        <div className="absolute -right-8 -top-8 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-12 bottom-0 opacity-10 pointer-events-none">
          <Crosshair className="h-48 w-48 text-emerald-400" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                CENTRO DE MANDO TÁCTICO // WAR ROOM
              </span>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-wider uppercase bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                BASE: BILBAO / BIZKAIA
              </span>
            </div>

            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>{profile.fullName || 'Daniel Santander Urrutia'}</span>
              <span className="text-slate-400 text-sm font-normal">— Geofísico Ambiental & M.Sc. Kiel / Poznań</span>
            </h1>

            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Consola operativa para la búsqueda estratégica y postulación en <strong className="text-emerald-400">Alemania</strong>, <strong className="text-sky-400">Euskadi / España</strong> y <strong className="text-amber-400">Remoto UE</strong> mediada 100% por ti.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              onClick={onLaunchRadar}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 border border-emerald-400/30"
            >
              <Radio className="h-4 w-4" />
              <span>Escanear Radar de Ofertas</span>
            </button>
          </div>
        </div>

        {/* Tactical Visa Status Directive */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-900/70 border border-sky-500/20 flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sky-300">ESTATUS ALEMANIA // §20 AufenthG (Ventaja Legal Inmediata)</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Doble Máster en CAU Kiel da acceso legal inmediato al visado de 18 meses para graduados. Permite empleo cualificado a tiempo completo con transición rápida a EU Blue Card (§18g MINT).
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/70 border border-emerald-500/20 flex items-start gap-2.5">
            <Award className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-emerald-300">ESTATUS ESPAÑA // Convenio Iberoamericano (Meta Nacionalidad)</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Nacionalidad chilena reduce el plazo a <strong>2 años de residencia legal</strong> para nacionalidad española. Prioridad táctica: Centros I+D (BC3, Tecnalia) y multinacionales (IDOM) vía Ley 14/2013 UGE.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Tactical Briefing (Mission HUD) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Missions of the Day */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-800 bg-[#111827] shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Crosshair className="h-4 w-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white tracking-wide uppercase font-mono">Briefing de Misión Diario</h2>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              FASE: RECONOCIMIENTO & PREPARACIÓN
            </span>
          </div>

          <div className="space-y-3">
            {/* Mission 1 */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition flex items-center justify-between gap-3 group">
              <div className="flex items-start gap-3">
                <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20 mt-0.5">
                  <span className="font-mono text-xs font-bold">01</span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-100 group-hover:text-emerald-300 transition">
                    Inspeccionar Cuadrante Alpha (Alemania / Euraxess)
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Revisar 2 convocatorias en centros Helmholtz / Thünen Institute (Suelos, Turberas y Dinámica de GEI).
                  </p>
                </div>
              </div>
              <button
                onClick={() => onSelectStation('market_radar', 'sources')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white text-[11px] font-bold rounded-lg transition flex items-center gap-1 shrink-0"
              >
                <span>Ejecutar</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            {/* Mission 2 */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-sky-500/40 transition flex items-center justify-between gap-3 group">
              <div className="flex items-start gap-3">
                <div className="h-7 w-7 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/20 mt-0.5">
                  <span className="font-mono text-xs font-bold">02</span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-100 group-hover:text-sky-300 transition">
                    Triaje de Radar en Cuadrante Beta (Euskadi)
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Evaluar vacantes en BC3 Research, Tecnalia o IDOM Zorrotzaurre con afinidad &gt; 70% para residencia en Bilbao.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onSelectStation('market_radar', 'offers')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-sky-600 text-slate-200 hover:text-white text-[11px] font-bold rounded-lg transition flex items-center gap-1 shrink-0"
              >
                <span>Revisar</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            {/* Mission 3 */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition flex items-center justify-between gap-3 group">
              <div className="flex items-start gap-3">
                <div className="h-7 w-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20 mt-0.5">
                  <span className="font-mono text-xs font-bold">03</span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-100 group-hover:text-amber-300 transition">
                    Armar Munición de Candidatura (CV & Carta)
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Compilar CV adaptado (Académico/ONG o Tech) incorporando la cláusula de visado transparente.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onSelectStation('agent_dossier', 'cvs')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-amber-600 text-slate-200 hover:text-white text-[11px] font-bold rounded-lg transition flex items-center gap-1 shrink-0"
              >
                <span>Preparar</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Tactical Metrics & Vital Stats */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-[#111827] shadow-md flex flex-col justify-between space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <span className="text-sm font-bold text-white tracking-wide uppercase font-mono flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-amber-400" />
              Telemetría Operativa
            </span>
            <span className="text-[10px] font-mono text-slate-400">EN TIEMPO REAL</span>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">Radar Total</div>
              <div className="text-xl font-black text-white mt-1">{offers.length}</div>
              <div className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="h-2.5 w-2.5" />
                Verificadas
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">Alta Afinidad</div>
              <div className="text-xl font-black text-emerald-400 mt-1">{highMatchOffers.length}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">&gt; 70% Match</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">Misiones Activas</div>
              <div className="text-xl font-black text-sky-400 mt-1">{activeApplications.length}</div>
              <div className="text-[10px] text-sky-400/80 mt-0.5">En seguimiento</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">Frecuencias</div>
              <div className="text-xl font-black text-amber-400 mt-1">{sources.length}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Portales / Centros</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
            <div className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Extensión de Navegador Activa</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1">
              Captura ofertas desde LinkedIn, InfoJobs o páginas de centros con 1 clic en <code className="text-emerald-400">extension/</code>.
            </p>
          </div>
        </div>
      </div>

      {/* Direct Quick Launch Stations */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => onSelectStation('market_radar', 'offers')}
          className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-emerald-500/50 bg-[#131d31] transition text-left space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-emerald-400 transition">
            <Radio className="h-5 w-5" />
            <ChevronRight className="h-4 w-4" />
          </div>
          <div className="font-bold text-white text-sm">1. Radar de Mercado</div>
          <p className="text-[11px] text-slate-400 leading-snug">
            350+ vacantes indexadas, empresas target y cuadrantes por país.
          </p>
        </button>

        <button
          onClick={() => onSelectStation('agent_dossier', 'profile')}
          className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-sky-500/50 bg-[#131d31] transition text-left space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-sky-400 transition">
            <FileText className="h-5 w-5" />
            <ChevronRight className="h-4 w-4" />
          </div>
          <div className="font-bold text-white text-sm">2. Dossier del Agente</div>
          <p className="text-[11px] text-slate-400 leading-snug">
            Perfil científico, máster en Kiel y armería de CVs en ES/EN.
          </p>
        </button>

        <button
          onClick={() => onSelectStation('mission_control', 'applications')}
          className="glass-panel p-4 rounded-xl border border-slate-800 hover:border-amber-500/50 bg-[#131d31] transition text-left space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-amber-400 transition">
            <Send className="h-5 w-5" />
            <ChevronRight className="h-4 w-4" />
          </div>
          <div className="font-bold text-white text-sm">3. Sala de Control</div>
          <p className="text-[11px] text-slate-400 leading-snug">
            Kanban de postulaciones, redacción de cartas y estado de misiones.
          </p>
        </button>
      </div>
    </div>
  );
};
