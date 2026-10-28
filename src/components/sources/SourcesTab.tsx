import React, { useState, useEffect } from 'react';
import { 
  Globe2, 
  Plus, 
  ExternalLink, 
  Search,
  Compass,
  Building2,
  Sparkles,
  CalendarCheck,
  Check,
  PlusCircle,
  Eye,
  Clock,
  Layers
} from 'lucide-react';
import { getStoredSources, saveStoredSources, updateSourceManualCheck } from '../../services/db';
import type { JobSource } from '../../types/sources';
import { AddSourceModal } from './AddSourceModal';
import { QuickAddJobModal } from './QuickAddJobModal';
import { AntigravityExploreModal } from '../common/AntigravityExploreModal';
import { MASTER_SECTORAL_SOURCES } from '../../services/masterSourceCatalog';

export const SourcesTab: React.FC = () => {
  const [sources, setSources] = useState<JobSource[]>(getStoredSources());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [selectedSourceForQuickAdd, setSelectedSourceForQuickAdd] = useState<JobSource | null>(null);
  const [isExploreModalOpen, setIsExploreModalOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [activePole, setActivePole] = useState<string>('all');
  const [justCheckedId, setJustCheckedId] = useState<string | null>(null);

  // Load stored sources and keep local check state synchronized
  const refreshSources = () => {
    setSources(getStoredSources());
  };

  useEffect(() => {
    refreshSources();
  }, []);

  const handleAddSource = (newSource: JobSource) => {
    const updated = [newSource, ...sources];
    setSources(updated);
    saveStoredSources(updated);
  };

  const handleMarkChecked = (srcId: string) => {
    const updated = updateSourceManualCheck(srcId);
    setSources(updated);
    setJustCheckedId(srcId);
    setTimeout(() => setJustCheckedId(null), 2500);
  };

  const openQuickAddForSource = (src: JobSource) => {
    setSelectedSourceForQuickAdd(src);
    setIsQuickAddOpen(true);
  };

  // Format check state
  const getCheckStatusBadge = (srcId: string) => {
    const stored = sources.find(s => s.id === srcId);
    const checkDateStr = stored?.lastManualCheck;

    if (!checkDateStr) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
          <Clock className="w-3 h-3 text-slate-500" />
          <span>Pendiente de revisar</span>
        </span>
      );
    }

    const checkDate = new Date(checkDateStr);
    const today = new Date();
    const isToday = checkDate.toDateString() === today.toDateString();

    if (isToday) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          <Check className="w-3 h-3 text-emerald-400" />
          <span>Revisado hoy</span>
        </span>
      );
    }

    const diffDays = Math.floor((today.getTime() - checkDate.getTime()) / (1000 * 3600 * 24));
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
        <CalendarCheck className="w-3 h-3 text-amber-400" />
        <span>Revisado hace {diffDays} {diffDays === 1 ? 'día' : 'días'}</span>
      </span>
    );
  };

  // Filter categories and sources
  const poles = [
    { id: 'all', label: 'Todos los Radares', icon: Layers },
    { id: 'euskadi', label: '🌿 Polo Euskadi & España', icon: Compass },
    { id: 'germany', label: '🏛️ Polo Alemania & DACH', icon: Building2 },
    { id: 'europe', label: '🌍 Redes UE & Movilidad', icon: Globe2 },
    { id: 'purpose', label: '✨ Empleo con Propósito', icon: Sparkles }
  ];

  return (
    <div className="space-y-6 text-slate-100 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl border border-slate-700/60 bg-gradient-to-r from-slate-900 via-[#131c2e] to-sky-950/40 shadow-xl gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" /> Hub de Búsqueda Manual Directa
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" /> 100% Sin Alucinaciones
            </span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <Globe2 className="h-6 w-6 text-emerald-400" />
            <span>Radares & Portales Institucionales de Empleo</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Directorio maestro para tu exploración activa. Accede con un clic a las bolsas de empleo oficiales de centros de I+D (BC3, Tecnalia, NEIKER, Thünen, UBA) y registra con precisión las convocatorias que encuentres.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setSelectedSourceForQuickAdd(null);
              setIsQuickAddOpen(true);
            }}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Registrar Vacante Encontrada</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 shadow-md transition flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4 text-slate-400" />
            <span>Añadir Nuevo Portal</span>
          </button>
        </div>
      </div>

      {/* Filter and Pole Bar */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {poles.map(p => {
            const Icon = p.icon;
            const isActive = activePole === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActivePole(p.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 border ${
                  isActive
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-700/70'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>

        <div className="relative">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={filterQuery}
            onChange={e => setFilterQuery(e.target.value)}
            placeholder="Filtrar radares por nombre, región o temática (ej: BC3, Tecnalia, Thünen, Edafología, Suelos, Clima, Euskadi)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-400 text-xs font-medium focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Grid of Sectoral Sources */}
      <div className="space-y-6">
        {MASTER_SECTORAL_SOURCES.map((cat, idx) => {
          // Filter by active pole
          if (activePole === 'euskadi' && !cat.sectorName.includes('Euskadi')) return null;
          if (activePole === 'germany' && !cat.sectorName.includes('Alemania')) return null;
          if (activePole === 'europe' && !cat.sectorName.includes('Unión Europea') && !cat.sectorName.includes('Movilidad')) return null;
          if (activePole === 'purpose' && !cat.sectorName.includes('Propósito') && !cat.sectorName.includes('Cooperación')) return null;

          const matchingSources = cat.sources.filter(s => 
            s.name.toLowerCase().includes(filterQuery.toLowerCase()) || 
            s.url.toLowerCase().includes(filterQuery.toLowerCase()) ||
            cat.sectorName.toLowerCase().includes(filterQuery.toLowerCase()) ||
            (s.notes && s.notes.toLowerCase().includes(filterQuery.toLowerCase())) ||
            (s.region && s.region.toLowerCase().includes(filterQuery.toLowerCase()))
          );

          if (matchingSources.length === 0) return null;

          return (
            <div key={idx} className="p-5 rounded-2xl border border-slate-800 bg-[#101726] shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">Radar #{idx + 1}:</span>
                    <span>{cat.sectorName}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{cat.description}</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                  {matchingSources.length} Portales
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {matchingSources.map((src) => {
                  const isJustChecked = justCheckedId === src.id;

                  return (
                    <div
                      key={src.id}
                      className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-3 group"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-xs text-white leading-snug group-hover:text-emerald-300 transition">
                            {src.name}
                          </h4>
                          <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                            {src.countryFocus || src.region || 'Oficial'}
                          </span>
                        </div>

                        {/* Status & Frequency Badges */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          {getCheckStatusBadge(src.id)}
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-500/10 text-sky-300 border border-sky-500/20">
                            {src.frequency || 'Semanal'}
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

                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {src.notes || 'Portal oficial verificado para búsqueda manual.'}
                        </p>

                        {src.typicalDeadlinesNotes && (
                          <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 text-[10px] text-slate-400">
                            <span className="font-semibold text-slate-300">Convocatorias: </span>
                            {src.typicalDeadlinesNotes}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons for Manual Scouting */}
                      <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
                        <div className="grid grid-cols-2 gap-2">
                          <a
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full px-2.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-semibold rounded-lg shadow transition flex items-center justify-center gap-1"
                          >
                            <span>Abrir Portal</span>
                            <ExternalLink className="h-3 w-3 shrink-0" />
                          </a>

                          <button
                            onClick={() => handleMarkChecked(src.id)}
                            className={`w-full px-2.5 py-1.5 text-[11px] font-semibold rounded-lg border transition flex items-center justify-center gap-1 ${
                              isJustChecked
                                ? 'bg-emerald-600 text-white border-emerald-500'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                            }`}
                          >
                            <Check className="h-3 w-3 shrink-0" />
                            <span>{isJustChecked ? '¡Anotado!' : 'Revisado hoy'}</span>
                          </button>
                        </div>

                        <button
                          onClick={() => openQuickAddForSource(src)}
                          className="w-full px-3 py-1.5 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold rounded-lg transition flex items-center justify-center gap-1.5"
                        >
                          <PlusCircle className="h-3.5 w-3.5 text-emerald-400" />
                          <span>Registrar vacante aquí</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <QuickAddJobModal
        isOpen={isQuickAddOpen}
        onClose={() => {
          setIsQuickAddOpen(false);
          setSelectedSourceForQuickAdd(null);
        }}
        defaultSource={selectedSourceForQuickAdd}
        onJobAdded={refreshSources}
      />

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
