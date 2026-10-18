import React, { useEffect, useCallback, useState } from 'react';
import { 
  Crosshair,
  ShieldCheck, 
  Sun, 
  Moon,
  Radio
} from 'lucide-react';
import type { AppTheme } from '../../services/themeManager';
import { resolveAsset } from '../../utils/assets';

interface NavTabItem {
  id: string;
  label: string;
  sub: string;
  matches: string[];
}

const NAV_TABS: NavTabItem[] = [
  { id: 'market_radar', label: 'RADAR', sub: 'MERCADO', matches: ['market_radar', 'offers', 'sources', 'companies'] },
  { id: 'agent_dossier', label: 'OPERATORS', sub: 'PERFIL', matches: ['agent_dossier', 'profile', 'cvs', 'showcase', 'gunsmith', 'skills'] },
  { id: 'mission_control', label: 'LOCKER', sub: 'CANDIDATURAS', matches: ['mission_control', 'applications', 'batch_applications', 'intelligence'] },
  { id: 'funding', label: 'FONDOS I+D', sub: 'CONVOCATORIAS', matches: ['funding', 'convocatorias'] },
  { id: 'settings', label: 'HQ', sub: 'AJUSTES', matches: ['settings'] }
];

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
  const [logoError, setLogoError] = useState(false);

  // Find current active tab index
  const activeIndex = NAV_TABS.findIndex(t => t.matches.includes(currentTab));

  const handleCycleTab = useCallback((direction: -1 | 1) => {
    if (!onSelectStation) return;
    const nextIndex = activeIndex === -1 
      ? 0 
      : (activeIndex + direction + NAV_TABS.length) % NAV_TABS.length;
    onSelectStation(NAV_TABS[nextIndex].id);
  }, [activeIndex, onSelectStation]);

  // Keyboard navigation for [Q] and [E] bumpers + [F1]
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === 'q' || e.key === 'Q') {
        e.preventDefault();
        handleCycleTab(-1);
      } else if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        handleCycleTab(1);
      } else if (e.key === 'F1') {
        e.preventDefault();
        onOpenUnifiedHelp();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCycleTab, onOpenUnifiedHelp]);

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--nav-bg)] backdrop-blur-md border-b border-[var(--nav-border)] px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-md text-[var(--text-primary)] font-mono transition-colors">
      
      {/* 1. Left: Brand Header returning to Career Home */}
      <button
        onClick={() => onSelectStation && onSelectStation('dashboard')}
        className={`flex items-center space-x-3 cursor-pointer group text-left focus:outline-none shrink-0 px-2 py-1 -ml-2 rounded-xl transition ${
          currentTab === 'dashboard'
            ? 'bg-emerald-500/10 border border-emerald-500/40 shadow-xs'
            : 'hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
        }`}
        title="CAREER // Consola Central de Operaciones (Click para volver al inicio)"
      >
        <div className={`h-9 w-9 rounded-xl overflow-hidden flex items-center justify-center shadow-inner shrink-0 transition bg-[#090b0e] ${
          currentTab === 'dashboard'
            ? 'ring-2 ring-cyan-500/50 border border-cyan-400'
            : 'border border-cyan-500/30 group-hover:border-cyan-400'
        }`}>
          {!logoError ? (
            <img 
              src={resolveAsset('/empleo_master_logo.jpg')} 
              alt="Empleo Master Radar Logo" 
              onError={() => setLogoError(true)}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" 
            />
          ) : (
            <Crosshair className="h-5 w-5 text-cyan-400 group-hover:rotate-45 transition-transform duration-300" />
          )}
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-black text-base sm:text-lg tracking-tight text-[var(--text-primary)] font-sans group-hover:text-cyan-500 transition flex items-center gap-1.5">
              <span>EMPLEO</span>
              <span className="text-cyan-600 dark:text-cyan-400 font-extrabold text-xs sm:text-sm tracking-widest bg-cyan-500/10 dark:bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30">MASTER</span>
            </h1>
            <span className={`text-[9px] font-mono font-black px-1.5 py-0.5 rounded border hidden sm:inline-block ${
              currentTab === 'dashboard'
                ? 'bg-red-600 text-white border-red-500 shadow-xs'
                : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
            }`}>
              {currentTab === 'dashboard' ? 'CAREER // HQ' : 'TACTICAL OPS'}
            </span>
          </div>
          <p className="text-[10px] text-[var(--text-muted)] font-mono hidden xl:block">
            CAU Kiel • U. de Chile • 54°20&apos;N • 43°15&apos;N
          </p>
        </div>
      </button>

      {/* 2. Center: Authentic Rainbow Six Siege Tactical Menu Bar */}
      <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 text-xs uppercase tracking-wider font-mono">
        
        {/* Left Bumper [Q] */}
        <button
          onClick={() => handleCycleTab(-1)}
          className="hidden lg:flex items-center justify-center px-2 py-1 rounded-lg text-[10px] font-mono font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10 transition border border-[var(--panel-border)] cursor-pointer"
          title="Pestaña anterior [Tecla Q]"
        >
          <span>[Q] ◀</span>
        </button>

        {/* Tab Buttons */}
        <nav className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
          {NAV_TABS.map((tab) => {
            const isActive = tab.matches.includes(currentTab);
            return (
              <button
                key={tab.id}
                onClick={() => onSelectStation && onSelectStation(tab.id)}
                className={`relative py-1.5 px-2 sm:px-2.5 md:px-3.5 transition-all duration-150 flex flex-col items-center justify-center cursor-pointer group focus:outline-none ${
                  isActive
                    ? 'text-[var(--text-primary)] font-black'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] font-bold'
                }`}
                title={`${tab.label} — ${tab.sub}`}
              >
                <span className="font-mono text-xs sm:text-[13px] tracking-[0.16em] uppercase font-black transition-colors">
                  {tab.label}
                </span>

                <span className="text-[8.5px] font-mono tracking-wider opacity-60 group-hover:opacity-100 transition-opacity uppercase hidden xl:inline">
                  // {tab.sub}
                </span>

                {/* Rainbow Six Siege Iconic Red Tactical Underline & Notch */}
                {isActive && (
                  <>
                    <div className="absolute -bottom-2.5 left-0 right-0 h-[3px] bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.8)]" />
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-red-600 rotate-45" />
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Bumper [E] */}
        <button
          onClick={() => handleCycleTab(1)}
          className="hidden lg:flex items-center justify-center px-2 py-1 rounded-lg text-[10px] font-mono font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10 transition border border-[var(--panel-border)] cursor-pointer"
          title="Pestaña siguiente [Tecla E]"
        >
          <span>▶ [E]</span>
        </button>
      </div>

      {/* 3. Right: Operator Clearance & Tactical HUD Controls */}
      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
        
        {/* Operator Badge (Rainbow Six Profile HUD) */}
        <div 
          onClick={() => onSelectStation && onSelectStation('agent_dossier', 'showcase')}
          className="hidden 2xl:flex items-center space-x-2 px-2.5 py-1 rounded-xl border border-[var(--panel-border)] bg-[var(--card-bg)] shadow-xs cursor-pointer hover:border-emerald-500 transition"
          title="Ver Expediente Operativo"
        >
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold font-mono text-[10px] flex items-center justify-center border border-emerald-500/40">
            50
          </div>
          <div className="text-left font-mono leading-none">
            <div className="text-[10px] font-black text-[var(--text-primary)]">
              D. SANTANDER
            </div>
            <div className="text-[8px] text-emerald-600 dark:text-emerald-400 font-bold">
              CLEARANCE: MAX
            </div>
          </div>
        </div>

        {/* Live Radar Ping Indicator */}
        <div className="hidden sm:flex items-center space-x-1.5 text-[10px] font-mono px-2.5 py-1 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 font-bold">
          <Radio className="h-3 w-3 animate-pulse text-emerald-500" />
          <span>RADAR: 350+</span>
        </div>

        {/* Tactical Theme Toggle (Nieve / Noche) */}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            className="flex items-center space-x-1.5 text-xs px-2.5 py-1.5 rounded-xl border border-[var(--panel-border)] bg-[var(--card-bg)] hover:border-sky-500 transition cursor-pointer font-mono font-bold shadow-sm text-[var(--text-primary)]"
            title={currentTheme === 'arctic' ? 'Cambiar a Noche Táctica (Operaciones Nocturnas)' : 'Cambiar a Nieve Táctica (Operaciones de Invierno / Alto Contraste)'}
          >
            {currentTheme === 'arctic' ? (
              <>
                <Sun className="h-3.5 w-3.5 text-sky-600" />
                <span className="hidden md:inline text-[11px]">❄️ Nieve</span>
              </>
            ) : (
              <>
                <Moon className="h-3.5 w-3.5 text-purple-400" />
                <span className="hidden md:inline text-[11px]">🌙 Noche</span>
              </>
            )}
          </button>
        )}

        {/* Protocol Button ([F1]) */}
        <button
          onClick={onOpenUnifiedHelp}
          className="flex items-center space-x-1.5 text-xs text-[var(--text-primary)] bg-[var(--card-bg)] hover:bg-[var(--panel-bg)] px-3 py-1.5 rounded-xl border border-[var(--panel-border)] hover:border-emerald-500 transition cursor-pointer font-mono font-bold shadow-sm"
          title="Ver el Protocolo Táctico Anti-Alucinaciones & Visados [Tecla F1]"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden md:inline text-[11px]">Protocolo</span>
        </button>
      </div>

    </header>
  );
};
