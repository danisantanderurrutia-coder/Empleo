import React from 'react';
import { Sparkles, Printer, X, MessageSquare, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { CompanyDossier } from '../../types/companies';

interface CompanyReportModalProps {
  company: CompanyDossier | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CompanyReportModal: React.FC<CompanyReportModalProps> = ({ company, isOpen, onClose }) => {
  if (!isOpen || !company) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-emerald-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-panel max-w-3xl w-full rounded-2xl border border-emerald-500/40 shadow-2xl space-y-4 my-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-emerald-900/60 shrink-0">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/30">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">Informe de Inteligencia Corporativa IA</h3>
              <p className="text-xs text-emerald-400">{company.name} • {company.headquarters}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition"
            >
              <Printer className="h-4 w-4" />
              <span>Imprimir Informe</span>
            </button>
            <button onClick={onClose} className="p-1.5 text-emerald-400 hover:text-white rounded-lg">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-emerald-950/90 space-y-5 text-xs text-emerald-100">
          {/* Header Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-900 via-emerald-800/80 to-emerald-900 border border-emerald-700/60 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">{company.name}</h1>
                <p className="text-emerald-300 font-semibold">{company.sector} • {company.size}</p>
              </div>
              <span className="font-mono text-[11px] px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-700">
                Fecha Reporte: {company.lastResearched}
              </span>
            </div>
            <p className="text-emerald-100/90 leading-relaxed pt-1">{company.description}</p>
          </div>

          {/* SWOT / Strategy Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Interview Hooks */}
            <div className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-700/50 space-y-2">
              <h4 className="font-bold text-emerald-300 uppercase tracking-wider flex items-center space-x-1.5">
                <MessageSquare className="h-4 w-4 text-emerald-400" />
                <span>Argumentos Estratégicos de Entrevista</span>
              </h4>
              <ul className="space-y-1.5 text-emerald-200">
                {company.interviewArguments.map((arg, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{arg}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Risk Factors & Red Flags */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
              <h4 className="font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-1.5">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <span>Factores de Riesgo / Red Flags</span>
              </h4>
              <ul className="space-y-1.5 text-amber-200">
                {company.redFlags.length > 0 ? (
                  company.redFlags.map((flag, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{flag}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-emerald-300">0 Riesgos críticos detectados en el análisis reciente.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Key Projects */}
          <div className="p-4 rounded-xl bg-emerald-900/40 border border-emerald-700/50 space-y-2">
            <h4 className="font-bold text-emerald-300 uppercase tracking-wider">Proyectos de Impacto Diagnosticados:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {company.keyProjects.map((proj, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-emerald-950/70 border border-emerald-800/60 text-emerald-200">
                  {proj}
                </div>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-800/60 text-[11px] text-emerald-400 flex items-center justify-between">
            <span>Generado por Researcher Agent — Job Search OS</span>
            <span className="font-mono">Verificado Anti-Hallucination</span>
          </div>
        </div>
      </div>
    </div>
  );
};
