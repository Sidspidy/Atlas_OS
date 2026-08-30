import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@atlas-os/ui';
import { Sidebar } from './components/Sidebar.js';
import { Header } from './components/Header.js';
import { CommandBarModal } from './components/CommandBarModal.js';
import { HomeView } from './views/HomeView.js';
import { CharacterStudioView } from './views/CharacterStudioView.js';
import { CompanionView } from './views/CompanionView.js';
import { AskView } from './views/AskView.js';
import { FilesView } from './views/FilesView.js';
import { ProjectsView } from './views/ProjectsView.js';
import { MemoryView } from './views/MemoryView.js';
import { TerminalView } from './views/TerminalView.js';
import { VoiceControlView } from './views/VoiceControlView.js';
import { VisionView } from './views/VisionView.js';
import { AgentsView } from './views/AgentsView.js';
import { WorkflowsView } from './views/WorkflowsView.js';
import { ProactiveView } from './views/ProactiveView.js';
import { IntegrationsView } from './views/IntegrationsView.js';
import { ObservabilityView } from './views/ObservabilityView.js';
import { SecurityView } from './views/SecurityView.js';
import { SettingsView } from './views/SettingsView.js';

declare global {
  interface Window {
    atlasAPI?: import('../preload/index.js').AtlasAPI;
  }
}

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isCompanion, setIsCompanion] = useState(false);
  const [healthStatus, setHealthStatus] = useState<'ok' | 'degraded' | 'down'>('ok');
  const [isCommandBarOpen, setIsCommandBarOpen] = useState(false);
  const [activePrompt, setActivePrompt] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (window.location.hash === '#companion') {
      setIsCompanion(true);
    }

    const checkHealth = async () => {
      if (window.atlasAPI) {
        const res = await window.atlasAPI.getHealth();
        if (res && res.status) {
          setHealthStatus(res.status);
        }
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectCommand = (query: string) => {
    setActivePrompt(query);
    setActiveTab('ask');
  };

  if (isCompanion) {
    return (
      <ThemeProvider>
        <CompanionView />
      </ThemeProvider>
    );
  }

  const renderView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'character':
        return <CharacterStudioView />;
      case 'ask':
        return <AskView initialPrompt={activePrompt} />;
      case 'files':
        return <FilesView />;
      case 'projects':
        return <ProjectsView />;
      case 'memory':
        return <MemoryView />;
      case 'terminal':
        return <TerminalView />;
      case 'voice':
        return <VoiceControlView />;
      case 'vision':
        return <VisionView />;
      case 'agents':
        return <AgentsView />;
      case 'workflows':
        return <WorkflowsView />;
      case 'proactive':
        return <ProactiveView />;
      case 'integrations':
        return <IntegrationsView />;
      case 'observability':
        return <ObservabilityView />;
      case 'security':
        return <SecurityView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <ThemeProvider>
      <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', background: 'var(--bg-primary)' }}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
          <Header backendHealth={healthStatus} onOpenCommandBar={() => setIsCommandBarOpen(true)} />
          <main style={{ flex: 1, overflowY: 'auto' }}>
            {renderView()}
          </main>
        </div>

        <CommandBarModal
          isOpen={isCommandBarOpen}
          onClose={() => setIsCommandBarOpen(false)}
          onSelectCommand={handleSelectCommand}
        />
      </div>
    </ThemeProvider>
  );
};

export default App;
