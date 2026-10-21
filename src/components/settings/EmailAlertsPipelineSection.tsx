import React, { useState } from 'react';
import { 
  Mail, 
  Clock, 
  ShieldCheck, 
  Play, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Layers, 
  Terminal, 
  Send,
  Tag,
  Plus,
  X
} from 'lucide-react';
import { getStoredSettings, saveStoredSettings } from '../../services/db';
import type { AppSettings } from '../../services/db';

export const EmailAlertsPipelineSection: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(getStoredSettings());
  const [recipient, setRecipient] = useState(settings.emailAlertRecipient || 'danisantander.urrutia@gmail.com');
  const [deliveryTime, setDeliveryTime] = useState(settings.emailAlertTime || '09:00');
  const [keywords, setKeywords] = useState<string[]>(
    settings.emailAlertKeywords || ['Boden', 'Bodenkunde', 'Klimaschutz', 'KI', 'Künstliche Intelligenz', 'Umweltbundesamt', 'Thünen', 'Geophysik', 'Eddy Covariance']
  );
  const [newKeyword, setNewKeyword] = useState('');
  const [provider, setProvider] = useState<'resend' | 'smtp' | 'local'>(settings.emailAlertProvider || 'resend');

  const [activeCodeTab, setActiveCodeTab] = useState<'workflow' | 'script' | 'secrets'>('workflow');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    const updated: AppSettings = {
      ...settings,
      emailAlertRecipient: recipient,
      emailAlertTime: deliveryTime,
      emailAlertKeywords: keywords,
      emailAlertProvider: provider,
      emailAlertEnabled: true
    };
    setSettings(updated);
    saveStoredSettings(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newKeyword.trim();
    if (trimmed && !keywords.includes(trimmed)) {
      setKeywords([...keywords, trimmed]);
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (kwToRemove: string) => {
    setKeywords(keywords.filter(k => k !== kwToRemove));
  };

  const copyToClipboard = (text: string, tabName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tabName);
    setTimeout(() => setCopiedTab(null), 2500);
  };

  const workflowCode = `name: "Daily Job Alerts (09:00 AM CET)"

on:
  schedule:
    # 07:00 UTC = 09:00 CEST (Central European Summer Time)
    - cron: '0 7 * * *'
  workflow_dispatch:

jobs:
  run-alerts:
    name: Execute Daily Job Digest
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up Python 3.11
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Run Job Alert Pipeline
        env:
          ALERT_RECIPIENT_EMAIL: "\${{ secrets.ALERT_RECIPIENT_EMAIL || '${recipient}' }}"
          RESEND_API_KEY: "\${{ secrets.RESEND_API_KEY }}"
          SMTP_HOST: "\${{ secrets.SMTP_HOST || 'smtp.gmail.com' }}"
          SMTP_PORT: "\${{ secrets.SMTP_PORT || '587' }}"
          SMTP_USER: "\${{ secrets.SMTP_USER }}"
          SMTP_PASS: "\${{ secrets.SMTP_PASS }}"
        run: |
          python scripts/daily_job_alerts.py

      - name: Upload HTML Digest Artifact
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: latest-job-digest
          path: scripts/latest_job_digest.html
          retention-days: 7`;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-sky-950/60 border border-emerald-500/30 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Serverless & Privado
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Diario a las {deliveryTime} CET
              </span>
            </div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
              <Mail className="h-6 w-6 text-emerald-400" />
              <span>Pipeline de Alertas Diarias por Correo Electrónico</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Monitoreo matutino automático de <strong>service.bund.de (500+ plazas)</strong>, <strong>Thünen-Institut</strong> y convocatorias públicas de <strong>Interamt / UBA</strong>. El proceso se ejecuta en la nube de GitHub Actions sin coste y sin requerir un servidor propio ni tener la web abierta.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <Play className="h-4 w-4" />
              <span>Simular Alerta de Hoy</span>
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              {isSaved ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}
              <span>{isSaved ? '¡Configuración Guardada!' : 'Guardar Parámetros'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visual Pipeline Flow Diagram */}
      <div className="p-5 rounded-2xl bg-[#0d1527] border border-slate-800 shadow-lg">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>Arquitectura Explicable del Pipeline de Alertas</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">Paso 1 • Disparador</span>
              <p className="font-semibold text-slate-200">GitHub Actions Cron</p>
              <p className="text-[11px] text-slate-400 mt-1">Corre a las 07:00 UTC (09:00 AM en Berlín/Madrid) cada mañana sin encender tu PC.</p>
            </div>
            <div className="mt-3 text-[10px] text-slate-500 font-mono">cron: '0 7 * * *'</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block mb-1">Paso 2 • Ingesta Multifuente</span>
              <p className="font-semibold text-slate-200">Rastreo de Feeds Oficiales</p>
              <p className="text-[11px] text-slate-400 mt-1">Descarga el canal RSS de service.bund.de y consulta portales del Thünen y UBA.</p>
            </div>
            <div className="mt-3 text-[10px] text-slate-500 font-mono">500+ ofertas analizadas</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">Paso 3 • Matching Semántico</span>
              <p className="font-semibold text-slate-200">Filtro por Palabras Clave</p>
              <p className="text-[11px] text-slate-400 mt-1">Evalúa presencia de términos edáficos, climáticos, de IA y entidades prioritarias.</p>
            </div>
            <div className="mt-3 text-[10px] text-slate-500 font-mono">{keywords.length} términos activos</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block mb-1">Paso 4 • Entrega Matutina</span>
              <p className="font-semibold text-slate-200">Boletín HTML Formateado</p>
              <p className="text-[11px] text-slate-400 mt-1">Despacha el digest a tu correo con escalas TVöD E13, enlaces directos y fechas límite.</p>
            </div>
            <div className="mt-3 text-[10px] text-slate-500 font-mono">{provider.toUpperCase()} / TLS</div>
          </div>
        </div>
      </div>

      {/* Configuration Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Settings */}
        <div className="p-6 rounded-2xl bg-[#0d1527] border border-slate-800 space-y-5">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Configuración del Destinatario y Parámetros</span>
          </h4>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Dirección de Correo Destino
            </label>
            <input
              type="email"
              value={recipient}
              onChange={e => setRecipient(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
              placeholder="tu-correo@ejemplo.com"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Aquí llegará el resumen diario cada mañana con las novedades recién descubiertas.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Hora de Envío (CET)
              </label>
              <input
                type="time"
                value={deliveryTime}
                onChange={e => setDeliveryTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Canal de Despacho
              </label>
              <select
                value={provider}
                onChange={e => setProvider(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="resend">Resend API (Recomendado / Gratis)</option>
                <option value="smtp">Gmail SMTP (Contraseña de Aplicación)</option>
                <option value="local">Script Local Mac (launchd)</option>
              </select>
            </div>
          </div>

          {/* Keywords Manager */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Palabras Clave de Búsqueda ({keywords.length})</span>
            </label>
            <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800 min-h-[80px]">
              {keywords.map(kw => (
                <span
                  key={kw}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-slate-800 text-slate-200 border border-slate-700 group hover:border-rose-500/50 transition"
                >
                  <Tag className="w-3 h-3 text-emerald-400" />
                  <span>{kw}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(kw)}
                    className="text-slate-400 hover:text-rose-400 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <form onSubmit={handleAddKeyword} className="flex gap-2 mt-2">
              <input
                type="text"
                value={newKeyword}
                onChange={e => setNewKeyword(e.target.value)}
                placeholder="Añadir término (p. ej. 'Remote Sensing', 'BZE-LW')..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right: Code Generator & Export */}
        <div className="p-6 rounded-2xl bg-[#0d1527] border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-sky-400" />
                <span>Código Listo para Ejecutar</span>
              </h4>
              <div className="flex gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setActiveCodeTab('workflow')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                    activeCodeTab === 'workflow' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  GitHub Workflow
                </button>
                <button
                  onClick={() => setActiveCodeTab('secrets')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                    activeCodeTab === 'secrets' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Secretos GitHub
                </button>
              </div>
            </div>

            {activeCodeTab === 'workflow' ? (
              <div className="relative">
                <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-[280px]">
                  {workflowCode}
                </pre>
                <button
                  onClick={() => copyToClipboard(workflowCode, 'workflow')}
                  className="absolute top-2 right-2 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] rounded-lg border border-slate-700 flex items-center gap-1 transition"
                >
                  {copiedTab === 'workflow' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedTab === 'workflow' ? 'Copiado' : 'Copiar YAML'}</span>
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs text-slate-300">
                <p className="font-semibold text-white">¿Cómo activar el envío en 2 minutos?</p>
                <ol className="list-decimal list-inside space-y-2 text-slate-400 text-[11px]">
                  <li>Ve a tu repositorio en GitHub &rarr; <strong>Settings &rarr; Secrets and variables &rarr; Actions</strong>.</li>
                  <li>Crea un secreto llamado <code className="text-emerald-400 font-mono">RESEND_API_KEY</code> con tu token gratuito de resend.com (o <code className="text-emerald-400 font-mono">SMTP_USER</code> y <code className="text-emerald-400 font-mono">SMTP_PASS</code> para Gmail).</li>
                  <li>¡Listo! El workflow se activará automáticamente cada mañana a las 09:00 AM o cuando pulses "Run workflow" manualmente.</li>
                </ol>
              </div>
            )}
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>El script ejecutor ya se encuentra guardado en <code className="text-emerald-300 font-mono">scripts/daily_job_alerts.py</code></span>
            </span>
          </div>
        </div>
      </div>

      {/* Live Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0a0f1d] border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-[#0a0f1d] z-10">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-white text-sm">Previsualización del Boletín de las 09:00 AM</span>
              </div>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-900/80 to-sky-900/80 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                  Job Search OS • Alerta Diaria 09:00 AM
                </span>
                <h3 className="text-lg font-bold mt-1">Convocatorias Nuevas Detectadas</h3>
                <p className="text-xs text-emerald-100 mt-0.5">Destinatario: {recipient}</p>
              </div>

              <div className="text-xs text-slate-300">
                A continuación tienes las oportunidades prioritarias filtradas con tu perfil:
              </div>

              {/* Offer Card 1: Thünen */}
              <div className="p-4 rounded-xl bg-slate-900 border-l-4 border-rose-500 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 uppercase">
                    ⚠️ Plazo Inminente • Match 92%
                  </span>
                  <span className="text-xs font-semibold text-amber-400">📅 Frist: 22.10.2026</span>
                </div>
                <h4 className="font-bold text-white text-sm">
                  Wissenschaftliche*r Mitarbeiter*in / Doktorand*in Agrar-/Bodenwissenschaften (w/m/d)
                </h4>
                <p className="text-xs text-slate-400">
                  🏢 <strong>Johann Heinrich von Thünen-Institut</strong> • 📍 Braunschweig, Niedersachsen
                </p>
                <div className="p-2.5 rounded-lg bg-slate-950 text-[11px] text-slate-300 space-y-1">
                  <div>💰 <strong>Convenio:</strong> TVöD Bund E13 (70% - ca. 43.742 € - 62.705 €)</div>
                  <div>🔬 <strong>Proyecto:</strong> TechWorms (Secuestro de carbono en subsuelo)</div>
                </div>
                <a
                  href="https://www.karriere-thuenen.de/index.php?ac=jobad&id=369&language=2"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition mt-1"
                >
                  <span>Abrir Convocatoria Oficial</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Offer Card 2: UBA */}
              <div className="p-4 rounded-xl bg-slate-900 border-l-4 border-emerald-500 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 uppercase">
                    ⭐ Alta Afinidad • Match 88%
                  </span>
                  <span className="text-xs font-semibold text-amber-400">📅 Frist: 28.10.2026</span>
                </div>
                <h4 className="font-bold text-white text-sm">
                  Spezialist*in im Bereich KI-Projektmanagement und KI Product Owner (KI-Lab)
                </h4>
                <p className="text-xs text-slate-400">
                  🏢 <strong>Umweltbundesamt (UBA)</strong> • 📍 Leipzig, Berlin oder Dessau-Roßlau
                </p>
                <div className="p-2.5 rounded-lg bg-slate-950 text-[11px] text-slate-300 space-y-1">
                  <div>💰 <strong>Convenio:</strong> TVöD Bund E13 (100% - ca. 62.489 € - 89.579 €)</div>
                  <div>🔬 <strong>Proyecto:</strong> Agenda Digital de Política Ambiental (KI-Lab)</div>
                </div>
                <a
                  href="https://interamt.de/koop/app/stelle?0&id=1499096"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition mt-1"
                >
                  <span>Abrir Convocatoria en Interamt</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-[#0d1527] flex justify-end">
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition"
              >
                Cerrar Previsualización
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
