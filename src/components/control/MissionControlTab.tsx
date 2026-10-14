import React, { useState } from 'react';
import { 
  Send, 
  KanbanSquare, 
  CheckSquare, 
  LineChart
} from 'lucide-react';
import { ApplicationsTab } from '../applications/ApplicationsTab';
import { BatchApplicationsTab } from '../applications/BatchApplicationsTab';
import { IntelligenceTab } from '../intelligence/IntelligenceTab';

interface MissionControlTabProps {
  initialSubTab?: 'applications' | 'batch' | 'intelligence';
}

export const MissionControlTab: React.FC<MissionControlTabProps> = ({ 
  initialSubTab = 'applications' 
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'applications' | 'batch' | 'intelligence'>(initialSubTab);

  return (
    <div className="space-y-6 text-slate-100 animate-fadeIn">
      {/* Station Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between glass-panel p-4 rounded-2xl border border-slate-800 bg-[#111827] shadow-lg gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Send className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2 font-mono uppercase tracking-tight">
              <span>Estación 3: Sala de Control & Misiones Activas</span>
            </h1>
            <p className="text-xs text-slate-400">
              Seguimiento Kanban del embudo de candidaturas, preparación de cartas de impacto e inteligencia de conversión.
            </p>
          </div>
        </div>

        {/* Sub-Tabs Switcher */}
        <div className="flex items-center p-1 bg-slate-900/90 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveSubTab('applications')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              activeSubTab === 'applications'
                ? 'bg-amber-600 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <KanbanSquare className="h-3.5 w-3.5" />
            <span>Tablero de Misiones</span>
          </button>

          <button
            onClick={() => setActiveSubTab('batch')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              activeSubTab === 'batch'
                ? 'bg-amber-600 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckSquare className="h-3.5 w-3.5" />
            <span>Despacho Asistido</span>
          </button>

          <button
            onClick={() => setActiveSubTab('intelligence')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              activeSubTab === 'intelligence'
                ? 'bg-amber-600 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LineChart className="h-3.5 w-3.5" />
            <span>Inteligencia & Funnel</span>
          </button>
        </div>
      </div>

      {/* SUB-PANEL 1: APPLICATIONS KANBAN */}
      {activeSubTab === 'applications' && (
        <div className="space-y-4">
          <ApplicationsTab />
        </div>
      )}

      {/* SUB-PANEL 2: BATCH APPLICATIONS */}
      {activeSubTab === 'batch' && (
        <div className="space-y-4">
          <BatchApplicationsTab />
        </div>
      )}

      {/* SUB-PANEL 3: INTELLIGENCE & CONVERSION */}
      {activeSubTab === 'intelligence' && (
        <div className="space-y-4">
          <IntelligenceTab />
        </div>
      )}
    </div>
  );
};
