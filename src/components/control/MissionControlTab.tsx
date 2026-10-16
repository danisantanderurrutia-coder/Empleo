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
    <div className="space-y-5 text-[var(--text-primary)] animate-fadeIn">
      {/* Tactical Top Bar & Pipeline Indicator */}
      <div 
        className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl border shadow-xl backdrop-blur-md gap-4 transition-colors"
        style={{ 
          backgroundColor: 'var(--card-bg)', 
          borderColor: 'var(--card-border)' 
        }}
      >
        <div className="flex items-center gap-3">
          {onReturnToHub && (
            <button
              onClick={onReturnToHub}
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer shadow border"
              style={{ 
                backgroundColor: 'var(--panel-bg)', 
                borderColor: 'var(--panel-border)',
                color: 'var(--text-primary)'
              }}
              title="Volver al Panel Central"
            >
              <ChevronLeft className="h-4 w-4 text-sky-500" />
              <span>« PANEL CENTRAL</span>
            </button>
          )}

          <div className="h-9 w-9 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-500/30 shrink-0">
            <Send className="h-5 w-5" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-black text-[var(--text-primary)] flex items-center gap-2 font-mono uppercase tracking-tight">
                CANDIDATURAS // GESTIÓN & SEGUIMIENTO DE PROCESOS
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/40 font-extrabold hidden sm:inline-block">
                PIPELINE ACTIVO
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] font-sans">
              Seguimiento de postulaciones laborales y convocatorias I+D • Control humano 100% verificado.
            </p>
          </div>
        </div>

        {/* 3-Stage Pipeline Indicator */}
        <div 
          className="hidden xl:flex items-center gap-1.5 text-[10px] font-mono font-bold px-3 py-1.5 rounded-xl border"
          style={{ 
            backgroundColor: 'var(--panel-bg)', 
            borderColor: 'var(--panel-border)' 
          }}
        >
          <span className="px-2 py-0.5 rounded bg-black/10 dark:bg-slate-900 text-[var(--text-muted)]">
            1. MERCADO & FONDOS
          </span>
          <span className="text-[var(--text-muted)] font-black">➔</span>
          <span className="px-2 py-0.5 rounded bg-black/10 dark:bg-slate-900 text-[var(--text-muted)]">
            2. PERFIL & CV MODULAR
          </span>
          <span className="text-[var(--text-muted)] font-black">➔</span>
          <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/40">
            3. CANDIDATURAS & KANBAN
          </span>
        </div>

        {/* Sub-Tabs Switcher */}
        <div 
          className="flex items-center p-1 rounded-xl border gap-1 shrink-0"
          style={{ 
            backgroundColor: 'var(--panel-bg)', 
            borderColor: 'var(--panel-border)' 
          }}
        >
          <button
            onClick={() => setActiveSubTab('applications')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'applications'
                ? 'bg-purple-600 text-white shadow font-black'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <KanbanSquare className="h-3.5 w-3.5" />
            <span>TABLERO DE PROCESOS</span>
          </button>

          <button
            onClick={() => setActiveSubTab('batch')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'batch'
                ? 'bg-purple-600 text-white shadow font-black'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <CheckSquare className="h-3.5 w-3.5" />
            <span>REVISIÓN EN LOTE</span>
          </button>

          <button
            onClick={() => setActiveSubTab('intelligence')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'intelligence'
                ? 'bg-purple-600 text-white shadow font-black'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <LineChart className="h-3.5 w-3.5" />
            <span>INTELIGENCIA & CONVERSIÓN</span>
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
