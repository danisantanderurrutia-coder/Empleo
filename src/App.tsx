import { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { TacticalHelpAndProtocolModal } from './components/common/TacticalHelpAndProtocolModal';

import { WarRoomTab } from './components/warroom/WarRoomTab';
import { MarketRadarTab } from './components/radar/MarketRadarTab';
import { AgentDossierTab } from './components/dossier/AgentDossierTab';
import { MissionControlTab } from './components/control/MissionControlTab';
import { FundingTab } from './components/funding/FundingTab';
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
  const [dossierSubTab, setDossierSubTab] = useState<'showcase' | 'skills' | 'profile' | 'cvs' | 'studio'>('showcase');
  const [studioOfferId, setStudioOfferId] = useState<string | undefined>();
  const [studioDocType, setStudioDocType] = useState<'cv' | 'cover_letter'>('cv');
  const [missionSubTab, setMissionSubTab] = useState<'applications' | 'batch' | 'intelligence'>('applications');

  const [isUnifiedHelpOpen, setIsUnifiedHelpOpen] = useState(false);
  const [dataRefreshKey, setDataRefreshKey] = useState(0);

  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  const handleToggleTheme = () => {
    const nextTheme: AppTheme = theme === 'arctic' ? 'cyber' : 'arctic';
    setTheme(nextTheme);
    saveStoredTheme(nextTheme);
  };

  const handleNavigate = (
    stationId: string,
    subTab?: string,
    filterParam?: string,
    targetOfferId?: string,
    targetDocType: 'cv' | 'cover_letter' = 'cv'
  ) => {
    if (targetOfferId) {
      setStudioOfferId(targetOfferId);
    }
    setStudioDocType(targetDocType);

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

    if (stationId === 'agent_dossier' || ['showcase', 'gunsmith', 'skills', 'profile', 'cvs', 'studio'].includes(stationId)) {
      if (subTab === 'gunsmith' || stationId === 'gunsmith') setDossierSubTab('studio'); // Taller CV fusionado en CV Studio
      else if (subTab === 'skills' || stationId === 'skills') setDossierSubTab('showcase'); // Competencias integradas en Resumen
      else if (subTab === 'cvs' || stationId === 'cvs') setDossierSubTab('studio'); // Plantillas unificadas en CV Studio
      else if (subTab === 'studio' || stationId === 'studio') {
        setDossierSubTab('studio');
        if (filterParam && !targetOfferId) setStudioOfferId(filterParam);
      }
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

  const handleStartApplicationFromFunding = (fundingTitle: string, org: string) => {
    const currentApps = getStoredApplications();
    const existing = currentApps.find(a => a.offerTitle === fundingTitle && a.companyName === org);
    if (!existing) {
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
      const newApp = {
        id: `CAND-FUND-${Date.now().toString().slice(-6)}`,
        offerId: `fund-${Date.now()}`,
        offerTitle: fundingTitle,
        companyName: org,
        location: 'Convocatoria I+D (UE / DACH / Euskadi)',
        currentStage: 1 as const,
        status: 'En Progreso' as const,
        createdDate: timestamp.split(' ')[0],
        updatedDate: timestamp.split(' ')[0],
        humanApprovalGranted: false,
        adaptedCvSummary: ['Convocatoria I+D / Beca de Excelencia'],
        history: [
          {
            id: `h-${Date.now()}`,
            timestamp,
            stage: 1 as const,
            title: `Convocatoria registrada para postulación (${fundingTitle})`,
            actor: 'Usuario' as const
          }
        ]
      };
      saveStoredApplications([newApp, ...currentApps]);
    }
    handleNavigate('mission_control', 'applications');
  };

  return (
    <div 
      className={`min-h-screen w-full bg-[var(--bg-app)] text-[var(--text-primary)] flex flex-col font-sans selection:bg-sky-500 selection:text-white theme-${theme} transition-colors duration-300 relative overflow-x-hidden`} 
      data-theme={theme}
    >
      {/* Tactical Snow Atmosphere Layer (Rainbow Six Operation Black Ice / Chalet) */}
      <div 
        className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-700 ${
          theme === 'arctic' ? 'tactical-snow-atmosphere opacity-90' : 'tactical-dark-snow-atmosphere opacity-95'
        }`}
      />

      {/* High-tech Technical Coordinate & Compass Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 tactical-grid-overlay opacity-40" />

      {/* Main Content with Relative Stacking */}
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        <Navbar
          currentTab={activeTab}
          currentTheme={theme}
          onToggleTheme={handleToggleTheme}
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
                onOpenStudio={(offerId, docType) => handleNavigate('agent_dossier', 'studio', undefined, offerId, docType)}
                onReturnToHub={() => handleNavigate('dashboard')}
              />
            )}

            {(activeTab === 'funding' || activeTab === 'convocatorias') && (
              <FundingTab
                onStartApplication={handleStartApplicationFromFunding}
                onReturnToHub={() => handleNavigate('dashboard')}
              />
            )}

            {activeTab === 'agent_dossier' && (
              <AgentDossierTab
                initialSubTab={dossierSubTab}
                initialStudioOfferId={studioOfferId}
                initialStudioDocType={studioDocType}
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
    </div>
  );
}

export default App;
