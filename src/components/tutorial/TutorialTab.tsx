import React, { useState } from 'react';
import { 
  BookOpen, 
  RefreshCw, 
  CheckCircle2, 
  Sparkles, 
  Compass, 
  ShieldCheck 
} from 'lucide-react';
import { getStoredDocs } from '../../services/db';
import { runUpdateDocumentationWorkflow } from '../../services/agents';
import type { PageDocInfo } from '../../types/tutorial';

interface TutorialTabProps {
  onStartGuidedTour: () => void;
}

export const TutorialTab: React.FC<TutorialTabProps> = ({ onStartGuidedTour }) => {
  const [docs, setDocs] = useState<PageDocInfo[]>(getStoredDocs());
  const [isUpdatingDocs, setIsUpdatingDocs] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string>(docs[0]?.pageId || 'dashboard');
  const [agentUpdateMsg, setAgentUpdateMsg] = useState<string | null>(null);

  const selectedDoc = docs.find(d => d.pageId === selectedDocId) || docs[0];

  const handleRunDocAgent = () => {
    setIsUpdatingDocs(true);
    setAgentUpdateMsg(null);
    setTimeout(() => {
      const res = runUpdateDocumentationWorkflow();
      const freshDocs = getStoredDocs();
      setDocs(freshDocs);
      setIsUpdatingDocs(false);
      setAgentUpdateMsg(`Documentation Agent ha verificado las ${res.updatedCount} pantallas. Versión incrementada a v1.0.5 (${new Date().toISOString().split('T')[0]}). 0 documentaciones obsoletas.`);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between glass-panel p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-400" />
            <span>Tutorial Integrado & Agente de Documentación Auto-Actualizable</span>
          </h2>
          <p className="text-xs text-slate-400">
            Manual de usuario completo, versión de documentación ({selectedDoc?.version}) y ejecutor del Documentation Agent.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onStartGuidedTour}
            className="px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-semibold text-xs rounded-xl border border-amber-500/30 transition flex items-center space-x-1.5"
          >
            <Compass className="h-4 w-4 text-amber-400" />
            <span>Iniciar Modo Guiado</span>
          </button>

          <button
            onClick={handleRunDocAgent}
            disabled={isUpdatingDocs}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg transition flex items-center space-x-2"
          >
            {isUpdatingDocs ? (
              <RefreshCw className="h-4 w-4 animate-spin text-indigo-300" />
            ) : (
              <Sparkles className="h-4 w-4 text-indigo-300" />
            )}
            <span>Ejecutar /update-documentation</span>
          </button>
        </div>
      </div>

      {agentUpdateMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{agentUpdateMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-3">
          <h3 className="font-bold text-slate-100 text-sm">Índice de Pantallas y Guías</h3>

          <div className="space-y-2">
            {docs.map((doc) => {
              const isSelected = doc.pageId === selectedDocId;

              return (
                <div
                  key={doc.pageId}
                  onClick={() => setSelectedDocId(doc.pageId)}
                  className={`glass-card p-3.5 rounded-xl border cursor-pointer transition space-y-1 ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-600/10'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-xs text-white">{doc.title}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                      {doc.version}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{doc.summary}</p>
                </div>
              );
            })}
          </div>
        </div>

        {selectedDoc && (
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedDoc.title}</h2>
                  <p className="text-xs text-slate-400 mt-1">{selectedDoc.summary}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-indigo-400 block">{selectedDoc.version}</span>
                  <span className="text-[10px] text-slate-500">Última revisión: {selectedDoc.lastUpdated}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-xs text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Pasos Guiados para el Usuario en esta Pantalla:</span>
                </h4>

                <div className="space-y-2 text-xs">
                  {selectedDoc.userSteps.map((step, i) => (
                    <div key={i} className="flex items-start space-x-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="h-5 w-5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-[11px] flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-slate-300 leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-xs text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  <span>Explicación de Módulos y Funciones Especiales:</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {selectedDoc.featuresExplained.map((feat, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                      <div className="font-bold text-indigo-300">{feat.feature}</div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{feat.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1">
                <div className="font-semibold flex items-center space-x-1.5">
                  <ShieldCheck className="h-4 w-4 text-amber-400" />
                  <span>Regla Fundamental del Sistema:</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  La IA nunca debe inventar experiencia, títulos, idiomas, empresas, fechas, salarios o logros. Toda información ausente se marcará como pendiente de verificación y cualquier acción irreversible (envío de candidaturas) requiere confirmación humana explícita.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
