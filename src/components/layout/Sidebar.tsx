import React from 'react';
import { 
  Crosshair, 
  Radio, 
  UserCheck, 
  Send, 
  Settings
} from 'lucide-react';

export interface TabItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  description: string;
}

const TACTICAL_STATIONS: TabItem[] = [
  { 
    id: 'dashboard', 
    label: 'War Room', 
    icon: Crosshair, 
    badge: 'HUD',
    description: 'Centro de Mando, Briefing Diario y Estatus de Visado' 
  },
  { 
    id: 'market_radar', 
    label: 'Radar de Mercado', 
    icon: Radio, 
    badge: 'Recon',
    description: '350+ Vacantes, 3 Cuadrantes de Visado y Empresas Target' 
  },
  { 
    id: 'agent_dossier', 
    label: 'Dossier del Agente', 
    icon: UserCheck, 
    badge: 'Armería',
    description: 'Perfil Geofísico, Máster Kiel y CVs Adaptados (ES/EN)' 
  },
  { 
    id: 'mission_control', 
    label: 'Sala de Control', 
    icon: Send, 
    badge: 'Misiones',
    description: 'Kanban de Candidaturas, Cartas y Funnel de Conversión' 
  },
  { 
    id: 'settings', 
    label: 'Cuartel General', 
    icon: Settings, 
    badge: 'HQ Tools',
    description: 'Extensión Chrome, Git-Scraper y Respaldo JSON' 
  }
];

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  // Map legacy tab IDs to parent stations if needed
  const resolveActiveStation = (tabId: string): string => {
    if (['offers', 'sources', 'companies'].includes(tabId)) return 'market_radar';
    if (['profile', 'cvs'].includes(tabId)) return 'agent_dossier';
    if (['applications', 'batch_applications', 'intelligence'].includes(tabId)) return 'mission_control';
    return tabId;
  };

  const currentStation = resolveActiveStation(activeTab);

  return (
    <aside className="w-64 bg-[#0a0f1d] border-r border-slate-800 flex flex-col shrink-0 min-h-[calc(100vh-65px)] shadow-2xl text-slate-100">
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400/80 flex items-center justify-between">
          <span>ESTACIONES DE MANDO</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {TACTICAL_STATIONS.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentStation === tab.id;

          return (
            <button
              key={tab.id}
              id={`tab-btn-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/40 shadow-md ring-1 ring-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`h-4 w-4 transition-colors ${
                  isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                }`} />
                <span className="font-mono tracking-tight font-bold">{tab.label}</span>
              </div>

              {tab.badge && (
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                  isActive 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-800/80 text-slate-400 border border-slate-700/60'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Operative Intelligence Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/80 text-[11px] font-mono text-slate-400 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 font-medium">ESTADO VISADO:</span>
          <span className="font-bold text-sky-400">§20 / Ley 14</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400 font-medium">BASE TÁCTICA:</span>
          <span className="font-bold text-emerald-400">Bilbao (Bizkaia)</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400 font-medium">CONTROL:</span>
          <span className="font-bold text-emerald-300 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            HUMAN-IN-THE-LOOP
          </span>
        </div>
      </div>
    </aside>
  );
};
