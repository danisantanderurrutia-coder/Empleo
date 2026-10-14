import React, { useState } from 'react';
import { 
  UserCheck, 
  FileCheck2, 
  GraduationCap,
  ChevronLeft
} from 'lucide-react';
import { MasterProfileTab } from '../profile/MasterProfileTab';
import { CVManagementTab } from '../cvs/CVManagementTab';

interface AgentDossierTabProps {
  initialSubTab?: 'profile' | 'cvs';
  onReturnToHub?: () => void;
}

export const AgentDossierTab: React.FC<AgentDossierTabProps> = ({ 
  initialSubTab = 'profile',
  onReturnToHub
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'cvs'>(initialSubTab);

  return (
    <div className="space-y-5 text-slate-100 animate-fadeIn">
      {/* Rainbow Six Siege Tactical Top Bar & Pipeline Indicator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl bg-[#0a0f1d]/95 border border-slate-700/80 shadow-2xl backdrop-blur-md gap-4">
        <div className="flex items-center gap-3">
          {onReturnToHub && (
            <button
              onClick={onReturnToHub}
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 hover:border-amber-500 transition flex items-center gap-1.5 cursor-pointer shadow"
              title="Volver a la consola central Career"
            >
              <ChevronLeft className="h-4 w-4 text-amber-500" />
              <span>« CAREER HUB</span>
            </button>
          )}

          <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
            <UserCheck className="h-5 w-5" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-black text-white flex items-center gap-2 font-mono uppercase tracking-tight">
                OPERATORS // DOSSIER DE ESPECIALISTA & ARMERÍA
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-extrabold hidden sm:inline-block">
                FASE 2 ACTIVA
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-sans">
              Operador Daniel Santander: Doble M.Sc. CAU Kiel • Geofísica U. de Chile • Armería Curricular.
            </p>
          </div>
        </div>

        {/* 3-Stage Pipeline Indicator */}
        <div className="hidden xl:flex items-center gap-1.5 text-[10px] font-mono font-bold bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400">
            1. RECONOCIMIENTO & FUENTES
          </span>
          <span className="text-slate-600 font-black">➔</span>
          <span className="px-2 py-0.5 rounded bg-amber-600/20 text-amber-400 border border-amber-500/40">
            2. SELECCIÓN & ARMERÍA
          </span>
          <span className="text-slate-600 font-black">➔</span>
          <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400">
            3. PREPARACIÓN & DESPACHO
          </span>
        </div>

        {/* Game Mode Sub-Tabs Switcher */}
        <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveSubTab('profile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'profile'
                ? 'bg-amber-600 text-white shadow font-black'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            <span>FICHA OPERADOR</span>
          </button>

          <button
            onClick={() => setActiveSubTab('cvs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 ${
              activeSubTab === 'cvs'
                ? 'bg-amber-600 text-white shadow font-black'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <FileCheck2 className="h-3.5 w-3.5" />
            <span>ARMERÍA CV (LOADOUT)</span>
          </button>
        </div>
      </div>

      {/* SUB-PANEL 1: MASTER PROFILE & ACHIEVEMENTS */}
      {activeSubTab === 'profile' && (
        <div className="space-y-4">
          <MasterProfileTab />
        </div>
      )}

      {/* SUB-PANEL 2: COMPILED CVS & TEMPLATES */}
      {activeSubTab === 'cvs' && (
        <div className="space-y-4">
          <CVManagementTab />
        </div>
      )}
    </div>
  );
};
