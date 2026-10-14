import { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ContextualHelpModal } from './components/layout/ContextualHelpModal';
import { GuidedTourOverlay } from './components/layout/GuidedTourOverlay';
import { ProtocolModal } from './components/offers/ProtocolModal';

import { DashboardTab } from './components/dashboard/DashboardTab';
import { MasterProfileTab } from './components/profile/MasterProfileTab';
import { CVManagementTab } from './components/cvs/CVManagementTab';
import { SourcesTab } from './components/sources/SourcesTab';
import { OffersTab } from './components/offers/OffersTab';
import { CompaniesTab } from './components/companies/CompaniesTab';
import { ApplicationsTab } from './components/applications/ApplicationsTab';
import { BatchApplicationsTab } from './components/applications/BatchApplicationsTab';
import { IntelligenceTab } from './components/intelligence/IntelligenceTab';
import { SettingsTab } from './components/settings/SettingsTab';

import { runDailyJobSearchWorkflow, runUpdateDocumentationWorkflow, runProcessApplicationWorkflow } from './services/agents';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isGuidedTourOpen, setIsGuidedTourOpen] = useState(false);
  const [isProtocolOpen, setIsProtocolOpen] = useState(false);
  const [dataRefreshKey, setDataRefreshKey] = useState(0);

  const handleRefreshData = () => {
    setDataRefreshKey(prev => prev + 1);
  };

  const handleRunWorkflow = (workflowName: string) => {
    if (workflowName === '/daily-job-search') {
      runDailyJobSearchWorkflow();
      handleRefreshData();
      setActiveTab('offers');
    } else if (workflowName === '/update-documentation') {
      runUpdateDocumentationWorkflow();
      handleRefreshData();
      setActiveTab('tutorial');
    } else if (workflowName === '/process-application') {
      runProcessApplicationWorkflow('off-101');
      handleRefreshData();
      setActiveTab('applications');
    }
  };

  const handleStartApplicationFromOffer = (offerId: string) => {
    runProcessApplicationWorkflow(offerId);
    handleRefreshData();
    setActiveTab('applications');
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      <Navbar
        currentTab={activeTab}
        onOpenContextHelp={() => setIsHelpOpen(true)}
        onStartGuidedTour={() => setIsGuidedTourOpen(true)}
        onOpenProtocolModal={() => setIsProtocolOpen(true)}
        onRefreshData={handleRefreshData}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tabId) => setActiveTab(tabId)}
        />

        <main key={dataRefreshKey} className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardTab
              onSelectTab={(tabId) => setActiveTab(tabId)}
              onRunWorkflow={handleRunWorkflow}
              onSelectOffer={() => {
                setActiveTab('offers');
              }}
              onSelectApplication={() => {
                setActiveTab('applications');
              }}
            />
          )}

          {activeTab === 'profile' && <MasterProfileTab />}

          {activeTab === 'cvs' && <CVManagementTab />}

          {activeTab === 'sources' && <SourcesTab />}

          {activeTab === 'offers' && (
            <OffersTab
              onStartApplication={handleStartApplicationFromOffer}
            />
          )}

          {activeTab === 'companies' && <CompaniesTab />}

          {activeTab === 'batch_applications' && <BatchApplicationsTab />}

          {activeTab === 'applications' && <ApplicationsTab />}

          {activeTab === 'intelligence' && <IntelligenceTab />}

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
        onGoToTutorial={() => setActiveTab('tutorial')}
      />

      <GuidedTourOverlay
        isOpen={isGuidedTourOpen}
        onClose={() => setIsGuidedTourOpen(false)}
        onSelectTab={(tabId) => setActiveTab(tabId)}
      />

      <ProtocolModal
        isOpen={isProtocolOpen}
        onClose={() => setIsProtocolOpen(false)}
      />
    </div>
  );
}

export default App;
