import React from 'react';
import { 
  Crosshair, 
  HelpCircle, 
  ShieldCheck, 
  Radio,
  UserCheck,
  Send,
  Compass
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onOpenContextHelp: () => void;
  onStartGuidedTour: () => void;
  onOpenProtocolModal: () => void;
  onRefreshData: () => void;
  onSelectStation?: (stationId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onOpenContextHelp,
  onStartGuidedTour,
  onOpenProtocolModal,
  onSelectStation
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a0f1d]/95 backdrop-blur-md border-b border-slate-800 px-5 py-3 flex items-center justify-between shadow-2xl text-slate-100 font-mono">
      {/* Brand Header */}
      <div className="flex items-center space-x-3">
        <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-inner">
          <Crosshair className="h-5 w-5 text-emerald-400" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-1.5 font-sans">
              EMPLEO <span className="text-emerald-400 font-mono text-xs font-black px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">TACTICAL OPS</span>
            </h1>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-sky-400 border border-slate-700 hidden sm:inline-block">
              CAU Kiel / U. de Chile
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium hidden sm:block font-sans">
            Consola Estratégica de Búsqueda y Postulación (Alemania, Euskadi & Remoto)
          </p>
        </div>
      </div>

      {/* Center Tactical Quick Switcher */}
      <div className="hidden lg:flex items-center space-x-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800/80 text-xs">
        <button
          onClick={() => onSelectStation && onSelectStation('dashboard')}
          className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
            currentTab === 'dashboard' 
              ? 'bg-emerald-600 text-white shadow-sm' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Crosshair className="h-3.5 w-3.5" />
          <span>War Room</span>
        </button>

        <button
          onClick={() => onSelectStation && onSelectStation('market_radar')}
          className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
            ['market_radar', 'offers', 'sources', 'companies'].includes(currentTab)
              ? 'bg-emerald-600 text-white shadow-sm' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Radio className="h-3.5 w-3.5" />
          <span>Radar</span>
        </button>

        <button
          onClick={() => onSelectStation && onSelectStation('agent_dossier')}
          className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
            ['agent_dossier', 'profile', 'cvs'].includes(currentTab)
              ? 'bg-sky-600 text-white shadow-sm' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <UserCheck className="h-3.5 w-3.5" />
          <span>Dossier</span>
        </button>

        <button
          onClick={() => onSelectStation && onSelectStation('mission_control')}
          className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
            ['mission_control', 'applications', 'batch_applications', 'intelligence'].includes(currentTab)
              ? 'bg-amber-600 text-white shadow-sm' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Send className="h-3.5 w-3.5" />
          <span>Misiones</span>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onOpenProtocolModal}
          className="flex items-center space-x-1 text-xs text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 px-3 py-1.5 rounded-lg border border-emerald-500/30 font-medium transition cursor-pointer"
          title="Ver el Protocolo Táctico Anti-Alucinaciones & Visado"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span className="font-semibold text-[11px] hidden sm:inline">Protocolo Táctico</span>
        </button>

        <button
          onClick={onStartGuidedTour}
          className="flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20 transition"
        >
          <Compass className="h-3.5 w-3.5 text-amber-400" />
          <span className="hidden sm:inline">Guía</span>
        </button>

        <button
          onClick={onOpenContextHelp}
          className="flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition"
          title="Ayuda de la estación actual"
        >
          <HelpCircle className="h-3.5 w-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Ayuda</span>
        </button>
      </div>
    </header>
  );
};
