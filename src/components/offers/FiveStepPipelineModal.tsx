import React, { useState } from 'react';
import {
  X,
  Search,
  FileText,
  MessageSquare,
  Target,
  Mail,
  ExternalLink,
  Copy,
  Check,
  Cpu,
  ShieldCheck,
  Lightbulb,
  AlertCircle,
  UserCheck
} from 'lucide-react';
import type { JobOffer } from '../../types/offers';
import { generateTailoredCoverLetter, generateApplicationQA } from '../../services/coverLetterCopilot';
import { getDossierForOffer } from '../../services/jobWingmanService';
import { WingmanEditor } from './WingmanEditor';
import { buildCv, renderCvMarkdown } from '../../services/cvStudio';

interface FiveStepPipelineModalProps {
  offer: JobOffer | null;
  isOpen: boolean;
  onClose: () => void;
  onStartApplication: (offerId: string) => void;
  onOpenStudio?: (offerId: string, docType?: 'cv' | 'cover_letter') => void;
}

const STEPS = [
  { num: 1, label: 'Análisis del empleo', icon: Search },
  { num: 2, label: 'Consejo Wingman', icon: Target },
  { num: 3, label: 'Preparar CV', icon: FileText },
  { num: 4, label: 'Carta', icon: MessageSquare },
  { num: 5, label: 'Contacto & Formularios', icon: Mail },
  { num: 6, label: 'Entrevista', icon: Cpu }
];

const card = 'p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3';
const btnPrimary = 'px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition cursor-pointer';
const btnGhost = 'px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 cursor-pointer';
const textareaCls = 'w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 font-mono text-[11px] leading-relaxed focus:outline-none';

export const FiveStepPipelineModal: React.FC<FiveStepPipelineModalProps> = ({
  offer,
  isOpen,
  onClose,
  onStartApplication,
  onOpenStudio
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [cvLang, setCvLang] = useState<'es' | 'en'>('es');
  const [letterLang, setLetterLang] = useState<'de' | 'en' | 'es'>('de');
  const [emailLang, setEmailLang] = useState<'de' | 'en'>('de');
  const [copied, setCopied] = useState<string | null>(null);
  const [editingLead, setEditingLead] = useState(false);
  const [, setDossierVersion] = useState(0);

  if (!isOpen || !offer) return null;

  const dossier = getDossierForOffer(offer);
  const lead = dossier.leadProfile;
  const leadFull = `${lead.titleHonorific ? lead.titleHonorific + ' ' : ''}${lead.name}`;
  const coverLetter = generateTailoredCoverLetter(offer, letterLang, lead, dossier);
  const qaPairs = generateApplicationQA(offer);
  const builtCv = buildCv({ lang: cvLang, length: '1p', offer });
  const cvText = renderCvMarkdown(builtCv);
  const emailSubject = emailLang === 'de' ? dossier.coldApproachEmail.subjectDe : dossier.coldApproachEmail.subjectEn;
  const emailBody = emailLang === 'de' ? dossier.coldApproachEmail.bodyDe : dossier.coldApproachEmail.bodyEn;
  const match = offer.matchScore;

  const copy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };
  const CopyBtn = ({ k, text, label }: { k: string; text: string; label: string }) => (
    <button
      onClick={() => copy(k, text)}
      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition flex items-center space-x-1 border border-slate-700 cursor-pointer"
    >
      {copied === k ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
      <span>{copied === k ? '¡Copiado!' : label}</span>
    </button>
  );
  const LangToggle = <T extends string>({ value, options, onChange }: { value: T; options: { v: T; l: string }[]; onChange: (v: T) => void }) => (
    <div className="flex bg-slate-950 rounded-lg p-0.5 border border-slate-800">
      {options.map(o => (
        <button
          key={o.v}
          onClick={() => onChange(o.v)}
          className={`px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${value === o.v ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
        >
          {o.l}
        </button>
      ))}
    </div>
  );
  const Nav = ({ prev, next, nextLabel }: { prev?: number; next?: number; nextLabel?: string }) => (
    <div className="flex justify-end pt-2 space-x-2">
      {prev && <button onClick={() => setActiveStep(prev)} className={btnGhost}>← Atrás</button>}
      {next && <button onClick={() => setActiveStep(next)} className={btnPrimary}>{nextLabel} →</button>}
    </div>
  );

  const interviewQuestions = [
    {
      q: `¿Cómo aplica su formación cuantitativa en Geofísica y R/Python a las exigencias concretas de ${offer.title} en ${offer.company}?`,
      a: dossier.candidateValueThesis
    },
    ...dossier.projectPainPoints.slice(0, 3).map(p => ({
      q: `Reto del proyecto: ${p}`,
      a: `Prepara una respuesta técnica propia (con un ejemplo verificable de tu CV) sobre cómo abordarías este punto. Ganchos disponibles: ${dossier.technicalHooks.slice(0, 2).join(' | ')}`
    }))
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#131c2e] max-w-4xl w-full rounded-2xl border border-slate-700 shadow-2xl space-y-4 my-8 flex flex-col max-h-[90vh] text-slate-100">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
          <div>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              Preparación Asistida de Candidatura
            </span>
            <h3 className="font-bold text-white text-base mt-1">{offer.title}</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              <strong className="text-white">{offer.company}</strong> • {offer.location}
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Stepper */}
        <div className="px-6 py-3 bg-slate-900/90 border-b border-slate-800 shrink-0">
          <div className="grid grid-cols-6 gap-2">
            {STEPS.map(step => {
              const Icon = step.icon;
              const isActive = activeStep === step.num;
              const isPast = activeStep > step.num;
              return (
                <button
                  key={step.num}
                  onClick={() => setActiveStep(step.num)}
                  className={`flex flex-col items-center p-2 rounded-xl text-[11px] font-semibold transition border cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                      : isPast
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <Icon className="h-3.5 w-3.5" />
                    <span>Paso {step.num}</span>
                  </div>
                  <span className="truncate max-w-full text-[10px] mt-0.5 font-normal">{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">

          {/* PASO 1: ANÁLISIS DEL EMPLEO */}
          {activeStep === 1 && (
            <div className="space-y-4">
              <div className={card}>
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Search className="h-4 w-4 text-emerald-400" />
                  <span>Paso 1: Análisis del empleo</span>
                </h4>
                <div className="flex flex-wrap gap-2 text-[11px] text-slate-300">
                  <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">Afinidad: <strong className="text-emerald-400">{match?.totalScore ?? '–'}/100</strong></span>
                  {offer.deadline && <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">Plazo: <strong className="text-amber-300">{offer.deadline}</strong></span>}
                  {offer.verificationStatus && <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">{offer.verificationStatus}</span>}
                </div>
                <p className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed">{offer.rawDescription}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={card}>
                  <span className="font-bold text-emerald-400">Requisitos</span>
                  <ul className="space-y-1 text-slate-300">
                    {offer.requirements.map((r, i) => <li key={i}>▸ {r}</li>)}
                  </ul>
                </div>
                <div className={card}>
                  <span className="font-bold text-sky-400">Responsabilidades</span>
                  <ul className="space-y-1 text-slate-300">
                    {offer.responsibilities.map((r, i) => <li key={i}>▸ {r}</li>)}
                  </ul>
                </div>
              </div>

              {match && (
                <div className={card}>
                  <span className="font-bold text-white">Encaje con tu perfil</span>
                  <div className="flex flex-wrap gap-1.5">
                    {match.matchingSkills.map((k, i) => <span key={i} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">✓ {k}</span>)}
                    {match.missingSkills.map((k, i) => <span key={i} className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">△ {k}</span>)}
                  </div>
                  {match.pendingVerificationRequirements.length > 0 && (
                    <p className="text-amber-300/90">Requisitos por verificar manualmente: {match.pendingVerificationRequirements.join('; ')}</p>
                  )}
                </div>
              )}

              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
                <span className="font-mono text-xs text-slate-300 truncate mr-3">{offer.url}</span>
                <a href={offer.url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl flex items-center space-x-1.5 shrink-0">
                  <span>Abrir vacante</span><ExternalLink className="h-4 w-4" />
                </a>
              </div>
              <Nav next={2} nextLabel="Paso 2: Consejo Wingman" />
            </div>
          )}

          {/* PASO 2: CONSEJO WINGMAN */}
          {activeStep === 2 && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button
                  onClick={() => setEditingLead(v => !v)}
                  className="px-3 py-1.5 bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 text-xs font-semibold rounded-lg border border-sky-500/40 cursor-pointer"
                >
                  {editingLead ? 'Cerrar formulario' : '✎ Cargar / editar supervisor y proyecto'}
                </button>
              </div>
              {editingLead && (
                <WingmanEditor
                  offer={offer}
                  dossier={dossier}
                  onSaved={() => { setEditingLead(false); setDossierVersion(v => v + 1); }}
                  onCancel={() => setEditingLead(false)}
                />
              )}
              <div className={card}>
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Target className="h-4 w-4 text-sky-400" />
                  <span>Paso 2: Consejo Wingman — supervisor e instituto</span>
                </h4>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <UserCheck className="h-5 w-5 text-sky-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <div className="font-bold text-white text-sm">{leadFull}</div>
                    <div className="text-sky-300">{lead.role}</div>
                    <div className="text-slate-400">{lead.institution}</div>
                    {lead.email && <a href={`mailto:${lead.email}`} className="text-sky-400 hover:underline font-mono">{lead.email}</a>}
                  </div>
                </div>
                {lead.researchFocus && lead.researchFocus.length > 0 && (
                  <div>
                    <span className="font-semibold text-slate-300">Líneas científicas:</span>
                    <ul className="mt-1 space-y-0.5 text-slate-300">{lead.researchFocus.map((r, i) => <li key={i}>▸ {r}</li>)}</ul>
                  </div>
                )}
                {lead.styleNotes && <p className="text-slate-400"><strong className="text-slate-300">Estilo / qué valora:</strong> {lead.styleNotes}</p>}
              </div>

              <div className={card}>
                <span className="font-bold text-amber-400 flex items-center gap-1.5"><AlertCircle className="h-4 w-4" />Dolores y retos del proyecto</span>
                <ul className="space-y-1.5">
                  {dossier.projectPainPoints.map((p, i) => (
                    <li key={i} className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-900/30 text-amber-200/90">{p}</li>
                  ))}
                </ul>
              </div>

              <div className={card}>
                <span className="font-bold text-emerald-400 flex items-center gap-1.5"><Lightbulb className="h-4 w-4" />Tu ángulo (hooks)</span>
                <p className="italic text-slate-300 p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/40">"{dossier.candidateValueThesis}"</p>
                <ul className="space-y-1.5">
                  {dossier.technicalHooks.map((h, i) => (
                    <li key={i} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300"><strong className="text-emerald-400">#{i + 1}</strong> {h}</li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={card}>
                  <span className="font-bold text-sky-400">→ Para el CV (paso 3)</span>
                  <ul className="space-y-1 text-slate-300">{dossier.cvGuidance.map((g, i) => <li key={i}>▸ {g}</li>)}</ul>
                </div>
                <div className={card}>
                  <span className="font-bold text-sky-400">→ Para la carta (paso 4)</span>
                  <ul className="space-y-1 text-slate-300">{dossier.coverLetterAngles.map((g, i) => <li key={i}>▸ {g}</li>)}</ul>
                </div>
              </div>
              <Nav prev={1} next={3} nextLabel="Paso 3: Preparar CV" />
            </div>
          )}

          {/* PASO 3: CV */}
          {activeStep === 3 && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-sky-950/30 border border-sky-500/30 space-y-1">
                <span className="font-bold text-sky-300 flex items-center gap-1.5"><Target className="h-4 w-4" />Guía Wingman para el CV de {leadFull}</span>
                <ul className="text-slate-300 space-y-0.5">{dossier.cvGuidance.map((g, i) => <li key={i}>▸ {g}</li>)}</ul>
              </div>
              <div className={card}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4 text-emerald-400" />
                    <span>Paso 3: Preparación del CV (datos verificados del Portafolio)</span>
                  </h4>
                  <LangToggle value={cvLang} onChange={setCvLang} options={[{ v: 'es', l: '🇪🇸 ES' }, { v: 'en', l: '🇬🇧 EN' }]} />
                </div>
                <div className="flex items-center justify-end gap-2">
                  {onOpenStudio && (
                    <button
                      onClick={() => { onOpenStudio(offer.id, 'cv'); onClose(); }}
                      className="px-3 py-1 bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 text-xs font-semibold rounded-lg flex items-center space-x-1.5 border border-sky-500/40 cursor-pointer"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /><span>Afinar en CV Studio A4</span>
                    </button>
                  )}
                  <CopyBtn k="cv" text={cvText} label="Copiar CV" />
                </div>
                <textarea value={cvText} readOnly rows={10} className={textareaCls} />
              </div>
              <Nav prev={2} next={4} nextLabel="Paso 4: Carta" />
            </div>
          )}

          {/* PASO 4: CARTA */}
          {activeStep === 4 && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-sky-950/30 border border-sky-500/30 space-y-1">
                <span className="font-bold text-sky-300 flex items-center gap-1.5"><Target className="h-4 w-4" />Ángulos Wingman para la carta</span>
                <ul className="text-slate-300 space-y-0.5">{dossier.coverLetterAngles.map((g, i) => <li key={i}>▸ {g}</li>)}</ul>
              </div>
              <div className={card}>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-emerald-400" />
                    <span>Paso 4: Carta de presentación</span>
                  </h4>
                  <div className="flex items-center gap-2">
                    <LangToggle value={letterLang} onChange={setLetterLang} options={[{ v: 'de', l: '🇩🇪 DE' }, { v: 'en', l: '🇬🇧 EN' }, { v: 'es', l: '🇪🇸 ES' }]} />
                    {onOpenStudio && (
                      <button
                        onClick={() => { onOpenStudio(offer.id, 'cover_letter'); onClose(); }}
                        className="px-3 py-1 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-xs font-semibold rounded-lg flex items-center space-x-1.5 border border-purple-500/40 cursor-pointer"
                        title="Abrir en Cover Letter Studio (A4 / DIN 5008)"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /><span>Afinar en Carta Studio</span>
                      </button>
                    )}
                    <CopyBtn k="letter" text={coverLetter.fullMarkdown} label="Copiar carta" />
                  </div>
                </div>
                <textarea value={coverLetter.fullMarkdown} readOnly rows={14} className={textareaCls} />
              </div>
              <Nav prev={3} next={5} nextLabel="Paso 5: Contacto & Formularios" />
            </div>
          )}

          {/* PASO 5: CONTACTO + FORMULARIOS */}
          {activeStep === 5 && (
            <div className="space-y-4">
              <div className={card}>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Mail className="h-4 w-4 text-emerald-400" />
                    <span>Consulta previa a {leadFull} (opcional)</span>
                  </h4>
                  <div className="flex items-center gap-2">
                    <LangToggle value={emailLang} onChange={setEmailLang} options={[{ v: 'de', l: '🇩🇪 DE' }, { v: 'en', l: '🇬🇧 EN' }]} />
                    {lead.email && (
                      <a
                        href={`mailto:${lead.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-semibold rounded-lg border border-slate-700"
                      >
                        Abrir en correo
                      </a>
                    )}
                    <CopyBtn k="email" text={emailBody} label="Copiar cuerpo" />
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono"><strong className="text-slate-400">Asunto:</strong> {emailSubject}</div>
                <textarea value={emailBody} readOnly rows={12} className={textareaCls} />
                <p className="text-slate-400">Una pregunta técnica real, sin pedir nada. Enviar antes del plazo; no se envía nada automáticamente.</p>
              </div>

              <div className={card}>
                <span className="font-bold text-white block">📋 Preguntas de formulario del portal</span>
                {qaPairs.map((qa, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-slate-300 font-semibold">
                      <span>{qa.question}</span>
                      <CopyBtn k={`qa${idx}`} text={qa.recommendedAnswer} label="Copiar" />
                    </div>
                    <p className="text-slate-300 text-[11px] font-mono">{qa.recommendedAnswer}</p>
                  </div>
                ))}
              </div>
              <Nav prev={4} next={6} nextLabel="Paso 6: Entrevista" />
            </div>
          )}

          {/* PASO 6: ENTREVISTA */}
          {activeStep === 6 && (
            <div className="space-y-4">
              <div className={card}>
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-emerald-400" />
                  <span>Paso 6: Preparación de entrevista con {leadFull}</span>
                </h4>
                <div className="space-y-3">
                  {interviewQuestions.map((iq, i) => (
                    <div key={i} className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                      <span className="font-bold text-emerald-400 block">❓ #{i + 1}: {iq.q}</span>
                      <div className="p-2.5 rounded bg-slate-900 text-slate-200 font-mono text-[11px]">💡 {iq.a}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                    <span className="font-semibold text-emerald-300">Pipeline completado</span>
                  </div>
                  <button
                    onClick={() => { onClose(); onStartApplication(offer.id); }}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition cursor-pointer"
                  >
                    📋 Registrar en Mis Candidaturas
                  </button>
                </div>
                <p className="text-[11px] text-slate-300">
                  Nada se envía automáticamente a {offer.company}. Los borradores quedan solo en tu ordenador; el envío oficial lo haces tú en el portal.
                </p>
              </div>
              <Nav prev={5} />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
