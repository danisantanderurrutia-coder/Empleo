import { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ContextualHelpModal } from './components/layout/ContextualHelpModal';
import { GuidedTourOverlay } from './components/layout/GuidedTourOverlay';
import { ProtocolModal } from './components/offers/ProtocolModal';

import { WarRoomTab } from './components/warroom/WarRoomTab';
import { MarketRadarTab } from './components/radar/MarketRadarTab';
import { AgentDossierTab } from './components/dossier/AgentDossierTab';
import { MissionControlTab } from './components/control/MissionControlTab';
import { SettingsTab } from './components/settings/SettingsTab';

import { getStoredOffers, saveStoredOffers, getStoredProfile } from './services/db';
import { calculateMatchScore } from './services/matchEngine';
import type { JobOffer } from './types/offers';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [radarSubTab, setRadarSubTab] = useState<'offers' | 'sources' | 'companies'>('offers');
  const [dossierSubTab, setDossierSubTab] = useState<'profile' | 'cvs'>('profile');
  const [missionSubTab, setMissionSubTab] = useState<'applications' | 'batch' | 'intelligence'>('applications');

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isGuidedTourOpen, setIsGuidedTourOpen] = useState(false);
  const [isProtocolOpen, setIsProtocolOpen] = useState(false);
  const [dataRefreshKey, setDataRefreshKey] = useState(0);

  const handleNavigate = (stationId: string, subTab?: string) => {
    if (stationId === 'market_radar' || ['offers', 'sources', 'companies'].includes(stationId)) {
      if (subTab === 'sources' || stationId === 'sources') setRadarSubTab('sources');
      else if (subTab === 'companies' || stationId === 'companies') setRadarSubTab('companies');
      else setRadarSubTab('offers');
      setActiveTab('market_radar');
      return;
    }

    if (stationId === 'agent_dossier' || ['profile', 'cvs'].includes(stationId)) {
      if (subTab === 'cvs' || stationId === 'cvs') setDossierSubTab('cvs');
      else setDossierSubTab('profile');
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

  const handleStartApplicationFromOffer = (_offerId: string) => {
    handleNavigate('mission_control', 'applications');
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      <Navbar
        currentTab={activeTab}
        onOpenContextHelp={() => setIsHelpOpen(true)}
        onStartGuidedTour={() => setIsGuidedTourOpen(true)}
        onOpenProtocolModal={() => setIsProtocolOpen(true)}
        onRefreshData={handleRefreshData}
        onSelectStation={(id) => handleNavigate(id)}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tabId) => handleNavigate(tabId)}
        />

        <main key={dataRefreshKey} className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <WarRoomTab
              onSelectStation={(station, subTab) => handleNavigate(station, subTab)}
              onLaunchRadar={() => handleNavigate('market_radar', 'offers')}
            />
          )}

          {activeTab === 'market_radar' && (
            <MarketRadarTab
              initialSubTab={radarSubTab}
              onStartApplication={handleStartApplicationFromOffer}
            />
          )}

          {activeTab === 'agent_dossier' && (
            <AgentDossierTab
              initialSubTab={dossierSubTab}
            />
          )}

          {activeTab === 'mission_control' && (
            <MissionControlTab
              initialSubTab={missionSubTab}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              onRefreshData={handleRefreshData}
            />
          )}
        </main>
      </div>

      <ContextualHelpModal
        currentTab={activeTab}
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        onGoToTutorial={() => handleNavigate('dashboard')}
      />

      <GuidedTourOverlay
        isOpen={isGuidedTourOpen}
        onClose={() => setIsGuidedTourOpen(false)}
        onSelectTab={(tabId) => handleNavigate(tabId)}
      />

      <ProtocolModal
        isOpen={isProtocolOpen}
        onClose={() => setIsProtocolOpen(false)}
      />
    </div>
  );
}

export default App;
