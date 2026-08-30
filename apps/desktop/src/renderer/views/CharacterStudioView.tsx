import React, { useState } from 'react';
import { AtlasState } from '@atlas-os/shared';
import { EYE_EXPRESSION_MAP } from '@atlas-os/character';
import { AtlasCharacter, GlassPanel, Button } from '@atlas-os/ui';
import { Sparkles, Eye, Play, ShieldAlert, Cpu, Layers, RefreshCw, Zap, Bell, CheckCircle2 } from 'lucide-react';

export const CharacterStudioView: React.FC = () => {
  const [selectedState, setSelectedState] = useState<AtlasState>(AtlasState.IDLE);
  const [characterSize, setCharacterSize] = useState<'sm' | 'md' | 'lg'>('lg');
  const [activeTab, setActiveTab] = useState<'expressions' | 'parameters'>('expressions');

  const allStates: { state: AtlasState; label: string; desc: string; category: string }[] = [
    { state: AtlasState.IDLE, label: 'IDLE', desc: 'Default standby state with gentle breathing & pupil glint shimmer', category: 'Basic' },
    { state: AtlasState.LISTENING, label: 'LISTENING', desc: 'Audio mic active with 5-bar equalizer frequency animation', category: 'Voice' },
    { state: AtlasState.THINKING, label: 'THINKING', desc: 'Reasoning & LLM processing with scanning orbital rings', category: 'AI Processing' },
    { state: AtlasState.SEARCHING, label: 'SEARCHING', desc: 'RAG vector search & directory indexing with radar sweep', category: 'Search' },
    { state: AtlasState.WORKING, label: 'WORKING', desc: 'Tool execution & code generation with spinning progress ring', category: 'Task Execution' },
    { state: AtlasState.SPEAKING, label: 'SPEAKING', desc: 'TTS voice playback with dynamic audio spectrum pulse', category: 'Voice' },
    { state: AtlasState.SUCCESS, label: 'SUCCESS', desc: 'Task completion & build success with sparkling victory arches', category: 'Status' },
    { state: AtlasState.WARNING, label: 'WARNING', desc: 'System alert & high CPU/resource usage warning exclamation', category: 'Alerts' },
    { state: AtlasState.ERROR, label: 'ERROR', desc: 'Compilation failure or connection error with slanted cross eyes', category: 'Alerts' },
    { state: AtlasState.SLEEP, label: 'SLEEP', desc: 'Idle sleep mode with closed cute curved eye arches', category: 'Basic' },
    { state: AtlasState.EXCITED, label: 'EXCITED', desc: 'High confidence match or major milestone with enlarged pupils', category: 'Basic' },
    { state: AtlasState.AWAITING_PERMISSION, label: 'AWAITING_PERMISSION', desc: 'High-risk terminal command alert with shield lock matrix', category: 'Security' },
    { state: AtlasState.PAUSED, label: 'PAUSED', desc: 'Assistant paused from system tray or user toggle', category: 'Status' },
    { state: AtlasState.PLANNING, label: 'PLANNING', desc: 'Goal decomposition into multi-agent step DAGs', category: 'AI Processing' }
  ];

  const handleSelectState = (state: AtlasState) => {
    setSelectedState(state);
    if (window.atlasAPI) {
      window.atlasAPI.setState(state);
    }
  };

  const currentConfig = EYE_EXPRESSION_MAP[selectedState] || EYE_EXPRESSION_MAP[AtlasState.IDLE];

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 600 }}>Atlas Character Studio & Expression Matrix</h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            Interactive preview showcase of all 14 digital eye expressions & character states
          </p>
        </div>

        {/* Size Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-secondary)', padding: '4px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
          {(['sm', 'md', 'lg'] as const).map((sz) => (
            <button
              key={sz}
              onClick={() => setCharacterSize(sz)}
              style={{
                background: characterSize === sz ? 'var(--accent-purple)' : 'transparent',
                color: characterSize === sz ? '#fff' : 'var(--text-muted)',
                border: 'none',
                padding: '4px 12px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'uppercase'
              }}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <GlassPanel glow style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '36px 20px', gap: '20px' }}>
        <AtlasCharacter size={characterSize} state={selectedState} />

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>{selectedState}</div>
          <div style={{ fontSize: '13px', color: currentConfig.primaryColor, fontWeight: 600, marginTop: '4px' }}>
            {currentConfig.label}
          </div>
        </div>

        {/* Action Triggers */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button
            variant="primary"
            onClick={() => {
              if (window.atlasAPI) {
                window.atlasAPI.showNotification({
                  title: `Atlas State: ${selectedState}`,
                  message: `Current expression active: ${currentConfig.label}`,
                  type: selectedState === AtlasState.ERROR ? 'error' : selectedState === AtlasState.WARNING ? 'warning' : 'info'
                });
              }
            }}
          >
            <Bell size={15} /> Trigger Companion Notification
          </Button>

          <Button variant="ghost" onClick={() => handleSelectState(AtlasState.IDLE)}>
            <RefreshCw size={15} /> Reset to IDLE
          </Button>
        </div>
      </GlassPanel>

      {/* Expression Cards Grid */}
      <div>
        <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="var(--accent-cyan)" />
          All 14 Character State Expressions
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
          {allStates.map((item) => {
            const isSelected = selectedState === item.state;
            const cfg = EYE_EXPRESSION_MAP[item.state];
            return (
              <div
                key={item.state}
                onClick={() => handleSelectState(item.state)}
                style={{
                  background: isSelected ? 'rgba(168, 85, 247, 0.12)' : 'var(--bg-secondary)',
                  border: isSelected ? '2px solid var(--accent-purple)' : '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)', background: 'var(--border-glass)', padding: '2px 8px', borderRadius: '4px' }}>
                    {item.category}
                  </span>
                  {isSelected && <CheckCircle2 size={16} color="var(--accent-purple)" />}
                </div>

                {/* Micro Character Preview */}
                <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
                  <AtlasCharacter size="sm" state={item.state} interactive={false} />
                </div>

                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: isSelected ? 'var(--accent-purple)' : '#fff' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
