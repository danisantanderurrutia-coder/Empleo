import React, { useState, useEffect } from 'react';
import { 
  KanbanSquare, 
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
  HelpCircle
} from 'lucide-react';
import { getStoredApplications, saveStoredApplications, getStoredProfile } from '../../services/db';
import type { ApplicationItem, ApplicationStage } from '../../types/applications';
import type { JobOffer } from '../../types/offers';
import { STAGES } from '../../types/applications';
import { generateTailoredCoverLetter, generateApplicationQA } from '../../services/coverLetterCopilot';
import { AddApplicationModal } from './AddApplicationModal';

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

const DEFAULT_SEED_APPS: ApplicationItem[] = [
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

export const ApplicationsTab: React.FC = () => {
  const [applications, setApplications] = useState<ApplicationItem[]>(() => {
    const stored = getStoredApplications();
    if (stored.length === 0) {
      saveStoredApplications(DEFAULT_SEED_APPS);
      return DEFAULT_SEED_APPS;
    }
    return stored;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'germany' | 'euskadi' | 'remote' | 'interviews'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [assistedDispatchApp, setAssistedDispatchApp] = useState<ApplicationItem | null>(null);
  
  // Assisted dispatch internal state
  const [letterLang, setLetterLang] = useState<'es' | 'en' | 'de'>('es');
  const [copiedLetter, setCopiedLetter] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

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

  const profile = getStoredProfile();
  const [mountTimestamp] = useState(() => Date.now());

  return (
    <div className="space-y-6 text-[var(--text-primary)] font-sans animate-fadeIn select-none">
      
      {/* Tactical Hero Control Header */}
      <div 
        className="p-5 rounded-2xl border shadow-xl backdrop-blur-md space-y-4 transition-colors"
        style={{ 
          backgroundColor: 'var(--card-bg)', 
          borderColor: 'var(--card-border)' 
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-500/30 shrink-0 shadow-inner">
              <KanbanSquare className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-black text-[var(--text-primary)] font-mono uppercase tracking-tight">
                  TABLERO DE PROCESOS & SEGUIMIENTO (KANBAN)
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/40">
                  CONTROL HUMANO 100%
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/10 dark:bg-slate-900 text-sky-600 dark:text-sky-300 border border-[var(--panel-border)] hidden sm:inline-block">
                  OPERADOR: {profile.fullName.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] font-sans mt-0.5">
                Seguimiento de postulaciones laborales y convocatorias I+D: genera cartas adaptadas (ES/EN/DE) y confirma despachos oficiales.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 shrink-0">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-mono font-black text-xs rounded-xl shadow-md transition flex items-center space-x-1.5 cursor-pointer uppercase tracking-wider"
            >
              <PlusCircle className="h-4 w-4" />
              <span>+ Añadir Candidatura</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[var(--panel-border)]">
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
              canMovePrev={false}
              canMoveNext={true}
            />
          ))}
          {colRadar.length === 0 && <EmptyColumnPlaceholder text="Sin ofertas guardadas en radar" />}
        </KanbanColumn>

        {/* COL 2: PREPARACIÓN / CARTAS & DOSSIER */}
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
              canMovePrev={true}
              canMoveNext={true}
            />
          ))}
          {colPrep.length === 0 && <EmptyColumnPlaceholder text="Sin candidaturas en preparación" />}
        </KanbanColumn>

        {/* COL 3: POSTULADAS / DESPACHADAS */}
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
              canMovePrev={true}
              canMoveNext={true}
            />
          ))}
          {colInterviews.length === 0 && <EmptyColumnPlaceholder text="Sin entrevistas activas" />}
        </KanbanColumn>

        {/* COL 5: CONCLUIDAS / HISTÓRICO */}
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

      {/* Slide-over / Modal: DESPACHO ASISTIDO */}
      {assistedDispatchApp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn font-sans">
          <div 
            className="max-w-4xl w-full rounded-2xl border shadow-2xl flex flex-col max-h-[92vh] overflow-hidden transition-colors"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--card-border)',
              color: 'var(--text-primary)'
            }}
          >
            
            {/* Dispatch Header */}
            <div 
              className="flex items-center justify-between p-5 border-b shrink-0"
              style={{
                backgroundColor: 'var(--panel-bg)',
                borderColor: 'var(--panel-border)'
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-500 border border-sky-500/30">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-mono font-black text-[var(--text-primary)] text-base uppercase tracking-tight">
                      DESPACHO ASISTIDO // {assistedDispatchApp.id}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30 font-bold">
                      FASE 3
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] font-sans mt-0.5">
                    {assistedDispatchApp.offerTitle} • <strong className="text-[var(--text-primary)]">{assistedDispatchApp.companyName}</strong> ({assistedDispatchApp.location})
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setAssistedDispatchApp(null)} 
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Dispatch Content Tabs / Sections */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 font-sans text-xs">
              
              {/* Section 1: Tailored Cover Letter Generator */}
              <div 
                className="p-4 rounded-xl border space-y-3"
                style={{
                  backgroundColor: 'var(--panel-bg)',
                  borderColor: 'var(--card-border)'
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2 font-mono font-bold text-[var(--text-primary)] text-sm">
                    <FileText className="h-4 w-4 text-sky-500" />
                    <span>CARTA DE PRESENTACIÓN A MEDIDA (TEMPLATE TÁCTICO)</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex items-center p-0.5 bg-black/5 dark:bg-slate-950 rounded-lg border border-[var(--card-border)] font-mono text-[11px]">
                      <button
                        onClick={() => setLetterLang('es')}
                        className={`px-2.5 py-1 rounded transition cursor-pointer ${letterLang === 'es' ? 'bg-sky-600 text-white font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                      >
                        🇪🇸 Español
                      </button>
                      <button
                        onClick={() => setLetterLang('en')}
                        className={`px-2.5 py-1 rounded transition cursor-pointer ${letterLang === 'en' ? 'bg-sky-600 text-white font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                      >
                        🇬🇧 English
                      </button>
                      <button
                        onClick={() => setLetterLang('de')}
                        className={`px-2.5 py-1 rounded transition cursor-pointer ${letterLang === 'de' ? 'bg-sky-600 text-white font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
                      >
                        🇩🇪 Deutsch
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        const offer = buildMockOfferFromApp(assistedDispatchApp);
                        const letter = generateTailoredCoverLetter(offer, letterLang);
                        navigator.clipboard.writeText(letter.fullMarkdown);
                        setCopiedLetter(true);
                        setTimeout(() => setCopiedLetter(null as any), 2000);
                      }}
                      className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-mono font-bold rounded-lg border border-sky-500 flex items-center space-x-1.5 transition cursor-pointer shadow-sm"
                    >
                      {copiedLetter ? <Check className="h-3.5 w-3.5 text-white" /> : <Copy className="h-3.5 w-3.5 text-white" />}
                      <span>{copiedLetter ? '¡Copiado!' : 'Copiar Carta'}</span>
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-black/5 dark:bg-slate-950 border border-[var(--card-border)] font-mono text-[var(--text-secondary)] text-[11px] leading-relaxed whitespace-pre-line max-h-52 overflow-y-auto">
                  {(() => {
                    const offer = buildMockOfferFromApp(assistedDispatchApp);
                    const letter = generateTailoredCoverLetter(offer, letterLang);
                    return letter.fullMarkdown;
                  })()}
                </div>
              </div>

              {/* Section 2: Strategic Talking Points & Pre-Filled Answers */}
              <div 
                className="p-4 rounded-xl border space-y-3"
                style={{
                  backgroundColor: 'var(--panel-bg)',
                  borderColor: 'var(--card-border)'
                }}
              >
                <div className="flex items-center space-x-2 font-mono font-bold text-[var(--text-primary)] text-sm">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span>ARGUMENTARIO ESTRATÉGICO PARA ENTREVISTAS & FORMULARIOS</span>
                </div>

                <div className="space-y-2.5">
                  {(() => {
                    const offer = buildMockOfferFromApp(assistedDispatchApp);
                    const qa = generateApplicationQA(offer);
                    return qa.map((item, idx) => (
                      <div key={idx} className="p-3 bg-black/5 dark:bg-slate-950 rounded-lg border border-[var(--card-border)] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[var(--text-primary)] font-sans">{item.question}</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(item.recommendedAnswer);
                              setCopiedIndex(idx);
                              setTimeout(() => setCopiedIndex(null), 2000);
                            }}
                            className="text-[10px] text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center space-x-1 cursor-pointer font-mono"
                          >
                            {copiedIndex === idx ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                            <span>{copiedIndex === idx ? 'Copiado' : 'Copiar'}</span>
                          </button>
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)] font-sans">{item.recommendedAnswer}</p>
                        <p className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">Tip: {item.tips}</p>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Section 3: Official Human Confirmation */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Lock className="h-5 w-5 text-amber-500" />
                    <div>
                      <h4 className="font-mono font-bold text-[var(--text-primary)] text-xs uppercase">
                        VERIFICACIÓN HUMANA OBLIGATORIA (FASE 7)
                      </h4>
                      <p className="text-[11px] text-[var(--text-secondary)]">
                        Ningún envío se realiza a espaldas del usuario. Una vez enviada la candidatura en la web oficial, confirma aquí para trasladar al estado &quot;Postuladas&quot;.
                      </p>
                    </div>
                  </div>

                  {assistedDispatchApp.humanApprovalGranted ? (
                    <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-mono font-bold text-xs shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>Envío Confirmado ({assistedDispatchApp.approvalTimestamp})</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleConfirmHumanSubmission(assistedDispatchApp.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-black text-xs rounded-xl shadow-lg transition flex items-center space-x-1.5 cursor-pointer shrink-0 uppercase tracking-wide"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Confirmar Envío Oficial</span>
                    </button>
                  )}
                </div>

                {assistedDispatchApp.offerUrl && (
                  <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between text-[11px]">
                    <span className="text-[var(--text-secondary)]">Enlace oficial a la vacante:</span>
                    <a
                      href={assistedDispatchApp.offerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-600 dark:text-sky-400 hover:underline font-mono flex items-center gap-1 font-bold"
                    >
                      <span>Abrir Portal de Postulación</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div 
              className="p-4 border-t flex justify-end shrink-0"
              style={{
                backgroundColor: 'var(--panel-bg)',
                borderColor: 'var(--panel-border)'
              }}
            >
              <button
                onClick={() => setAssistedDispatchApp(null)}
                className="px-5 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-[var(--text-primary)] font-bold font-mono text-xs rounded-xl border border-[var(--card-border)] transition cursor-pointer"
              >
                Cerrar Despacho
              </button>
            </div>

          </div>
        </div>
      )}

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
  canMovePrev: boolean;
  canMoveNext: boolean;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  app,
  now,
  onMoveStage,
  onDelete,
  onOpenDispatch,
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
            className="px-2.5 py-1 bg-sky-500/15 hover:bg-sky-600 text-sky-600 dark:text-sky-300 hover:text-white rounded-lg text-[10px] font-mono font-bold transition flex items-center space-x-1 border border-sky-500/30 cursor-pointer shadow-sm"
            title="Abrir Despacho Asistido (Cartas, Argumentos y Envío)"
          >
            <Sparkles className="h-3 w-3" />
            <span>Despacho</span>
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
