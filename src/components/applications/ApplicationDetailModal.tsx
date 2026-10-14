import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Lock, 
  Clock, 
  X, 
  ChevronRight,
  Sparkles,
  Copy,
  Check,
  HelpCircle,
  Cpu
} from 'lucide-react';
import type { ApplicationItem, ApplicationStage } from '../../types/applications';
import { STAGES } from '../../types/applications';
import { generateTailoredCoverLetter, generateApplicationQA } from '../../services/coverLetterCopilot';
import type { ApplicationQAPair } from '../../services/coverLetterCopilot';

interface ApplicationDetailModalProps {
  application: ApplicationItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAdvanceStage: (appId: string, targetStage: ApplicationStage) => void;
  onRequestSubmissionApproval: (app: ApplicationItem) => void;
}

export const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  application,
  isOpen,
  onClose,
  onAdvanceStage,
  onRequestSubmissionApproval
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedLetter, setCopiedLetter] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState<string | null>(application?.coverLetter || null);
  const [selectedLang, setSelectedLang] = useState<'es' | 'en'>('es');

  if (!isOpen || !application) return null;

  // Mock JobOffer from application details for letter generation
  const mockOffer = {
    id: application.offerId,
    title: application.offerTitle,
    company: application.companyName,
    location: application.location,
    isBilbaoLocation: application.location.toLowerCase().includes('bilbao'),
    isRemote: application.location.toLowerCase().includes('remoto'),
    url: 'https://www.tecnalia.com/empleo',
    sourceId: 'src-1',
    sourceName: 'Portal Oficial',
    publishedDate: '2026-08-19',
    rawDescription: 'Posición técnica de impacto en España y Euskadi.',
    requirements: ['R', 'GIS', 'Gobernanza Ambiental', 'Español / Inglés'],
    responsibilities: [],
    status: 'Nueva' as const,
    extractedAt: '2026-08-19',
    matchScore: { totalScore: 90, skillFitScore: 35, locationScore: 25, salaryScore: 15, experienceScore: 10, companyQualityScore: 5, matchingSkills: [], missingSkills: [], rationale: [], pendingVerificationRequirements: [] }
  };

  const handleGenerateLetter = (lang: 'es' | 'en') => {
    const letterObj = generateTailoredCoverLetter(mockOffer, lang);
    setGeneratedLetter(letterObj.fullMarkdown);
  };

  const qaPairs: ApplicationQAPair[] = generateApplicationQA(mockOffer);

  const handleCopyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#131c2e] max-w-4xl w-full rounded-2xl border border-slate-700 shadow-2xl space-y-4 my-8 flex flex-col max-h-[90vh] text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {application.id}
              </span>
              <h3 className="font-bold text-white text-base">{application.offerTitle}</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Empresa: <strong className="text-white">{application.companyName}</strong> • {application.location}
            </p>
          </div>

          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 9 Steps Bar */}
        <div className="px-6 py-3 bg-slate-900/90 border-b border-slate-800 overflow-x-auto shrink-0">
          <div className="flex items-center space-x-1 min-w-[700px]">
            {STAGES.map((st) => {
              const isCurrent = application.currentStage === st.stage;
              const isPast = application.currentStage > st.stage;

              return (
                <React.Fragment key={st.stage}>
                  <button
                    onClick={() => {
                      if (st.stage === 7 && !application.humanApprovalGranted) {
                        onRequestSubmissionApproval(application);
                      } else {
                        onAdvanceStage(application.id, st.stage);
                      }
                    }}
                    className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition ${
                      isCurrent
                        ? 'bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-600/30'
                        : isPast
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {isPast && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />}
                    {st.stage === 7 && (
                      <span title="Requiere confirmación humana">
                        <Lock className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      </span>
                    )}
                    <span>{st.shortName}</span>
                  </button>
                  {st.stage < 9 && <ChevronRight className="h-3.5 w-3.5 text-slate-700 shrink-0" />}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          {/* Privacy & Human Control Banner */}
          <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-xs text-slate-200 space-y-1">
            <span className="font-bold text-emerald-400 flex items-center gap-1.5">
              <Lock className="h-4 w-4 text-emerald-400" />
              <span>Garantía de Control Humano & Privacidad Local:</span>
            </span>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Esta sección es tu <strong>centro de mando privado en tu ordenador</strong>. Ninguna postulación ni correo se envía automáticamente a <strong>{application.companyName}</strong>. Aquí gestionas tus borradores de CV, cartas y respuestas para realizarlas tú directamente en el portal oficial de la empresa.
            </p>
          </div>

          {/* Current Stage Indicator */}
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-indigo-300">
                Paso Actual: {STAGES.find(s => s.stage === application.currentStage)?.label}
              </span>
              {application.currentStage === 6 && !application.humanApprovalGranted && (
                <span className="text-[11px] font-semibold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 flex items-center gap-1">
                  <Lock className="h-3.5 w-3.5 text-amber-400" /> Aprobación Humana Requerida
                </span>
              )}
            </div>
            <p className="text-slate-300 font-medium">
              {STAGES.find(s => s.stage === application.currentStage)?.description}
            </p>

            {application.currentStage === 6 && !application.humanApprovalGranted && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => onRequestSubmissionApproval(application)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition"
                >
                  Abrir Modal de Confirmación de Envío (Paso 7)
                </button>
              </div>
            )}
          </div>

          {/* AI Cover Letter Generator */}
          <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3 bg-slate-900/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-emerald-400" />
                <h4 className="font-semibold text-white text-xs uppercase tracking-wider">
                  Generador de Carta de Presentación Adaptada (Inspirado en Claude Skills)
                </h4>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setSelectedLang('es');
                    handleGenerateLetter('es');
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                    selectedLang === 'es' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  🇪🇸 Español
                </button>
                <button
                  onClick={() => {
                    setSelectedLang('en');
                    handleGenerateLetter('en');
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                    selectedLang === 'en' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  🇬🇧 English
                </button>
              </div>
            </div>

            {generatedLetter ? (
              <div className="space-y-2">
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedLetter);
                      setCopiedLetter(true);
                      setTimeout(() => setCopiedLetter(false), 2000);
                    }}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition flex items-center space-x-1 border border-slate-700"
                  >
                    {copiedLetter ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-300" />}
                    <span>{copiedLetter ? '¡Copiado!' : 'Copiar Carta'}</span>
                  </button>
                </div>
                <textarea
                  value={generatedLetter}
                  onChange={e => setGeneratedLetter(e.target.value)}
                  rows={8}
                  className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 font-mono text-[11px] leading-relaxed focus:outline-none focus:border-emerald-500"
                />
              </div>
            ) : (
              <button
                onClick={() => handleGenerateLetter('es')}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow transition flex items-center justify-center space-x-2"
              >
                <Sparkles className="h-4 w-4 text-white" />
                <span>Generar Carta de Presentación Personalizada con IA</span>
              </button>
            )}
          </div>

          {/* AI Application Q&A Copilot */}
          <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3 bg-slate-900/60">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-2.5">
              <Cpu className="h-5 w-5 text-emerald-400" />
              <h4 className="font-semibold text-white text-xs uppercase tracking-wider">
                Copilot de Respuestas para Formularios (Inspirado en AIHawk)
              </h4>
            </div>
            <p className="text-[11px] text-slate-400">
              Respuestas rápidas adaptadas a tu perfil para copiar y pegar en formularios de postulación:
            </p>

            <div className="space-y-3">
              {qaPairs.map((qa, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between font-semibold text-white">
                    <span className="flex items-center gap-1.5">
                      <HelpCircle className="h-4 w-4 text-emerald-400" />
                      {qa.question}
                    </span>
                    <button
                      onClick={() => handleCopyText(qa.recommendedAnswer, idx)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-medium transition flex items-center space-x-1 border border-slate-700"
                    >
                      {copiedIndex === idx ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3 text-slate-300" />}
                      <span>{copiedIndex === idx ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300 font-normal text-[11px] leading-relaxed">
                    {qa.recommendedAnswer}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-medium">
                    💡 Tip: {qa.tips}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit History */}
          <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-3 bg-slate-900/60">
            <h4 className="font-semibold text-white flex items-center space-x-1.5">
              <Clock className="h-4 w-4 text-emerald-400" />
              <span>Historial de Auditoría de la Candidatura</span>
            </h4>

            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {application.history.map((evt) => (
                <div key={evt.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-0.5 text-slate-300">
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span className="font-semibold text-emerald-400">Paso {evt.stage} • {evt.actor}</span>
                    <span>{evt.timestamp}</span>
                  </div>
                  <div className="text-slate-200">{evt.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
