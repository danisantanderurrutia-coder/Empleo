import React, { useState } from 'react';
import { 
  Radio, 
  Sparkles, 
  Globe2, 
  Building2, 
  ExternalLink, 
  ShieldCheck, 
  Award,
  Layers
} from 'lucide-react';
import { OffersTab } from '../offers/OffersTab';
import { SourcesTab } from '../sources/SourcesTab';
import { CompaniesTab } from '../companies/CompaniesTab';

interface MarketRadarTabProps {
  initialSubTab?: 'offers' | 'sources' | 'companies';
  onStartApplication: (offerId: string) => void;
}

export const MarketRadarTab: React.FC<MarketRadarTabProps> = ({ 
  initialSubTab = 'offers', 
  onStartApplication 
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'offers' | 'sources' | 'companies'>(initialSubTab);

  return (
    <div className="space-y-6 text-slate-100 animate-fadeIn">
      {/* Station Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between glass-panel p-4 rounded-2xl border border-slate-800 bg-[#111827] shadow-lg gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Radio className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2 font-mono uppercase tracking-tight">
              <span>Estación 1: Radar de Mercado & Reconocimiento</span>
            </h1>
            <p className="text-xs text-slate-400">
              Monitoreo unificado de vacantes indexadas, cuadrantes estratégicos de visado y empresas target.
            </p>
          </div>
        </div>

        {/* Sub-Tabs Switcher */}
        <div className="flex items-center p-1 bg-slate-900/90 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveSubTab('offers')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              activeSubTab === 'offers'
                ? 'bg-emerald-600 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Vacantes Indexadas</span>
          </button>

          <button
            onClick={() => setActiveSubTab('sources')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              activeSubTab === 'sources'
                ? 'bg-emerald-600 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe2 className="h-3.5 w-3.5" />
            <span>Cuadrantes de Visado</span>
          </button>

          <button
            onClick={() => setActiveSubTab('companies')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              activeSubTab === 'companies'
                ? 'bg-emerald-600 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="h-3.5 w-3.5" />
            <span>Empresas & Institutos</span>
          </button>
        </div>
      </div>

      {/* SUB-PANEL 1: OFFERS RADAR */}
      {activeSubTab === 'offers' && (
        <div className="space-y-4">
          <OffersTab onStartApplication={onStartApplication} />
        </div>
      )}

      {/* SUB-PANEL 2: VISA QUADRANTS & SOURCES */}
      {activeSubTab === 'sources' && (
        <div className="space-y-6">
          {/* Tactical 3-Quadrant Map */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Quadrant Alpha */}
            <div className="glass-panel p-5 rounded-2xl border border-sky-500/30 bg-[#0f192d] space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-sky-500/20 pb-2">
                <span className="text-[10px] font-mono font-bold uppercase text-sky-400 tracking-wider flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  CUADRANTE ALPHA
                </span>
                <span className="text-[10px] font-mono bg-sky-500/10 text-sky-300 px-2 py-0.5 rounded border border-sky-500/20">
                  §20 AufenthG
                </span>
              </div>

              <div>
                <h3 className="font-bold text-white text-sm">Alemania & Postgraduados UE</h3>
                <p className="text-[11px] text-slate-300 mt-1">
                  Prioridad inmediata gracias a tu doble máster de Kiel. Visado de búsqueda de 18 meses a tiempo completo y pase a EU Blue Card.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
                <a 
                  href="https://euraxess.ec.europa.eu/jobs/search?keywords=soil%20OR%20climate%20OR%20peatland&country=DE" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-900/80 hover:bg-sky-950/60 border border-slate-800 hover:border-sky-500/40 transition flex items-center justify-between group"
                >
                  <span className="font-medium text-slate-200 group-hover:text-sky-300">Euraxess Germany (Helmholtz & Thünen)</span>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-sky-400" />
                </a>

                <a 
                  href="https://www.daad.de/en/study-and-research-in-germany/phd-studies-and-research/research-jobs/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-900/80 hover:bg-sky-950/60 border border-slate-800 hover:border-sky-500/40 transition flex items-center justify-between group"
                >
                  <span className="font-medium text-slate-200 group-hover:text-sky-300">DAAD Research Jobs (Alemania)</span>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-sky-400" />
                </a>

                <a 
                  href="https://www.stepstone.de/jobs/environmental-science?language=en" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-900/80 hover:bg-sky-950/60 border border-slate-800 hover:border-sky-500/40 transition flex items-center justify-between group"
                >
                  <span className="font-medium text-slate-200 group-hover:text-sky-300">StepStone Germany (English / Umwelt)</span>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-sky-400" />
                </a>
              </div>
            </div>

            {/* Quadrant Beta */}
            <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-[#0f241d] space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 tracking-wider flex items-center gap-1">
                  <Award className="h-3.5 w-3.5" />
                  CUADRANTE BETA
                </span>
                <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20">
                  Ley 14/2013 UGE
                </span>
              </div>

              <div>
                <h3 className="font-bold text-white text-sm">Euskadi & España (Preferencia Bilbao)</h3>
                <p className="text-[11px] text-slate-300 mt-1">
                  Centros de investigación y multinacionales con capacidad legal de patrocinio directo y meta de nacionalidad en 2 años.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
                <a 
                  href="https://www.bc3research.org/careers.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-900/80 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-500/40 transition flex items-center justify-between group"
                >
                  <span className="font-medium text-slate-200 group-hover:text-emerald-300">BC3 Basque Centre for Climate Change</span>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-400" />
                </a>

                <a 
                  href="https://www.tecnalia.com/empleo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-900/80 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-500/40 transition flex items-center justify-between group"
                >
                  <span className="font-medium text-slate-200 group-hover:text-emerald-300">Tecnalia Research & Innovation</span>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-400" />
                </a>

                <a 
                  href="https://neiker.eus/es/empleo/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-900/80 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-500/40 transition flex items-center justify-between group"
                >
                  <span className="font-medium text-slate-200 group-hover:text-emerald-300">Neiker (Suelos & Edafología Euskadi)</span>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-400" />
                </a>

                <a 
                  href="https://www.idom.com/unete-a-idom/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-900/80 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-500/40 transition flex items-center justify-between group"
                >
                  <span className="font-medium text-slate-200 group-hover:text-emerald-300">IDOM Zorrotzaurre (Consultoría & Cuencas)</span>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-400" />
                </a>
              </div>
            </div>

            {/* Quadrant Gamma */}
            <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 bg-[#23180d] space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                <span className="text-[10px] font-mono font-bold uppercase text-amber-400 tracking-wider flex items-center gap-1">
                  <Globe2 className="h-3.5 w-3.5" />
                  CUADRANTE GAMMA
                </span>
                <span className="text-[10px] font-mono bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20">
                  Remoto / Global
                </span>
              </div>

              <div>
                <h3 className="font-bold text-white text-sm">Gobernanza & Redes Internacionales</h3>
                <p className="text-[11px] text-slate-300 mt-1">
                  Incidencia en políticas públicas, salvaguardias socioambientales y teletrabajo con entidades globales.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
                <a 
                  href="https://environmentalpaper.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-900/80 hover:bg-amber-950/60 border border-slate-800 hover:border-amber-500/40 transition flex items-center justify-between group"
                >
                  <span className="font-medium text-slate-200 group-hover:text-amber-300">Environmental Paper Network (EPN)</span>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-amber-400" />
                </a>

                <a 
                  href="https://globalforestcoalition.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-900/80 hover:bg-amber-950/60 border border-slate-800 hover:border-amber-500/40 transition flex items-center justify-between group"
                >
                  <span className="font-medium text-slate-200 group-hover:text-amber-300">Global Forest Coalition</span>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-amber-400" />
                </a>

                <a 
                  href="https://remotive.com/remote-jobs/data" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-900/80 hover:bg-amber-950/60 border border-slate-800 hover:border-amber-500/40 transition flex items-center justify-between group"
                >
                  <span className="font-medium text-slate-200 group-hover:text-amber-300">Remotive Data & Spatial</span>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-amber-400" />
                </a>
              </div>
            </div>
          </div>

          {/* Full Sources Manager */}
          <div className="pt-4 border-t border-slate-800">
            <h2 className="text-sm font-bold text-white uppercase font-mono tracking-wide mb-3 flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald-400" />
              <span>Gestión Completa de Frecuencias & Portales</span>
            </h2>
            <SourcesTab />
          </div>
        </div>
      )}

      {/* SUB-PANEL 3: COMPANIES & TARGETS */}
      {activeSubTab === 'companies' && (
        <div className="space-y-4">
          <CompaniesTab />
        </div>
      )}
    </div>
  );
};
