import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Building2, 
  Search, 
  PlusCircle,
  Eye,
  Trash2,
  Cpu,
  Globe2,
  Star,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  FileText
} from 'lucide-react';
import { getStoredOffers, saveStoredOffers } from '../../services/db';
import type { JobOffer } from '../../types/offers';
import { MatchRationaleModal } from './MatchRationaleModal';
import { AddOfferModal } from './AddOfferModal';
import { WebsitePreviewModal } from '../common/WebsitePreviewModal';
import { AntigravityExploreModal } from '../common/AntigravityExploreModal';
import { runAutonomousGlobalSearch } from '../../services/antigravitySearchEngine';
import { searchRealPublicJobs } from '../../services/publicJobApis';
import { FiveStepPipelineModal } from './FiveStepPipelineModal';
import { TacticalHelpAndProtocolModal } from '../common/TacticalHelpAndProtocolModal';
import { checkUrlLiveness } from '../../services/liveWebScraper';

interface OffersTabProps {
  initialLocationFilter?: string;
  onStartApplication: (offerId: string) => void;
  onOpenStudio?: (offerId: string) => void;
}

export const OffersTab: React.FC<OffersTabProps> = ({ 
  initialLocationFilter = 'ALL',
  onStartApplication,
  onOpenStudio
}) => {
  const [offers, setOffers] = useState<JobOffer[]>(getStoredOffers());
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);

  const [selectedOfferForRationale, setSelectedOfferForRationale] = useState<JobOffer | null>(null);
  const [selectedOfferForPipeline, setSelectedOfferForPipeline] = useState<JobOffer | null>(null);
  const [selectedOfferForPreview, setSelectedOfferForPreview] = useState<JobOffer | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExploreModalOpen, setIsExploreModalOpen] = useState(false);
  const [isProtocolModalOpen, setIsProtocolModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [minScoreFilter, setMinScoreFilter] = useState<number>(0);
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<string>(
    initialLocationFilter === 'HIGH_MATCH' ? 'ALL' : initialLocationFilter
  );
  const [includeRemote, setIncludeRemote] = useState<boolean>(true);

  const [isSearchingAi, setIsSearchingAi] = useState(false);
  const [isPurgingLinks, setIsPurgingLinks] = useState(false);
  const [searchResultSummary, setSearchResultSummary] = useState<string | null>(null);

  useEffect(() => {
    const current = getStoredOffers();
    if (current.length === 0) {
      setIsSearchingAi(true);
      searchRealPublicJobs('').then(res => {
        if (res.offers.length > 0) {
          setOffers(res.offers);
          saveStoredOffers(res.offers);
        }
        setIsSearchingAi(false);
      }).catch(() => setIsSearchingAi(false));
    }
  }, []);

  useEffect(() => {
    if (initialLocationFilter === 'HIGH_MATCH') {
      setMinScoreFilter(70);
      setSelectedLocationFilter('ALL');
    } else if (initialLocationFilter) {
      setSelectedLocationFilter(initialLocationFilter);
      setMinScoreFilter(0);
    }
  }, [initialLocationFilter]);

  const refreshOffers = () => {
    setOffers(getStoredOffers());
  };

  const handleOfferAdded = (newOffer: JobOffer) => {
    const updated = [newOffer, ...offers];
    setOffers(updated);
    saveStoredOffers(updated);
    setSelectedOfferId(newOffer.id);
  };

  const handleDeleteOffer = (id: string) => {
    const updated = offers.filter(o => o.id !== id);
    setOffers(updated);
    saveStoredOffers(updated);
    if (selectedOfferId === id) {
      setSelectedOfferId(updated[0]?.id || null);
    }
  };

  const handleToggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = offers.map(o => {
      if (o.id === id) {
        return { ...o, isFavorite: !o.isFavorite };
      }
      return o;
    });
    setOffers(updated);
    saveStoredOffers(updated);
  };

  const handleRunAutonomousSearch = async (query?: string) => {
    const targetQuery = query !== undefined ? query : searchQuery;
    setIsSearchingAi(true);
    setSearchResultSummary(null);

    const res = await runAutonomousGlobalSearch(targetQuery);
    setOffers(res.offers);
    setIsSearchingAi(false);
    setSearchResultSummary(res.summary);

    setTimeout(() => setSearchResultSummary(null), 7000);
  };

  const handlePurgeDeadLinks = async () => {
    setIsPurgingLinks(true);
    setSearchResultSummary('🛡️ Verificando enlaces y depurando vacantes no disponibles...');

    const currentStored = getStoredOffers();
    const validOffers: JobOffer[] = [];
    let deadCount = 0;

    for (const offer of currentStored) {
      if (!offer.url || offer.url.includes('invalid') || offer.url.includes('404')) {
        deadCount++;
        continue;
      }
      const isAlive = await checkUrlLiveness(offer.url);
      if (isAlive) {
        validOffers.push(offer);
      } else {
        deadCount++;
      }
    }

    setOffers(validOffers);
    saveStoredOffers(validOffers);
    setIsPurgingLinks(false);
    setSearchResultSummary(`🛡️ Depuración completada: ${deadCount} enlaces descartados, ${validOffers.length} vacantes vigentes confirmadas.`);
    setTimeout(() => setSearchResultSummary(null), 8000);
  };

  // Filtered offers computation
  const filteredOffers = useMemo(() => {
    return offers.filter(offer => {
      const locLower = (offer.location || '').toLowerCase();
      const titleLower = (offer.title || '').toLowerCase();
      const companyLower = (offer.company || '').toLowerCase();
      const isRemoteOffer = offer.isRemote || locLower.includes('remoto') || locLower.includes('remote');

      // 1. Text Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery = 
          titleLower.includes(q) || 
          companyLower.includes(q) || 
          locLower.includes(q) || 
          offer.requirements.some(r => r.toLowerCase().includes(q));
        if (!matchesQuery) return false;
      }

      // 2. Score Filter
      const score = offer.matchScore?.totalScore || 0;
      if (score < minScoreFilter) return false;

      // 3. Location / Favorite Category Filters
      if (selectedLocationFilter === 'FAVORITES') {
        return !!offer.isFavorite;
      }

      if (selectedLocationFilter === 'GERMANY') {
        const isGermany = locLower.includes('alemania') || locLower.includes('germany') || locLower.includes('kiel') || locLower.includes('potsdam') || locLower.includes('berlin');
        return isGermany || (includeRemote && isRemoteOffer);
      }

      if (selectedLocationFilter === 'BILBAO') {
        const isBilbao = locLower.includes('bilbao') || locLower.includes('bizkaia') || offer.isBilbaoLocation;
        return isBilbao || (includeRemote && isRemoteOffer);
      }

      if (selectedLocationFilter === 'EUSKADI') {
        const isEuskadi = locLower.includes('bilbao') || locLower.includes('bizkaia') || locLower.includes('donostia') || locLower.includes('gasteiz') || locLower.includes('euskadi');
        return isEuskadi || (includeRemote && isRemoteOffer);
      }

      if (selectedLocationFilter === 'REMOTE_ONLY') {
        return isRemoteOffer;
      }

      return true;
    }).sort((a, b) => {
      // Favorites first, then match score descending
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return (b.matchScore?.totalScore || 0) - (a.matchScore?.totalScore || 0);
    });
  }, [offers, searchQuery, minScoreFilter, selectedLocationFilter, includeRemote]);

  // Keep a selected offer
  useEffect(() => {
    if (filteredOffers.length > 0) {
      if (!selectedOfferId || !filteredOffers.some(o => o.id === selectedOfferId)) {
        setSelectedOfferId(filteredOffers[0].id);
      }
    } else {
      setSelectedOfferId(null);
    }
  }, [filteredOffers, selectedOfferId]);

  const activeSelectedOffer = useMemo(() => {
    return filteredOffers.find(o => o.id === selectedOfferId) || filteredOffers[0] || null;
  }, [filteredOffers, selectedOfferId]);

  // Category counts
  const favCount = useMemo(() => offers.filter(o => o.isFavorite).length, [offers]);
  const germanyCount = useMemo(() => offers.filter(o => {
    const l = (o.location || '').toLowerCase();
    return l.includes('alemania') || l.includes('germany') || l.includes('kiel') || l.includes('berlin');
  }).length, [offers]);
  const euskadiCount = useMemo(() => offers.filter(o => {
    const l = (o.location || '').toLowerCase();
    return l.includes('bilbao') || l.includes('bizkaia') || l.includes('donostia') || l.includes('euskadi');
  }).length, [offers]);
  const remoteCount = useMemo(() => offers.filter(o => o.isRemote || (o.location || '').toLowerCase().includes('remoto')).length, [offers]);

  return (
    <div className="space-y-4 text-[var(--text-primary)] font-sans animate-fadeIn">

      {/* =========================================================================
       * 1. TOOLBAR SUPERIOR COMPACTO: BÚSQUEDA, FILTROS RÁPIDOS & ACCIONES
       * ========================================================================= */}
      <div className="p-4 rounded-2xl bg-[var(--panel-bg)] border border-[var(--panel-border)] shadow-sm backdrop-blur-md space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="h-4 w-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleRunAutonomousSearch()}
              placeholder="Buscar por puesto, empresa o tecnología (ej. Carbon, R, Python, Geofísica)..."
              className="w-full pl-10 pr-4 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] font-medium focus:outline-none focus:border-sky-500 shadow-sm"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => handleRunAutonomousSearch()}
              disabled={isSearchingAi}
              className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-mono font-bold text-xs rounded-xl shadow-sm transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
              title="Consultar APIs públicas de empleo en tiempo real"
            >
              {isSearchingAi ? <Cpu className="h-3.5 w-3.5 animate-spin" /> : <Globe2 className="h-3.5 w-3.5" />}
              <span>{isSearchingAi ? 'Buscando...' : 'Buscar en APIs'}</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3 py-2 bg-[var(--card-bg)] hover:bg-[var(--panel-bg)] border border-[var(--panel-border)] hover:border-sky-500 text-[var(--text-primary)] font-mono font-bold text-xs rounded-xl transition flex items-center space-x-1.5 cursor-pointer shadow-sm"
              title="Añadir vacante manualmente"
            >
              <PlusCircle className="h-3.5 w-3.5 text-sky-600" />
              <span className="hidden sm:inline">Añadir</span>
            </button>

            <button
              onClick={handlePurgeDeadLinks}
              disabled={isPurgingLinks}
              className="p-2 bg-[var(--card-bg)] hover:bg-rose-500/10 border border-[var(--panel-border)] hover:border-rose-500 text-[var(--text-muted)] hover:text-rose-500 rounded-xl transition cursor-pointer shadow-sm"
              title="Verificar y purgar enlaces caídos"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filter Pills Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--panel-border)] text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedLocationFilter('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                selectedLocationFilter === 'ALL'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)] hover:border-sky-500'
              }`}
            >
              Todas ({offers.length})
            </button>

            <button
              onClick={() => setSelectedLocationFilter('FAVORITES')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1 cursor-pointer ${
                selectedLocationFilter === 'FAVORITES'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-[var(--card-bg)] text-amber-500 border border-[var(--card-border)] hover:border-amber-500'
              }`}
            >
              <Star className="h-3 w-3 fill-amber-500" />
              <span>Favoritas ({favCount})</span>
            </button>

            <button
              onClick={() => setSelectedLocationFilter('GERMANY')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1 cursor-pointer ${
                selectedLocationFilter === 'GERMANY'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)] hover:border-sky-500'
              }`}
            >
              <span>🇩🇪 DACH (§20)</span>
              <span className="opacity-80">({germanyCount})</span>
            </button>

            <button
              onClick={() => setSelectedLocationFilter('BILBAO')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1 cursor-pointer ${
                selectedLocationFilter === 'BILBAO'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)] hover:border-emerald-500'
              }`}
            >
              <span>📍 Euskadi (Ley 14)</span>
              <span className="opacity-80">({euskadiCount})</span>
            </button>

            <button
              onClick={() => setSelectedLocationFilter('REMOTE_ONLY')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1 cursor-pointer ${
                selectedLocationFilter === 'REMOTE_ONLY'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border border-[var(--card-border)] hover:border-emerald-500'
              }`}
            >
              <span>🌐 Remoto</span>
              <span className="opacity-80">({remoteCount})</span>
            </button>
          </div>

          {/* Minimum Score Selector & Include Remote */}
          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-1.5 cursor-pointer text-xs font-mono text-[var(--text-muted)] font-medium">
              <input
                type="checkbox"
                checked={includeRemote}
                onChange={e => setIncludeRemote(e.target.checked)}
                className="rounded border-[var(--card-border)] text-sky-600 focus:ring-sky-500 h-3.5 w-3.5"
              />
              <span className="hidden sm:inline">Incluir Remoto</span>
            </label>

            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] font-mono text-[var(--text-muted)] font-bold">Afinidad:</span>
              <select
                value={minScoreFilter}
                onChange={e => setMinScoreFilter(Number(e.target.value))}
                aria-label="Filtrar por afinidad mínima"
                className="px-2.5 py-1 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg text-xs font-mono font-bold text-[var(--text-primary)] focus:outline-none focus:border-sky-500 shadow-sm"
              >
                <option value={0}>Todas</option>
                <option value={50}>&gt;= 50%</option>
                <option value={70}>&gt;= 70%</option>
                <option value={85}>&gt;= 85%</option>
              </select>
            </div>
          </div>
        </div>

        {searchResultSummary && (
          <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs font-mono text-sky-600 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>{searchResultSummary}</span>
          </div>
        )}
      </div>

      {/* =========================================================================
       * 2. CONSOLA DIVIDIDA (MASTER-DETAIL): LISTA TÁCTICA (40%) + INSPECCIÓN (60%)
       * ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[calc(100vh-250px)]">
        
        {/* COLUMNA IZQUIERDA: LISTA COMPACTA DE VACANTES (5 cols) */}
        <div className="lg:col-span-5 flex flex-col h-[calc(100vh-260px)] overflow-hidden rounded-2xl bg-[var(--panel-bg)] border border-[var(--panel-border)] p-3 shadow-sm backdrop-blur-md">
          <div className="flex items-center justify-between px-2 pb-2.5 border-b border-[var(--panel-border)] text-xs font-mono font-bold text-[var(--text-muted)]">
            <span>VACANTES DISPONIBLES ({filteredOffers.length})</span>
            <span className="text-[10px]">ORDEN: AFINIDAD</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 py-2 pr-1">
            {filteredOffers.length === 0 ? (
              <div className="p-8 text-center text-xs text-[var(--text-muted)] space-y-2">
                <Search className="h-8 w-8 mx-auto opacity-40" />
                <p>No se encontraron vacantes con los filtros actuales.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setMinScoreFilter(0);
                    setSelectedLocationFilter('ALL');
                  }}
                  className="px-3 py-1 bg-sky-600 text-white rounded-lg font-mono text-xs cursor-pointer"
                >
                  Restablecer Filtros
                </button>
              </div>
            ) : (
              filteredOffers.map(offer => {
                const isSelected = activeSelectedOffer?.id === offer.id;
                const score = offer.matchScore?.totalScore || 0;
                const isGermany = (offer.location || '').toLowerCase().includes('alemania') || (offer.location || '').toLowerCase().includes('kiel');
                const isBilbao = (offer.location || '').toLowerCase().includes('bilbao') || (offer.location || '').toLowerCase().includes('euskadi');
                const isRemote = offer.isRemote || (offer.location || '').toLowerCase().includes('remoto');

                const scoreBadgeColor = 
                  score >= 75 ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' :
                  score >= 50 ? 'bg-sky-500/10 text-sky-600 border-sky-500/30' :
                  'bg-slate-500/10 text-[var(--text-muted)] border-slate-500/30';

                return (
                  <div
                    key={offer.id}
                    onClick={() => setSelectedOfferId(offer.id)}
                    className={`p-3 rounded-xl border transition cursor-pointer relative group flex items-start justify-between gap-3 ${
                      isSelected 
                        ? 'bg-[var(--card-bg)] border-sky-500 shadow-sm ring-1 ring-sky-500/30' 
                        : 'bg-[var(--card-bg)] border-[var(--card-border)] hover:border-sky-400/60'
                    }`}
                  >
                    {/* Score Indicator */}
                    <div className={`h-10 w-10 rounded-xl border flex flex-col items-center justify-center shrink-0 font-mono font-black ${scoreBadgeColor}`}>
                      <span className="text-xs leading-none">{score}%</span>
                      <span className="text-[7px] uppercase font-bold tracking-tighter">Match</span>
                    </div>

                    {/* Title & Metadata */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs">{isGermany ? '🇩🇪' : isBilbao ? '🇪🇸' : isRemote ? '🌐' : '🌍'}</span>
                        <h4 className="text-xs font-bold text-[var(--text-primary)] truncate group-hover:text-sky-600 transition">
                          {offer.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
                        <span className="font-semibold text-[var(--text-secondary)] truncate flex items-center gap-1">
                          <Building2 className="h-3 w-3 text-sky-600" />
                          {offer.company}
                        </span>
                        <span>•</span>
                        <span className="truncate flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-emerald-500" />
                          {offer.location}
                        </span>
                      </div>

                      {/* Small Chips */}
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {isGermany && (
                          <span className="text-[8px] font-mono font-bold px-1.5 py-0.2 rounded bg-sky-500/10 text-sky-600 border border-sky-500/20">
                            DACH §20
                          </span>
                        )}
                        {isBilbao && (
                          <span className="text-[8px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            Ley 14
                          </span>
                        )}
                        {isRemote && (
                          <span className="text-[8px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20">
                            Remoto
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Star Button */}
                    <button
                      onClick={(e) => handleToggleFavorite(offer.id, e)}
                      className="p-1 rounded-lg text-slate-400 hover:text-amber-500 transition cursor-pointer shrink-0"
                      title={offer.isFavorite ? 'Quitar de favoritas' : 'Marcar como favorita (⭐)'}
                    >
                      <Star className={`h-4 w-4 ${offer.isFavorite ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: PANEL DE INSPECCIÓN TÉCNICA (7 cols) */}
        <div className="lg:col-span-7 h-[calc(100vh-260px)] overflow-y-auto rounded-2xl bg-[var(--panel-bg)] border border-[var(--panel-border)] p-6 shadow-sm backdrop-blur-md flex flex-col justify-between space-y-5">
          {activeSelectedOffer ? (
            <div className="space-y-5">
              
              {/* Header de la Vacante Inspeccionada */}
              <div className="border-b border-[var(--panel-border)] pb-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-600 border border-sky-500/20 font-bold uppercase">
                      Portal: {activeSelectedOffer.sourceName}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-bold">
                      Vigente y Verificada
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => handleToggleFavorite(activeSelectedOffer.id)}
                      className={`p-1.5 rounded-lg border border-[var(--panel-border)] transition cursor-pointer ${
                        activeSelectedOffer.isFavorite 
                          ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' 
                          : 'bg-[var(--card-bg)] text-slate-400 hover:text-amber-500'
                      }`}
                      title="Marcar como favorita"
                    >
                      <Star className={`h-4 w-4 ${activeSelectedOffer.isFavorite ? 'fill-amber-500' : ''}`} />
                    </button>

                    {activeSelectedOffer.url && (
                      <button
                        onClick={() => setSelectedOfferForPreview(activeSelectedOffer)}
                        className="p-1.5 rounded-lg border border-[var(--panel-border)] bg-[var(--card-bg)] text-sky-600 hover:bg-sky-500/10 transition cursor-pointer"
                        title="Ver en vista previa web"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (window.confirm(`¿Deseas eliminar "${activeSelectedOffer.title}"?`)) {
                          handleDeleteOffer(activeSelectedOffer.id);
                        }
                      }}
                      className="p-1.5 rounded-lg border border-[var(--panel-border)] bg-[var(--card-bg)] text-slate-400 hover:text-rose-500 transition cursor-pointer"
                      title="Eliminar vacante"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <h2 className="text-xl font-black text-[var(--text-primary)] font-sans">
                  {activeSelectedOffer.title}
                </h2>

                <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-secondary)] font-medium">
                  <span className="flex items-center gap-1.5 font-bold text-[var(--text-primary)]">
                    <Building2 className="h-4 w-4 text-sky-600" />
                    {activeSelectedOffer.company}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-emerald-500" />
                    {activeSelectedOffer.location}
                  </span>
                  {activeSelectedOffer.publishedDate && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1.5 text-[var(--text-muted)] font-mono">
                        <Clock className="h-3.5 w-3.5" />
                        {activeSelectedOffer.publishedDate}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Telemetría de Afinidad & Desglose Explicable */}
              <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-2">
                  <span className="text-xs font-mono font-black uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-emerald-500" />
                    <span>RADIOGRAFÍA DE AFINIDAD TÉCNICA</span>
                  </span>
                  <span className="text-sm font-mono font-black text-emerald-600">
                    {activeSelectedOffer.matchScore?.totalScore || 0}% TOTAL
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-[var(--panel-bg)] border border-[var(--card-border)]">
                    <div className="text-[10px] text-[var(--text-muted)] uppercase">Habilidades Fit</div>
                    <div className="text-sm font-bold text-sky-600 font-mono mt-0.5">
                      {activeSelectedOffer.matchScore?.skillFitScore || 0} / 35 pts
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[var(--panel-bg)] border border-[var(--card-border)]">
                    <div className="text-[10px] text-[var(--text-muted)] uppercase">Ubicación / Ley</div>
                    <div className="text-sm font-bold text-emerald-600 font-mono mt-0.5">
                      {activeSelectedOffer.matchScore?.locationScore || 0} / 25 pts
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[var(--panel-bg)] border border-[var(--card-border)]">
                    <div className="text-[10px] text-[var(--text-muted)] uppercase">Salario / Rango</div>
                    <div className="text-sm font-bold text-purple-600 font-mono mt-0.5">
                      {activeSelectedOffer.matchScore?.salaryScore || 0} / 15 pts
                    </div>
                  </div>
                </div>

                {/* Coincidencias de Competencias */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-mono text-[var(--text-muted)] font-bold">
                    Competencias Identificadas en tu Perfil:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(activeSelectedOffer.matchScore?.matchingSkills || []).length > 0 ? (
                      activeSelectedOffer.matchScore?.matchingSkills.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>{s}</span>
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-[var(--text-muted)] font-sans italic">
                        Sin coincidencia directa en texto. Revisa la adaptación curricular.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Marco Legal & Viabilidad de Contratación */}
              <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span className="text-sky-600 uppercase flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4" />
                    <span>MARCO LEGAL & VÍA DE CONTRATACIÓN</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-600 font-bold">
                    DOBLE M.SC. COMPATIBLE
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans">
                  {(activeSelectedOffer.location || '').toLowerCase().includes('alemania') || (activeSelectedOffer.location || '').toLowerCase().includes('kiel')
                    ? 'Alemania (§20 AufenthG - Investigación y Ciencia): Tu Doble M.Sc. en CAU Kiel otorga elegibilidad directa para contratos de investigación sin cuotas restrictivas y con vía expedita a EU Blue Card.'
                    : (activeSelectedOffer.location || '').toLowerCase().includes('bilbao') || (activeSelectedOffer.location || '').toLowerCase().includes('euskadi')
                    ? 'España (Ley 14/2013 - UGE): Profesionales altamente cualificados en centros I+D+i vascos (BC3, Tecnalia, Neiker) con resolución administrativa en plazo legal de 20 días hábiles.'
                    : 'Modalidad Remota Europea: Contrato de servicios técnicos o nómina internacional bajo directivas de teletrabajo de la Unión Europea.'}
                </p>
              </div>

              {/* Requisitos y Tecnologías Clave */}
              {activeSelectedOffer.requirements && activeSelectedOffer.requirements.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Requisitos Extraídos de la Oferta:
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {activeSelectedOffer.requirements.map((req, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-[var(--card-bg)] border border-[var(--card-border)] text-xs text-[var(--text-secondary)]">
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Descripción de la Vacante */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Descripción Oficial del Puesto:
                </h3>
                <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-xs text-[var(--text-secondary)] leading-relaxed font-sans max-h-48 overflow-y-auto whitespace-pre-line shadow-inner">
                  {activeSelectedOffer.rawDescription || 'No se incluye descripción detallada en la ficha pública.'}
                </div>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-[var(--text-muted)] space-y-3">
              <Layers className="h-12 w-12 opacity-30" />
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                Selecciona una vacante para inspeccionar
              </h3>
              <p className="text-xs max-w-sm leading-relaxed">
                Haz clic en cualquier oferta de la lista izquierda para desplegar su radiografía técnica, desglose de afinidad y marco de visado sin abrir popups.
              </p>
            </div>
          )}

          {/* Sticky Bottom Action Bar */}
          {activeSelectedOffer && (
            <div className="pt-4 border-t border-[var(--panel-border)] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[var(--panel-bg)] sticky bottom-0">
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  onClick={() => setSelectedOfferForRationale(activeSelectedOffer)}
                  className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-[var(--card-bg)] hover:bg-[var(--panel-bg)] border border-[var(--panel-border)] hover:border-sky-500 text-xs font-mono font-bold transition cursor-pointer text-[var(--text-primary)]"
                >
                  Ver Justificación
                </button>

                {activeSelectedOffer.url && (
                  <a
                    href={activeSelectedOffer.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-[var(--card-bg)] hover:bg-[var(--panel-bg)] border border-[var(--panel-border)] hover:border-sky-500 text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 text-sky-600"
                  >
                    <span>Web Oficial</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}

                {onOpenStudio && (
                  <button
                    onClick={() => onOpenStudio(activeSelectedOffer.id)}
                    className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Abrir y adaptar en CV Studio A4"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>Adaptar en CV Studio</span>
                  </button>
                )}

              </div>

              <button
                onClick={() => {
                  onStartApplication(activeSelectedOffer.id);
                  setSelectedOfferForPipeline(activeSelectedOffer);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-mono font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Sparkles className="h-4 w-4 text-white" />
                <span>⚡ Preparar Postulación (Pipeline + Wingman)</span>
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Modals preservados */}
      <FiveStepPipelineModal
        offer={selectedOfferForPipeline}
        isOpen={!!selectedOfferForPipeline}
        onClose={() => setSelectedOfferForPipeline(null)}
        onStartApplication={onStartApplication}
        onOpenStudio={onOpenStudio}
      />

      <MatchRationaleModal
        offer={selectedOfferForRationale}
        isOpen={!!selectedOfferForRationale}
        onClose={() => setSelectedOfferForRationale(null)}
        onStartApplication={onStartApplication}
      />

      <AddOfferModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onOfferAdded={handleOfferAdded}
      />

      <WebsitePreviewModal
        url={selectedOfferForPreview?.url || 'https://www.tecnalia.com/empleo'}
        title={selectedOfferForPreview?.title || 'Vista Previa de Oferta'}
        company={selectedOfferForPreview?.company || 'Empresa'}
        location={selectedOfferForPreview?.location || 'Bilbao'}
        rawDescription={selectedOfferForPreview?.rawDescription}
        requirements={selectedOfferForPreview?.requirements}
        isOpen={!!selectedOfferForPreview}
        onClose={() => setSelectedOfferForPreview(null)}
        onDeleteOffer={selectedOfferForPreview ? () => handleDeleteOffer(selectedOfferForPreview.id) : undefined}
      />

      <AntigravityExploreModal
        isOpen={isExploreModalOpen}
        onClose={() => setIsExploreModalOpen(false)}
        defaultCategory="offers"
        onExplorationCompleted={refreshOffers}
      />

      <TacticalHelpAndProtocolModal
        isOpen={isProtocolModalOpen}
        onClose={() => setIsProtocolModalOpen(false)}
        initialTab="protocol"
      />
    </div>
  );
};
