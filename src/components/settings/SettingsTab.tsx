import React, { useState } from 'react';
import { 
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
import { MASTER_SECTORAL_SOURCES } from '../../services/masterSourceCatalog';

interface SettingsTabProps {
  onRefreshData: () => void;
  onReturnToHub?: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ onRefreshData, onReturnToHub }) => {
  const [activeHQSection, setActiveHQSection] = useState<'sources' | 'accounts' | 'audit_backup'>('sources');
  const [sourceSearch, setSourceSearch] = useState('');
  const [selectedTheater, setSelectedTheater] = useState<'ALL' | 'GERMANY' | 'EUSKADI' | 'REMOTE'>('ALL');

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

  // Extract all sources flattened from MASTER_SECTORAL_SOURCES
  const allMasterSources = MASTER_SECTORAL_SOURCES.flatMap(cat => 
    cat.sources.map(s => ({
      ...s,
      categoryName: cat.sectorName,
      categoryDescription: cat.description
    }))
  );

  const filteredSources = allMasterSources.filter(src => {
    const notesStr = src.notes || '';
    const matchesSearch = !sourceSearch.trim() || 
      src.name.toLowerCase().includes(sourceSearch.toLowerCase()) ||
      notesStr.toLowerCase().includes(sourceSearch.toLowerCase()) ||
      src.categoryName.toLowerCase().includes(sourceSearch.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedTheater === 'GERMANY') {
      const txt = (src.name + ' ' + notesStr + ' ' + src.url).toLowerCase();
      return txt.includes('germany') || txt.includes('alemania') || txt.includes('de') || txt.includes('xing') || txt.includes('stepstone') || txt.includes('euraxess');
    }
    if (selectedTheater === 'EUSKADI') {
      const txt = (src.name + ' ' + notesStr + ' ' + src.url).toLowerCase();
      return txt.includes('euskadi') || txt.includes('bilbao') || txt.includes('españa') || txt.includes('spain') || txt.includes('bc3') || txt.includes('tecnalia') || txt.includes('neiker') || txt.includes('idom');
    }
    if (selectedTheater === 'REMOTE') {
      const txt = (src.name + ' ' + notesStr + ' ' + src.url).toLowerCase();
      return txt.includes('remot') || txt.includes('global') || txt.includes('onu') || txt.includes('un') || txt.includes('climate') || txt.includes('brussels');
    }
    return true;
  });

  return (
    <div className="space-y-5 animate-fadeIn text-slate-100">
      {/* Rainbow Six Siege Tactical Top Bar & Sub-Nav Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between p-4 rounded-2xl bg-[#0a0f1d]/95 border border-slate-700/80 shadow-2xl backdrop-blur-md gap-4">
        <div className="flex items-center gap-3">
          {onReturnToHub && (
            <button
              onClick={onReturnToHub}
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 hover:border-red-500 transition flex items-center gap-1.5 cursor-pointer shadow"
              title="Volver a la consola central Career"
            >
              <ChevronLeft className="h-4 w-4 text-red-500" />
              <span>« CAREER HUB</span>
            </button>
          )}

          <div className="h-9 w-9 rounded-xl bg-red-600/10 text-red-400 flex items-center justify-center border border-red-500/30 shrink-0">
            <Building2 className="h-5 w-5" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-black text-white flex items-center gap-2 font-mono uppercase tracking-tight">
                HQ // CUARTEL GENERAL & MATRIZ DE FUENTES
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-600 font-extrabold hidden sm:inline-block">
                25+ PORTALES ACTIVOS
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-sans">
              Centro de comando de fuentes oficiales, credenciales de portales y auditoría de integridad.
            </p>
          </div>
        </div>

        {/* HQ Sub-Station Switcher & Save Button */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveHQSection('sources')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeHQSection === 'sources'
                  ? 'bg-red-600 text-white shadow font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Globe2 className="h-3.5 w-3.5" />
              <span>MATRIZ FUENTES (25+)</span>
            </button>

            <button
              onClick={() => setActiveHQSection('accounts')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeHQSection === 'accounts'
                  ? 'bg-red-600 text-white shadow font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>MIS CUENTAS ({portals.length})</span>
            </button>

            <button
              onClick={() => setActiveHQSection('audit_backup')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeHQSection === 'audit_backup'
                  ? 'bg-red-600 text-white shadow font-black'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Download className="h-3.5 w-3.5" />
              <span>BACKUP & AUDITORÍA</span>
            </button>
          </div>

          <button
            onClick={handleSaveSettings}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-xs rounded-xl border border-slate-600 shadow transition flex items-center space-x-1.5 cursor-pointer shrink-0"
            title="Guardar cambios de configuración"
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>GUARDADO</span>
              </>
            ) : (
              <span>GUARDAR HQ</span>
            )}
          </button>
        </div>
      </div>

      {importStatus && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>{importStatus}</span>
        </div>
      )}

      {/* =========================================================
       * HQ SECTION 1: SOURCES MATRIX (CUARTEL GENERAL CON TODAS LAS FUENTES)
       * ========================================================= */}
      {activeHQSection === 'sources' && (
        <div className="space-y-4">
          {/* Theater Filter & Search Controls */}
          <div className="p-4 rounded-2xl bg-[#0c1220]/95 border border-slate-700/80 shadow-xl space-y-3">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="relative flex-1 w-full">
                <Search className="h-4 w-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={sourceSearch}
                  onChange={e => setSourceSearch(e.target.value)}
                  placeholder="Buscar fuente por nombre, portal, temática (ej: Euraxess, BC3, Tecnalia, IDOM, Climatebase)..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-sans"
                />
              </div>

              {/* Theater Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 shrink-0 font-mono text-xs">
                <button
                  onClick={() => setSelectedTheater('ALL')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer border ${
                    selectedTheater === 'ALL'
                      ? 'bg-red-600 text-white border-red-500 shadow'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  TODAS ({allMasterSources.length})
                </button>
                <button
                  onClick={() => setSelectedTheater('GERMANY')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer border ${
                    selectedTheater === 'GERMANY'
                      ? 'bg-sky-600 text-white border-sky-400 shadow'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  🇩🇪 ALEMANIA §20
                </button>
                <button
                  onClick={() => setSelectedTheater('EUSKADI')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer border ${
                    selectedTheater === 'EUSKADI'
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  🇪🇸 EUSKADI LEY 14
                </button>
                <button
                  onClick={() => setSelectedTheater('REMOTE')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer border ${
                    selectedTheater === 'REMOTE'
                      ? 'bg-amber-600 text-white border-amber-400 shadow'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  🌐 REMOTO & GOBERNANZA
                </button>
              </div>
            </div>
          </div>

          {/* Grid of Sources */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredSources.map((source) => {
              const isDe = (source.name + ' ' + source.notes).toLowerCase().includes('germany') || (source.name + ' ' + source.notes).toLowerCase().includes('alemania') || source.id.includes('xing') || source.id.includes('stepstone');
              const isEus = (source.name + ' ' + source.notes).toLowerCase().includes('euskadi') || (source.name + ' ' + source.notes).toLowerCase().includes('bilbao') || source.id.includes('bc3') || source.id.includes('tecnalia');
              
              const theaterBadge = isDe 
                ? { label: '§20 AufenthG Priority', bg: 'bg-sky-950 text-sky-300 border-sky-600' }
                : isEus
                ? { label: 'Ley 14/2013 UGE', bg: 'bg-emerald-950 text-emerald-300 border-emerald-600' }
                : { label: 'Remoto / Global UE', bg: 'bg-amber-950 text-amber-300 border-amber-600' };

              return (
                <div
                  key={source.id}
                  className="p-4 rounded-xl bg-[#0c1220]/95 border border-slate-700/80 hover:border-slate-500 shadow-xl transition flex flex-col justify-between space-y-3 group"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 text-[10px] font-mono">
                      <span className="text-red-400 font-bold flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        PORTAL-ID: {source.id.slice(-8).toUpperCase()}
                      </span>
                      <span className={`px-2 py-0.5 rounded border font-extrabold ${theaterBadge.bg}`}>
                        {theaterBadge.label}
                      </span>
                    </div>

                    <h3 className="text-sm font-black text-white font-sans group-hover:text-red-400 transition">
                      {source.name}
                    </h3>
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed font-sans">
                      {source.notes}
                    </p>
                    <div className="text-[10px] font-mono text-slate-400 mt-2">
                      Categoría: <strong className="text-slate-300">{source.categoryName}</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-[10px] text-slate-400">
                      Frecuencia: <strong className="text-slate-200">{source.frequency}</strong>
                    </span>

                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-sky-300 hover:text-white border border-slate-700 hover:border-sky-500 transition flex items-center gap-1.5 font-bold cursor-pointer"
                    >
                      <span>Ingresar al Portal</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================
       * HQ SECTION 2: CONNECTED PORTAL ACCOUNTS
       * ========================================================= */}
      {activeHQSection === 'accounts' && (
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
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 via-lime-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center justify-center space-x-1.5 shrink-0 disabled:opacity-50 cursor-pointer"
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
    )}

      {/* =========================================================
       * HQ SECTION 3: AUDIT, BACKUP & LLM CONFIGURATION
       * ========================================================= */}
      {activeHQSection === 'audit_backup' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs animate-fadeIn">
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-[#0c1220]/95 border border-slate-700/80 shadow-xl space-y-4">
              <h3 className="font-bold text-slate-100 text-sm flex items-center space-x-2">
                <Cpu className="h-4 w-4 text-sky-400" />
                <span>Configuración de Modelo LLM & APIs (En desarrollo)</span>
              </h3>
              <p className="text-[11px] text-slate-300">
                Actualmente la aplicación funciona en modo 100% frontend local sin llamadas a modelos de pago. La clave que introduzcas se guarda solo en tu navegador para futuras integraciones directas.
              </p>

              <div className="space-y-3 font-mono">
                <div>
                  <label className="font-medium text-slate-300">Proveedor de IA Preferido</label>
                  <select
                    value={settings.llmProvider}
                    onChange={e => setSettings({ ...settings, llmProvider: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-red-500"
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
                    className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0c1220]/95 border border-slate-700/80 shadow-xl space-y-4">
              <h3 className="font-bold text-slate-100 text-sm flex items-center space-x-2">
                <Globe2 className="h-4 w-4 text-sky-400" />
                <span>Opciones Experimentales de Navegación</span>
              </h3>
              <p className="text-[11px] text-slate-300">
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
                    className="rounded bg-slate-900 border-slate-700 text-red-600 focus:ring-red-500"
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
                    className="rounded bg-slate-900 border-slate-700 text-red-600 focus:ring-red-500"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-[#0c1220]/95 border border-slate-700/80 shadow-xl space-y-4">
              <h3 className="font-bold text-slate-100 text-sm flex items-center space-x-2">
                <Download className="h-4 w-4 text-emerald-400" />
                <span>Copia de Seguridad & Portabilidad de Datos</span>
              </h3>
              <p className="text-slate-300">
                Exporta o importa tu Master Profile, Banco de Logros, Candidaturas y Fuentes en formato JSON compatible con Git.
              </p>

              <div className="space-y-3 pt-1">
                <button
                  onClick={handleExportJson}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-100 font-semibold rounded-xl border border-slate-700 transition flex items-center justify-center space-x-2 cursor-pointer"
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

            <div className="p-5 rounded-2xl border border-rose-500/30 bg-rose-500/5 space-y-3 shadow-xl">
              <h3 className="font-bold text-rose-300 text-sm flex items-center space-x-2">
                <RotateCcw className="h-4 w-4 text-rose-400" />
                <span>Restablecer Base de Datos Local</span>
              </h3>
              <p className="text-slate-300">
                Limpia la base de datos de tu navegador (localStorage), borrando ofertas, candidaturas y perfil para empezar desde cero con datos limpios.
              </p>

              <button
                onClick={handleResetData}
                className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-semibold rounded-xl border border-rose-500/40 transition cursor-pointer"
              >
                Restablecer Base de Datos Local
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
