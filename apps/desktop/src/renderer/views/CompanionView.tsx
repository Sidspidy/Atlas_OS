import React, { useState, useEffect } from 'react';
import { AtlasState } from '@atlas-os/shared';
import { AtlasCharacter } from '@atlas-os/ui';
import { Maximize2, Mic, Search, Camera, Code, Zap } from 'lucide-react';
import { CompanionSpeechBubble, SpeechNotification } from '../components/CompanionSpeechBubble.js';

export const CompanionView: React.FC = () => {
  const [currentState, setCurrentState] = useState<AtlasState>(AtlasState.IDLE);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeNotification, setActiveNotification] = useState<SpeechNotification | null>({
    id: 'welcome',
    title: 'Atlas OS',
    message: 'Atlas companion active. Click Atlas for quick actions.',
    type: 'info',
    actions: [
      { label: 'Open Main App', actionId: 'open_main' },
      { label: 'Dismiss', actionId: 'dismiss' }
    ]
  });

  useEffect(() => {
    if (window.atlasAPI) {
      window.atlasAPI.getState().then((s) => {
        if (s) setCurrentState(s as AtlasState);
      });

      window.atlasAPI.onStateChanged((stateStr) => {
        setCurrentState(stateStr as AtlasState);
      });

      window.atlasAPI.onNotificationReceived((notification) => {
        setActiveNotification(notification);
      });
    }
  }, []);

  const handleRestoreMain = () => {
    if (window.atlasAPI) {
      window.atlasAPI.restoreMain();
    }
  };

  const handleActionClick = (actionId: string) => {
    if (actionId === 'open_main') {
      handleRestoreMain();
    }
    setActiveNotification(null);
  };

  const triggerState = (newState: AtlasState) => {
    setCurrentState(newState);
    if (window.atlasAPI) {
      window.atlasAPI.setState(newState);
    }
  };

  return (
    <div
      style={{
        width: '320px',
        height: '360px',
        background: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        WebkitAppRegion: 'drag'
      } as React.CSSProperties}
    >
      {/* Speech Notification Bubble */}
      {activeNotification && (
        <div style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
          <CompanionSpeechBubble
            notification={activeNotification}
            onDismiss={() => setActiveNotification(null)}
            onActionClick={handleActionClick}
          />
        </div>
      )}

      {/* Floating Atlas Character */}
      <div
        onClick={() => setMenuOpen(!menuOpen)}
        style={{ marginTop: activeNotification ? '70px' : '0px', WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        <AtlasCharacter size="companion" state={currentState} />
      </div>

      {/* Quick Radial Action Menu */}
      {menuOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: '15px',
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-full)',
            padding: '8px 12px',
            display: 'flex',
            gap: '10px',
            boxShadow: 'var(--shadow-glass), var(--glow-cyan)',
            WebkitAppRegion: 'no-drag',
            animation: 'radial-pop 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          } as React.CSSProperties}
        >
          <button onClick={handleRestoreMain} style={btnStyle} title="Open Main Application">
            <Maximize2 size={15} color="var(--accent-cyan)" />
          </button>
          <button onClick={() => triggerState(AtlasState.LISTENING)} style={btnStyle} title="Voice Command">
            <Mic size={15} color="var(--accent-purple)" />
          </button>
          <button onClick={() => triggerState(AtlasState.SEARCHING)} style={btnStyle} title="Search Files">
            <Search size={15} color="var(--accent-cyan)" />
          </button>
          <button onClick={() => triggerState(AtlasState.THINKING)} style={btnStyle} title="Screen Vision">
            <Camera size={15} color="var(--accent-emerald)" />
          </button>
          <button onClick={() => triggerState(AtlasState.WORKING)} style={btnStyle} title="Code Intelligence">
            <Code size={15} color="var(--accent-magenta)" />
          </button>
          <button onClick={() => triggerState(AtlasState.EXCITED)} style={btnStyle} title="Quick Action">
            <Zap size={15} color="var(--accent-amber)" />
          </button>
        </div>
      )}

      {/* Embedded Animation */}
      <style>{`
        @keyframes radial-pop {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

const btnStyle: React.CSSProperties = {
  background: 'var(--bg-glass-hover)',
  border: '1px solid var(--border-glass)',
  borderRadius: '50%',
  width: '32px',
  height: '32px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'transform 0.15s ease, border-color 0.15s ease'
};
