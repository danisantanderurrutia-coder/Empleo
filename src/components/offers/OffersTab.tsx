import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Building2, 
  Search, 
  PlusCircle,
  Eye,
  Trash2,
  Cpu,
  CheckCircle2,
  Globe2,
  X
} from 'lucide-react';
import { getStoredOffers, saveStoredOffers } from '../../services/db';
import type { JobOffer } from '../../types/offers';
import { MatchRationaleModal } from './MatchRationaleModal';
import { AddOfferModal } from './AddOfferModal';
import { WebsitePreviewModal } from '../common/WebsitePreviewModal';
import { AntigravityExploreModal } from '../common/AntigravityExploreModal';
import { runAutonomousGlobalSearch } from '../../services/antigravitySearchEngine';
import { runDailyPipelineEuskadi } from '../../services/dailyPipelineEngine';
import { searchRealPublicJobs } from '../../services/publicJobApis';

import { FiveStepPipelineModal } from './FiveStepPipelineModal';
import { ProtocolModal } from './ProtocolModal';

import { checkUrlLiveness } from '../../services/liveWebScraper';
import { ShieldCheck } from 'lucide-react';

interface OffersTabProps {
  initialLocationFilter?: string;
  onStartApplication: (offerId: string) => void;
}

export const OffersTab: React.FC<OffersTabProps> = ({ 
  initialLocationFilter = 'ALL',
  onStartApplication 
}) => {
  const [offers, setOffers] = useState<JobOffer[]>(getStoredOffers());
  const [selectedOfferForRationale, setSelectedOfferForRationale] = useState<JobOffer | null>(null);
  const [selectedOfferForPipeline, setSelectedOfferForPipeline] = useState<JobOffer | null>(null);
  const [selectedOfferForPreview, setSelectedOfferForPreview] = useState<JobOffer | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExploreModalOpen, setIsExploreModalOpen] = useState(false);
  const [isProtocolModalOpen, setIsProtocolModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [minScoreFilter, setMinScoreFilter] = useState<number>(0);
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

  const refreshOffers = () => {
    setOffers(getStoredOffers());
  };

  const handleOfferAdded = (newOffer: JobOffer) => {
    setOffers([newOffer, ...offers]);
  };

  const handleDeleteOffer = (id: string) => {
    const updated = offers.filter(o => o.id !== id);
    setOffers(updated);
    saveStoredOffers(updated);
  };

  const handlePurgeDeadLinks = async () => {
    setIsPurgingLinks(true);
    setSearchResultSummary('🛡️ Verificando estado de enlaces y filtrando basuras de navegación...');

    const JUNK_TITLES_SET = new Set([
      'inicio', 'home', 'registro', 'registrarse', 'register', 'login', 'acceso', 'acceso candidatos',
      'contacto', 'contact', 'contactar', 'sobre nosotros', 'about us', 'quiénes somos', 'servicios',
      'aviso legal', 'legal notice', 'privacidad', 'privacy policy', 'cookies', 'mapa web', 'sitemap',
      'ver más', 'saber más', 'read more', 'click aquí', 'haz clic', 'buscar', 'search', 'menú', 'menu',
      'volver', 'atrás', 'back', 'top', 'arriba', 'compartir', 'share', 'facebook', 'twitter', 'linkedin',
      'instagram', 'youtube', 'rss', 'canal rss', 'blog', 'noticias', 'news', 'prensa', 'press', 'empleo',
      'ofertas', 'ofertas de empleo', 'trabaja con nosotros', 'carreras', 'careers', 'join us', 'únete'
    ]);

    const UNRELATED_JUNK_WORDS = [
      'sales manager', 'sales director', 'saas', '401k', 'austin', 'tx', 'texas', 'account executive',
      'customer success', 'accountant', 'nurse', 'real estate', 'crypto', 'casino', 'barista', 'insurance',
      'why_remote', '/why_remote', '/wizard', '/about', '/faq', '/pricing', '/benefits', '/guide',
      'ecuador', 'colombia', 'peru', 'perú', 'chile', 'argentina', 'mexico', 'méxico', 'venezuela',
      'bolivia', 'paraguay', 'uruguay', 'guatemala', 'honduras', 'el salvador', 'nicaragua', 'costa rica',
      'panama', 'panamá', 'cuba', 'dominicana', 'haiti', 'haití', 'pakistan', 'pakistán', 'india',
      'bangladesh', 'nigeria', 'kenya', 'uganda', 'philippines', 'vietnam', 'thailand', 'indonesia',
      'brazil', 'brasil', 'united states', 'usa', 'eeuu', 'crimen organizado', 'justicia penal', 'unv volunteer'
    ];

    const currentStored = getStoredOffers();
    const validOffers: JobOffer[] = [];
    let deadCount = 0;

    for (const offer of currentStored) {
      const cleanTitle = (offer.title || '').toLowerCase().trim();
      const cleanLoc = (offer.location || '').toLowerCase().trim();
      const cleanUrl = (offer.url || '').toLowerCase();
      const fullOfferStr = `${cleanTitle} ${cleanLoc} ${cleanUrl}`;
      const isUnrelatedJunk = UNRELATED_JUNK_WORDS.some(w => fullOfferStr.includes(w));

      const EXPIRED_KEYWORDS = [
        'plazo finalizado', 'convocatoria cerrada', 'plazo vencido', 'inscripción cerrada',
        'solicitudes cerradas', 'application closed', 'deadline passed', 'expired'
      ];
      const isExpiredByKeyword = EXPIRED_KEYWORDS.some(k => fullOfferStr.includes(k));
      const isExpiredStatus = offer.verificationStatus === 'Expirada';

      if (isExpiredStatus || isExpiredByKeyword || !offer.url || offer.url.includes('invalid') || offer.url.includes('404') || JUNK_TITLES_SET.has(cleanTitle) || cleanTitle.length < 8 || isUnrelatedJunk) {
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
    setSearchResultSummary(`🛡️ Depuración completada: Se han purgado ${deadCount} enlaces de navegación basura/muertos y se mantienen ${validOffers.length} vacantes de empleo reales y 100% activas.`);
    setTimeout(() => setSearchResultSummary(null), 8000);
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

  const [selectedLocationFilter, setSelectedLocationFilter] = useState<string>(initialLocationFilter);

  useEffect(() => {
    if (initialLocationFilter) {
      setSelectedLocationFilter(initialLocationFilter);
    }
  }, [initialLocationFilter]);

  const [includeRemote, setIncludeRemote] = useState<boolean>(true);

  const [matchOperator, setMatchOperator] = useState<'OR' | 'AND'>('OR');
  const [customKeywords, setCustomKeywords] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('job_search_os_custom_keywords_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [newKeywordInput, setNewKeywordInput] = useState('');
  const [selectedActiveKeywords, setSelectedActiveKeywords] = useState<string[]>([]);

  // Associated Terms Map (Semantic Expansion)
  const ASSOCIATED_TERMS_MAP: Record<string, string[]> = {
    'suelos & biogeoquímica': ['suelo', 'suelos', 'biogeoquímica', 'carbono', 'edafología', 'soil', 'soils', 'land use', 'restauración'],
    'gobernanza ambiental': ['gobernanza', 'políticas públicas', 'participación', 'facilitación', 'governance', 'policy', 'mediación', 'derechos'],
    'cambio climático': ['clima', 'cambio climático', 'climate', 'resiliencia', 'adaptación', 'descarbonización', 'transición'],
    'r & gis / modelación': ['gis', 'r', 'python', 'qgis', 'arcgis', 'earth engine', 'modelación', 'spatial', 'geofísica', 'swat', 'modflow'],
    'servicios ecosistémicos': ['servicios ecosistémicos', 'ecosystem services', 'capital natural', 'aries', 'biodiversidad'],
    'facilitación multi-actor': ['facilitación', 'multi-actor', 'diálogo', 'participación comunitaria', 'mediación'],
    'geofísica': ['geofísica', 'geophysics', 'geofísico', 'geofísica aplicada'],
    'bilbao / bizkaia': ['bilbao', 'bizkaia', 'euskadi', 'basque'],
    'soil biogeochemistry': ['soil', 'biogeochemistry', 'carbon', 'soils', 'wetlands'],
    'climate policy & governance': ['climate', 'policy', 'governance', 'resilience', 'transition'],
    'spatial modeling (r/gis)': ['spatial', 'modeling', 'gis', 'r', 'qgis', 'python', 'geospatial'],
    'ecosystem services': ['ecosystem services', 'ecosystem', 'biodiversity'],
    'geophysics': ['geophysics', 'geophysicist'],
    'multi-stakeholder facilitation': ['facilitation', 'stakeholder', 'dialogue', 'community']
  };

  const saveCustomKeywords = (keywords: string[]) => {
    setCustomKeywords(keywords);
    try {
      localStorage.setItem('job_search_os_custom_keywords_v1', JSON.stringify(keywords));
    } catch (e) {
      console.warn('Could not save custom keywords:', e);
    }
  };

  const handleAddCustomKeyword = () => {
    const trimmed = newKeywordInput.trim();
    if (trimmed && !customKeywords.includes(trimmed)) {
      const updated = [...customKeywords, trimmed];
      saveCustomKeywords(updated);
      setSelectedActiveKeywords(prev => [...prev, trimmed]);
      setNewKeywordInput('');
    }
  };

  const handleRemoveCustomKeyword = (kwToRemove: string) => {
    const updated = customKeywords.filter(k => k !== kwToRemove);
    saveCustomKeywords(updated);
    setSelectedActiveKeywords(prev => prev.filter(k => k !== kwToRemove));
  };

  const toggleSelectKeyword = (kw: string) => {
    if (selectedActiveKeywords.includes(kw)) {
      setSelectedActiveKeywords(selectedActiveKeywords.filter(k => k !== kw));
    } else {
      setSelectedActiveKeywords([...selectedActiveKeywords, kw]);
    }
  };

  // Helper to check if text matches keyword or associated terms
  const doesOfferMatchKeywordGroup = (offerText: string, kw: string): boolean => {
    const textLower = offerText.toLowerCase();
    const kwLower = kw.toLowerCase();

    // Check direct match
    if (textLower.includes(kwLower)) return true;

    // Check associated terms
    const associated = ASSOCIATED_TERMS_MAP[kwLower] || kwLower.split(/[\s&/]+/);
    return associated.some(term => term.length > 2 && textLower.includes(term.toLowerCase()));
  };

  // Non-Target Countries & Non-Target Continents Blacklist (Ecuador, Pakistan, US local, etc.)
  const NON_SPAIN_LOCATIONS = [
    'ecuador', 'colombia', 'peru', 'perú', 'chile', 'argentina', 'mexico', 'méxico', 'venezuela',
    'bolivia', 'paraguay', 'uruguay', 'guatemala', 'honduras', 'el salvador', 'nicaragua', 'costa rica',
    'panama', 'panamá', 'cuba', 'dominicana', 'haiti', 'haití', 'pakistan', 'pakistán', 'india',
    'bangladesh', 'nigeria', 'kenya', 'uganda', 'philippines', 'vietnam', 'thailand', 'indonesia',
    'brazil', 'brasil', 'united states', 'usa', 'eeuu', 'texas', 'austin', 'new york', 'california',
    'turkey', 'egypt', 'morocco', 'marruecos', 'tunisia',
    'senegal', 'ghana', 'ethiopia', 'etiópica', 'somalia', 'sudan', 'syria', 'iraq', 'afghanistan',
    'afganistán', 'ukraine', 'russia', 'china', 'japan', 'australia'
  ];

  // Unrelated Disciplines Blacklist (Crime, Penal Justice, UNV Field Volunteers, SaaS Sales)
  const UNRELATED_DISCIPLINE_KEYWORDS = [
    'crimen organizado', 'justicia penal', 'derecho penal', 'criminal justice', 'organized crime',
    'voluntario unv', 'unv volunteer', 'sales manager', 'sales director', 'saas', '401k',
    'account executive', 'customer success', 'nurse', 'enfermero', 'enfermera', 'barista', 'casino'
  ];

  // Strict Location & Logic (OR / AND) Filtering
  const filteredOffers = offers.filter(offer => {
    const locLower = (offer.location || '').toLowerCase();
    const titleLower = (offer.title || '').toLowerCase();
    const isRemoteOffer = offer.isRemote || locLower.includes('remoto') || locLower.includes('remote');
    const offerFullText = `${offer.title} ${offer.company} ${offer.location} ${offer.rawDescription} ${offer.requirements.join(' ')}`.toLowerCase();

    // 0. Discard Generic Landing Page URLs (e.g. /job-offers/, /careers/, /empleo/, /jobs/)
    const GENERIC_LANDING_REGEX = /\/(job-offers|job_offers|careers|jobs|vacancies|trabaja-con-nosotros|work-with-us|join-us|unete-a-idom)\/?$/i;
    if (GENERIC_LANDING_REGEX.test(offer.url || '')) {
      return false; // Discard generic portal landing pages automatically!
    }

    // 1. Strict Unrelated Discipline Discard (e.g. Crimen Organizado, Justicia Penal, UNV Volunteer)
    const isUnrelatedDiscipline = UNRELATED_DISCIPLINE_KEYWORDS.some(k => offerFullText.includes(k));
    if (isUnrelatedDiscipline) {
      return false; // Discard completely
    }

    // 2. Strict Foreign Country Discard (e.g. Ecuador, Pakistan, USA)
    const isForeignLocation = NON_SPAIN_LOCATIONS.some(ctry => locLower.includes(ctry) || titleLower.includes(ctry));
    if (isForeignLocation) {
      return false; // Discard any non-Spain location completely
    }

    // 3. Strict Selected Location Enforcement
    let matchesLocation = true;
    if (selectedLocationFilter === 'GERMANY') {
      const isGermanyLoc = locLower.includes('alemania') || locLower.includes('germany') || locLower.includes('deutschland') || locLower.includes('berlin') || locLower.includes('munich') || locLower.includes('münchen') || locLower.includes('kiel') || locLower.includes('hamburg') || locLower.includes('frankfurt') || locLower.includes('cologne') || locLower.includes('köln') || locLower.includes('euraxess') || (offer.sourceName || '').toLowerCase().includes('euraxess');
      matchesLocation = isGermanyLoc || isRemoteOffer;
    } else if (selectedLocationFilter === 'BILBAO') {
      const isBilbaoLoc = locLower.includes('bilbao') || locLower.includes('bizkaia') || locLower.includes('erandio') || locLower.includes('leioa') || locLower.includes('barakaldo') || locLower.includes('zamudio') || locLower.includes('getxo');
      matchesLocation = isBilbaoLoc || (includeRemote && isRemoteOffer && !isForeignLocation);
    } else if (selectedLocationFilter === 'DONOSTIA') {
      const isDonostiaLoc = locLower.includes('donostia') || locLower.includes('san sebastián') || locLower.includes('san sebastian') || locLower.includes('gipuzkoa');
      matchesLocation = isDonostiaLoc || (includeRemote && isRemoteOffer && !isForeignLocation);
    } else if (selectedLocationFilter === 'EUSKADI') {
      const isEuskadiLoc = locLower.includes('bilbao') || locLower.includes('bizkaia') || locLower.includes('donostia') || locLower.includes('vitoria') || locLower.includes('gasteiz') || locLower.includes('euskadi') || locLower.includes('país vasco') || locLower.includes('basque');
      matchesLocation = isEuskadiLoc || (includeRemote && isRemoteOffer && !isForeignLocation);
    } else if (selectedLocationFilter === 'ESPAÑA') {
      const isSpainLoc = locLower.includes('españa') || locLower.includes('spain') || locLower.includes('madrid') || locLower.includes('barcelona') || locLower.includes('valencia') || locLower.includes('sevilla') || locLower.includes('bilbao') || locLower.includes('euskadi');
      matchesLocation = isSpainLoc || (includeRemote && isRemoteOffer && !isForeignLocation);
    } else if (selectedLocationFilter === 'REMOTE_ONLY') {
      matchesLocation = isRemoteOffer && !isForeignLocation;
    }

    // Text search bar query filter
    const matchesSearchQuery = searchQuery === '' || offerFullText.includes(searchQuery.toLowerCase());

    // Keywords OR / AND Logic Filter
    let matchesKeywordsLogic = true;
    if (selectedActiveKeywords.length > 0) {
      if (matchOperator === 'OR') {
        matchesKeywordsLogic = selectedActiveKeywords.some(kw => doesOfferMatchKeywordGroup(offerFullText, kw));
      } else {
        // AND mode: offer must match ALL selected keyword groups
        matchesKeywordsLogic = selectedActiveKeywords.every(kw => doesOfferMatchKeywordGroup(offerFullText, kw));
      }
    }

    const matchesScore = offer.matchScore.totalScore >= minScoreFilter;

    return matchesLocation && matchesSearchQuery && matchesKeywordsLogic && matchesScore;
  });

  // Profile-based Smart Keywords Extractor (ES 🇪🇸 & EN 🇬🇧)
  const spanishProfileKeywords = [
    'Suelos & Biogeoquímica',
    'Gobernanza Ambiental',
    'Cambio Climático',
    'R & GIS / Modelación',
    'Servicios Ecosistémicos',
    'Facilitación Multi-Actor',
    'Geofísica',
    'Bilbao / Bizkaia'
  ];

  const englishProfileKeywords = [
    'Soil Biogeochemistry',
    'Climate Policy & Governance',
    'Spatial Modeling (R/GIS)',
    'Ecosystem Services',
    'Geophysics',
    'Multi-stakeholder Facilitation'
  ];

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between glass-panel p-6 rounded-2xl border border-slate-800 bg-[#131c2e] shadow-lg gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5 tracking-tight">
            <Sparkles className="h-6 w-6 text-emerald-400" />
            <span>Radar & Buscador de Ofertas de Empleo</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Filtra y ejecuta el Pipeline Maestro de 5 Pasos en las vacantes que hayas añadido.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={async () => {
              setIsSearchingAi(true);
              const res = await runDailyPipelineEuskadi(searchQuery);
              setOffers(res.scoutedOffers);
              setIsSearchingAi(false);
              setSearchResultSummary(res.summary);
              setTimeout(() => setSearchResultSummary(null), 8000);
            }}
            disabled={isSearchingAi}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-md transition flex items-center space-x-1.5 disabled:opacity-50"
          >
            <Cpu className={`h-4 w-4 text-white ${isSearchingAi ? 'animate-spin' : ''}`} />
            <span>{isSearchingAi ? 'Rastreando Portales...' : '⚡ Rastrear Todos los Portales en Vivo'}</span>
          </button>

          <button
            onClick={handlePurgeDeadLinks}
            disabled={isPurgingLinks}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 shadow-md transition flex items-center space-x-1.5 disabled:opacity-50"
            title="Comprueba cada URL (solo en modo desarrollo) de las vacantes e elimina automáticamente las que retornen error 404/caducadas"
          >
            <ShieldCheck className={`h-4 w-4 text-emerald-400 ${isPurgingLinks ? 'animate-spin' : ''}`} />
            <span>{isPurgingLinks ? 'Verificando URLs...' : '🛡️ Depurar Enlaces Caducados'}</span>
          </button>

          <button
            onClick={() => setIsProtocolModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-semibold text-xs rounded-xl border border-emerald-500/40 shadow-md transition flex items-center space-x-1.5"
            title="Ver el Protocolo Maestro de Búsqueda Amplia y Filtrado de Alta Precisión"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>🛡️ Protocolo Búsqueda</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 shadow-md transition flex items-center space-x-1.5"
          >
            <PlusCircle className="h-4 w-4 text-slate-400" />
            <span>Agregar Oferta Manual</span>
          </button>
        </div>
      </div>

      {/* Module 1: Áreas de Trabajo & Especialidades */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-[#131c2e] shadow-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span className="font-bold text-white text-xs uppercase tracking-wider">
              🎯 Áreas de Trabajo / Especialidades (Master Profile)
            </span>
          </div>

          {/* Interactive OR / AND Operator Selector */}
          <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0">
            <span className="text-[11px] font-semibold text-slate-400 pl-2">Lógica:</span>
            <button
              onClick={() => setMatchOperator('OR')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                matchOperator === 'OR'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Modo O (OR): Muestra vacantes que contengan AL MENOS UNA de las especialidades seleccionadas"
            >
              O (OR) — Amplia
            </button>
            <button
              onClick={() => setMatchOperator('AND')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                matchOperator === 'AND'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Modo Y (AND): Muestra solo vacantes que contengan TODAS las especialidades seleccionadas"
            >
              Y (AND) — Estricta
            </button>
          </div>
        </div>

        {/* Add Custom Keyword Input */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newKeywordInput}
            onChange={e => setNewKeywordInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddCustomKeyword()}
            placeholder="+ Añade una especialidad personalizada (ej: Edafología, Agroforestería, GIS)..."
            className="flex-1 px-3.5 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-xs font-medium focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={handleAddCustomKeyword}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow transition"
          >
            + Añadir
          </button>
        </div>

        {/* Custom Keywords Row (if any) */}
        {customKeywords.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs font-bold text-amber-400 shrink-0">📌 Personalizadas:</span>
            {customKeywords.map((kw) => {
              const isSelected = selectedActiveKeywords.includes(kw);
              return (
                <div key={kw} className="flex items-center space-x-1">
                  <button
                    onClick={() => toggleSelectKeyword(kw)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition flex items-center space-x-1 ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                        : 'bg-slate-900/80 text-slate-300 border-slate-700/80 hover:border-emerald-500/50 hover:bg-slate-800'
                    }`}
                  >
                    <span>{kw}</span>
                    <span className="text-[10px] opacity-75">{isSelected ? '✓' : '+'}</span>
                  </button>
                  <button
                    onClick={() => handleRemoveCustomKeyword(kw)}
                    className="p-1 text-slate-500 hover:text-rose-400"
                    title="Eliminar palabra clave"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* ES 🇪🇸 Keywords */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs font-bold text-emerald-400 shrink-0">🇪🇸 Especialidades:</span>
          {spanishProfileKeywords.filter(k => !k.includes('Bilbao')).map((kw) => {
            const isSelected = selectedActiveKeywords.includes(kw);
            return (
              <button
                key={kw}
                onClick={() => toggleSelectKeyword(kw)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border transition flex items-center space-x-1 ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                    : 'bg-slate-900/80 text-slate-300 border-slate-700/80 hover:border-emerald-500/50 hover:bg-slate-800'
                }`}
              >
                <span>{kw}</span>
                <span className="text-[10px] opacity-75">{isSelected ? '✓' : '+'}</span>
              </button>
            );
          })}
        </div>

        {/* EN 🇬🇧 Keywords */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/60">
          <span className="text-xs font-bold text-emerald-400 shrink-0">🇬🇧 English:</span>
          {englishProfileKeywords.map((kw) => {
            const isSelected = selectedActiveKeywords.includes(kw);
            return (
              <button
                key={kw}
                onClick={() => toggleSelectKeyword(kw)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border transition flex items-center space-x-1 ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                    : 'bg-slate-900/80 text-slate-300 border-slate-700/80 hover:border-emerald-500/50 hover:bg-slate-800'
                }`}
              >
                <span>{kw}</span>
                <span className="text-[10px] opacity-75">{isSelected ? '✓' : '+'}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Module 2: Lugares & Ubicaciones Preferentes */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-[#131c2e] shadow-md space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-emerald-400" />
            <span className="font-bold text-white text-xs uppercase tracking-wider">
              📍 Filtro de Lugares & Ubicaciones (Foco Bilbao / Euskadi / España)
            </span>
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold">
            🛡️ Escudo Geográfico: Se descartan ofertas fuera de España salvo 100% Remoto
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={() => setSelectedLocationFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border ${
              selectedLocationFilter === 'ALL'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <Globe2 className="h-3.5 w-3.5" />
            <span>🌍 Todas las Ubicaciones Válidas (España + Remoto)</span>
          </button>

          <button
            onClick={() => setSelectedLocationFilter('BILBAO')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border ${
              selectedLocationFilter === 'BILBAO'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <MapPin className="h-3.5 w-3.5 text-emerald-400" />
            <span>📍 Bilbao / Bizkaia (Prioridad Alta +25 pts)</span>
          </button>

          <button
            onClick={() => setSelectedLocationFilter('EUSKADI')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border ${
              selectedLocationFilter === 'EUSKADI'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <MapPin className="h-3.5 w-3.5 text-lime-400" />
            <span>📍 Euskadi / País Vasco (Bilbao, Donostia, Vitoria)</span>
          </button>

          <button
            onClick={() => setSelectedLocationFilter('ESPAÑA')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border ${
              selectedLocationFilter === 'ESPAÑA'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <span>🇪🇸 España (Nacional: Madrid, BCN, Bilbao, etc.)</span>
          </button>

          <button
            onClick={() => setSelectedLocationFilter('REMOTE_ONLY')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border ${
              selectedLocationFilter === 'REMOTE_ONLY'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <Globe2 className="h-3.5 w-3.5 text-sky-400" />
            <span>🌐 Remoto (100% Teletrabajo)</span>
          </button>
        </div>
      </div>

      {/* Autonomous Search Input Console */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-[#131c2e] shadow-md space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="h-4 w-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleRunAutonomousSearch()}
              placeholder="Buscar en APIs públicas (ej: data, remote, engineer) o filtrar vacantes añadidas..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-xs font-medium focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            onClick={() => handleRunAutonomousSearch()}
            disabled={isSearchingAi}
            className="w-full md:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-2 shrink-0 disabled:opacity-50"
          >
            {isSearchingAi ? (
              <>
                <Cpu className="h-4 w-4 animate-spin text-white" />
                <span>Consultando APIs Públicas...</span>
              </>
            ) : (
              <>
                <Globe2 className="h-4 w-4 text-white" />
                <span>Buscar en APIs Públicas</span>
              </>
            )}
          </button>
        </div>

        {/* Location & Score Filter Console */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 font-semibold text-xs">Filtro Ubicación:</span>
            <button
              onClick={() => setSelectedLocationFilter('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                selectedLocationFilter === 'ALL'
                  ? 'bg-slate-800 text-white border border-slate-700 font-bold'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              Todas ({offers.length})
            </button>
            <button
              onClick={() => setSelectedLocationFilter('GERMANY')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                selectedLocationFilter === 'GERMANY'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40 font-bold'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              🇩🇪 Alemania / DACH (§20)
            </button>
            <button
              onClick={() => setSelectedLocationFilter('BILBAO')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                selectedLocationFilter === 'BILBAO'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              📍 Bilbao / Bizkaia
            </button>
            <button
              onClick={() => setSelectedLocationFilter('DONOSTIA')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                selectedLocationFilter === 'DONOSTIA'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              📍 Donostia / San Sebastián
            </button>
            <button
              onClick={() => setSelectedLocationFilter('EUSKADI')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                selectedLocationFilter === 'EUSKADI'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              🏞️ Todo Euskadi
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-1.5 cursor-pointer text-xs text-slate-300 font-medium">
              <input
                type="checkbox"
                checked={includeRemote}
                onChange={e => setIncludeRemote(e.target.checked)}
                className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 h-4 w-4 bg-slate-900"
              />
              <span>🌐 Incluir 100% Remoto</span>
            </label>

            <div className="flex items-center space-x-1 text-xs font-semibold">
              <span className="text-slate-400">Score Mín:</span>
              <select
                value={minScoreFilter}
                onChange={e => setMinScoreFilter(Number(e.target.value))}
                className="px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs"
              >
                <option value={0}>0%+</option>
                <option value={60}>60%+</option>
                <option value={80}>80%+</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {searchResultSummary && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2 shadow-sm">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
          <span className="font-semibold">{searchResultSummary}</span>
        </div>
      )}

      {/* Result Count Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-1">
        <span>Mostrando {filteredOffers.length} de {offers.length} vacantes verificadas</span>
        <span>Ordenado por Coincidencia (Match Score)</span>
      </div>

      {/* Offers List */}
      <div className="space-y-4">
        {filteredOffers.length === 0 ? (
          <div className="glass-panel p-10 rounded-2xl border border-slate-800 text-center space-y-2 bg-[#131c2e]">
            <p className="text-base text-white font-bold">No se encontraron vacantes activas en este momento.</p>
            <p className="text-xs text-slate-400">Haz clic en "⚡ Rastrear Todos los Portales en Vivo" o selecciona un portal en el lanzador superior.</p>
          </div>
        ) : (
          filteredOffers.map((offer) => {
            const score = offer.matchScore.totalScore;
            const scoreColor = score >= 80 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' :
                               score >= 60 ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' :
                               'text-slate-400 bg-slate-800/40 border-slate-700';

            return (
              <div
                key={offer.id}
                className="glass-card p-6 rounded-2xl border border-slate-800 bg-[#131c2e] hover:border-slate-700 transition space-y-4 shadow-md text-slate-100"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <span className="text-lg">🇪🇸</span>
                      <h3 className="font-bold text-lg text-white">{offer.title}</h3>
                      {offer.isBilbaoLocation && (
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          📍 Bilbao / Euskadi
                        </span>
                      )}
                      {offer.isRemote && (
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                          🌐 Remoto
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-400 font-medium flex flex-wrap items-center gap-3 pt-0.5">
                      <span className="flex items-center gap-1 text-slate-200 font-semibold">
                        <Building2 className="h-4 w-4 text-emerald-400" />
                        {offer.company}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-slate-500" />
                        {offer.location}
                      </span>
                      <span>•</span>
                      <span>Fuente: <strong className="text-slate-300">{offer.sourceName}</strong></span>
                    </div>
                  </div>

                  {/* Score & Action Controls */}
                  <div className="flex items-center space-x-3 shrink-0">
                    <div className={`px-4 py-2.5 rounded-xl border text-center min-w-[80px] shadow-sm ${scoreColor}`}>
                      <div className="font-bold text-xl font-mono leading-none">{score}%</div>
                      <div className="text-[9px] uppercase font-semibold tracking-wider mt-1">Match</div>
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <button
                        onClick={() => setSelectedOfferForPipeline(offer)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-1.5"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-white" />
                        <span>⚡ Preparar Candidatura (Fase 3)</span>
                      </button>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => setSelectedOfferForRationale(offer)}
                          className="flex-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition"
                        >
                          Justificación
                        </button>

                        {offer.url && (
                          <button
                            onClick={() => setSelectedOfferForPreview(offer)}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition"
                            title="Ver en Web Real"
                          >
                            <Eye className="h-3.5 w-3.5 text-slate-300" />
                          </button>
                        )}

                        <button
                          onClick={() => {
                            if (window.confirm(`¿Deseas eliminar "${offer.title}"?`)) {
                              handleDeleteOffer(offer.id);
                            }
                          }}
                          className="p-1 bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 rounded-lg border border-slate-700 transition"
                          title="Eliminar vacante"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-800 pt-3">
                  {offer.rawDescription}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-300">
                  <div className="flex flex-wrap gap-1.5">
                    {offer.requirements.map((req, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 text-[11px]">
                        {req}
                      </span>
                    ))}
                  </div>

                  <span className="font-mono text-emerald-400 font-semibold text-xs">
                    {offer.salaryMin ? `${offer.salaryMin.toLocaleString()} - ${offer.salaryMax?.toLocaleString()} ${offer.salaryCurrency || '€'}` : 'Salario a convenir'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <FiveStepPipelineModal
        offer={selectedOfferForPipeline}
        isOpen={!!selectedOfferForPipeline}
        onClose={() => setSelectedOfferForPipeline(null)}
        onStartApplication={onStartApplication}
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

      <ProtocolModal
        isOpen={isProtocolModalOpen}
        onClose={() => setIsProtocolModalOpen(false)}
      />
    </div>
  );
};
