import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Building2, 
  PlusCircle,
  Search,
  Sparkles,
  MapPin,
  ExternalLink,
  Trash2,
  Copy,
  Check,
  FileText,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  Send,
  HelpCircle,
  UserCheck,
  Mail,
  FolderCheck,
  ShieldCheck,
  Lightbulb,
  Bot,
  Workflow,
  Cpu,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { getStoredApplications, saveStoredApplications, getStoredOffers } from '../../services/db';
import type { ApplicationItem, ApplicationStage } from '../../types/applications';
import type { JobOffer } from '../../types/offers';
import { STAGES } from '../../types/applications';
import { generateTailoredCoverLetter, generateApplicationQA } from '../../services/coverLetterCopilot';
import { getDossierForOffer } from '../../services/jobWingmanService';
import { AddApplicationModal } from './AddApplicationModal';
import { FiveStepPipelineModal } from '../offers/FiveStepPipelineModal';

const PIPELINE_STEPS_DECLARATION = [
  {
    step: 1,
    title: 'Radar & Análisis',
    badge: 'Filtro Algorítmico',
    desc: 'Extracción de requerimientos clave, stack técnico y condiciones contractuales (TVöD/TV-L/Sector Privado).',
    wingmanRole: 'Ingesta y parsing de la vacante',
    icon: Search,
    color: 'text-sky-500 bg-sky-500/10 border-sky-500/30'
  },
  {
    step: 2,
    title: 'Inteligencia de PI',
    badge: 'Wingman Radar',
    desc: 'Mapeo de publicaciones del supervisor/director, diagnóstico del dolor del proyecto y ganchos de paridad.',
    wingmanRole: 'Dossier de abordaje interpersonal',
    icon: UserCheck,
    color: 'text-purple-500 bg-purple-500/10 border-purple-500/30'
  },
  {
    step: 3,
    title: 'Auditoría de Docs',
    badge: 'Expediente Oficial',
    desc: 'Verificación estricta de documentos requeridos (título con distinción, transcript, cartas de recomendación).',
    wingmanRole: 'Checklist anti-descalificación',
    icon: FolderCheck,
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/30'
  },
  {
    step: 4,
    title: 'Calibración de CV',
    badge: 'CV Cuantitativo',
    desc: 'Reordenamiento de módulos: física de medios porosos, balances de masa y reproducibilidad en R/Python.',
    wingmanRole: 'Sugerencias de priorización de hechos',
    icon: FileText,
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30'
  },
  {
    step: 5,
    title: 'Carta de Impacto',
    badge: '5 Párrafos Rigurosos',
    desc: 'Borrador académico en alemán/inglés/español con balances físicos concretos y cero clichés serviles.',
    wingmanRole: 'Ensamblaje anti-AI y rigor técnico',
    icon: Sparkles,
    color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/30'
  },
  {
    step: 6,
    title: 'Cold Approach',
    badge: 'Email al Supervisor',
    desc: 'Pregunta técnica pertinente o consulta previa directamente al PI antes o durante la postulación.',
    wingmanRole: 'Borrador sobrio de par a par',
    icon: Mail,
    color: 'text-rose-500 bg-rose-500/10 border-rose-500/30'
  },
  {
    step: 7,
    title: 'Despacho & Control',
    badge: 'Aprobación Humana',
    desc: 'Ningún envío se ejecuta en automático. El candidato aprueba y confirma el envío en la plataforma oficial.',
    wingmanRole: 'Blindaje ético y confirmación formal',
    icon: Send,
    color: 'text-teal-500 bg-teal-500/10 border-teal-500/30'
  }
];

const buildMockOfferFromApp = (app: ApplicationItem): JobOffer => ({
  id: app.offerId,
  title: app.offerTitle,
  company: app.companyName,
  location: app.location,
  isBilbaoLocation: app.location.toLowerCase().includes('bilbao') || app.location.toLowerCase().includes('bizkaia'),
  isRemote: app.location.toLowerCase().includes('remoto') || app.location.toLowerCase().includes('remote'),
  url: app.offerUrl || '',
  sourceId: 'src-manual',
  sourceName: 'Locker Target',
  publishedDate: app.createdDate,
  rawDescription: app.interviewNotes || '',
  requirements: app.adaptedCvSummary || [],
  responsibilities: [],
  status: 'Nueva',
  extractedAt: app.createdDate,
  matchScore: {
    totalScore: 90,
    skillFitScore: 35,
    locationScore: 25,
    salaryScore: 15,
    experienceScore: 10,
    companyQualityScore: 5,
    matchingSkills: [],
    missingSkills: [],
    rationale: [],
    pendingVerificationRequirements: []
  }
});

const getOfferForApp = (app: ApplicationItem): JobOffer => {
  const stored = getStoredOffers();
  const found = stored.find(o => o.id === app.offerId);
  if (found) return found;
  return buildMockOfferFromApp(app);
};

const THUENEN_SEED_APP: ApplicationItem = {
  id: 'CAND-THUENEN-369',
  offerId: 'job-thuenen-techworms-369',
  offerTitle: 'Wissenschaftliche*r Mitarbeiter*in / Doktorand*in (TechWorms)',
  companyName: 'Johann Heinrich von Thünen-Institut',
  location: 'Braunschweig, Niedersachsen, Alemania',
  currentStage: 2,
  status: 'En Progreso',
  createdDate: '2026-10-21',
  updatedDate: '2026-10-28',
  offerUrl: 'https://www.karriere-thuenen.de/index.php?ac=jobad&id=369&language=2',
  humanApprovalGranted: false,
  adaptedCvSummary: [
    'Física de Medios Porosos & Ecuaciones de Richards',
    'RootBox / Cuantificación Radicular bajo UV',
    'Modelado y Análisis Estadístico en R / Python',
    'Isótopos 13C/15N y Dinámica de Carbono en Subsuelo'
  ],
  interviewNotes: 'Proyecto TechWorms (Prof. Dr. Axel Don). Pipeline calibrado con enfoque cuantitativo.',
  history: [
    {
      id: 'h-thuenen-1',
      timestamp: '2026-10-21 12:00',
      stage: 1,
      title: 'Vacante detectada e interceptada en portal Thünen',
      actor: 'Usuario'
    },
    {
      id: 'h-thuenen-2',
      timestamp: '2026-10-22 20:00',
      stage: 2,
      title: 'Dossier Wingman generado para Prof. Dr. Axel Don',
      actor: 'Usuario'
    }
  ]
};

const DEFAULT_SEED_APPS: ApplicationItem[] = [
  THUENEN_SEED_APP,
  {
    id: 'CAND-2026-001',
    offerId: 'seed-bc3-01',
    offerTitle: 'Senior Research Fellow in Climatology & Ecosystem Accounting',
    companyName: 'BC3 Basque Centre for Climate Change',
    location: 'Bilbao / Leioa, Bizkaia',
    currentStage: 2,
    status: 'En Progreso',
    createdDate: '2026-10-10',
    updatedDate: '2026-10-14',
    offerUrl: 'https://www.bc3research.org/careers.html',
    humanApprovalGranted: false,
    adaptedCvSummary: ['R (sf, terra, ggplot2)', 'Modelización de Servicios Ecosistémicos', 'Políticas Ambientales UE'],
    interviewNotes: 'Puesto estratégico en Euskadi. Posibilidad de tramitación vía Ley 14/2013 (UGE Investigadores).',
    history: [
      {
        id: 'h-1',
        timestamp: '2026-10-10 10:30',
        stage: 1,
        title: 'Vacante detectada e interceptada en portal de BC3',
        actor: 'Usuario'
      }
    ]
  },
  {
    id: 'CAND-2026-002',
    offerId: 'seed-gfz-02',
    offerTitle: 'Scientific Project Lead – Earth Observation & Climate Risk Analytics',
    companyName: 'GFZ German Research Centre for Geosciences',
    location: 'Potsdam / Berlín, Alemania',
    currentStage: 4,
    status: 'En Progreso',
    createdDate: '2026-10-08',
    updatedDate: '2026-10-13',
    offerUrl: 'https://www.gfz-potsdam.de/en/career',
    humanApprovalGranted: false,
    adaptedCvSummary: ['Observación de la Tierra', 'Python / Rasterio / Scikit-learn', 'AufenthG §20'],
    interviewNotes: 'Convenio TV-L E13. Compatible 100% con título Double M.Sc. CAU Kiel y visado §20.',
    history: [
      {
        id: 'h-2',
        timestamp: '2026-10-08 14:00',
        stage: 3,
        title: 'CV adaptado y carta de presentación borrador generada',
        actor: 'Usuario'
      }
    ]
  },
  {
    id: 'CAND-2026-003',
    offerId: 'seed-unep-03',
    offerTitle: 'IMEO Methane Alert and Response System Implementation Coordinator',
    companyName: 'United Nations Environment Programme (UNEP)',
    location: 'París, Francia / 100% Remoto Europa',
    currentStage: 7,
    status: 'Enviada',
    createdDate: '2026-09-28',
    updatedDate: '2026-10-05',
    offerUrl: 'https://unjobs.org/vacancies/1786913775321',
    humanApprovalGranted: true,
    approvalTimestamp: '2026-10-05 16:20',
    adaptedCvSummary: ['Monitoreo Satelital MARS', 'Gobernanza Climática', 'Inglés C1 / Francés'],
    interviewNotes: 'Postulación oficial enviada por portal Inspira. Esperando respuesta de primera ronda.',
    history: [
      {
        id: 'h-3',
        timestamp: '2026-10-05 16:20',
        stage: 7,
        title: 'Postulación confirmada y enviada formalmente por el usuario.',
        actor: 'Usuario'
      }
    ]
  }
];

interface ApplicationsTabProps {
  onOpenStudio?: (offerId: string, docType?: 'cv' | 'cover_letter') => void;
}

export const ApplicationsTab: React.FC<ApplicationsTabProps> = ({ onOpenStudio }) => {
  const [applications, setApplications] = useState<ApplicationItem[]>(() => {
    const stored = getStoredApplications();
    if (stored.length === 0) {
      saveStoredApplications(DEFAULT_SEED_APPS);
      return DEFAULT_SEED_APPS;
    }
    const hasThuenen = stored.some(a => a.offerId === 'job-thuenen-techworms-369' || a.id === 'CAND-THUENEN-369');
    if (!hasThuenen) {
      const merged = [THUENEN_SEED_APP, ...stored];
      saveStoredApplications(merged);
      return merged;
    }
    return stored;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'germany' | 'euskadi' | 'remote' | 'interviews'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAppForPipeline, setSelectedAppForPipeline] = useState<ApplicationItem | null>(null);
  const [assistedDispatchApp, setAssistedDispatchApp] = useState<ApplicationItem | null>(null);

  // Assisted dispatch internal state
  const [letterLang, setLetterLang] = useState<'es' | 'en' | 'de'>('de');
  const [copiedLetter, setCopiedLetter] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [dispatchTab, setDispatchTab] = useState<'briefing' | 'letter' | 'docs' | 'qa'>('briefing');
  const [emailLang, setEmailLang] = useState<'de' | 'en'>('de');
  const [showPipelineExplainer, setShowPipelineExplainer] = useState(true);

  useEffect(() => {
    saveStoredApplications(applications);
  }, [applications]);

  const handleAddApplication = (newApp: ApplicationItem) => {
    const updated = [newApp, ...applications];
    setApplications(updated);
  };

  const handleDeleteApplication = (appId: string) => {
    if (window.confirm('¿Confirmas que deseas eliminar esta oferta/candidatura de tu Locker?')) {
      const updated = applications.filter(a => a.id !== appId);
      setApplications(updated);
      if (assistedDispatchApp?.id === appId) {
        setAssistedDispatchApp(null);
      }
    }
  };

  const handleMoveStage = (appId: string, direction: 'prev' | 'next') => {
    const updated = applications.map(app => {
      if (app.id !== appId) return app;

      let newStage = app.currentStage;
      let newStatus = app.status;

      if (direction === 'next') {
        if (newStage < 9) newStage = (newStage + 1) as ApplicationStage;
        if (newStage >= 7) {
          if (newStage === 7) newStatus = 'Enviada';
          else if (newStage === 8) newStatus = 'Entrevista';
          else if (newStage === 9) newStatus = 'Oferta Recibida';
        }
      } else {
        if (newStage > 1) newStage = (newStage - 1) as ApplicationStage;
        if (newStage < 7) newStatus = 'En Progreso';
      }

      return {
        ...app,
        currentStage: newStage,
        status: newStatus,
        updatedDate: new Date().toISOString().split('T')[0],
        history: [
          ...app.history,
          {
            id: `h-${Date.now()}`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            stage: newStage,
            title: `Candidatura movida a Etapa ${newStage}: ${STAGES.find(s => s.stage === newStage)?.shortName}`,
            actor: 'Usuario' as const
          }
        ]
      };
    });

    setApplications(updated);
  };

  const handleConfirmHumanSubmission = (appId: string) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const updated = applications.map(app => {
      if (app.id !== appId) return app;
      return {
        ...app,
        currentStage: 7 as ApplicationStage,
        status: 'Enviada' as const,
        humanApprovalGranted: true,
        approvalTimestamp: timestamp,
        updatedDate: timestamp.split(' ')[0],
        history: [
          ...app.history,
          {
            id: `h-${Date.now()}`,
            timestamp,
            stage: 7 as ApplicationStage,
            title: 'ENVÍO CONFIRMADO FORMALMENTE (Paso 7 - Aprobación Humana Concedida)',
            actor: 'Usuario' as const
          }
        ]
      };
    });

    setApplications(updated);
    setAssistedDispatchApp(prev => prev && prev.id === appId ? { ...prev, currentStage: 7, status: 'Enviada', humanApprovalGranted: true } : prev);
  };

  // Filter applications
  const filteredApps = applications.filter(app => {
    const query = searchQuery.toLowerCase().trim();
    const matchQuery = !query || 
      app.offerTitle.toLowerCase().includes(query) ||
      app.companyName.toLowerCase().includes(query) ||
      app.location.toLowerCase().includes(query);

    if (!matchQuery) return false;

    if (selectedFilter === 'germany') {
      const loc = app.location.toLowerCase();
      return loc.includes('alemania') || loc.includes('germany') || loc.includes('berlín') || loc.includes('potsdam') || loc.includes('kiel');
    }
    if (selectedFilter === 'euskadi') {
      const loc = app.location.toLowerCase();
      return loc.includes('bilbao') || loc.includes('bizkaia') || loc.includes('donostia') || loc.includes('euskadi');
    }
    if (selectedFilter === 'remote') {
      const loc = app.location.toLowerCase();
      return loc.includes('remoto') || loc.includes('remote');
    }
    if (selectedFilter === 'interviews') {
      return app.currentStage === 8 || app.status === 'Entrevista';
    }

    return true;
  });

  // Group into 5 primary tactical columns:
  // 1. Radar / Guardadas (Stages 1-2)
  // 2. Preparación / Cartas & CV (Stages 3-5)
  // 3. Postuladas / Despachadas (Stages 6-7)
  // 4. Entrevistas en Curso (Stage 8)
  // 5. Concluidas / Histórico (Stage 9 or Final outcomes)
  const colRadar = filteredApps.filter(a => a.currentStage <= 2 && a.status === 'En Progreso');
  const colPrep = filteredApps.filter(a => a.currentStage >= 3 && a.currentStage <= 5 && a.status === 'En Progreso');
  const colSent = filteredApps.filter(a => (a.currentStage === 6 || a.currentStage === 7) || a.status === 'Enviada');
  const colInterviews = filteredApps.filter(a => a.currentStage === 8 || a.status === 'Entrevista');
  const colDone = filteredApps.filter(a => a.currentStage >= 9 || a.status === 'Oferta Recibida' || a.status === 'Desestimada' || a.status === 'Pausada');

  const [mountTimestamp] = useState(() => Date.now());

  return (
    <div className="space-y-6 text-[var(--text-primary)] font-sans animate-fadeIn select-none">
      
      {/* TACTICAL HERO: JOB WINGMAN AI COPILOT & PIPELINE ARCHITECTURE */}
      <div 
        className="rounded-2xl border shadow-xl backdrop-blur-md overflow-hidden transition-colors"
        style={{ 
          backgroundColor: 'var(--card-bg)', 
          borderColor: 'var(--card-border)' 
        }}
      >
        <div className="relative p-5 sm:p-6 flex flex-col lg:flex-row items-center gap-6 justify-between overflow-hidden">
          {/* Subtle gradient glow in the background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

          {/* Left: Avatar + Title & Mission Statement */}
          <div className="flex items-start gap-4 sm:gap-5 relative z-10 max-w-3xl">
            {/* Robot / Tactical Copilot Wingman Avatar */}
            <div className="relative shrink-0">
              <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl overflow-hidden border-2 border-sky-400/50 shadow-lg shadow-sky-500/20 group bg-slate-950">
                <img 
                  src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=400&q=80" 
                  alt="Job Wingman AI Copilot" 
                  className="h-full w-full object-cover grayscale contrast-125 group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-sky-500/20" />
                <div className="absolute bottom-1 left-0 right-0 flex justify-center">
                  <span className="px-1.5 py-0.5 rounded bg-sky-600 text-white font-mono font-black text-[9px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
                    <Bot className="h-2.5 w-2.5" />
                    <span>WINGMAN</span>
                  </span>
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-[var(--card-bg)] flex items-center justify-center shadow" title="Wingman en línea y asistiendo">
                <span className="h-2 w-2 rounded-full bg-white animate-ping" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-sky-500/15 text-sky-600 dark:text-sky-300 border border-sky-500/30 text-[10px] font-mono font-black uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-sky-500 animate-pulse" />
                  JOB WINGMAN // TACTICAL APPLICATION COPILOT
                </span>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold">
                  Pipeline Asistido en 7 Fases
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                  Zero-Servility Standard
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-black text-[var(--text-primary)] font-mono uppercase tracking-tight">
                Tablero de Procesos, Despacho Asistido & Pipeline Táctico
              </h2>

              <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
                Tu copiloto técnico para superar el filtro burocrático de empleo y convocatorias I+D. Mapeamos la psicología del PI a cargo, diagnosticamos los cuellos de botella del proyecto, calibramos el CV cuantitativo y redactamos cartas con rigor físico de par a par — garantizando siempre <span className="font-bold text-[var(--text-primary)]">control y despacho humano innegociable</span>.
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center gap-2.5 shrink-0 relative z-10 w-full lg:w-auto">
            <button
              onClick={() => setShowPipelineExplainer(prev => !prev)}
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl border border-[var(--card-border)] bg-[var(--panel-bg)] hover:bg-[var(--card-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-mono text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
              title="Mostrar u ocultar la arquitectura declarativa del pipeline"
            >
              <Workflow className="h-3.5 w-3.5 text-sky-500" />
              <span>{showPipelineExplainer ? 'Ocultar Arquitectura' : 'Ver Arquitectura Pipeline'}</span>
              {showPipelineExplainer ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full sm:w-auto px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-mono font-black text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-1.5 cursor-pointer uppercase tracking-wider"
            >
              <PlusCircle className="h-4 w-4" />
              <span>+ Añadir Candidatura</span>
            </button>
          </div>
        </div>

        {/* Declarative Pipeline Architecture Breakdown (Expandable) */}
        {showPipelineExplainer && (
          <div className="px-5 pb-5 pt-2 border-t border-[var(--panel-border)] bg-[var(--panel-bg)] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <Cpu className="h-4 w-4 text-sky-500" />
                <h3 className="font-mono font-black text-xs uppercase tracking-wider text-[var(--text-primary)]">
                  Arquitectura del Pipeline Asistido (7 Pasos de Alto Valor)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">
                «El Wingman investiga y modela. El candidato valida y ejecuta.»
              </span>
            </div>

            {/* Step sequence grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2.5">
              {PIPELINE_STEPS_DECLARATION.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.step}
                    className="p-3 rounded-xl border flex flex-col justify-between space-y-2 relative group hover:border-sky-500/50 transition-all shadow-sm"
                    style={{
                      backgroundColor: 'var(--card-bg)',
                      borderColor: 'var(--card-border)'
                    }}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className={`h-6 w-6 rounded-lg flex items-center justify-center border text-[10px] font-mono font-black ${item.color}`}>
                          0{item.step}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--panel-bg)] text-[var(--text-muted)] border border-[var(--card-border)] font-bold">
                          {item.badge}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1.5 font-bold text-xs text-[var(--text-primary)] font-mono">
                        <IconComponent className="h-3.5 w-3.5 text-sky-500 shrink-0" />
                        <span className="truncate">{item.title}</span>
                      </div>

                      <p className="text-[10.5px] text-[var(--text-secondary)] leading-snug line-clamp-3">
                        {item.desc}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[var(--panel-border)] text-[9.5px] font-mono text-sky-600 dark:text-sky-400">
                      <span className="font-bold">Wingman: </span>
                      <span className="text-[var(--text-muted)]">{item.wingmanRole}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-t border-[var(--panel-border)] bg-[var(--card-bg)]">
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                selectedFilter === 'all'
                  ? 'bg-sky-600 text-white shadow font-black'
                  : 'bg-[var(--panel-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--card-border)]'
              }`}
            >
              Todas ({applications.length})
            </button>
            <button
              onClick={() => setSelectedFilter('euskadi')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                selectedFilter === 'euskadi'
                  ? 'bg-emerald-600 text-white shadow font-black'
                  : 'bg-[var(--panel-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--card-border)]'
              }`}
            >
              📍 Bilbao / Euskadi
            </button>
            <button
              onClick={() => setSelectedFilter('germany')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                selectedFilter === 'germany'
                  ? 'bg-amber-600 text-white shadow font-black'
                  : 'bg-[var(--panel-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--card-border)]'
              }`}
            >
              🇩🇪 Alemania (§20)
            </button>
            <button
              onClick={() => setSelectedFilter('remote')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                selectedFilter === 'remote'
                  ? 'bg-sky-600 text-white shadow font-black'
                  : 'bg-[var(--panel-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--card-border)]'
              }`}
            >
              🌐 Remoto UE
            </button>
            <button
              onClick={() => setSelectedFilter('interviews')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                selectedFilter === 'interviews'
                  ? 'bg-purple-600 text-white shadow font-black'
                  : 'bg-[var(--panel-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--card-border)]'
              }`}
            >
              🎯 Entrevistas ({colInterviews.length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="h-3.5 w-3.5 text-[var(--text-muted)] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar en candidaturas..."
              className="w-full pl-9 pr-3 py-1.5 border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-sky-500 font-sans"
              style={{ 
                backgroundColor: 'var(--panel-bg)', 
                borderColor: 'var(--card-border)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
        </div>
      </div>

      {/* 5-Column Tactical Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-start">
        
        {/* COL 1: GUARDADAS / EN RADAR */}
        <KanbanColumn
          title="📌 EN RADAR // GUARDADAS"
          badgeColor="bg-slate-800 text-slate-300 border-slate-700"
          count={colRadar.length}
          description="Ofertas interceptadas para análisis"
        >
          {colRadar.map(app => (
            <ApplicationCard
              key={app.id}
              app={app}
              now={mountTimestamp}
              onMoveStage={handleMoveStage}
              onDelete={handleDeleteApplication}
              onOpenDispatch={() => setAssistedDispatchApp(app)}
              onOpenPipeline={() => setSelectedAppForPipeline(app)}
              canMovePrev={false}
              canMoveNext={true}
            />
          ))}
          {colRadar.length === 0 && <EmptyColumnPlaceholder text="Sin ofertas guardadas en radar" />}
        </KanbanColumn>

        {/* COL 2: PREPARACIÓN // DOSSIER */}
        <KanbanColumn
          title="⚡ PREPARACIÓN // DOSSIER"
          badgeColor="bg-sky-950 text-sky-300 border-sky-700"
          count={colPrep.length}
          description="Adaptando CV y redactando carta"
        >
          {colPrep.map(app => (
            <ApplicationCard
              key={app.id}
              app={app}
              now={mountTimestamp}
              onMoveStage={handleMoveStage}
              onDelete={handleDeleteApplication}
              onOpenDispatch={() => setAssistedDispatchApp(app)}
              onOpenPipeline={() => setSelectedAppForPipeline(app)}
              canMovePrev={true}
              canMoveNext={true}
            />
          ))}
          {colPrep.length === 0 && <EmptyColumnPlaceholder text="Sin candidaturas en preparación" />}
        </KanbanColumn>

        {/* COL 3: POSTULADAS // ENVIADAS */}
        <KanbanColumn
          title="🚀 POSTULADAS // ENVIADAS"
          badgeColor="bg-emerald-950 text-emerald-300 border-emerald-700"
          count={colSent.length}
          description="Envío oficial confirmado por usuario"
        >
          {colSent.map(app => (
            <ApplicationCard
              key={app.id}
              app={app}
              now={mountTimestamp}
              onMoveStage={handleMoveStage}
              onDelete={handleDeleteApplication}
              onOpenDispatch={() => setAssistedDispatchApp(app)}
              onOpenPipeline={() => setSelectedAppForPipeline(app)}
              canMovePrev={true}
              canMoveNext={true}
            />
          ))}
          {colSent.length === 0 && <EmptyColumnPlaceholder text="Sin postulaciones enviadas" />}
        </KanbanColumn>

        {/* COL 4: ENTREVISTAS */}
        <KanbanColumn
          title="🎯 ENTREVISTAS // EN CURSO"
          badgeColor="bg-purple-950 text-purple-300 border-purple-700"
          count={colInterviews.length}
          description="Rondas técnicas o institucionales"
        >
          {colInterviews.map(app => (
            <ApplicationCard
              key={app.id}
              app={app}
              now={mountTimestamp}
              onMoveStage={handleMoveStage}
              onDelete={handleDeleteApplication}
              onOpenDispatch={() => setAssistedDispatchApp(app)}
              onOpenPipeline={() => setSelectedAppForPipeline(app)}
              canMovePrev={true}
              canMoveNext={true}
            />
          ))}
          {colInterviews.length === 0 && <EmptyColumnPlaceholder text="Sin entrevistas activas" />}
        </KanbanColumn>

        {/* COL 5: CONCLUIDAS // HISTÓRICO */}
        <KanbanColumn
          title="🏁 HISTÓRICO // CONCLUIDAS"
          badgeColor="bg-slate-900 text-slate-400 border-slate-800"
          count={colDone.length}
          description="Ofertas recibidas, declinadas o cerradas"
        >
          {colDone.map(app => (
            <ApplicationCard
              key={app.id}
              app={app}
              now={mountTimestamp}
              onMoveStage={handleMoveStage}
              onDelete={handleDeleteApplication}
              onOpenDispatch={() => setAssistedDispatchApp(app)}
              onOpenPipeline={() => setSelectedAppForPipeline(app)}
              canMovePrev={true}
              canMoveNext={false}
            />
          ))}
          {colDone.length === 0 && <EmptyColumnPlaceholder text="Sin histórico registrado" />}
        </KanbanColumn>

      </div>

      {/* Manual Add Offer Modal */}
      <AddApplicationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddApplication={handleAddApplication}
      />

      {/* Modal: PIPELINE UNIFICADO (7 Pasos: Análisis, Supervisor, Documentos, CV, Carta, Contacto, Entrevista) */}
      {selectedAppForPipeline && (
        <FiveStepPipelineModal
          offer={getOfferForApp(selectedAppForPipeline)}
          isOpen={!!selectedAppForPipeline}
          onClose={() => setSelectedAppForPipeline(null)}
          onStartApplication={() => {
            setSelectedAppForPipeline(null);
          }}
          onOpenStudio={onOpenStudio}
        />
      )}

      {/* Modal: DESPACHO ASISTIDO + WINGMAN BRIEFING */}
      {assistedDispatchApp && (() => {
        const dispatchOffer = getOfferForApp(assistedDispatchApp);
        const dispatchDossier = getDossierForOffer(dispatchOffer);
        const tailoredLetter = generateTailoredCoverLetter(dispatchOffer, letterLang, dispatchDossier?.leadProfile, dispatchDossier);
        const letterMarkdown = tailoredLetter.fullMarkdown;
        const qaList = generateApplicationQA(dispatchOffer);
        const coldApproach = dispatchDossier?.coldApproachEmail;

        return (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
            <div 
              className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl border"
              style={{
                backgroundColor: 'var(--panel-bg)',
                borderColor: 'var(--panel-border)'
              }}
            >
              {/* Tactical Unsplash Hero Banner */}
              <div className="relative h-44 w-full shrink-0 overflow-hidden bg-slate-950">
                <img 
                  src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80" 
                  alt="Job Wingman Ops" 
                  className="w-full h-full object-cover opacity-60 mix-blend-luminosity scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--panel-bg)] via-[var(--panel-bg)]/40 to-transparent" />
                
                <div className="absolute top-3 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-full bg-sky-500/30 text-sky-200 border border-sky-400/40 text-[10px] font-mono font-black uppercase tracking-wider backdrop-blur-md flex items-center gap-1.5 shadow-sm">
                      <Sparkles className="h-3 w-3 text-sky-400 animate-pulse" />
                      JOB WINGMAN // TACTICAL DISPATCH HUB
                    </span>
                    <span className="px-2 py-0.5 rounded bg-black/50 text-slate-300 text-[10px] font-mono border border-white/10 backdrop-blur-md">
                      Etapa {assistedDispatchApp.currentStage}: {STAGES.find(s => s.stage === assistedDispatchApp.currentStage)?.shortName}
                    </span>
                  </div>
                  <button
                    onClick={() => setAssistedDispatchApp(null)}
                    className="p-1.5 rounded-xl bg-black/50 text-white/70 hover:text-white hover:bg-black/80 transition cursor-pointer border border-white/10 backdrop-blur-md"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-base sm:text-lg font-black text-white font-mono uppercase tracking-tight line-clamp-1 drop-shadow-md">
                    {assistedDispatchApp.offerTitle}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-200 mt-1">
                    <span className="flex items-center gap-1 font-bold text-sky-300">
                      <Building2 className="h-3.5 w-3.5" />
                      {assistedDispatchApp.companyName}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {assistedDispatchApp.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center space-x-1 px-4 py-2 border-b border-[var(--panel-border)] bg-[var(--card-bg)] overflow-x-auto text-xs font-mono shrink-0">
                <button
                  onClick={() => setDispatchTab('briefing')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center space-x-1.5 shrink-0 cursor-pointer ${
                    dispatchTab === 'briefing'
                      ? 'bg-sky-600 text-white shadow font-black'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--panel-bg)]'
                  }`}
                >
                  <UserCheck className="h-3.5 w-3.5" />
                  <span>🎯 Briefing Wingman & Contacto PI</span>
                </button>
                <button
                  onClick={() => setDispatchTab('letter')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center space-x-1.5 shrink-0 cursor-pointer ${
                    dispatchTab === 'letter'
                      ? 'bg-sky-600 text-white shadow font-black'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--panel-bg)]'
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>📄 Carta Adaptada (5 Párrafos)</span>
                </button>
                <button
                  onClick={() => setDispatchTab('docs')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center space-x-1.5 shrink-0 cursor-pointer ${
                    dispatchTab === 'docs'
                      ? 'bg-sky-600 text-white shadow font-black'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--panel-bg)]'
                  }`}
                >
                  <FolderCheck className="h-3.5 w-3.5" />
                  <span>📋 Documentos & Anexos</span>
                </button>
                <button
                  onClick={() => setDispatchTab('qa')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center space-x-1.5 shrink-0 cursor-pointer ${
                    dispatchTab === 'qa'
                      ? 'bg-sky-600 text-white shadow font-black'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--panel-bg)]'
                  }`}
                >
                  <Lightbulb className="h-3.5 w-3.5" />
                  <span>💡 Q&A y Argumentos</span>
                </button>
              </div>

              {/* Body Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                
                {/* TAB 1: BRIEFING WINGMAN */}
                {dispatchTab === 'briefing' && (
                  <div className="space-y-4 font-sans text-xs">
                    {/* Explanatory Wingman Mission Box */}
                    <div className="p-4 rounded-xl border border-sky-500/30 bg-sky-500/10 space-y-2">
                      <div className="flex items-center space-x-2 font-mono font-black text-sky-600 dark:text-sky-300 text-xs uppercase tracking-wide">
                        <Sparkles className="h-4 w-4 text-sky-500 shrink-0" />
                        <span>Misión Wingman: De la Burocracia al Abordaje de Alto Valor</span>
                      </div>
                      <p className="text-[11.5px] text-[var(--text-secondary)] leading-relaxed font-sans">
                        Job Wingman analiza las prioridades del decisor científico ({dispatchDossier?.leadProfile.name || 'Supervisor a cargo'}), detecta los cuellos de botella del proyecto ({dispatchOffer.title}) y formula ángulos sin clichés ni servilismo. Tu perfil geofísico en física de medios porosos y modelado de datos en R/Python se posiciona como una ventaja técnica diferencial frente a perfiles agronómicos tradicionales.
                      </p>
                    </div>

                    {/* PI Intelligence Card */}
                    <div 
                      className="p-4 rounded-xl border space-y-3"
                      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
                    >
                      <div className="flex items-center justify-between border-b border-[var(--panel-border)] pb-2">
                        <div className="flex items-center space-x-2 font-mono font-bold text-xs uppercase">
                          <UserCheck className="h-4 w-4 text-purple-500" />
                          <span>Decisor / Investigador Principal (PI)</span>
                        </div>
                        {dispatchDossier?.leadProfile.email && (
                          <a
                            href={`mailto:${dispatchDossier.leadProfile.email}`}
                            className="font-mono text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 font-bold"
                          >
                            <Mail className="h-3.5 w-3.5" />
                            <span>{dispatchDossier.leadProfile.email}</span>
                          </a>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11.5px]">
                        <div>
                          <span className="font-mono text-[var(--text-muted)] text-[10px] uppercase block">Nombre y Afiliación:</span>
                          <span className="font-bold text-[var(--text-primary)]">
                            {dispatchDossier?.leadProfile.name || 'Prof. Dr. Axel Don'}
                          </span>
                          <span className="text-[var(--text-secondary)] block text-[11px]">
                            {dispatchDossier?.leadProfile.role || 'Leiter der Arbeitsgruppe Subsoil Carbon / Thünen-Institut'}
                          </span>
                        </div>

                        <div>
                          <span className="font-mono text-[var(--text-muted)] text-[10px] uppercase block">Reto Clave del Proyecto:</span>
                          <span className="text-[var(--text-secondary)]">
                            {dispatchDossier?.projectPainPoints?.[0] || 'Cuantificación in-situ de biomasa radicular bajo UV (RootBox) y transporte en macroporos.'}
                          </span>
                        </div>
                      </div>

                      {dispatchDossier?.leadProfile.keyPublications && dispatchDossier.leadProfile.keyPublications.length > 0 && (
                        <div className="pt-2 border-t border-[var(--panel-border)]">
                          <span className="font-mono text-[var(--text-muted)] text-[10px] uppercase block mb-1">Publicaciones / Enfoques de Referencia:</span>
                          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-[var(--text-secondary)] font-mono">
                            {dispatchDossier.leadProfile.keyPublications.map((pub, i) => (
                              <li key={i}>{pub}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Cold Approach Email Box */}
                    {coldApproach && (
                      <div 
                        className="p-4 rounded-xl border space-y-3"
                        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 font-mono font-bold text-xs uppercase">
                            <Mail className="h-4 w-4 text-emerald-500" />
                            <span>Email de Abordaje Directo / Consulta Previa</span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <div className="flex rounded-lg border border-[var(--card-border)] overflow-hidden text-[10px] font-mono">
                              <button
                                onClick={() => setEmailLang('de')}
                                className={`px-2 py-1 font-bold cursor-pointer ${emailLang === 'de' ? 'bg-sky-600 text-white' : 'bg-[var(--panel-bg)] text-[var(--text-secondary)]'}`}
                              >
                                DE
                              </button>
                              <button
                                onClick={() => setEmailLang('en')}
                                className={`px-2 py-1 font-bold cursor-pointer ${emailLang === 'en' ? 'bg-sky-600 text-white' : 'bg-[var(--panel-bg)] text-[var(--text-secondary)]'}`}
                              >
                                EN
                              </button>
                            </div>

                            <button
                              onClick={() => {
                                const text = emailLang === 'de' 
                                  ? `Betreff: ${coldApproach.subjectDe}\n\n${coldApproach.bodyDe}`
                                  : `Subject: ${coldApproach.subjectEn}\n\n${coldApproach.bodyEn}`;
                                navigator.clipboard.writeText(text);
                                setCopiedEmail(true);
                                setTimeout(() => setCopiedEmail(false), 2000);
                              }}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-mono font-bold flex items-center space-x-1 cursor-pointer shadow-sm transition"
                            >
                              {copiedEmail ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                              <span>{copiedEmail ? 'Copiado' : 'Copiar Correo'}</span>
                            </button>
                          </div>
                        </div>

                        <div className="p-3 rounded-lg bg-[var(--panel-bg)] border border-[var(--card-border)] space-y-2 font-mono text-[11px]">
                          <div>
                            <span className="text-[var(--text-muted)]">Betreff / Asunto: </span>
                            <span className="font-bold text-[var(--text-primary)]">
                              {emailLang === 'de' ? coldApproach.subjectDe : coldApproach.subjectEn}
                            </span>
                          </div>
                          <div className="text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed pt-2 border-t border-[var(--panel-border)] font-sans text-xs">
                            {emailLang === 'de' ? coldApproach.bodyDe : coldApproach.bodyEn}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Hooks Match List */}
                    {dispatchDossier?.technicalHooks && (
                      <div 
                        className="p-4 rounded-xl border space-y-2.5"
                        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
                      >
                        <span className="font-mono text-xs font-bold text-[var(--text-primary)] uppercase flex items-center gap-1.5">
                          <ShieldCheck className="h-4 w-4 text-amber-500" />
                          <span>Ganchos Estratégicos Detectados (Hooks)</span>
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          {dispatchDossier.technicalHooks.map((hook, i) => (
                            <div key={i} className="p-2.5 rounded-lg bg-[var(--panel-bg)] border border-[var(--card-border)] space-y-1">
                              <span className="font-mono text-[9.5px] uppercase font-bold text-sky-600 dark:text-sky-400 block">
                                Gancho Técnico #{i + 1}
                              </span>
                              <p className="text-[11px] text-[var(--text-secondary)] leading-snug">
                                {hook}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: CARTA ADAPTADA */}
                {dispatchTab === 'letter' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-1.5 font-mono text-xs">
                        <button
                          onClick={() => setLetterLang('de')}
                          className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                            letterLang === 'de'
                              ? 'bg-amber-600 text-white font-black shadow'
                              : 'bg-[var(--card-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--card-border)]'
                          }`}
                        >
                          🇩🇪 Alemán (Oficial)
                        </button>
                        <button
                          onClick={() => setLetterLang('en')}
                          className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                            letterLang === 'en'
                              ? 'bg-sky-600 text-white font-black shadow'
                              : 'bg-[var(--card-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--card-border)]'
                          }`}
                        >
                          🇬🇧 Inglés
                        </button>
                        <button
                          onClick={() => setLetterLang('es')}
                          className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                            letterLang === 'es'
                              ? 'bg-emerald-600 text-white font-black shadow'
                              : 'bg-[var(--card-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--card-border)]'
                          }`}
                        >
                          🇪🇸 Español
                        </button>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono text-[var(--text-muted)]">
                          ~480 palabras • 5 párrafos académicos
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(letterMarkdown);
                            setCopiedLetter(true);
                            setTimeout(() => setCopiedLetter(false), 2000);
                          }}
                          className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-mono font-bold flex items-center space-x-1.5 cursor-pointer shadow-sm transition"
                        >
                          {copiedLetter ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                          <span>{copiedLetter ? 'Copiada al portapapeles' : 'Copiar Carta'}</span>
                        </button>
                      </div>
                    </div>

                    <div 
                      className="p-5 rounded-xl border text-xs leading-relaxed whitespace-pre-wrap font-sans space-y-3"
                      style={{ 
                        backgroundColor: 'var(--card-bg)', 
                        borderColor: 'var(--card-border)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      {letterMarkdown}
                    </div>
                  </div>
                )}

                {/* TAB 3: DOCUMENTOS Y ANEXOS */}
                {dispatchTab === 'docs' && (
                  <div className="space-y-4 font-sans text-xs">
                    <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-1">
                      <span className="font-mono font-bold text-purple-600 dark:text-purple-300 text-xs uppercase block">
                        Auditoría de Documentos para Convocatorias Públicas y Científicas
                      </span>
                      <p className="text-[11px] text-[var(--text-secondary)]">
                        En procesos académicos alemanes (TVöD / TV-L E13) y europeos, enviar el expediente incompleto descalifica automáticamente al candidato antes de la revisión por el PI.
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      {[
                        { title: 'Anschreiben / Motivation Letter (1 pág.)', desc: 'Personalizada para el PI y el proyecto específico, destacando física vs agronomía.', status: 'Listo' },
                        { title: 'Tabellarischer Lebenslauf (CV estilo cronológico)', desc: 'Estructura clara de 2 páginas con stack técnico R/Python e instrumental de campo.', status: 'Listo' },
                        { title: 'Urkunden & Zeugnisse (Títulos Oficiales)', desc: 'Licenciatura y Título de Geofísico de la Univ. de Chile "con distinción", con traducción jurada/oficial.', status: 'Requerido' },
                        { title: 'Notenübersicht / Transcript of Records', desc: 'Certificado de notas detallado en escala original con ponderación de créditos.', status: 'Requerido' },
                        { title: 'Empfehlungsschreiben / Referenzen (2 contactos)', desc: 'Contactos académicos directos (teléfono/email institucional de profesores guía).', status: 'Recomendado' },
                        { title: 'Sprachzertifikate (Alemán / Inglés)', desc: 'Acreditación de inglés C1 y nivel de alemán operativo (B1/B2 o compromiso de inmersión).', status: 'Recomendado' },
                        { title: 'Arbeitsproben / Repositorios GitHub', desc: 'Scripts en R / Python demostrando reproducibilidad en análisis numérico de datos.', status: 'Opcional' }
                      ].map((doc, idx) => (
                        <div 
                          key={idx}
                          className="p-3 rounded-xl border flex items-start justify-between gap-3"
                          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
                        >
                          <div className="space-y-0.5">
                            <span className="font-bold text-[var(--text-primary)] block font-sans">
                              {doc.title}
                            </span>
                            <span className="text-[11px] text-[var(--text-secondary)] block">
                              {doc.desc}
                            </span>
                          </div>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border shrink-0 ${
                            doc.status === 'Listo' 
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                              : doc.status === 'Requerido'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                              : 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30'
                          }`}>
                            {doc.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 4: Q&A Y ARGUMENTOS */}
                {dispatchTab === 'qa' && (
                  <div className="space-y-3 font-sans text-xs">
                    <span className="font-mono text-xs font-bold text-[var(--text-primary)] uppercase block mb-1">
                      Defensa Técnica de la Candidatura en Entrevista / Formulario
                    </span>
                    {qaList.map((qa, index) => (
                      <div 
                        key={index}
                        className="p-4 rounded-xl border space-y-2 transition"
                        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="font-bold text-sky-600 dark:text-sky-400 text-xs">
                            {qa.question}
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(qa.recommendedAnswer);
                              setCopiedIndex(index);
                              setTimeout(() => setCopiedIndex(null), 2000);
                            }}
                            className="p-1 rounded bg-[var(--panel-bg)] hover:bg-[var(--card-border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition cursor-pointer shrink-0 border border-[var(--card-border)]"
                            title="Copiar respuesta"
                          >
                            {copiedIndex === index ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                          </button>
                        </div>
                        <p className="text-[11.5px] text-[var(--text-secondary)] leading-relaxed">
                          {qa.recommendedAnswer}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

              </div>

              {/* Modal Footer with Verification & Pipeline launcher */}
              <div 
                className="p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0"
                style={{
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--panel-border)'
                }}
              >
                {/* Human Verification State */}
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
                    <Lock className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">
                      Verificación Humana (Paso 7):
                    </span>
                    {assistedDispatchApp.humanApprovalGranted ? (
                      <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Envío oficial confirmado ({assistedDispatchApp.approvalTimestamp})
                      </span>
                    ) : (
                      <button
                        onClick={() => handleConfirmHumanSubmission(assistedDispatchApp.id)}
                        className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>Confirmar Envío Oficial en Portal</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Pipeline and Close Actions */}
                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => {
                      const appToOpen = assistedDispatchApp;
                      setAssistedDispatchApp(null);
                      setSelectedAppForPipeline(appToOpen);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-sky-600 to-purple-600 hover:from-sky-500 hover:to-purple-500 text-white font-mono font-bold text-xs rounded-xl shadow-md transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Abrir Pipeline Completo (7 Pasos)</span>
                  </button>

                  <button
                    onClick={() => setAssistedDispatchApp(null)}
                    className="px-4 py-2 bg-[var(--panel-bg)] hover:bg-[var(--card-border)] text-[var(--text-secondary)] font-mono font-bold text-xs rounded-xl border border-[var(--card-border)] transition cursor-pointer"
                  >
                    Cerrar
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
};

// ----------------------------------------------------
// SUB-COMPONENTS: COLUMN & CARD
// ----------------------------------------------------

interface KanbanColumnProps {
  title: string;
  badgeColor: string;
  count: number;
  description: string;
  children: React.ReactNode;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  badgeColor,
  count,
  description,
  children
}) => {
  return (
    <div 
      className="border rounded-2xl p-3.5 flex flex-col space-y-3 shadow-md min-h-[580px] transition-colors"
      style={{ 
        backgroundColor: 'var(--card-bg)', 
        borderColor: 'var(--card-border)' 
      }}
    >
      <div className="flex items-center justify-between border-b border-[var(--panel-border)] pb-2.5">
        <div>
          <h3 className="font-mono font-black text-[var(--text-primary)] text-xs tracking-tight uppercase flex items-center gap-1.5">
            <span>{title}</span>
          </h3>
          <p className="text-[10px] text-[var(--text-muted)] font-mono mt-0.5">{description}</p>
        </div>
        <span className={`text-[11px] font-mono font-black px-2 py-0.5 rounded-lg border ${badgeColor}`}>
          {count}
        </span>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

const EmptyColumnPlaceholder: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div 
      className="p-6 rounded-xl border border-dashed text-center flex flex-col items-center justify-center text-[var(--text-muted)] text-xs font-mono space-y-1 my-4"
      style={{ borderColor: 'var(--card-border)' }}
    >
      <HelpCircle className="h-5 w-5 text-[var(--text-muted)]" />
      <span>{text}</span>
    </div>
  );
};

interface ApplicationCardProps {
  app: ApplicationItem;
  now: number;
  onMoveStage: (appId: string, direction: 'prev' | 'next') => void;
  onDelete: (appId: string) => void;
  onOpenDispatch: () => void;
  onOpenPipeline: () => void;
  canMovePrev: boolean;
  canMoveNext: boolean;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  app,
  now,
  onMoveStage,
  onDelete,
  onOpenDispatch,
  onOpenPipeline,
  canMovePrev,
  canMoveNext
}) => {
  const isGermany = app.location.toLowerCase().includes('alemania') || app.location.toLowerCase().includes('germany') || app.location.toLowerCase().includes('potsdam') || app.location.toLowerCase().includes('kiel');
  const isEuskadi = app.location.toLowerCase().includes('bilbao') || app.location.toLowerCase().includes('bizkaia') || app.location.toLowerCase().includes('donostia');
  const isRemote = app.location.toLowerCase().includes('remoto') || app.location.toLowerCase().includes('remote');

  // Compute days since last activity
  const dateStr = app.updatedDate || app.createdDate;
  const parsedTime = dateStr ? new Date(dateStr).getTime() : now;
  const daysAgo = Math.max(0, Math.floor((now - parsedTime) / (1000 * 60 * 60 * 24)));

  const needsFollowUp = (app.currentStage === 6 || app.currentStage === 7) && daysAgo >= 7;

  return (
    <div 
      className="p-3.5 rounded-xl border hover:border-sky-500 shadow-md space-y-2.5 transition group"
      style={{ 
        backgroundColor: 'var(--panel-bg)', 
        borderColor: 'var(--card-border)' 
      }}
    >
      
      {/* Top Card Bar */}
      <div className="flex items-center justify-between text-[10px] font-mono">
        <span className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-slate-950 text-[var(--text-muted)] border border-[var(--card-border)] font-bold">
          {app.id}
        </span>

        <div className="flex items-center gap-1">
          {isGermany && (
            <span className="px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30 font-bold">
              🇩🇪 DACH
            </span>
          )}
          {isEuskadi && (
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold">
              📍 Euskadi
            </span>
          )}
          {isRemote && (
            <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-bold">
              🌐 Remoto
            </span>
          )}
        </div>
      </div>

      {/* Main Title & Organization */}
      <div>
        <h4 className="font-bold text-[var(--text-primary)] text-xs leading-snug line-clamp-2 hover:text-sky-600 dark:hover:text-sky-400 transition font-sans">
          {app.offerTitle}
        </h4>
        <div className="flex items-center space-x-1 text-[11px] text-[var(--text-secondary)] font-mono mt-1">
          <Building2 className="h-3 w-3 text-sky-500 shrink-0" />
          <span className="truncate">{app.companyName}</span>
        </div>
        <div className="flex items-center space-x-1 text-[10px] text-[var(--text-muted)] font-mono mt-0.5">
          <MapPin className="h-3 w-3 text-[var(--text-muted)] shrink-0" />
          <span className="truncate">{app.location}</span>
        </div>
      </div>

      {/* Follow-up Alert badge if 7+ days */}
      {needsFollowUp && (
        <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[9.5px] font-mono font-bold text-amber-600 dark:text-amber-400 flex items-center justify-between">
          <span>⏰ Seguimiento sugerido</span>
          <span>+{daysAgo}d</span>
        </div>
      )}

      {/* Notes / Snippet */}
      {app.interviewNotes && (
        <div 
          className="p-2 rounded text-[10px] text-[var(--text-muted)] font-mono border line-clamp-2"
          style={{ 
            backgroundColor: 'var(--card-bg)', 
            borderColor: 'var(--card-border)' 
          }}
        >
          {app.interviewNotes}
        </div>
      )}

      {/* Quick Move and Action Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-[var(--panel-border)]">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onMoveStage(app.id, 'prev')}
            disabled={!canMovePrev}
            title="Mover a etapa anterior"
            className="p-1 rounded bg-[var(--card-bg)] hover:bg-[var(--panel-bg)] text-[var(--text-secondary)] disabled:opacity-20 cursor-pointer transition border border-[var(--card-border)]"
          >
            <ArrowLeft className="h-3 w-3" />
          </button>
          <button
            onClick={() => onMoveStage(app.id, 'next')}
            disabled={!canMoveNext}
            title="Mover a siguiente etapa"
            className="p-1 rounded bg-[var(--card-bg)] hover:bg-[var(--panel-bg)] text-[var(--text-secondary)] disabled:opacity-20 cursor-pointer transition border border-[var(--card-border)]"
          >
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={onOpenDispatch}
            className="px-2 py-1 bg-sky-500/15 hover:bg-sky-600 text-sky-600 dark:text-sky-300 hover:text-white rounded-lg text-[10px] font-mono font-bold transition flex items-center space-x-1 border border-sky-500/30 cursor-pointer shadow-sm"
            title="Abrir Despacho Asistido con Inteligencia Wingman y Radar"
          >
            <Sparkles className="h-3 w-3 text-sky-500" />
            <span>Despacho</span>
          </button>

          <button
            onClick={onOpenPipeline}
            className="px-2 py-1 bg-purple-500/15 hover:bg-purple-600 text-purple-600 dark:text-purple-300 hover:text-white rounded-lg text-[10px] font-mono font-bold transition flex items-center space-x-1 border border-purple-500/30 cursor-pointer shadow-sm"
            title="Abrir Pipeline Completo (7 Pasos: Análisis, Supervisor, Documentos, CV, Carta, Contacto, Entrevista)"
          >
            <FolderCheck className="h-3 w-3 text-purple-500" />
            <span>Pipeline</span>
          </button>

          {app.offerUrl && (
            <a
              href={app.offerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded bg-[var(--card-bg)] hover:bg-[var(--panel-bg)] text-[var(--text-secondary)] cursor-pointer transition border border-[var(--card-border)]"
              title="Abrir oferta web"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          )}

          <button
            onClick={() => onDelete(app.id)}
            className="p-1 rounded bg-[var(--card-bg)] hover:bg-rose-500/20 text-[var(--text-muted)] hover:text-rose-500 cursor-pointer transition border border-[var(--card-border)]"
            title="Eliminar candidatura"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

    </div>
  );
};
