import React, { useState } from 'react';
import { 
  Building2, 
  Compass, 
  ChevronLeft, 
  Globe2,
  TrendingUp
} from 'lucide-react';
import { CompaniesTab } from '../companies/CompaniesTab';
import { DailyPortalsRadar } from './DailyPortalsRadar';
import { ClusterBenchmarkTable } from './ClusterBenchmarkTable';
import { getStoredCompanies } from '../../services/db';
import { DAILY_PORTALS } from '../../data/dailyPortalsCatalog';
import type { CompanySectorCluster, QuadrantType } from '../../types/companies';

interface MarketRadarTabProps {
  initialSubTab?: 'organizations' | 'benchmark' | 'portals' | string;
  initialFilter?: string;
  onStartApplication?: (offerId: string) => void;
  onStartPipelineFromCompany?: (companyId: string) => void;
  onOpenStudio?: (offerId?: string, docType?: 'cv' | 'cover_letter') => void;
  onReturnToHub?: () => void;
}

export const MarketRadarTab: React.FC<MarketRadarTabProps> = ({ 
  initialSubTab = 'organizations', 
  initialFilter = 'ALL',
  onStartApplication,
  onStartPipelineFromCompany,
  onReturnToHub
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'organizations' | 'benchmark' | 'portals'>(
    initialSubTab === 'portals' ? 'portals' :
    initialSubTab === 'benchmark' ? 'benchmark' : 'organizations'
  );
  const [drilldownQuadrant, setDrilldownQuadrant] = useState<string>(initialFilter);
  const [drilldownSectorCluster, setDrilldownSectorCluster] = useState<CompanySectorCluster>('ALL');

  const companies = getStoredCompanies();
  const portalsCount = DAILY_PORTALS.length;

  const handleBenchmarkDrilldown = (cluster: CompanySectorCluster, quadrant: QuadrantType) => {
    setDrilldownQuadrant(quadrant);
    setDrilldownSectorCluster(cluster);
    setActiveSubTab('organizations');
  };

  return (
    <div className="space-y-5 text-slate-100 animate-fadeIn">
      {/* Top Bar with Title and SubTab Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl bg-[#0a0f1d]/95 border border-slate-700/80 shadow-2xl backdrop-blur-md gap-4">
        <div className="flex items-center gap-3">
          {onReturnToHub && (
            <button
              onClick={onReturnToHub}
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 hover:border-cyan-500 transition flex items-center gap-1.5 cursor-pointer shadow"
              title="Volver a la consola central Career"
            >
              <ChevronLeft className="h-4 w-4 text-cyan-400" />
              <span>« CAREER HUB</span>
            </button>
          )}

          <div className="h-9 w-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/30 shrink-0">
            <Compass className="h-5 w-5" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-black text-white flex items-center gap-2 font-mono uppercase tracking-tight">
                MERCADO // ECOSISTEMA DE CUADRANTES & PORTALES
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-extrabold hidden sm:inline-block">
                PROSPECCIÓN DIRECTA
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              DACH • EUSKADI • EUROPA & GLOBAL // CERO OFERTAS FANTASMA
            </p>
          </div>
        </div>

        {/* SubTab Toggle: Organizaciones vs Benchmark vs Portales Diarios */}
        <div className="flex flex-wrap items-center bg-[#070b14] p-1 rounded-xl border border-slate-800 self-start md:self-auto shadow-inner gap-1">
          <button
            onClick={() => setActiveSubTab('organizations')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
              activeSubTab === 'organizations'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>ORGANIZACIONES ({companies.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('benchmark')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
              activeSubTab === 'benchmark'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <TrendingUp className="h-4 w-4 text-purple-300" />
            <span>BENCHMARK PROBABILIDAD (3-6M)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('portals')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
              activeSubTab === 'portals'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Globe2 className="h-4 w-4" />
            <span>PORTALES DIARIOS ({portalsCount})</span>
          </button>
        </div>
      </div>

      {/* Main SubTab Content */}
      {activeSubTab === 'organizations' && (
        <CompaniesTab
          onStartPipeline={onStartPipelineFromCompany || ((companyId) => {
            if (onStartApplication) onStartApplication(companyId);
          })}
          initialQuadrant={drilldownQuadrant}
          initialSectorCluster={drilldownSectorCluster}
        />
      )}

      {activeSubTab === 'benchmark' && (
        <ClusterBenchmarkTable onSelectClusterFilter={handleBenchmarkDrilldown} />
      )}

      {activeSubTab === 'portals' && (
        <DailyPortalsRadar />
      )}
    </div>
  );
};
