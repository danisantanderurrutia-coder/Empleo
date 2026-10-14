import React from 'react';
import { 
  Crosshair, 
  HelpCircle, 
  ShieldCheck, 
  Compass,
  Sun,
  Zap,
  Moon
} from 'lucide-react';
import type { AppTheme } from '../../services/themeManager';

interface NavbarProps {
  currentTab: string;
  currentTheme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
  onOpenContextHelp: () => void;
  onStartGuidedTour: () => void;
  onOpenProtocolModal: () => void;
  onRefreshData: () => void;
  onSelectStation?: (stationId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  currentTheme,
  onThemeChange,
  onOpenContextHelp,
  onStartGuidedTour,
  onOpenProtocolModal,
  onSelectStation
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a0f1d]/95 backdrop-blur-md border-b border-slate-800 px-5 py-3 flex items-center justify-between shadow-2xl text-slate-100 font-mono transition-colors">
      {/* Brand Header */}
      <div className="flex items-center space-x-3">
        <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-inner shrink-0">
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
          <p className="text-[11px] text-slate-300 font-medium hidden sm:block font-sans">
            Consola Estratégica de Búsqueda y Postulación (Alemania, Euskadi & Remoto)
          </p>
        </div>
      </div>

      {/* Center Tactical Rainbow Six Siege Navigation Bar */}
      <div className="flex items-center space-x-3 sm:space-x-5 md:space-x-6 text-xs uppercase tracking-wider font-mono font-bold">
        <button
          onClick={() => onSelectStation && onSelectStation('market_radar')}
          className={`py-1.5 transition flex items-center gap-1.5 relative cursor-pointer ${
            ['market_radar', 'offers', 'sources', 'companies'].includes(currentTab)
              ? 'text-white border-b-2 border-red-600 font-black' 
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <span>PLAY</span>
        </button>

        <button
          onClick={() => onSelectStation && onSelectStation('agent_dossier')}
          className={`py-1.5 transition flex items-center gap-1.5 relative cursor-pointer ${
            ['agent_dossier', 'profile', 'cvs'].includes(currentTab)
              ? 'text-white border-b-2 border-red-600 font-black' 
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <span>OPERATORS</span>
        </button>

        <button
          onClick={() => onSelectStation && onSelectStation('dashboard')}
          className={`py-1.5 transition flex items-center gap-1.5 relative cursor-pointer ${
            currentTab === 'dashboard' 
              ? 'text-white border-b-2 border-red-600 font-black' 
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <span>CAREER</span>
        </button>

        <button
          onClick={() => onSelectStation && onSelectStation('mission_control')}
          className={`py-1.5 transition flex items-center gap-1.5 relative cursor-pointer ${
            ['mission_control', 'applications', 'batch_applications', 'intelligence'].includes(currentTab)
              ? 'text-white border-b-2 border-red-600 font-black' 
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <span>LOCKER</span>
        </button>

        <button
          onClick={() => onSelectStation && onSelectStation('settings')}
          className={`py-1.5 transition flex items-center gap-1.5 relative cursor-pointer ${
            currentTab === 'settings'
              ? 'text-white border-b-2 border-red-600 font-black' 
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <span>HQ</span>
        </button>
      </div>

      {/* Right Controls: Theme Switcher & Actions */}
      <div className="flex items-center space-x-2">
        {/* Tactical Theme Switcher */}
        <div className="flex items-center p-0.5 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-inner">
          <button
            onClick={() => onThemeChange('luminous')}
            title="Modo Aero-Luminoso (Laboratorio Científico / Alto Contraste)"
            className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
              currentTheme === 'luminous'
                ? 'bg-emerald-600 text-white shadow font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Sun className="h-3.5 w-3.5" />
            <span className="hidden md:inline text-[11px]">Luminoso</span>
          </button>

          <button
            onClick={() => onThemeChange('cyber')}
            title="Modo Cyber-Táctico (Misión Secreta / Solarpunk Neon)"
            className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
              currentTheme === 'cyber'
                ? 'bg-emerald-500 text-slate-950 shadow font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            <span className="hidden md:inline text-[11px]">Cyber</span>
          </button>

          <button
            onClick={() => onThemeChange('dark')}
            title="Modo Deep Slate (Operaciones Nocturnas)"
            className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
              currentTheme === 'dark'
                ? 'bg-slate-700 text-white shadow font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Moon className="h-3.5 w-3.5" />
            <span className="hidden md:inline text-[11px]">Dark</span>
          </button>
        </div>

        <button
          onClick={onOpenProtocolModal}
          className="flex items-center space-x-1 text-xs text-emerald-400 bg-emerald-950/60 hover:bg-emerald-900/60 px-3 py-1.5 rounded-lg border border-emerald-500/30 font-medium transition cursor-pointer"
          title="Ver el Protocolo Táctico Anti-Alucinaciones & Visado"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span className="font-semibold text-[11px] hidden sm:inline">Protocolo</span>
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
