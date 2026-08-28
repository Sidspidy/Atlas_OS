import React, { useState } from 'react';
import { AtlasState } from '@atlas-os/shared';
import { EYE_EXPRESSION_MAP } from '@atlas-os/character';
import { AtlasCharacter, GlassPanel, Button } from '@atlas-os/ui';
import { Sparkles, Terminal, FileText, CheckCircle2, ShieldAlert, MousePointer, Cpu } from 'lucide-react';

export const HomeView: React.FC = () => {
  const [currentState, setCurrentState] = useState<AtlasState>(AtlasState.IDLE);
  const [stateHistory, setStateHistory] = useState<{ state: AtlasState; time: string }[]>([
    { state: AtlasState.IDLE, time: new Date().toLocaleTimeString() }
  ]);

  const handleStateChange = (newState: AtlasState) => {
    setCurrentState(newState);
    setStateHistory((prev) => [{ state: newState, time: new Date().toLocaleTimeString() }, ...prev.slice(0, 7)]);
    if (window.atlasAPI) {
      window.atlasAPI.setState(newState);
    }
  };

  const currentConfig = EYE_EXPRESSION_MAP[currentState];

  const stateButtons = [
    { state: AtlasState.IDLE, label: 'IDLE' },
    { state: AtlasState.LISTENING, label: 'LISTENING' },
    { state: AtlasState.THINKING, label: 'THINKING' },
    { state: AtlasState.SEARCHING, label: 'SEARCHING' },
    { state: AtlasState.PLANNING, label: 'PLANNING' },
    { state: AtlasState.WORKING, label: 'WORKING' },
    { state: AtlasState.SPEAKING, label: 'SPEAKING' },
    { state: AtlasState.SUCCESS, label: 'SUCCESS' },
    { state: AtlasState.WARNING, label: 'WARNING' },
    { state: AtlasState.ERROR, label: 'ERROR' },
    { state: AtlasState.SLEEP, label: 'SLEEP' },
    { state: AtlasState.EXCITED, label: 'EXCITED' },
    { state: AtlasState.PAUSED, label: 'PAUSED' },
    { state: AtlasState.AWAITING_PERMISSION, label: 'PERMISSION' }
  ];

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px', overflowY: 'auto' }}>
      {/* Hero Section with Atlas Character */}
      <GlassPanel glow style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px', gap: '20px' }}>
        <AtlasCharacter size="lg" state={currentState} />

        <div style={{ textAlign: 'center' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '26px', fontWeight: 600 }}>Good morning. Atlas is ready.</h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px' }}>
            State: <span style={{ color: currentConfig.primaryColor, fontWeight: 700 }}>{currentState}</span> — {currentConfig.label}
          </p>
        </div>

        {/* State Machine Controller Panel */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', maxWidth: '800px', marginTop: '10px' }}>
          {stateButtons.map((btn) => (
            <button
              key={btn.state}
              onClick={() => handleStateChange(btn.state)}
              style={{
                background: currentState === btn.state ? currentConfig.primaryColor : 'var(--bg-glass-hover)',
                color: currentState === btn.state ? '#000' : 'var(--text-main)',
                border: '1px solid var(--border-glass)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Floating Speech Toast Test Trigger */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
          <Button
            variant="default"
            onClick={() => {
              if (window.atlasAPI) {
                window.atlasAPI.showNotification({
                  title: 'Code Analysis',
                  message: 'I found 3 TypeScript compilation issues in auth.service.ts.',
                  type: 'warning',
                  actions: [
                    { label: 'Explain', actionId: 'explain' },
                    { label: 'Open File', actionId: 'open_file' }
                  ]
                });
              }
            }}
          >
            <Sparkles size={14} color="var(--accent-purple)" />
            Send Companion Notification Alert
          </Button>
        </div>
      </GlassPanel>

      {/* Grid Section: Expression Metadata & State Timeline */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Digital Eyes Parameters */}
        <GlassPanel style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 600 }}>
            <Cpu size={18} color="var(--accent-cyan)" />
            Digital Eyes Display Matrix
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', color: 'var(--text-muted)' }}>
            <div style={paramCardStyle}>
              <span>Eye Expression Type</span>
              <strong style={{ color: 'var(--text-main)', textTransform: 'capitalize' }}>{currentConfig.eyeType}</strong>
            </div>
            <div style={paramCardStyle}>
              <span>Cursor Tracking</span>
              <strong style={{ color: currentConfig.enableCursorTracking ? 'var(--accent-emerald)' : 'var(--text-dim)' }}>
                {currentConfig.enableCursorTracking ? 'Enabled (Active)' : 'Disabled'}
              </strong>
            </div>
            <div style={paramCardStyle}>
              <span>Pulse Speed</span>
              <strong style={{ color: 'var(--text-main)' }}>{currentConfig.pulseSpeedMs} ms</strong>
            </div>
            <div style={paramCardStyle}>
              <span>Blink Routine</span>
              <strong style={{ color: 'var(--text-main)' }}>
                {currentConfig.blinkIntervalMs > 0 ? `${currentConfig.blinkIntervalMs} ms` : 'Disabled'}
              </strong>
            </div>
          </div>
        </GlassPanel>

        {/* Live State Machine History Log */}
        <GlassPanel style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 600 }}>
            <Sparkles size={18} color="var(--accent-purple)" />
            State Transition History Log
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '180px', overflowY: 'auto' }}>
            {stateHistory.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', background: 'var(--bg-secondary)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontWeight: 600, color: EYE_EXPRESSION_MAP[item.state].primaryColor }}>{item.state}</span>
                <span style={{ color: 'var(--text-dim)', fontSize: '12px' }}>{item.time}</span>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};

const paramCardStyle: React.CSSProperties = {
  background: 'var(--bg-secondary)',
  padding: '12px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border-glass)',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
};
