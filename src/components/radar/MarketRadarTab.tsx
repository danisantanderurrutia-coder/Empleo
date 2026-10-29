import React, { useState } from 'react';
import { 
  Building2, 
  Compass, 
  ChevronLeft, 
  Globe2
} from 'lucide-react';
import { CompaniesTab } from '../companies/CompaniesTab';
import { DailyPortalsRadar } from './DailyPortalsRadar';
import { getStoredCompanies } from '../../services/db';
import { DAILY_PORTALS } from '../../data/dailyPortalsCatalog';

interface MarketRadarTabProps {
  initialSubTab?: 'organizations' | 'portals' | string;
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
  const [activeSubTab, setActiveSubTab] = useState<'organizations' | 'portals'>(
    initialSubTab === 'portals' ? 'portals' : 'organizations'
  );

  const companies = getStoredCompanies();
  const portalsCount = DAILY_PORTALS.length;

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

        {/* SubTab Toggle: Organizaciones vs Portales Diarios */}
        <div className="flex items-center bg-[#070b14] p-1 rounded-xl border border-slate-800 self-start md:self-auto shadow-inner">
          <button
            onClick={() => setActiveSubTab('organizations')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
              activeSubTab === 'organizations'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>ORGANIZACIONES & CENTROS ({companies.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('portals')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
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
          initialQuadrant={initialFilter}
        />
      )}

      {activeSubTab === 'portals' && (
        <DailyPortalsRadar />
      )}
    </div>
  );
};
