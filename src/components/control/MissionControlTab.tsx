import React, { useState } from 'react';
import { 
  Send, 
  KanbanSquare, 
  CheckSquare, 
  LineChart,
  ChevronLeft
} from 'lucide-react';
import { ApplicationsTab } from '../applications/ApplicationsTab';
import { BatchApplicationsTab } from '../applications/BatchApplicationsTab';
import { IntelligenceTab } from '../intelligence/IntelligenceTab';

interface MissionControlTabProps {
  initialSubTab?: 'applications' | 'batch' | 'intelligence';
  onReturnToHub?: () => void;
}

export const MissionControlTab: React.FC<MissionControlTabProps> = ({ 
  initialSubTab = 'applications',
  onReturnToHub
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'applications' | 'batch' | 'intelligence'>(initialSubTab);

  return (
    <div className="space-y-5 text-slate-100 animate-fadeIn">
      {/* Rainbow Six Siege Tactical Top Bar & Pipeline Indicator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl bg-[#0a0f1d]/95 border border-slate-700/80 shadow-2xl backdrop-blur-md gap-4">
        <div className="flex items-center gap-3">
          {onReturnToHub && (
            <button
              onClick={onReturnToHub}
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 hover:border-red-500 transition flex items-center gap-1.5 cursor-pointer shadow"
              title="Volver a la consola central Career"
            >
              <ChevronLeft className="h-4 w-4 text-red-500" />
              <span>« CAREER HUB</span>
            </button>
          )}

          <div className="h-9 w-9 rounded-xl bg-red-600/10 text-red-500 flex items-center justify-center border border-red-500/30 shrink-0">
            <Send className="h-5 w-5" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-black text-white flex items-center gap-2 font-mono uppercase tracking-tight">
                CANDIDATURAS // GESTIÓN & SEGUIMIENTO DE PROCESOS
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 font-extrabold hidden sm:inline-block">
                PIPELINE ACTIVO
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-sans">
              Seguimiento mediado por Daniel Santander: aprobación humana obligatoria • embudo de selección • entrevistas.
            </p>
          </div>
        </div>

        {/* 3-Stage Pipeline Indicator */}
        <div className="hidden xl:flex items-center gap-1.5 text-[10px] font-mono font-bold bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400">
            1. MERCADO & VACANTES
          </span>
          <span className="text-slate-600 font-black">➔</span>
          <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400">
            2. PERFIL & ADAPTACIÓN DE CV
          </span>
          <span className="text-slate-600 font-black">➔</span>
          <span className="px-2 py-0.5 rounded bg-sky-600/20 text-sky-400 border border-sky-500/40">
            3. CANDIDATURAS & SEGUIMIENTO
          </span>
        </div>

        {/* Game Mode Sub-Tabs Switcher */}
        <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveSubTab('applications')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'applications'
                ? 'bg-red-600 text-white shadow font-black'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <KanbanSquare className="h-3.5 w-3.5" />
            <span>TABLERO DE PROCESOS</span>
          </button>

          <button
            onClick={() => setActiveSubTab('batch')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'batch'
                ? 'bg-red-600 text-white shadow font-black'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <CheckSquare className="h-3.5 w-3.5" />
            <span>REVISIÓN EN LOTE</span>
          </button>

          <button
            onClick={() => setActiveSubTab('intelligence')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'intelligence'
                ? 'bg-red-600 text-white shadow font-black'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <LineChart className="h-3.5 w-3.5" />
            <span>TELEMETRÍA // DEBRIEFING & INTELIGENCIA</span>
          </button>
        </div>
      </div>

      {/* SUB-PANEL 1: APPLICATIONS KANBAN & UNIFIED DESPACHO ASISTIDO */}
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
