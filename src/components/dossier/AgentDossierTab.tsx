import React, { useState } from 'react';
import { 
  UserCheck, 
  FileCheck2, 
  GraduationCap
} from 'lucide-react';
import { MasterProfileTab } from '../profile/MasterProfileTab';
import { CVManagementTab } from '../cvs/CVManagementTab';

interface AgentDossierTabProps {
  initialSubTab?: 'profile' | 'cvs';
}

export const AgentDossierTab: React.FC<AgentDossierTabProps> = ({ 
  initialSubTab = 'profile' 
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'cvs'>(initialSubTab);

  return (
    <div className="space-y-6 text-slate-100 animate-fadeIn">
      {/* Station Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between glass-panel p-4 rounded-2xl border border-slate-800 bg-[#111827] shadow-lg gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/30">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2 font-mono uppercase tracking-tight">
              <span>Estación 2: Dossier del Agente & Armería de CVs</span>
            </h1>
            <p className="text-xs text-slate-400">
              Identidad científica, Doble Máster CAU Kiel, banco de logros verificados y versiones de CV compiladas.
            </p>
          </div>
        </div>

        {/* Sub-Tabs Switcher */}
        <div className="flex items-center p-1 bg-slate-900/90 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveSubTab('profile')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              activeSubTab === 'profile'
                ? 'bg-sky-600 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Perfil Maestro & Logros</span>
          </button>

          <button
            onClick={() => setActiveSubTab('cvs')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              activeSubTab === 'cvs'
                ? 'bg-sky-600 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCheck2 className="h-3.5 w-3.5" />
            <span>Armería de CVs Compilados</span>
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
