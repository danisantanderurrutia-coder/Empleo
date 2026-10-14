import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, Square, ExternalLink, FileText, Send, CheckCircle2, 
  RefreshCw, ShieldCheck, Sparkles, Building2, MapPin, AlertCircle, Eye, X,
  Database, Trash2, ShieldAlert, Copy, Check
} from 'lucide-react';
import type { ApplicationItem } from '../../types/applications';
import { getStoredApplications, getStoredOffers } from '../../services/db';
import { BatchApplicationService } from '../../services/batchApplicationService';
import { PipelineOrchestrator } from '../../services/pipelineOrchestrator';
import { StorageQuotaManager, type StorageHealth } from '../../services/storageQuotaManager';

export const BatchApplicationsTab: React.FC = () => {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<'todos' | 'pendientes' | 'aprobados' | 'enviados'>('todos');
  const [previewApp, setPreviewApp] = useState<ApplicationItem | null>(null);
  const [assistedDispatchApp, setAssistedDispatchApp] = useState<ApplicationItem | null>(null);
  const [isRunningPipeline, setIsRunningPipeline] = useState(false);
  const [pipelineStatus, setPipelineStatus] = useState<string>('');
  const [batchSize, setBatchSize] = useState<number>(10);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [storageHealth, setStorageHealth] = useState<StorageHealth | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const loadData = () => {
    const apps = getStoredApplications();
    setApplications(apps);
    setStorageHealth(StorageQuotaManager.getStorageHealth());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRunFullPipeline = async () => {
    setIsRunningPipeline(true);
    setPipelineStatus('Iniciando orquestador SOLID...');
    try {
      const result = await PipelineOrchestrator.runCompletePipeline((status) => {
        setPipelineStatus(status.message);
      }, { batchSize });
      loadData();
      setSuccessMessage(result.summary);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch {
      setPipelineStatus('Error al ejecutar el pipeline.');
    } finally {
      setIsRunningPipeline(false);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedAppIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const filtered = getFilteredApps();
    if (selectedAppIds.length === filtered.length) {
      setSelectedAppIds([]);
    } else {
      setSelectedAppIds(filtered.map(a => a.id));
    }
  };

  const handleBatchApprove = () => {
    if (selectedAppIds.length === 0) return;
    BatchApplicationService.approveBatchApplicationsStatic(selectedAppIds);
    loadData();
    setSuccessMessage(`Aprobadas ${selectedAppIds.length} postulaciones con "OK". Preparadas en Fase 6 para envío asistido.`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleConfirmAssistedDispatch = (appId: string) => {
    BatchApplicationService.dispatchBatchApplicationsStatic([appId]);
    loadData();
    setAssistedDispatchApp(null);
    setSuccessMessage(`🚀 ¡Candidatura confirmada y trasladada exitosamente a la Fase 7 (Enviada)!`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handlePruneStorage = () => {
    const { prunedCount, freedBytes } = StorageQuotaManager.pruneOldDrafts();
    loadData();
    setSuccessMessage(`Almacenamiento optimizado: Eliminados ${prunedCount} borradores antiguos (Liberados ${Math.round(freedBytes / 1024)} KB).`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getFilteredApps = () => {
    return applications.filter(app => {
      if (activeFilter === 'pendientes') return !app.isBatchApproved && app.currentStage < 7;
      if (activeFilter === 'aprobados') return app.isBatchApproved && app.currentStage < 7;
      if (activeFilter === 'enviados') return app.currentStage >= 7;
      return true;
    });
  };

  const filteredApps = getFilteredApps();
  const allOffers = getStoredOffers();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-xl p-6 text-white border border-indigo-500/20 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="bg-indigo-500/30 text-indigo-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-indigo-400/30">
                SOLID Enterprise Architecture
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-400/30">
                Despacho Asistido & Verificación Estricta
              </span>
              {storageHealth && (
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                  storageHealth.isNearLimit 
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' 
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}>
                  <Database className="w-3.5 h-3.5" />
                  Almacenamiento: {storageHealth.usedKB} KB ({storageHealth.estimatedPercent}%)
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-slate-100">Postulación en Lote & Despacho Asistido</h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Revisión unificada de convocatorias verificadas estrictamente, inspección de borradores en Fase 6,
              y despacho guiado al portal oficial de cada empresa.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Configurable Batch Size Selector */}
            <div className="flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-lg border border-slate-800 text-xs">
              <span className="text-slate-400 font-medium pl-1">Lote:</span>
              {[5, 10, 25].map(size => (
                <button
                  key={size}
                  onClick={() => setBatchSize(size)}
                  className={`px-2 py-1 rounded font-semibold transition ${
                    batchSize === size ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            <button
              onClick={handleRunFullPipeline}
              disabled={isRunningPipeline}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-emerald-500 hover:from-indigo-600 hover:to-emerald-600 text-white font-medium px-4 py-2.5 rounded-lg shadow-lg hover:shadow-indigo-500/25 transition duration-200 disabled:opacity-50 text-xs md:text-sm whitespace-nowrap"
            >
              <RefreshCw className={`w-4 h-4 ${isRunningPipeline ? 'animate-spin' : ''}`} />
              {isRunningPipeline ? 'Ejecutando Pipeline...' : 'Escanear & Preparar Lote'}
            </button>
          </div>
        </div>

        {isRunningPipeline && (
          <div className="mt-4 p-3 bg-indigo-900/50 rounded-lg border border-indigo-400/30 flex items-center gap-3 text-sm text-indigo-200 animate-pulse">
            <RefreshCw className="w-4 h-4 animate-spin text-indigo-300" />
            <span>{pipelineStatus}</span>
          </div>
        )}

        {successMessage && (
          <div className="mt-4 p-3 bg-emerald-900/60 rounded-lg border border-emerald-400/40 flex items-center justify-between text-sm text-emerald-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
            {storageHealth?.isNearLimit && (
              <button
                onClick={handlePruneStorage}
                className="flex items-center gap-1 text-xs bg-emerald-800 hover:bg-emerald-700 px-3 py-1 rounded font-semibold text-white transition"
              >
                <Trash2 className="w-3.5 h-3.5" /> Limpiar Almacenamiento
              </button>
            )}
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {[
            { id: 'todos', label: 'Todas', count: applications.length },
            { id: 'pendientes', label: 'Pendientes (Fase 6)', count: applications.filter(a => !a.isBatchApproved && a.currentStage < 7).length },
            { id: 'aprobados', label: 'Aprobadas (OK)', count: applications.filter(a => a.isBatchApproved && a.currentStage < 7).length },
            { id: 'enviados', label: 'Enviadas (Fase 7)', count: applications.filter(a => a.currentStage >= 7).length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                activeFilter === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={handleSelectAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            {selectedAppIds.length === filteredApps.length && filteredApps.length > 0 ? (
              <CheckSquare className="w-4 h-4 text-indigo-600" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
            <span>Seleccionar Todo ({selectedAppIds.length})</span>
          </button>

          <button
            onClick={handleBatchApprove}
            disabled={selectedAppIds.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 disabled:opacity-40 transition"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Aprobar Seleccionadas (OK)</span>
          </button>

          {storageHealth?.isNearLimit && (
            <button
              onClick={handlePruneStorage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-300 hover:bg-rose-100 transition"
              title="Liberar espacio en el navegador borrando borradores antiguos"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Optimizar Espacio</span>
            </button>
          )}
        </div>
      </div>

      {/* Applications Grid / Cards */}
      {filteredApps.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
          <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-semibold text-slate-700">No hay postulaciones en este estado</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Haz clic en "Escanear & Preparar Lote" para buscar vacantes en tus fuentes y generar adaptaciones automáticas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredApps.map(app => {
            const offer = allOffers.find(o => o.id === app.offerId);
            const isSelected = selectedAppIds.includes(app.id);

            // Strict Verification Badge Logic (No false positives)
            const isStrictlyVerified = offer?.isVerified && offer?.verificationStatus === 'Vigente y Verificada';
            const isPendingManual = offer?.verificationStatus === 'Pendiente de Verificación Manual' || !offer?.isVerified;

            return (
              <div
                key={app.id}
                className={`bg-white rounded-xl p-5 border transition shadow-sm hover:shadow-md ${
                  isSelected ? 'border-indigo-500 bg-indigo-50/20' : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  {/* Left: Checkbox + Title Info */}
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleSelect(app.id)}
                      className="mt-1 text-slate-400 hover:text-indigo-600 focus:outline-none"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-indigo-600" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-300" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-base font-bold text-slate-900 hover:text-indigo-600 transition">
                          {app.offerTitle}
                        </h3>
                        {app.isBatchApproved && (
                          <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> OK Aprobado (Fase 6)
                          </span>
                        )}
                        {app.currentStage >= 7 && (
                          <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-indigo-200">
                            <Send className="w-3 h-3 text-indigo-600" /> Enviada (Fase 7)
                          </span>
                        )}

                        {/* Strict Verification Badges */}
                        {isStrictlyVerified ? (
                          <span className="bg-emerald-50 text-emerald-700 text-xs font-medium px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-200">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Vigente y Verificada
                          </span>
                        ) : isPendingManual ? (
                          <span className="bg-amber-50 text-amber-700 text-xs font-medium px-2 py-0.5 rounded flex items-center gap-1 border border-amber-200">
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" /> Pendiente Verificación Manual
                          </span>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" /> {app.companyName}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" /> {app.location}
                        </span>
                        {offer && (
                          <span className="text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                            {offer.matchScore.totalScore}% Coincidencia
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
                    {/* Link to original offer page */}
                    {app.offerUrl && (
                      <a
                        href={app.offerUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                        <span>Ver Oferta Original</span>
                      </a>
                    )}

                    {/* Preview CV & Cover Letter */}
                    <button
                      onClick={() => setPreviewApp(app)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition"
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Revisar Borradores</span>
                    </button>

                    {/* Assisted Dispatch Launch Button */}
                    {app.currentStage < 7 && (
                      <button
                        onClick={() => setAssistedDispatchApp(app)}
                        className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow transition"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Despacho Asistido</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* CV Highlights summary tag */}
                {app.adaptedCvSummary && app.adaptedCvSummary.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg">
                    <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-800">Adaptación del CV:</strong>{' '}
                      {app.adaptedCvSummary.slice(0, 2).join(' • ')}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal 1: Assisted Portal Dispatch Workspace */}
      {assistedDispatchApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#131c2e] max-w-2xl w-full rounded-2xl border border-slate-700 shadow-2xl space-y-4 p-6 text-slate-100">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-indigo-400/30">
                  Despacho Guiado al Portal Oficial
                </span>
                <h3 className="font-bold text-lg text-white mt-1">{assistedDispatchApp.offerTitle}</h3>
                <p className="text-xs text-slate-400">{assistedDispatchApp.companyName} • {assistedDispatchApp.location}</p>
              </div>
              <button onClick={() => setAssistedDispatchApp(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="font-bold text-emerald-400 block">PASO 1: Copiar Datos Rápidos para el Formulario:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => copyToClipboard(assistedDispatchApp.formDraft?.['nombre_completo'] || '', 'nombre')}
                    className="p-2 rounded bg-slate-950 border border-slate-800 text-left flex justify-between items-center hover:border-slate-700"
                  >
                    <span>Nombre: {assistedDispatchApp.formDraft?.['nombre_completo']}</span>
                    {copiedField === 'nombre' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  </button>

                  <button
                    onClick={() => copyToClipboard(assistedDispatchApp.formDraft?.['email'] || '', 'email')}
                    className="p-2 rounded bg-slate-950 border border-slate-800 text-left flex justify-between items-center hover:border-slate-700"
                  >
                    <span>Email: {assistedDispatchApp.formDraft?.['email']}</span>
                    {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="font-bold text-indigo-300 block">PASO 2: Abrir Formulario Web Oficial:</span>
                {assistedDispatchApp.offerUrl && (
                  <a
                    href={assistedDispatchApp.offerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg bg-indigo-950/60 border border-indigo-500/40 text-indigo-200 font-semibold hover:bg-indigo-900/60 transition"
                  >
                    <span>Abrir Portal de {assistedDispatchApp.companyName}</span>
                    <ExternalLink className="w-4 h-4 text-indigo-300" />
                  </a>
                )}
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-3">
                <span className="font-bold text-emerald-300 block">PASO 3: Confirmar Envío Realizado:</span>
                <p className="text-slate-300 text-[11px]">
                  Una vez que hayas completado el formulario en la web oficial de la empresa, haz clic a continuación para registrar la candidatura como <strong>Enviada (Fase 7)</strong>.
                </p>
                <button
                  onClick={() => handleConfirmAssistedDispatch(assistedDispatchApp.id)}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmar Envío Realizado en Portal Oficial</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Preview CV & Cover Letter */}
      {previewApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-900 text-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">{previewApp.offerTitle}</h3>
                <p className="text-xs text-indigo-200">{previewApp.companyName} • {previewApp.location}</p>
              </div>
              <button
                onClick={() => setPreviewApp(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
              <div>
                <h4 className="font-bold text-slate-900 flex items-center gap-2 text-base border-b pb-2 mb-3">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  Carta de Presentación Adaptada
                </h4>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-sans whitespace-pre-wrap leading-relaxed text-slate-800 text-xs md:text-sm">
                  {previewApp.coverLetter || 'Carta de presentación en generación...'}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 flex items-center gap-2 text-base border-b pb-2 mb-3">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  Puntos Clave Adaptados en tu CV
                </h4>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                  {previewApp.adaptedCvSummary?.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  )) || <li>Experiencia orientada a la posición y normativas europeas.</li>}
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              {previewApp.offerUrl && (
                <a
                  href={previewApp.offerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Abrir enlace original de la vacante
                </a>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    BatchApplicationService.approveBatchApplicationsStatic([previewApp.id]);
                    loadData();
                    setPreviewApp(null);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs transition"
                >
                  Aprobar (Marcar OK)
                </button>
                <button
                  onClick={() => setPreviewApp(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold text-xs transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
