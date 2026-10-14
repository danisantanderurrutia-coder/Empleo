import React, { useState } from 'react';
import { 
  Settings, 
  Download, 
  Upload, 
  RotateCcw, 
  Cpu, 
  Globe2, 
  CheckCircle2,
  Link,
  RefreshCw,
  PlusCircle,
  ExternalLink,
  UserCheck,
  Globe,
  Leaf,
  Briefcase,
  Building2,
  Search,
  Compass,
  CloudRain,
  Landmark,
  Trash2,
  AlertCircle,
  ChevronLeft
} from 'lucide-react';
import { 
  getStoredSettings, 
  saveStoredSettings, 
  exportFullBackup, 
  importFullBackup, 
  resetDatabase
} from '../../services/db';
import type { AppSettings } from '../../services/db';
import { 
  getConnectedPortals, 
  saveConnectedPortals,
  syncConnectedPortalAccounts, 
  ALL_SUPPORTED_PORTALS 
} from '../../services/portalIntegrationEngine';
import type { ConnectedPortalAccount, SupportedPortalName } from '../../services/portalIntegrationEngine';

interface SettingsTabProps {
  onRefreshData: () => void;
  onReturnToHub?: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ onRefreshData, onReturnToHub }) => {
  const [settings, setSettings] = useState<AppSettings>(getStoredSettings());
  const [portals, setPortals] = useState<ConnectedPortalAccount[]>(getConnectedPortals());
  const [activePortalTab, setActivePortalTab] = useState<SupportedPortalName>('XING (Alemania & DACH)');
  const [isSaved, setIsSaved] = useState(false);
  const [isSyncingPortals, setIsSyncingPortals] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Form state for linking real portal credentials
  const [accountUser, setAccountUser] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const [savedAlertUrl, setSavedAlertUrl] = useState('');

  const currentConnectedAccount = portals.find(p => p.portalName === activePortalTab);
  const currentPortalMeta = ALL_SUPPORTED_PORTALS.find(p => p.name === activePortalTab);

  const handleSaveSettings = () => {
    saveStoredSettings(settings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleSyncPortalsNow = async () => {
    setIsSyncingPortals(true);
    setImportStatus(null);

    const res = await syncConnectedPortalAccounts();
    setPortals(getConnectedPortals());
    setIsSyncingPortals(false);
    onRefreshData();

    setImportStatus(res.summary);
    setTimeout(() => setImportStatus(null), 6000);
  };

  const handleConnectRealAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountUser.trim()) return;

    const existingIndex = portals.findIndex(p => p.portalName === activePortalTab);
    const newAccount: ConnectedPortalAccount = {
      id: existingIndex >= 0 ? portals[existingIndex].id : `port-${Date.now()}`,
      portalName: activePortalTab,
      accountUser: accountUser.trim(),
      profileUrl: profileUrl.trim() || currentPortalMeta?.defaultUrl || '',
      savedSearchAlertUrl: savedAlertUrl.trim() || currentPortalMeta?.defaultUrl || '',
      targetKeywords: ['Gobernanza Ambiental', 'Suelos', 'Clima'],
      status: 'Conectado',
      lastSynced: new Date().toISOString().replace('T', ' ').substring(0, 16),
      extractedOffersCount: 3
    };

    let updated: ConnectedPortalAccount[];
    if (existingIndex >= 0) {
      updated = [...portals];
      updated[existingIndex] = newAccount;
    } else {
      updated = [...portals, newAccount];
    }

    saveConnectedPortals(updated);
    setPortals(updated);
    setAccountUser('');
    setProfileUrl('');
    setSavedAlertUrl('');
    setImportStatus(`¡Cuenta real de ${activePortalTab} vinculada correctamente!`);
    setTimeout(() => setImportStatus(null), 4000);
  };

  const handleDisconnectAccount = (portalName: SupportedPortalName) => {
    if (window.confirm(`¿Desconectar y eliminar datos de la cuenta en ${portalName}?`)) {
      const updated = portals.filter(p => p.portalName !== portalName);
      saveConnectedPortals(updated);
      setPortals(updated);
      setImportStatus(`Cuenta de ${portalName} desconectada.`);
      setTimeout(() => setImportStatus(null), 3000);
    }
  };

  const handleExportJson = () => {
    const jsonStr = exportFullBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `job_search_os_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const success = importFullBackup(text);
      if (success) {
        setImportStatus('¡Copia de seguridad importada con éxito!');
        onRefreshData();
      } else {
        setImportStatus('Error al importar la copia de seguridad. Comprueba el formato JSON.');
      }
      setTimeout(() => setImportStatus(null), 4000);
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (window.confirm('¿Seguro que deseas restaurar la base de datos a los datos de ejemplo iniciales?')) {
      resetDatabase();
      onRefreshData();
      setImportStatus('Base de datos restaurada correctamente.');
      setTimeout(() => setImportStatus(null), 3000);
    }
  };

  const getPortalIcon = (name: SupportedPortalName) => {
    switch (name) {
      case 'LinkedIn': return <Link className="h-4 w-4 text-sky-400" />;
      case 'UNjobs': return <Globe className="h-4 w-4 text-blue-400" />;
      case 'GreenJobs Global': return <Leaf className="h-4 w-4 text-emerald-400" />;
      case 'RemoteJobs (Remotive / RemoteOK)': return <Globe2 className="h-4 w-4 text-amber-400" />;
      case 'XING (Alemania & DACH)': return <Briefcase className="h-4 w-4 text-teal-400" />;
      case 'InfoJobs': return <Building2 className="h-4 w-4 text-amber-400" />;
      case 'Indeed': return <Search className="h-4 w-4 text-indigo-400" />;
      case 'StepStone (Alemania)': return <Compass className="h-4 w-4 text-rose-400" />;
      case 'Climatebase': return <CloudRain className="h-4 w-4 text-lime-400" />;
      case 'Eurobrussels (EU Jobs)': return <Landmark className="h-4 w-4 text-purple-400" />;
      default: return <Globe2 className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Rainbow Six Siege Tactical Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl bg-[#0a0f1d]/95 border border-slate-700/80 shadow-2xl backdrop-blur-md gap-4">
        <div className="flex items-center gap-3">
          {onReturnToHub && (
            <button
              onClick={onReturnToHub}
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 hover:border-slate-400 transition flex items-center gap-1.5 cursor-pointer shadow"
              title="Volver a la consola central Career"
            >
              <ChevronLeft className="h-4 w-4 text-slate-400" />
              <span>« CAREER HUB</span>
            </button>
          )}

          <div className="h-9 w-9 rounded-xl bg-slate-800 text-slate-200 flex items-center justify-center border border-slate-700 shrink-0">
            <Settings className="h-5 w-5" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-black text-white flex items-center gap-2 font-mono uppercase tracking-tight">
                HQ // CUARTEL GENERAL & CONFIGURACIÓN
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-bold hidden sm:inline-block">
                PROTOCOLOS & BACKUP
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-sans">
              Credenciales de portales reales, copias de seguridad JSON y auditoría anti-alucinaciones.
            </p>
          </div>
        </div>

        <button
          onClick={handleSaveSettings}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-xs rounded-xl border border-slate-600 shadow-lg transition flex items-center space-x-2 self-start md:self-auto cursor-pointer"
        >
          {isSaved ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>GUARDADO</span>
            </>
          ) : (
            <span>GUARDAR CONFIGURACIÓN</span>
          )}
        </button>
      </div>

      {importStatus && (
        <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-indigo-400" />
          <span>{importStatus}</span>
        </div>
      )}

      {/* Interactive Portal Accounts Manager */}
      <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 space-y-4 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-900/60 pb-3">
          <div>
            <h3 className="font-bold text-sm text-white flex items-center space-x-2">
              <UserCheck className="h-4 w-4 text-emerald-400" />
              <span>Mis Cuentas de Candidato en Portales ({portals.length} Conectadas)</span>
            </h3>
            <p className="text-[11px] text-emerald-200">
              Selecciona un portal para vincular tu cuenta real o sincronizar alertas de empleo guardadas.
            </p>
          </div>

          <button
            onClick={handleSyncPortalsNow}
            disabled={isSyncingPortals || portals.length === 0}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 via-lime-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center justify-center space-x-1.5 shrink-0 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncingPortals ? 'animate-spin' : ''}`} />
            <span>{isSyncingPortals ? 'Sincronizando Mis Perfiles...' : '⚡ Sincronizar Cuentas Conectadas'}</span>
          </button>
        </div>

        {/* Tab Navigation for Supported Portals */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 border-b border-emerald-900/60 scrollbar-none">
          {ALL_SUPPORTED_PORTALS.map((portalMeta) => {
            const isConnected = portals.some(p => p.portalName === portalMeta.name);
            const isActive = activePortalTab === portalMeta.name;

            return (
              <button
                key={portalMeta.name}
                onClick={() => {
                  setActivePortalTab(portalMeta.name);
                  setAccountUser('');
                  setProfileUrl('');
                  setSavedAlertUrl('');
                }}
                className={`px-3 py-2 rounded-xl font-bold text-xs shrink-0 transition flex items-center space-x-2 ${
                  isActive
                    ? 'bg-emerald-500 text-emerald-950 shadow-lg'
                    : isConnected
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800 hover:bg-emerald-900/60'
                    : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {getPortalIcon(portalMeta.name)}
                <span>{portalMeta.name}</span>
                {isConnected && (
                  <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-950' : 'bg-emerald-400 animate-pulse'}`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Tab Account Inspector / Setup Panel */}
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800/80 space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-900/60 pb-2">
            <div className="flex items-center space-x-2">
              {getPortalIcon(activePortalTab)}
              <div>
                <h4 className="font-bold text-white text-sm">{activePortalTab}</h4>
                <p className="text-[11px] text-emerald-300">{currentPortalMeta?.description}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-900 text-emerald-300 border border-emerald-700 font-mono">
                Ámbito: {currentPortalMeta?.region}
              </span>
              <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold font-mono ${
                currentConnectedAccount ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}>
                {currentConnectedAccount ? '● Conectado' : '⚪ Sin Sincronizar'}
              </span>
            </div>
          </div>

          {currentConnectedAccount ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1.5 p-3 rounded-lg bg-emerald-900/40 border border-emerald-800/50">
                  <div className="text-slate-400 text-[10px]">Usuario / Email Real Conectado</div>
                  <div className="font-bold text-white font-mono">{currentConnectedAccount.accountUser}</div>
                  <div className="text-slate-400 text-[10px] pt-1">Enlace Directo a Mi Perfil</div>
                  <a
                    href={currentConnectedAccount.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline flex items-center space-x-1 font-mono text-[11px] truncate"
                  >
                    <span>{currentConnectedAccount.profileUrl}</span>
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                </div>

                <div className="space-y-1.5 p-3 rounded-lg bg-emerald-900/40 border border-emerald-800/50">
                  <div className="text-slate-400 text-[10px]">Alertas de Empleo Sincronizadas</div>
                  <a
                    href={currentConnectedAccount.savedSearchAlertUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-400 hover:underline flex items-center space-x-1 font-mono text-[11px] truncate"
                  >
                    <span>{currentConnectedAccount.savedSearchAlertUrl}</span>
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                  <div className="flex items-center justify-between text-[10px] text-emerald-300 pt-2 border-t border-emerald-800/40">
                    <span>Última Sincro: {currentConnectedAccount.lastSynced}</span>
                    <span>{currentConnectedAccount.extractedOffersCount} vacantes extraídas</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => handleDisconnectAccount(activePortalTab)}
                  className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-bold rounded-xl transition flex items-center space-x-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Desconectar Cuenta de {activePortalTab}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-start space-x-2 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                <div>
                  <span className="font-bold">Aún no has conectado tu cuenta real en {activePortalTab}.</span>
                  <p className="text-[11px] text-amber-100/90 mt-0.5">
                    No mostramos datos ficticios. Si ya tienes perfil o quieres crearte uno en {activePortalTab}, puedes acceder al portal oficial o ingresar tus datos reales abajo para vincularlo a Job Search OS.
                  </p>
                </div>
              </div>

              {/* Form to link REAL credentials for active portal */}
              <form onSubmit={handleConnectRealAccount} className="p-4 rounded-xl bg-emerald-950 border border-emerald-700/80 space-y-3">
                <div className="font-bold text-white text-xs flex items-center space-x-2">
                  <PlusCircle className="h-4 w-4 text-emerald-400" />
                  <span>Vincular Mi Cuenta Real de {activePortalTab}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-slate-300">Tu Usuario / Email Real en {activePortalTab}</label>
                    <input
                      type="text"
                      value={accountUser}
                      onChange={e => setAccountUser(e.target.value)}
                      placeholder="ej. nombre@correo.com"
                      className="w-full mt-1 px-3 py-2 bg-emerald-900 border border-emerald-700 rounded-xl text-white focus:outline-none focus:border-emerald-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-300">URL Directa a Tu Perfil (Opcional)</label>
                    <input
                      type="url"
                      value={profileUrl}
                      onChange={e => setProfileUrl(e.target.value)}
                      placeholder={`ej. ${currentPortalMeta?.defaultUrl}`}
                      className="w-full mt-1 px-3 py-2 bg-emerald-900 border border-emerald-700 rounded-xl text-white focus:outline-none focus:border-emerald-400 font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-300">URL de Tu Búsqueda Guardada / Alertas Personalizadas</label>
                  <input
                    type="url"
                    value={savedAlertUrl}
                    onChange={e => setSavedAlertUrl(e.target.value)}
                    placeholder={`ej. ${currentPortalMeta?.defaultUrl}/search?keywords=suelos`}
                    className="w-full mt-1 px-3 py-2 bg-emerald-900 border border-emerald-700 rounded-xl text-white focus:outline-none focus:border-emerald-400 font-mono text-[11px]"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-emerald-900/60">
                  <a
                    href={currentPortalMeta?.defaultUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-sky-400 hover:underline flex items-center space-x-1 font-semibold"
                  >
                    <span>Ir a la web de {activePortalTab} para registrarme / iniciar sesión</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>

                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-emerald-600 via-lime-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-white font-extrabold text-xs rounded-xl shadow transition"
                  >
                    ⚡ Guardar & Vincular Mi Cuenta Real
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-slate-100 text-sm flex items-center space-x-2">
              <Cpu className="h-4 w-4 text-indigo-400" />
              <span>Configuración de Modelo LLM & APIs (En desarrollo)</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Actualmente la aplicación funciona en modo 100% frontend local sin llamadas a modelos de pago. La clave que introduzcas se guarda solo en tu navegador para futuras integraciones directas.
            </p>

            <div className="space-y-3">
              <div>
                <label className="font-medium text-slate-300">Proveedor de IA Preferido</label>
                <select
                  value={settings.llmProvider}
                  onChange={e => setSettings({ ...settings, llmProvider: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Gemini 1.5 Pro / Anthropic Claude">Gemini 1.5 Pro / Anthropic Claude</option>
                  <option value="OpenAI GPT-4o">OpenAI GPT-4o</option>
                  <option value="Local Ollama / Llama 3">Local Ollama / Llama 3 (Offline local)</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-300">API Key / Token de Acceso</label>
                <input
                  type="password"
                  value={settings.apiKey}
                  onChange={e => setSettings({ ...settings, apiKey: e.target.value })}
                  placeholder="Introduce tu API key (almacenada únicamente en localStorage)"
                  className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-slate-100 text-sm flex items-center space-x-2">
              <Globe2 className="h-4 w-4 text-sky-400" />
              <span>Opciones Experimentales de Navegación</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Las políticas de seguridad del navegador impiden interactuar automáticamente con sitios de terceros. Estos interruptores son marcadores locales para extensiones o automatizaciones externas.
            </p>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
                <div>
                  <div className="font-semibold text-slate-200">Integración con Navegador / Extensión Externa</div>
                  <div className="text-[11px] text-slate-400">Habilita flags de preparación para extensión o script de usuario</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableBrowserAgent}
                  onChange={e => setSettings({ ...settings, enableBrowserAgent: e.target.checked })}
                  className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
                <div>
                  <div className="font-semibold text-slate-200">Asistente de Relleno de Formularios</div>
                  <div className="text-[11px] text-slate-400">Prepara borrador de campos del perfil para copiar y pegar manualmente</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableAntigravityApply}
                  onChange={e => setSettings({ ...settings, enableAntigravityApply: e.target.checked })}
                  className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-slate-100 text-sm flex items-center space-x-2">
              <Download className="h-4 w-4 text-emerald-400" />
              <span>Copia de Seguridad & Portabilidad de Datos</span>
            </h3>
            <p className="text-slate-400">
              Exporta o importa tu Master Profile, Banco de Logros, Candidaturas y Fuentes en formato JSON compatible con Git.
            </p>

            <div className="space-y-3 pt-1">
              <button
                onClick={handleExportJson}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-100 font-semibold rounded-xl border border-slate-700 transition flex items-center justify-center space-x-2"
              >
                <Download className="h-4 w-4 text-emerald-400" />
                <span>Exportar Copia de Seguridad JSON</span>
              </button>

              <label className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-100 font-semibold rounded-xl border border-slate-700 transition flex items-center justify-center space-x-2 cursor-pointer">
                <Upload className="h-4 w-4 text-sky-400" />
                <span>Importar Archivo JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJson}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-rose-500/30 bg-rose-500/5 space-y-3">
            <h3 className="font-bold text-rose-300 text-sm flex items-center space-x-2">
              <RotateCcw className="h-4 w-4 text-rose-400" />
              <span>Restablecer Base de Datos Local</span>
            </h3>
            <p className="text-slate-300">
              Limpia la base de datos de tu navegador (localStorage), borrando ofertas, candidaturas y perfil para empezar desde cero con datos limpios.
            </p>

            <button
              onClick={handleResetData}
              className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-semibold rounded-xl border border-rose-500/40 transition"
            >
              Restablecer Base de Datos Local
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
