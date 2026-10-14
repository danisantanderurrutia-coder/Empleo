import React from 'react';
import { Sparkles, CheckCircle2, X, Target } from 'lucide-react';
import type { JobOffer } from '../../types/offers';

interface MatchRationaleModalProps {
  offer: JobOffer | null;
  isOpen: boolean;
  onClose: () => void;
  onStartApplication: (offerId: string) => void;
}

export const MatchRationaleModal: React.FC<MatchRationaleModalProps> = ({
  offer,
  isOpen,
  onClose,
  onStartApplication
}) => {
  if (!isOpen || !offer) return null;

  const score = offer.matchScore;
  const total = score.totalScore;

  // Grade Rating A-F (career-ops rubric style)
  let grade = 'Grade A+';
  let gradeBadgeColor = 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
  if (total >= 90) {
    grade = 'Grade A+ (Prioridad Máxima)';
    gradeBadgeColor = 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
  } else if (total >= 80) {
    grade = 'Grade A (Alta Prioridad)';
    gradeBadgeColor = 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30';
  } else if (total >= 65) {
    grade = 'Grade B (Evaluación Viable)';
    gradeBadgeColor = 'bg-amber-500/20 text-amber-300 border border-amber-500/40';
  } else {
    grade = 'Grade C / F (Baja Coincidencia)';
    gradeBadgeColor = 'bg-slate-800 text-slate-400 border border-slate-700';
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#131c2e] max-w-2xl w-full rounded-2xl p-6 border border-slate-700 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200 text-slate-100">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-emerald-400" />
              <h3 className="font-bold text-white text-base">Desglose de Match & Matriz DAFO</h3>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${gradeBadgeColor}`}>
                {grade}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {offer.title} • <strong className="text-white">{offer.company}</strong> ({offer.location})
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Score Breakdown Bars */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="text-slate-400 flex justify-between">
              <span>Encaje Técnico</span>
              <strong className="text-emerald-400 font-bold">{score.skillFitScore}/35</strong>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(score.skillFitScore / 35) * 100}%` }} />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="text-slate-400 flex justify-between">
              <span>Ubicación Bilbao</span>
              <strong className="text-emerald-400 font-bold">{score.locationScore}/25</strong>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(score.locationScore / 25) * 100}%` }} />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="text-slate-400 flex justify-between">
              <span>Condiciones Salario</span>
              <strong className="text-purple-400 font-bold">{score.salaryScore}/15</strong>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(score.salaryScore / 15) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* Matriz DAFO (SWOT Analysis - career-ops style) */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-emerald-400" />
            <h4 className="font-semibold text-xs text-slate-300 uppercase tracking-wider">
              Análisis DAFO de la Vacante (Rúbrica Antigravity & career-ops):
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 space-y-0.5">
              <span className="font-semibold text-emerald-400">💪 Fortalezas:</span>
              <p className="text-slate-300">Formación en Geofísica, R, GIS y Gobernanza de Suelos/Clima de nivel Máster Europa.</p>
            </div>
            <div className="p-2.5 rounded-lg bg-sky-950/40 border border-sky-500/30 text-sky-300 space-y-0.5">
              <span className="font-semibold text-sky-400">🎯 Oportunidad:</span>
              <p className="text-slate-300">Sede estratégica en Euskadi/Bilbao con altísima proyección en proyectos de transición justa.</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-xs text-slate-400 uppercase tracking-wider">
            Explicación Transparente del Score (0-100%):
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {score.rationale.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button onClick={onClose} className="text-xs text-slate-400 hover:text-white font-medium">
            Cerrar
          </button>

          <button
            onClick={() => {
              onClose();
              onStartApplication(offer.id);
            }}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-md transition"
          >
            Iniciar Candidatura en 9 Pasos
          </button>
        </div>
      </div>
    </div>
  );
};
