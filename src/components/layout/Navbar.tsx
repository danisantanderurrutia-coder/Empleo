import React from 'react';
import { 
  Crosshair, 
  HelpCircle 
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onOpenUnifiedHelp: () => void;
  onSelectStation?: (stationId: string, subTab?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onOpenUnifiedHelp,
  onSelectStation
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#080d19]/95 backdrop-blur-md border-b border-slate-800 px-5 py-3 flex items-center justify-between shadow-2xl text-slate-100 font-mono transition-colors">
      {/* Clickable Brand Header returning to Home / Career */}
      <button
        onClick={() => onSelectStation && onSelectStation('dashboard')}
        className="flex items-center space-x-3 cursor-pointer group text-left focus:outline-none"
        title="Volver al Centro de Mando (Career Hub)"
      >
        <div className="h-9 w-9 rounded-xl bg-red-600/10 border border-red-500/30 flex items-center justify-center shadow-inner shrink-0 text-red-500 group-hover:bg-red-600/20 group-hover:border-red-500 transition">
          <Crosshair className="h-5 w-5 group-hover:rotate-45 transition-transform duration-300" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-black text-lg tracking-tight text-white font-sans group-hover:text-red-400 transition">
              EMPLEO
            </h1>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700 hidden sm:inline-block">
              HUB
            </span>
          </div>
          <p className="text-[11px] text-slate-300 font-mono hidden sm:block">
            Alemania • Euskadi • Remoto
          </p>
        </div>
      </button>

      {/* Center Tactical Navigation Bar */}
      <div className="flex items-center space-x-3 sm:space-x-5 md:space-x-7 text-xs uppercase tracking-wider font-mono font-bold">
        <button
          onClick={() => onSelectStation && onSelectStation('dashboard')}
          className={`py-1.5 transition flex items-center gap-1.5 relative cursor-pointer ${
            currentTab === 'dashboard'
              ? 'text-white border-b-2 border-red-600 font-black' 
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <span>PANEL</span>
        </button>

        <button
          onClick={() => onSelectStation && onSelectStation('market_radar')}
          className={`py-1.5 transition flex items-center gap-1.5 relative cursor-pointer ${
            ['market_radar', 'offers', 'sources', 'companies'].includes(currentTab)
              ? 'text-white border-b-2 border-red-600 font-black' 
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <span>MERCADO</span>
        </button>

        <button
          onClick={() => onSelectStation && onSelectStation('agent_dossier', 'showcase')}
          className={`py-1.5 transition flex items-center gap-1.5 relative cursor-pointer ${
            ['agent_dossier', 'profile', 'cvs', 'showcase', 'gunsmith', 'skills'].includes(currentTab)
              ? 'text-white border-b-2 border-red-600 font-black' 
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <span>MI PERFIL</span>
        </button>

        <button
          onClick={() => onSelectStation && onSelectStation('mission_control')}
          className={`py-1.5 transition flex items-center gap-1.5 relative cursor-pointer ${
            ['mission_control', 'applications', 'batch_applications', 'intelligence'].includes(currentTab)
              ? 'text-white border-b-2 border-red-600 font-black' 
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <span>CANDIDATURAS</span>
        </button>

        <button
          onClick={() => onSelectStation && onSelectStation('settings')}
          className={`py-1.5 transition flex items-center gap-1.5 relative cursor-pointer ${
            currentTab === 'settings'
              ? 'text-white border-b-2 border-red-600 font-black' 
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <span>AJUSTES</span>
        </button>
      </div>

      {/* Right Controls: Unified Help/Protocol */}
      <div className="flex items-center space-x-2.5">
        <button
          onClick={onOpenUnifiedHelp}
          className="flex items-center space-x-1.5 text-xs text-slate-200 bg-slate-900/90 hover:bg-slate-800 px-3.5 py-1.5 rounded-xl border border-slate-700/80 hover:border-red-500 transition cursor-pointer font-mono font-bold shadow"
          title="Centro de Mando: Ayuda, Guía de Estaciones y Protocolo de Visados"
        >
          <HelpCircle className="h-3.5 w-3.5 text-red-500" />
          <span className="hidden sm:inline">Ayuda & Protocolo</span>
        </button>
      </div>
    </header>
  );
};
