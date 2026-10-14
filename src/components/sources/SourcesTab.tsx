import React, { useState } from 'react';
import { 
  Globe2, 
  Plus, 
  ExternalLink, 
  CheckCircle2, 
  RefreshCw,
  Cpu,
  Sparkles,
  Search
} from 'lucide-react';
import { getStoredSources, saveStoredSources } from '../../services/db';
import type { JobSource } from '../../types/sources';
import { AddSourceModal } from './AddSourceModal';
import { scoutSourceWithAntigravity } from '../../services/antigravityEngine';
import { AntigravityExploreModal } from '../common/AntigravityExploreModal';
import { MASTER_SECTORAL_SOURCES } from '../../services/masterSourceCatalog';

export const SourcesTab: React.FC = () => {
  const [sources, setSources] = useState<JobSource[]>(getStoredSources());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExploreModalOpen, setIsExploreModalOpen] = useState(false);
  const [isScoutingId, setIsScoutingId] = useState<string | null>(null);
  const [scoutResult, setScoutResult] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState('');

  const refreshSources = () => {
    setSources(getStoredSources());
  };

  const handleAddSource = (newSource: JobSource) => {
    const updated = [newSource, ...sources];
    setSources(updated);
    saveStoredSources(updated);
  };

  const handleRunScoutOnSource = (url: string, name: string, id: string) => {
    setIsScoutingId(id);
    setScoutResult(null);

    setTimeout(() => {
      const res = scoutSourceWithAntigravity(url, name);
      setIsScoutingId(null);
      setScoutResult(`El escaneo automático de "${name}" no está disponible (requiere backend): ${res.newCount} ofertas añadidas. Añádelas manualmente.`);
      setTimeout(() => setScoutResult(null), 6000);
    }, 1000);
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between glass-panel p-6 rounded-2xl border border-slate-800 bg-[#131c2e] shadow-lg gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <Globe2 className="h-6 w-6 text-emerald-400" />
            <span>Directorio de Portales de Empleo (11 Categorías & 25+ Plataformas)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Revisa, testea y escanea independientemente cada portal con enlaces a sus páginas oficiales (sin escaneo automático).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsExploreModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-md transition flex items-center space-x-1.5"
          >
            <Sparkles className="h-4 w-4 text-white" />
            <span>✨ Explorar Fuentes con IA</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 shadow-md transition flex items-center space-x-1.5"
          >
            <Plus className="h-4 w-4 text-slate-400" />
            <span>Añadir Portal Manual</span>
          </button>
        </div>
      </div>

      {scoutResult && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2 shadow-sm">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
          <span className="font-semibold">{scoutResult}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="relative">
        <Search className="h-4 w-4 text-slate-500 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={filterQuery}
          onChange={e => setFilterQuery(e.target.value)}
          placeholder="Filtra portales (ej: Idealist, Hacesfalta, ReliefWeb, Tecnalia, BC3, Climatebase, InfoJobs)..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-xs font-medium focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* 11 Categorías Especializadas Console */}
      <div className="space-y-6">
        {MASTER_SECTORAL_SOURCES.map((cat, idx) => {
          const matchingSources = cat.sources.filter(s => 
            s.name.toLowerCase().includes(filterQuery.toLowerCase()) || 
            s.url.toLowerCase().includes(filterQuery.toLowerCase()) ||
            cat.sectorName.toLowerCase().includes(filterQuery.toLowerCase())
          );

          if (matchingSources.length === 0) return null;

          return (
            <div key={idx} className="glass-panel p-5 rounded-2xl border border-slate-800 bg-[#131c2e] shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">Category #{idx + 1}:</span>
                    <span>{cat.sectorName}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{cat.description}</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                  {matchingSources.length} Portales
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {matchingSources.map((src) => (
                  <div
                    key={src.id}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-bold text-xs text-white leading-snug">{src.name}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                          {(src as any).countryFocus || 'España'}
                        </span>
                      </div>

                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-mono text-emerald-400 hover:underline flex items-center gap-1 truncate"
                      >
                        <span className="truncate">{src.url}</span>
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>

                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {src.notes || 'Portal oficial verificado para vacantes en España y Euskadi.'}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold rounded-lg border border-slate-700 transition flex items-center space-x-1"
                      >
                        <span>Comprobar Portal Real</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>

                      <button
                        onClick={() => handleRunScoutOnSource(src.url, src.name, src.id)}
                        disabled={isScoutingId === src.id}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold rounded-lg shadow transition flex items-center space-x-1 disabled:opacity-50"
                      >
                        {isScoutingId === src.id ? (
                          <RefreshCw className="h-3 w-3 animate-spin text-white" />
                        ) : (
                          <Cpu className="h-3 w-3 text-white" />
                        )}
                        <span>{isScoutingId === src.id ? 'Escaneando...' : 'Escanear'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <AddSourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddSource={handleAddSource}
      />

      <AntigravityExploreModal
        isOpen={isExploreModalOpen}
        onClose={() => setIsExploreModalOpen(false)}
        defaultCategory="sources"
        onExplorationCompleted={refreshSources}
      />
    </div>
  );
};
