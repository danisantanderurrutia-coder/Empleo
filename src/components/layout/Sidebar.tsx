import React from 'react';
import { 
  LayoutDashboard, 
  UserCheck, 
  FileCheck2, 
  Globe2, 
  Building2, 
  Sparkles, 
  KanbanSquare, 
  LineChart, 
  Settings,
  CheckSquare
} from 'lucide-react';

export interface TabItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  description: string;
}

const TABS: TabItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Resumen ejecutivo y acciones recomendadas' },
  { id: 'profile', label: 'Perfil', icon: UserCheck, description: 'Master Profile y Banco de Logros' },
  { id: 'cvs', label: 'CVs', icon: FileCheck2, description: 'Generación de plantillas y versiones de CV' },
  { id: 'sources', label: 'Fuentes', icon: Globe2, badge: 'Portales', description: 'Directorio y Lanzador de 11 Categorías & 25+ Portales' },
  { id: 'companies', label: 'Empresas & Careers', icon: Building2, badge: 'Links', description: 'Monitoreo de links oficiales de carreras y vacantes' },
  { id: 'offers', label: 'Ofertas', icon: Sparkles, badge: 'Resultados', description: 'Buscador con Google 2 semanas y Pipeline Maestro de 5 Pasos' },
  { id: 'batch_applications', label: 'Postulación en Lote', icon: CheckSquare, badge: 'SOLID Lote', description: 'Revisión unificada, verificación de enlaces y despacho masivo' },
  { id: 'applications', label: 'Candidaturas', icon: KanbanSquare, badge: 'Progreso', description: 'Seguimiento del progreso de cada solicitud' },
  { id: 'intelligence', label: 'Inteligencia', icon: LineChart, description: 'Estadísticas, conversión y Asesor IA' },
  { id: 'settings', label: 'Configuración', icon: Settings, description: 'Agentes, LLMs y copias de seguridad' }
];

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  return (
    <aside className="w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col shrink-0 min-h-[calc(100vh-65px)] shadow-lg text-slate-100">
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Navegación Principal
        </div>

        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`tab-btn-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`h-4 w-4 transition-colors ${
                  isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                }`} />
                <span className="font-medium">{tab.label}</span>
              </div>

              {tab.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isActive 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/60 text-[11px] text-slate-400 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 font-medium">Ubicación:</span>
          <span className="font-semibold text-emerald-400">Bilbao, Bizkaia</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400 font-medium">Anti-Alucinación:</span>
          <span className="font-semibold text-emerald-400">Estricto</span>
        </div>
      </div>
    </aside>
  );
};
