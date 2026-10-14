import React, { useState } from 'react';
import { 
  KanbanSquare, 
  Lock, 
  Building2, 
  ChevronRight
} from 'lucide-react';
import { getStoredApplications, saveStoredApplications } from '../../services/db';
import type { ApplicationItem, ApplicationStage } from '../../types/applications';
import { STAGES } from '../../types/applications';
import { ApplicationDetailModal } from './ApplicationDetailModal';
import { SubmissionConfirmModal } from './SubmissionConfirmModal';

export const ApplicationsTab: React.FC = () => {
  const [applications, setApplications] = useState<ApplicationItem[]>(getStoredApplications());
  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(null);
  const [confirmingApp, setConfirmingApp] = useState<ApplicationItem | null>(null);

  const handleAdvanceStage = (appId: string, targetStage: ApplicationStage) => {
    const updated = applications.map(a => {
      if (a.id === appId) {
        return {
          ...a,
          currentStage: targetStage,
          updatedDate: new Date().toISOString().split('T')[0],
          history: [
            ...a.history,
            {
              id: `h-${Date.now()}`,
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
              stage: targetStage,
              title: `Candidatura avanzada al Paso ${targetStage}: ${STAGES.find(s => s.stage === targetStage)?.label}`,
              actor: 'Usuario' as const
            }
          ]
        };
      }
      return a;
    });
    setApplications(updated);
    saveStoredApplications(updated);
    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp(updated.find(a => a.id === appId) || null);
    }
  };

  const handleConfirmSubmission = (appId: string) => {
    const updated = applications.map(a => {
      if (a.id === appId) {
        return {
          ...a,
          currentStage: 7 as ApplicationStage,
          status: 'Enviada' as const,
          humanApprovalGranted: true,
          approvalTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          updatedDate: new Date().toISOString().split('T')[0],
          history: [
            ...a.history,
            {
              id: `h-${Date.now()}`,
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
              stage: 7 as ApplicationStage,
              title: 'ENVÍO CONFIRMADO MANUALMENTE POR EL USUARIO (Paso 7 completado).',
              actor: 'Usuario' as const
            }
          ]
        };
      }
      return a;
    });
    setApplications(updated);
    saveStoredApplications(updated);
    setConfirmingApp(null);
    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp(updated.find(a => a.id === appId) || null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-[#0a0f1d]/90 border border-slate-700/80 shadow-md gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2 font-mono uppercase">
            <KanbanSquare className="h-5 w-5 text-sky-400" />
            <span>Fase 3 del Pipeline: Despacho Asistido & Seguimiento</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Pipeline Maestro de 3 Fases: 1. Exploración & Fuentes ➔ 2. Selección & Armería CV ➔ 3. Preparación & Despacho Asistido.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30 text-amber-300 font-mono font-bold shrink-0">
          <Lock className="h-4 w-4 text-amber-400" />
          <span>Aprobación Humana Obligatoria para Envíos</span>
        </div>
      </div>

      <div className="space-y-4">
        {applications.map((app) => {
          const currentStageObj = STAGES.find(s => s.stage === app.currentStage);
          const needsHumanApproval = app.currentStage === 6 && !app.humanApprovalGranted;

          return (
            <div
              key={app.id}
              className={`glass-panel p-5 rounded-2xl border transition space-y-4 ${
                needsHumanApproval 
                  ? 'border-amber-500/50 bg-amber-500/5' 
                  : 'border-slate-800'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                      {app.id}
                    </span>
                    <h3 className="font-bold text-base text-white">{app.offerTitle}</h3>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-slate-300">
                    <span className="flex items-center space-x-1">
                      <Building2 className="h-3.5 w-3.5 text-indigo-400" />
                      <strong className="text-white">{app.companyName}</strong>
                    </span>
                    <span>•</span>
                    <span>📍 {app.location}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-medium">{app.status}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  {needsHumanApproval && (
                    <button
                      onClick={() => setConfirmingApp(app)}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center space-x-1.5"
                    >
                      <Lock className="h-3.5 w-3.5" />
                      <span>Confirmar Envío (Paso 7)</span>
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedApp(app)}
                    className="px-4 py-2 bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 font-semibold text-xs rounded-xl border border-indigo-500/30 transition flex items-center space-x-1"
                  >
                    <span>Gestionar Candidatura</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Paso Actual: <strong className="text-indigo-300">{currentStageObj?.label}</strong></span>
                  <span className="font-mono text-[11px]">Etapa {app.currentStage} / 9</span>
                </div>

                <div className="flex items-center space-x-1">
                  {STAGES.map((st) => (
                    <div
                      key={st.stage}
                      className={`h-2 flex-1 rounded-full transition-all ${
                        app.currentStage >= st.stage
                          ? st.stage === 7 && !app.humanApprovalGranted
                            ? 'bg-amber-400 animate-pulse'
                            : 'bg-indigo-500'
                          : 'bg-slate-800'
                      }`}
                      title={st.label}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ApplicationDetailModal
        application={selectedApp}
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        onAdvanceStage={handleAdvanceStage}
        onRequestSubmissionApproval={(app) => setConfirmingApp(app)}
      />

      <SubmissionConfirmModal
        application={confirmingApp}
        isOpen={!!confirmingApp}
        onClose={() => setConfirmingApp(null)}
        onConfirmSubmission={handleConfirmSubmission}
      />
    </div>
  );
};
