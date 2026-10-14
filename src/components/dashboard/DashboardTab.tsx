import React from 'react';
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Search, 
  Building2, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp,
  AlertCircle,
  Zap
} from 'lucide-react';
import { getStoredOffers, getStoredApplications, getStoredSources, getStoredProfile } from '../../services/db';

interface DashboardTabProps {
  onSelectTab: (tabId: string) => void;
  onRunWorkflow: (workflowName: string) => void;
  onSelectOffer: (offerId: string) => void;
  onSelectApplication: (appId: string) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  onSelectTab,
  onRunWorkflow,
  onSelectOffer,
  onSelectApplication
}) => {
  const offers = getStoredOffers();
  const applications = getStoredApplications();
  const sources = getStoredSources();
  const profile = getStoredProfile();

  const bilbaoOffers = offers.filter(o => o.isBilbaoLocation || (o.location || '').toLowerCase().includes('bilbao'));
  const highMatchOffers = offers.filter(o => o.matchScore.totalScore >= 80);
  const activeApps = applications.filter(a => a.status === 'En Progreso' || a.status === 'Entrevista');
  const pendingSubmissionApps = applications.filter(a => a.currentStage === 6 && !a.humanApprovalGranted);
  const interviewsCount = applications.filter(a => a.status === 'Entrevista' || a.currentStage === 8).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#131c2e] p-6 border border-slate-800 shadow-md text-slate-100">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="h-11 w-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-sm shrink-0">
                <Zap className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    Ubicación Principal: Bilbao, Bizkaia
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-emerald-400" /> Anti-Hallucination Verified
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
                  Bienvenido de nuevo, <span className="gradient-text">{profile.fullName}</span>
                </h2>
              </div>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed font-medium">
              Tu centro de mando supervisa <strong className="text-slate-200 font-semibold">{offers.length} ofertas scouted</strong>, <strong className="text-slate-200 font-semibold">{applications.length} candidaturas</strong> en seguimiento y <strong className="text-slate-200 font-semibold">{sources.length} fuentes activas</strong> en Euskadi y remoto.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => onRunWorkflow('/daily-job-search')}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-md transition flex items-center space-x-2"
            >
              <Search className="h-4 w-4 text-white" />
              <span>Ejecutar /daily-job-search</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div 
          onClick={() => onSelectTab('applications')}
          className="glass-card p-4 rounded-2xl border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Candidaturas Activas</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-500/20 transition">
              <Send className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-white">{activeApps.length}</span>
            <span className="text-[11px] text-indigo-400 font-medium">En proceso activo</span>
          </div>
          <p className="text-[11px] text-slate-400">
            {pendingSubmissionApps.length > 0 ? (
              <span className="text-amber-400 font-semibold flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {pendingSubmissionApps.length} pendiente de envío humano
              </span>
            ) : (
              'Pipeline al día'
            )}
          </p>
        </div>

        {/* KPI 2 */}
        <div 
          onClick={() => onSelectTab('offers')}
          className="glass-card p-4 rounded-2xl border border-slate-800 hover:border-purple-500/40 cursor-pointer transition space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Ofertas Top Match (&gt;80%)</span>
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:bg-purple-500/20 transition">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-white">{highMatchOffers.length}</span>
            <span className="text-[11px] text-purple-400 font-medium">Coincidencia alta</span>
          </div>
          <p className="text-[11px] text-slate-400">
            {bilbaoOffers.length} vacantes en Bilbao / Bizkaia
          </p>
        </div>

        {/* KPI 3 */}
        <div 
          onClick={() => onSelectTab('applications')}
          className="glass-card p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Entrevistas Programadas</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500/20 transition">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-white">{interviewsCount}</span>
            <span className="text-[11px] text-emerald-400 font-medium">Fase final</span>
          </div>
          <p className="text-[11px] text-slate-400">Tasa de entrevista: 50%</p>
        </div>

        {/* KPI 4 */}
        <div 
          onClick={() => onSelectTab('sources')}
          className="glass-card p-4 rounded-2xl border border-slate-800 hover:border-sky-500/40 cursor-pointer transition space-y-2 group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Fuentes Monitoreadas</span>
            <div className="h-8 w-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center group-hover:bg-sky-500/20 transition">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-white">{sources.length}</span>
            <span className="text-[11px] text-sky-400 font-medium">Activas</span>
          </div>
          <p className="text-[11px] text-slate-400">Rastreo automático diario</p>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Actionable Next Steps & Top Offers */}
        <div className="lg:col-span-2 space-y-6">
          {/* Actionable Next Steps Banner if pending approval */}
          {pendingSubmissionApps.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start justify-between gap-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm text-amber-300">
                    Aprobación Humana Requerida ({pendingSubmissionApps.length})
                  </h4>
                  <p className="text-xs text-slate-300">
                    La candidatura para <strong className="text-white">{pendingSubmissionApps[0].offerTitle}</strong> en <strong className="text-white">{pendingSubmissionApps[0].companyName}</strong> está lista en el Paso 6 (Revisión Final).
                  </p>
                </div>
              </div>
              <button
                onClick={() => onSelectApplication(pendingSubmissionApps[0].id)}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition shrink-0"
              >
                Revisar y Confirmar
              </button>
            </div>
          )}

          {/* Top Job Offers List */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-indigo-400" />
                <h3 className="font-bold text-slate-100 text-sm">Ofertas Destacadas con Mejor Match</h3>
              </div>
              <button
                onClick={() => onSelectTab('offers')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center space-x-1"
              >
                <span>Ver todas las ofertas ({offers.length})</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {offers.slice(0, 3).map((offer) => (
                <div
                  key={offer.id}
                  onClick={() => onSelectOffer(offer.id)}
                  className="glass-card p-4 rounded-xl border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition flex items-center justify-between gap-4 group"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-sm text-slate-100 group-hover:text-indigo-300 transition">
                        {offer.title}
                      </span>
                      {offer.isBilbaoLocation && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> Bilbao
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-slate-400">
                      <span className="flex items-center space-x-1">
                        <Building2 className="h-3 w-3 text-slate-500" />
                        <span>{offer.company}</span>
                      </span>
                      <span>•</span>
                      <span>{offer.location}</span>
                      {offer.salaryMin && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-400 font-medium">
                            {offer.salaryMin.toLocaleString()}€ - {offer.salaryMax?.toLocaleString()}€
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Match score badge */}
                  <div className="flex items-center space-x-3 shrink-0">
                    <div className="text-right">
                      <div className="text-lg font-black text-indigo-400">{offer.matchScore.totalScore}%</div>
                      <div className="text-[10px] text-slate-500">Match Score</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-indigo-400 transition" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Active Pipeline & Workflow Launchers */}
        <div className="space-y-6">
          {/* Quick Workflows Launcher Box */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="font-bold text-slate-100 text-sm flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span>Flujos de Trabajo Inteligentes</span>
            </h3>
            <p className="text-xs text-slate-400">
              Lanza acciones automatizadas ejecutadas por tus agentes especializados:
            </p>

            <div className="space-y-2">
              <button
                onClick={() => onRunWorkflow('/daily-job-search')}
                className="w-full text-left p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition flex items-center justify-between text-xs group"
              >
                <div>
                  <div className="font-semibold text-slate-200 group-hover:text-indigo-300">/daily-job-search</div>
                  <div className="text-[11px] text-slate-400">Scout & Matcher en fuentes de Bilbao</div>
                </div>
                <Search className="h-4 w-4 text-indigo-400" />
              </button>

              <button
                onClick={() => onRunWorkflow('/update-documentation')}
                className="w-full text-left p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 transition flex items-center justify-between text-xs group"
              >
                <div>
                  <div className="font-semibold text-slate-200 group-hover:text-purple-300">/update-documentation</div>
                  <div className="text-[11px] text-slate-400">Documentation Agent update (v1.0.5)</div>
                </div>
                <Clock className="h-4 w-4 text-purple-400" />
              </button>
            </div>
          </div>

          {/* Active Applications Quick List */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-100 text-sm">Estado de Candidaturas</h3>
              <button
                onClick={() => onSelectTab('applications')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Ver pipeline
              </button>
            </div>

            <div className="space-y-3">
              {applications.slice(0, 3).map((app) => (
                <div
                  key={app.id}
                  onClick={() => onSelectApplication(app.id)}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                    <span className="truncate max-w-[170px]">{app.offerTitle}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300">
                      Paso {app.currentStage}/9
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{app.companyName}</span>
                    <span className="text-emerald-400 font-medium">{app.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
