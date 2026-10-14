import React, { useState } from 'react';
import { 
  Zap, 
  HelpCircle, 
  Sparkles, 
  RefreshCw, 
  Search, 
  ShieldCheck, 
  FileText,
  Compass
} from 'lucide-react';
import { runDailyJobSearchWorkflow, runUpdateDocumentationWorkflow } from '../../services/agents';
import type { AgentLog } from '../../services/agents';

interface NavbarProps {
  currentTab: string;
  onOpenContextHelp: () => void;
  onStartGuidedTour: () => void;
  onOpenProtocolModal: () => void;
  onRefreshData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenContextHelp,
  onStartGuidedTour,
  onOpenProtocolModal,
  onRefreshData
}) => {
  const [isRunningWorkflow, setIsRunningWorkflow] = useState(false);
  const [workflowLog, setWorkflowLog] = useState<AgentLog[] | null>(null);
  const [activeWorkflowName, setActiveWorkflowName] = useState('');

  const handleRunDailySearch = () => {
    setIsRunningWorkflow(true);
    setActiveWorkflowName('/daily-job-search');
    setTimeout(() => {
      const res = runDailyJobSearchWorkflow();
      setWorkflowLog(res.logs);
      setIsRunningWorkflow(false);
      onRefreshData();
    }, 1200);
  };

  const handleRunDocUpdate = () => {
    setIsRunningWorkflow(true);
    setActiveWorkflowName('/update-documentation');
    setTimeout(() => {
      const res = runUpdateDocumentationWorkflow();
      setWorkflowLog(res.logs);
      setIsRunningWorkflow(false);
      onRefreshData();
    }, 1000);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800 px-5 py-3 flex items-center justify-between shadow-lg text-slate-100">
      {/* Brand Header */}
      <div className="flex items-center space-x-3">
        <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-inner">
          <Zap className="h-5 w-5 text-emerald-400" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
              Job Search <span className="gradient-text font-black">OS</span>
            </h1>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-slate-700">
              v1.0.7 SOLID Enterprise
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium hidden sm:block">Centro de Mando con IA & Antigravity Engine</p>
        </div>
      </div>

      {/* Center Actions */}
      <div className="hidden lg:flex items-center space-x-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
        <button
          id="tour-btn-daily-search"
          onClick={handleRunDailySearch}
          disabled={isRunningWorkflow}
          className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm"
          title="Ejecutar Scout & Matcher Agent para buscar nuevas ofertas en Euskadi y España"
        >
          {isRunningWorkflow && activeWorkflowName === '/daily-job-search' ? (
            <RefreshCw className="h-3.5 w-3.5 animate-spin text-white" />
          ) : (
            <Search className="h-3.5 w-3.5 text-white" />
          )}
          <span>/daily-job-search</span>
        </button>

        <button
          onClick={handleRunDocUpdate}
          disabled={isRunningWorkflow}
          className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
          title="Ejecutar Documentation Agent para verificar documentación"
        >
          {isRunningWorkflow && activeWorkflowName === '/update-documentation' ? (
            <RefreshCw className="h-3.5 w-3.5 animate-spin text-white" />
          ) : (
            <FileText className="h-3.5 w-3.5 text-slate-300" />
          )}
          <span>/update-documentation</span>
        </button>

        <div className="h-4 w-px bg-slate-800 mx-1" />

        <button
          onClick={onOpenProtocolModal}
          className="flex items-center space-x-1 text-xs text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 px-3 py-1.5 rounded-lg border border-emerald-500/30 font-medium transition cursor-pointer"
          title="Ver el Protocolo Estándar SOLID & Filtros Anti-Alucinaciones"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span className="font-semibold text-[11px]">🛡️ Protocolo SOLID</span>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2">
        <button
          id="tour-btn-protocol-mobile"
          onClick={onOpenProtocolModal}
          className="lg:hidden flex items-center space-x-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-emerald-950/60 text-emerald-300 border border-emerald-500/30"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Protocolo</span>
        </button>

        <button
          id="tour-btn-guided-mode"
          onClick={onStartGuidedTour}
          className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20 transition"
        >
          <Compass className="h-3.5 w-3.5 text-amber-400" />
          <span className="hidden sm:inline">Modo Guiado</span>
        </button>

        <button
          id="tour-btn-context-help"
          onClick={onOpenContextHelp}
          className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition"
          title="Ayuda Contextual para esta pestaña"
        >
          <HelpCircle className="h-4 w-4 text-emerald-400" />
          <span>Ayuda</span>
        </button>
      </div>

      {/* Workflow Logs Modal */}
      {workflowLog && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#131c2e] max-w-lg w-full rounded-2xl p-6 border border-slate-700 shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-emerald-400" />
                <h3 className="font-bold text-base text-white">Ejecución de Workflow: {activeWorkflowName}</h3>
              </div>
              <button
                onClick={() => setWorkflowLog(null)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {workflowLog.map((log) => (
                <div key={log.id} className="text-xs p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 font-semibold">
                    <span className="text-emerald-400">{log.agentName}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <div className="text-white font-bold">{log.action}</div>
                  <div className="text-slate-300">{log.details}</div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setWorkflowLog(null)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
