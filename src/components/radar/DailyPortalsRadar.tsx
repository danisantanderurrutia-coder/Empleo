import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Search, 
  Link as LinkIcon, 
  Briefcase, 
  Compass, 
  Leaf, 
  GraduationCap, 
  Globe, 
  Building2, 
  CloudRain, 
  Landmark, 
  Clock, 
  ArrowUpRight
} from 'lucide-react';
import { DAILY_PORTALS, type DailyPortal } from '../../data/dailyPortalsCatalog';

interface DailyPortalsRadarProps {
  onQuickAddOpportunity?: () => void;
}

const STORAGE_KEY_CHECKED = 'job_search_os_portals_checked_today_v1';

export const DailyPortalsRadar: React.FC<DailyPortalsRadarProps> = () => {
  const [selectedQuadrant, setSelectedQuadrant] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [checkedPortals, setCheckedPortals] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHECKED);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Only keep checkmarks from today
        const todayStr = new Date().toISOString().split('T')[0];
        const validToday: Record<string, string> = {};
        for (const [id, dateStr] of Object.entries(parsed)) {
          if (typeof dateStr === 'string' && dateStr.startsWith(todayStr)) {
            validToday[id] = dateStr;
          }
        }
        setCheckedPortals(validToday);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleToggleChecked = (id: string) => {
    const todayStr = new Date().toISOString();
    const updated = { ...checkedPortals };
    if (updated[id]) {
      delete updated[id];
    } else {
      updated[id] = todayStr;
    }
    setCheckedPortals(updated);
    try {
      localStorage.setItem(STORAGE_KEY_CHECKED, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const filteredPortals = DAILY_PORTALS.filter(portal => {
    if (selectedQuadrant !== 'ALL' && portal.quadrant !== selectedQuadrant) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const inName = portal.name.toLowerCase().includes(q);
      const inDesc = portal.description.toLowerCase().includes(q);
      const inKeywords = portal.suggestedKeywords.some(k => k.toLowerCase().includes(q));
      return inName || inDesc || inKeywords;
    }
    return true;
  });

  const checkedCount = Object.keys(checkedPortals).length;
  const totalCount = DAILY_PORTALS.length;

  const renderIcon = (iconName: DailyPortal['iconName']) => {
    switch (iconName) {
      case 'Linkedin': return <LinkIcon className="h-5 w-5 text-sky-400" />;
      case 'Briefcase': return <Briefcase className="h-5 w-5 text-teal-400" />;
      case 'Compass': return <Compass className="h-5 w-5 text-rose-400" />;
      case 'Leaf': return <Leaf className="h-5 w-5 text-emerald-400" />;
      case 'GraduationCap': return <GraduationCap className="h-5 w-5 text-indigo-400" />;
      case 'Globe': return <Globe className="h-5 w-5 text-cyan-400" />;
      case 'Search': return <Search className="h-5 w-5 text-amber-400" />;
      case 'Building2': return <Building2 className="h-5 w-5 text-amber-500" />;
      case 'CloudRain': return <CloudRain className="h-5 w-5 text-blue-400" />;
      case 'Landmark': return <Landmark className="h-5 w-5 text-purple-400" />;
      default: return <Compass className="h-5 w-5 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 font-mono">
              <Compass className="h-5 w-5 text-cyan-400" />
              <span>PORTALES DE RASTREO DIARIO</span>
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono font-bold">
              RUTINA MATUTINA
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Accesos directos con búsquedas pre-filtradas para tu perfil. Ábrelos en 1 minuto cada mañana para explorar novedades sin intermediarios ficticios.
          </p>
        </div>

        {/* Progress badge */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs font-mono flex items-center gap-2">
            <span className="text-slate-400">Revisados hoy:</span>
            <span className={`font-bold ${checkedCount > 0 ? 'text-emerald-400' : 'text-slate-300'}`}>
              {checkedCount} / {totalCount}
            </span>
            {checkedCount === totalCount && (
              <span className="text-emerald-400 flex items-center gap-1 font-bold">
                <CheckCircle2 className="h-3.5 w-3.5" /> ¡Completado!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Quadrant tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800">
          <button
            onClick={() => setSelectedQuadrant('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition cursor-pointer ${
              selectedQuadrant === 'ALL'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Todos ({DAILY_PORTALS.length})
          </button>
          <button
            onClick={() => setSelectedQuadrant('DACH')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition cursor-pointer ${
              selectedQuadrant === 'DACH'
                ? 'bg-teal-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            DACH (Alemania)
          </button>
          <button
            onClick={() => setSelectedQuadrant('EUSKADI')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition cursor-pointer ${
              selectedQuadrant === 'EUSKADI'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Euskadi / España
          </button>
          <button
            onClick={() => setSelectedQuadrant('EUROPA')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition cursor-pointer ${
              selectedQuadrant === 'EUROPA'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Europa / I+D
          </button>
          <button
            onClick={() => setSelectedQuadrant('GLOBAL_REMOTE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition cursor-pointer ${
              selectedQuadrant === 'GLOBAL_REMOTE'
                ? 'bg-sky-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Global & Remoto
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtrar por portal o keyword..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Grid of Portals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPortals.map((portal) => {
          const isChecked = !!checkedPortals[portal.id];
          return (
            <div
              key={portal.id}
              className={`p-4 rounded-2xl border transition flex flex-col justify-between space-y-3 relative group ${
                isChecked
                  ? 'bg-slate-900/60 border-emerald-900/40 opacity-80 hover:opacity-100'
                  : 'bg-[#0b101e]/90 border-slate-800 hover:border-slate-700 shadow-md'
              }`}
            >
              {/* Top row */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 shrink-0">
                      {renderIcon(portal.iconName)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white group-hover:text-cyan-400 transition">
                        {portal.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                        <span className="text-cyan-400">{portal.quadrantLabel}</span>
                        <span>•</span>
                        <span>{portal.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Toggle checked today */}
                  <button
                    onClick={() => handleToggleChecked(portal.id)}
                    className="p-1 text-slate-500 hover:text-emerald-400 transition cursor-pointer"
                    title={isChecked ? 'Marcado como revisado hoy (click para desmarcar)' : 'Marcar como revisado hoy'}
                  >
                    {isChecked ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-600 hover:text-slate-400" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {portal.description}
                </p>

                {/* Keywords pill */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {portal.suggestedKeywords.slice(0, 4).map((kw, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom row actions */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                  <Clock className="h-3 w-3 text-cyan-500" />
                  <span>{portal.recommendedFrequency}</span>
                </div>

                <a
                  href={portal.directUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    if (!isChecked) handleToggleChecked(portal.id);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <span>Abrir Portal</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
