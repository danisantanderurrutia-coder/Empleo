import React from 'react';
import { LineChart, Award, BarChart3 } from 'lucide-react';
import { getStoredOffers, getStoredApplications, getStoredCVs } from '../../services/db';
import { StrategyAdvisorChat } from './StrategyAdvisorChat';

export const IntelligenceTab: React.FC = () => {
  const offers = getStoredOffers();
  const applications = getStoredApplications();
  const cvs = getStoredCVs();

  const bilbaoOffers = offers.filter(o => o.isBilbaoLocation || (o.location || '').toLowerCase().includes('bilbao'));
  const submittedCount = applications.filter(a => a.humanApprovalGranted || a.currentStage >= 7).length;
  const interviewCount = applications.filter(a => a.currentStage === 8 || a.status === 'Entrevista').length;
  const conversionRate = submittedCount > 0 ? Math.round((interviewCount / submittedCount) * 100) : 0;

  // Real source analysis
  const sourceStats = offers.reduce((acc, o) => {
    const src = o.sourceName || 'Manual';
    acc[src] = (acc[src] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topSourceEntry = Object.entries(sourceStats).sort((a, b) => b[1] - a[1])[0];
  const topSourceName = topSourceEntry ? topSourceEntry[0] : 'Sin fuentes añadidas';
  const topSourceCount = topSourceEntry ? topSourceEntry[1] : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-[#0d1627] via-[#091322] to-[#0d1627] border border-slate-700 shadow-xl gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800 text-[10px] font-mono font-bold uppercase tracking-wider">
              PILAR 6 // TELEMETRÍA & DEBRIEFING TÁCTICO
            </span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 font-mono uppercase tracking-tight">
            <LineChart className="h-5 w-5 text-sky-400" />
            <span>INTELIGENCIA DE RENDIMIENTO & POST-MORTEM</span>
          </h2>
          <p className="text-xs text-slate-300 font-sans mt-0.5">
            Telemetría real de tus candidaturas: embudo de conversión, análisis de respuesta frente al ghosting y calibración de estrategia con IA.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-slate-400 font-medium">Tasa de Conversión a Entrevista</div>
          <div className="text-2xl font-black text-emerald-400">{conversionRate}%</div>
          <div className="text-[11px] text-slate-500">{interviewCount} entrevistas de {submittedCount} enviadas</div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-slate-400 font-medium">Ofertas en Bilbao / Bizkaia</div>
          <div className="text-2xl font-black text-indigo-400">{bilbaoOffers.length}</div>
          <div className="text-[11px] text-slate-500">De {offers.length} ofertas registradas</div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-slate-400 font-medium">Plantillas de CV Guardadas</div>
          <div className="text-base font-bold text-purple-300 truncate">{cvs.length > 0 ? `${cvs.length} versiones` : 'Ninguna guardada'}</div>
          <div className="text-[11px] text-slate-500">{cvs.length > 0 ? cvs[0].name : 'Crea una versión en la pestaña CVs'}</div>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="text-slate-400 font-medium">Fuente Más Frecuente</div>
          <div className="text-base font-bold text-sky-300 truncate">{topSourceName}</div>
          <div className="text-[11px] text-slate-500">{topSourceCount > 0 ? `${topSourceCount} ofertas registradas` : 'Añade ofertas para ver métricas'}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-slate-100 text-sm flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-indigo-400" />
              <span>Embudo de Conversión de Búsqueda</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between text-slate-300 font-medium">
                  <span>1. Ofertas Scouted</span>
                  <span className="font-bold text-white">{offers.length}</span>
                </div>
                <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-300 font-medium">
                  <span>2. Candidaturas Iniciadas</span>
                  <span className="font-bold text-white">{applications.length}</span>
                </div>
                <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: `${(applications.length / Math.max(1, offers.length)) * 100}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-300 font-medium">
                  <span>3. Enviadas (Aprobadas por Humano)</span>
                  <span className="font-bold text-white">{submittedCount}</span>
                </div>
                <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-sky-600 rounded-full" style={{ width: `${(submittedCount / Math.max(1, applications.length)) * 100}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-300 font-medium">
                  <span>4. Conseguido Entrevista</span>
                  <span className="font-bold text-emerald-400">{interviewCount}</span>
                </div>
                <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(interviewCount / Math.max(1, submittedCount)) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="font-bold text-slate-100 text-sm flex items-center space-x-2">
              <Award className="h-4 w-4 text-purple-400" />
              <span>Rendimiento por Plantilla de CV</span>
            </h3>

            <div className="space-y-2 text-xs">
              {cvs.map((cv) => (
                <div key={cv.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div>
                    <div className="font-semibold text-slate-200">{cv.name}</div>
                    <div className="text-[11px] text-slate-400">Formato: {cv.templateId}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-emerald-400">50%</span>
                    <div className="text-[10px] text-slate-500">Tasa Respuesta</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <StrategyAdvisorChat />
      </div>
    </div>
  );
};
