import React, { useState } from 'react';
import { Home, Zap, Folder, Code, Terminal, CheckSquare, Calendar, Brain, Plug, Settings, Mic, MicOff, Volume2, VolumeX, Sliders, Sparkles } from 'lucide-react';
import { AudioWaveformVisualizer } from './AudioWaveformVisualizer.js';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'character', label: 'Character Studio', icon: Sparkles },
    { id: 'ask', label: 'Command Center', icon: Zap },
    { id: 'files', label: 'Files & Search', icon: Folder },
    { id: 'projects', label: 'Code Assistant', icon: Code },
    { id: 'terminal', label: 'Terminal', icon: Terminal },
    { id: 'workflows', label: 'Tasks & Notes', icon: CheckSquare },
    { id: 'proactive', label: 'Calendar', icon: Calendar },
    { id: 'memory', label: 'Memories', icon: Brain },
    { id: 'integrations', label: 'Plugins', icon: Plug },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside
      style={{
        width: '260px',
        height: '100vh',
        background: 'rgba(10, 14, 24, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 14px',
        boxSizing: 'border-box',
        zIndex: 10
      }}
    >
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingLeft: '8px' }}>
        <div
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #a855f7, #38bdf8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(168, 85, 247, 0.4)'
          }}
        >
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>A</span>
        </div>
        <div>
          <div style={{ fontSize: '17px', fontWeight: 700, letterSpacing: '-0.3px', color: '#fff' }}>Atlas OS</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Your AI Companion</div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflowY: 'auto' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '10px',
                border: 'none',
                background: isActive ? 'linear-gradient(90deg, rgba(168, 85, 247, 0.25), rgba(56, 189, 248, 0.1))' : 'transparent',
                color: isActive ? '#fff' : 'var(--text-muted)',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                textAlign: 'left',
                borderLeft: isActive ? '3px solid #a855f7' : '3px solid transparent'
              }}
            >
              <Icon size={18} color={isActive ? '#a855f7' : 'var(--text-muted)'} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Voice Agent Sidebar Widget (Bottom Card) */}
      <div
        style={{
          marginTop: '16px',
          background: 'rgba(20, 26, 42, 0.8)',
          border: '1px solid rgba(168, 85, 247, 0.25)',
          borderRadius: '14px',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #a855f7, #38bdf8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '14px' }}>🤖</span>
            </div>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', position: 'absolute', bottom: 0, right: 0, border: '2px solid #0a0e18' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>Atlas Voice</div>
            <div style={{ fontSize: '11px', color: '#a855f7', fontWeight: 500 }}>{isMicOn ? 'Listening...' : 'Standby'}</div>
          </div>
        </div>

        {/* Live Audio Spectrum Canvas */}
        <div style={{ height: '32px', width: '100%', borderRadius: '6px', overflow: 'hidden', background: 'rgba(0, 0, 0, 0.3)' }}>
          <AudioWaveformVisualizer isListening={isMicOn} isSpeaking={false} />
        </div>

        {/* Voice Control Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
          <button
            onClick={() => setIsMicOn(!isMicOn)}
            style={{ background: isMicOn ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.05)', border: 'none', borderRadius: '6px', padding: '6px', color: isMicOn ? '#a855f7' : 'var(--text-muted)', cursor: 'pointer' }}
          >
            {isMicOn ? <Mic size={14} /> : <MicOff size={14} />}
          </button>
          <button
            onClick={() => setIsMuted(!isMuted)}
            style={{ background: isMuted ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.05)', border: 'none', borderRadius: '6px', padding: '6px', color: isMuted ? '#ef4444' : 'var(--text-muted)', cursor: 'pointer' }}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
          <button
            onClick={() => setActiveTab('voice')}
            style={{ background: 'rgba(255, 255, 255, 0.05)', border: 'none', borderRadius: '6px', padding: '6px', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <Sliders size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
};
