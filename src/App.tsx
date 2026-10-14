import { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { TacticalHelpAndProtocolModal } from './components/common/TacticalHelpAndProtocolModal';

import { WarRoomTab } from './components/warroom/WarRoomTab';
import { MarketRadarTab } from './components/radar/MarketRadarTab';
import { AgentDossierTab } from './components/dossier/AgentDossierTab';
import { MissionControlTab } from './components/control/MissionControlTab';
import { SettingsTab } from './components/settings/SettingsTab';

import { getStoredOffers, saveStoredOffers, getStoredProfile, getStoredApplications, saveStoredApplications } from './services/db';
import { calculateMatchScore } from './services/matchEngine';
import { getStoredTheme, saveStoredTheme, applyThemeToDOM, type AppTheme } from './services/themeManager';
import type { JobOffer } from './types/offers';

export function App() {
  const [theme, setTheme] = useState<AppTheme>(getStoredTheme());
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [radarSubTab, setRadarSubTab] = useState<'offers' | 'sources' | 'companies'>('offers');
  const [radarLocationFilter, setRadarLocationFilter] = useState<string>('ALL');
  const [dossierSubTab, setDossierSubTab] = useState<'showcase' | 'profile' | 'cvs'>('showcase');
  const [missionSubTab, setMissionSubTab] = useState<'applications' | 'batch' | 'intelligence'>('applications');

  const [isUnifiedHelpOpen, setIsUnifiedHelpOpen] = useState(false);
  const [dataRefreshKey, setDataRefreshKey] = useState(0);

  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  const handleThemeChange = (newTheme: AppTheme) => {
    setTheme(newTheme);
    saveStoredTheme(newTheme);
  };

  const handleNavigate = (stationId: string, subTab?: string, filterParam?: string) => {
    if (filterParam) {
      setRadarLocationFilter(filterParam);
    }

    if (stationId === 'market_radar' || ['offers', 'sources', 'companies'].includes(stationId)) {
      if (subTab === 'sources' || stationId === 'sources') setRadarSubTab('sources');
      else if (subTab === 'companies' || stationId === 'companies') setRadarSubTab('companies');
      else setRadarSubTab('offers');
      setActiveTab('market_radar');
      return;
    }

    if (stationId === 'agent_dossier' || ['showcase', 'profile', 'cvs'].includes(stationId)) {
      if (subTab === 'cvs' || stationId === 'cvs') setDossierSubTab('cvs');
      else if (subTab === 'profile' || stationId === 'profile') setDossierSubTab('profile');
      else setDossierSubTab('showcase');
      setActiveTab('agent_dossier');
      return;
    }

    if (stationId === 'mission_control' || ['applications', 'batch_applications', 'intelligence'].includes(stationId)) {
      if (subTab === 'batch' || stationId === 'batch_applications') setMissionSubTab('batch');
      else if (subTab === 'intelligence' || stationId === 'intelligence') setMissionSubTab('intelligence');
      else setMissionSubTab('applications');
      setActiveTab('mission_control');
      return;
    }

    setActiveTab(stationId);
  };

  const handleRefreshData = () => {
    setDataRefreshKey(prev => prev + 1);
  };

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const importJob = params.get('importJob');
      if (importJob) {
        const parsed = JSON.parse(decodeURIComponent(importJob));
        const profile = getStoredProfile();
        const currentOffers = getStoredOffers();
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
        const partialOffer: Partial<JobOffer> = {
          id: `ext-${Date.now()}`,
          title: parsed.title || 'Oferta Importada',
          company: parsed.company || 'Empresa Detectada',
          location: parsed.location || 'Bilbao / Remoto',
          isBilbaoLocation: (parsed.location || '').toLowerCase().includes('bilbao') || (parsed.location || '').toLowerCase().includes('bizkaia'),
          isRemote: (parsed.location || '').toLowerCase().includes('remoto') || (parsed.location || '').toLowerCase().includes('remote'),
          url: parsed.url || window.location.href,
          sourceId: 'src-extension-import',
          sourceName: 'Extensión Empleo (Navegador)',
          publishedDate: timestamp.split(' ')[0],
          rawDescription: parsed.rawDescription || parsed.description || '',
          requirements: [],
          responsibilities: [],
          status: 'Nueva',
          extractedAt: timestamp,
          isVerified: true,
          verificationStatus: 'Vigente y Verificada'
        };
        const matchScore = calculateMatchScore(partialOffer, profile);
        const newOffer: JobOffer = {
          ...partialOffer,
          matchScore
        } as JobOffer;
        saveStoredOffers([newOffer, ...currentOffers]);
        handleNavigate('market_radar', 'offers');
        // Clean URL parameter
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (e) {
      console.warn('Error importing job from query parameter:', e);
    }
  }, []);

  const handleStartApplicationFromOffer = (offerId: string) => {
    const currentOffers = getStoredOffers();
    const targetOffer = currentOffers.find(o => o.id === offerId);
    if (targetOffer) {
      const currentApps = getStoredApplications();
      const existing = currentApps.find(a => a.offerId === offerId);
      if (!existing) {
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
        const newApp = {
          id: `CAND-${Date.now().toString().slice(-6)}`,
          offerId: targetOffer.id,
          offerTitle: targetOffer.title,
          companyName: targetOffer.company,
          location: targetOffer.location,
          currentStage: 1 as const,
          status: 'En Progreso' as const,
          createdDate: timestamp.split(' ')[0],
          updatedDate: timestamp.split(' ')[0],
          offerUrl: targetOffer.url,
          humanApprovalGranted: false,
          adaptedCvSummary: targetOffer.requirements || [],
          history: [
            {
              id: `h-${Date.now()}`,
              timestamp,
              stage: 1 as const,
              title: `Oferta guardada en Locker desde el Radar`,
              actor: 'Usuario' as const
            }
          ]
        };
        saveStoredApplications([newApp, ...currentApps]);
      }
    }
    handleNavigate('mission_control', 'applications');
  };

  return (
    <div className={`min-h-screen w-full bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-red-500 selection:text-white theme-${theme}`} data-theme={theme}>
      <Navbar
        currentTab={activeTab}
        currentTheme={theme}
        onThemeChange={handleThemeChange}
        onOpenUnifiedHelp={() => setIsUnifiedHelpOpen(true)}
        onSelectStation={(id, subTab) => handleNavigate(id, subTab)}
      />

      <div className="flex-1 flex overflow-hidden w-full">
        <main key={dataRefreshKey} className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto w-full max-w-none">
          {activeTab === 'dashboard' && (
            <WarRoomTab
              onSelectStation={(station, subTab, filter) => handleNavigate(station, subTab, filter)}
              onLaunchRadar={() => handleNavigate('market_radar', 'offers', 'ALL')}
            />
          )}

          {activeTab === 'market_radar' && (
            <MarketRadarTab
              initialSubTab={radarSubTab}
              initialFilter={radarLocationFilter}
              onStartApplication={handleStartApplicationFromOffer}
              onReturnToHub={() => handleNavigate('dashboard')}
            />
          )}

          {activeTab === 'agent_dossier' && (
            <AgentDossierTab
              initialSubTab={dossierSubTab}
              onReturnToHub={() => handleNavigate('dashboard')}
            />
          )}

          {activeTab === 'mission_control' && (
            <MissionControlTab
              initialSubTab={missionSubTab}
              onReturnToHub={() => handleNavigate('dashboard')}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              onRefreshData={handleRefreshData}
              onReturnToHub={() => handleNavigate('dashboard')}
            />
          )}
        </main>
      </div>

      <TacticalHelpAndProtocolModal
        isOpen={isUnifiedHelpOpen}
        onClose={() => setIsUnifiedHelpOpen(false)}
      />
    </div>
  );
}

export default App;
