import React from 'react';
import { 
  Crosshair, 
  HelpCircle, 
  Sun, 
  Zap, 
  Moon 
} from 'lucide-react';
import type { AppTheme } from '../../services/themeManager';

interface NavbarProps {
  currentTab: string;
  currentTheme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
  onOpenUnifiedHelp: () => void;
  onSelectStation?: (stationId: string, subTab?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  currentTheme,
  onThemeChange,
  onOpenUnifiedHelp,
  onSelectStation
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#080d19]/95 backdrop-blur-md border-b border-slate-800 px-5 py-3 flex items-center justify-between shadow-2xl text-slate-100 font-mono transition-colors">
      {/* Clean Brand Header */}
      <div className="flex items-center space-x-3">
        <div className="h-9 w-9 rounded-xl bg-red-600/10 border border-red-500/30 flex items-center justify-center shadow-inner shrink-0 text-red-500">
          <Crosshair className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-black text-lg tracking-tight text-white font-sans">
            EMPLEO
          </h1>
          <p className="text-[11px] text-slate-300 font-mono hidden sm:block">
            Alemania • Euskadi • Remoto
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
          onClick={() => onSelectStation && onSelectStation('agent_dossier', 'showcase')}
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

      {/* Right Controls: Unified Help/Protocol & Theme Switcher */}
      <div className="flex items-center space-x-2.5">
        {/* Tactical Theme Switcher */}
        <div className="flex items-center p-0.5 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-inner">
          <button
            onClick={() => onThemeChange('luminous')}
            title="Modo High-Contrast Luminous"
            className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
              currentTheme === 'luminous'
                ? 'bg-sky-600 text-white shadow font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Sun className="h-3.5 w-3.5" />
            <span className="hidden lg:inline text-[11px]">Cyan</span>
          </button>

          <button
            onClick={() => onThemeChange('cyber')}
            title="Modo Cyber-Táctico Rainbow Six"
            className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
              currentTheme === 'cyber'
                ? 'bg-red-600 text-white shadow font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            <span className="hidden lg:inline text-[11px]">Tactical</span>
          </button>

          <button
            onClick={() => onThemeChange('dark')}
            title="Modo Stealth Nocturno"
            className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
              currentTheme === 'dark'
                ? 'bg-slate-700 text-white shadow font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Moon className="h-3.5 w-3.5" />
            <span className="hidden lg:inline text-[11px]">Dark</span>
          </button>
        </div>

        {/* Combined Ayuda, Guía & Protocolo Button */}
        <button
          onClick={onOpenUnifiedHelp}
          className="flex items-center space-x-1.5 text-xs text-slate-200 bg-slate-900/90 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700/80 hover:border-red-500 transition cursor-pointer font-mono font-bold shadow"
          title="Centro de Mando: Ayuda, Guía de Estaciones y Protocolo de Visados"
        >
          <HelpCircle className="h-3.5 w-3.5 text-red-500" />
          <span className="hidden sm:inline">Ayuda & Protocolo</span>
        </button>
      </div>
    </header>
  );
};
