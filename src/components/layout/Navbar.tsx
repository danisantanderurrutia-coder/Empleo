import React from 'react';
import { 
  Crosshair, 
  HelpCircle,
  Sun,
  Moon
} from 'lucide-react';
import type { AppTheme } from '../../services/themeManager';

interface NavbarProps {
  currentTab: string;
  currentTheme?: AppTheme;
  onToggleTheme?: () => void;
  onOpenUnifiedHelp: () => void;
  onSelectStation?: (stationId: string, subTab?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  currentTheme = 'arctic',
  onToggleTheme,
  onOpenUnifiedHelp,
  onSelectStation
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--nav-bg)] backdrop-blur-md border-b border-[var(--nav-border)] px-5 py-3 flex items-center justify-between shadow-sm text-[var(--text-primary)] font-mono transition-colors">
      {/* Clickable Brand Header returning to Home / Panel */}
      <button
        onClick={() => onSelectStation && onSelectStation('dashboard')}
        className="flex items-center space-x-3 cursor-pointer group text-left focus:outline-none"
        title="Volver al Centro de Mando (Panel de Control)"
      >
        <div className="h-9 w-9 rounded-xl bg-sky-600/10 border border-sky-500/30 flex items-center justify-center shadow-inner shrink-0 text-sky-600 group-hover:bg-sky-600/20 group-hover:border-sky-500 transition">
          <Crosshair className="h-5 w-5 group-hover:rotate-45 transition-transform duration-300" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-black text-lg tracking-tight text-[var(--text-primary)] font-sans group-hover:text-sky-600 transition">
              EMPLEO
            </h1>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-sky-500/10 text-sky-600 border border-sky-500/30 hidden sm:inline-block">
              OS
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] font-mono hidden sm:block">
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
              ? 'text-sky-600 border-b-2 border-sky-600 font-black' 
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <span>PANEL</span>
        </button>

        <button
          onClick={() => onSelectStation && onSelectStation('market_radar')}
          className={`py-1.5 transition flex items-center gap-1.5 relative cursor-pointer ${
            ['market_radar', 'offers', 'sources', 'companies'].includes(currentTab)
              ? 'text-sky-600 border-b-2 border-sky-600 font-black' 
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <span>MERCADO</span>
        </button>

        <button
          onClick={() => onSelectStation && onSelectStation('agent_dossier', 'showcase')}
          className={`py-1.5 transition flex items-center gap-1.5 relative cursor-pointer ${
            ['agent_dossier', 'profile', 'cvs', 'showcase', 'gunsmith', 'skills'].includes(currentTab)
              ? 'text-sky-600 border-b-2 border-sky-600 font-black' 
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <span>MI PERFIL</span>
        </button>

        <button
          onClick={() => onSelectStation && onSelectStation('mission_control')}
          className={`py-1.5 transition flex items-center gap-1.5 relative cursor-pointer ${
            ['mission_control', 'applications', 'batch_applications', 'intelligence'].includes(currentTab)
              ? 'text-sky-600 border-b-2 border-sky-600 font-black' 
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <span>CANDIDATURAS</span>
        </button>

        <button
          onClick={() => onSelectStation && onSelectStation('settings')}
          className={`py-1.5 transition flex items-center gap-1.5 relative cursor-pointer ${
            currentTab === 'settings'
              ? 'text-sky-600 border-b-2 border-sky-600 font-black' 
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <span>AJUSTES</span>
        </button>
      </div>

      {/* Right Controls: Theme Toggle & Unified Help */}
      <div className="flex items-center space-x-2">
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            className="flex items-center space-x-1.5 text-xs px-2.5 py-1.5 rounded-xl border border-[var(--panel-border)] bg-[var(--card-bg)] hover:border-sky-500 transition cursor-pointer font-mono font-bold shadow-sm text-[var(--text-primary)]"
            title={currentTheme === 'arctic' ? 'Cambiar a Noche Táctica (Oscuro)' : 'Cambiar a Nieve Táctica (Claro)'}
          >
            {currentTheme === 'arctic' ? (
              <>
                <Moon className="h-3.5 w-3.5 text-sky-600" />
                <span className="hidden md:inline text-[11px]">Noche</span>
              </>
            ) : (
              <>
                <Sun className="h-3.5 w-3.5 text-amber-400" />
                <span className="hidden md:inline text-[11px]">Nieve</span>
              </>
            )}
          </button>
        )}

        <button
          onClick={onOpenUnifiedHelp}
          className="flex items-center space-x-1.5 text-xs text-[var(--text-primary)] bg-[var(--card-bg)] hover:bg-[var(--panel-bg)] px-3 py-1.5 rounded-xl border border-[var(--panel-border)] hover:border-sky-500 transition cursor-pointer font-mono font-bold shadow-sm"
          title="Centro de Mando: Ayuda, Guía de Estaciones y Protocolo de Visados"
        >
          <HelpCircle className="h-3.5 w-3.5 text-sky-600" />
          <span className="hidden sm:inline text-[11px]">Ayuda</span>
        </button>
      </div>
    </header>
  );
};
