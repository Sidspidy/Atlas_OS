import React, { useState, useEffect } from 'react';
import { Home, Zap, FileText, Image, Wand2, FilePlus, Mic, MicOff, Volume2, VolumeX, Sliders, Sparkles, Terminal } from 'lucide-react';
import { AtlasEmblemLogo } from '@atlas-os/ui';
import { AtlasState } from '@atlas-os/shared';
import { AudioWaveformVisualizer } from './AudioWaveformVisualizer.js';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentState, setCurrentState] = useState<AtlasState>(AtlasState.IDLE);

  useEffect(() => {
    if ((window as any).atlasAPI && (window as any).atlasAPI.onStateChanged) {
      const unsubscribe = (window as any).atlasAPI.onStateChanged((newStateStr: string) => {
        setCurrentState(newStateStr as AtlasState);
      });
      return () => {
        if (typeof unsubscribe === 'function') unsubscribe();
      };
    }
  }, []);

  // AI Product Suite Navigation
  const navItems = [
    { id: 'home', label: 'Home Dashboard', icon: Home },
    { id: 'ask', label: 'AI Chat Assistant', icon: Zap },
    { id: 'pdf-analyzer', label: 'PDF Analyzer', icon: FileText },
    { id: 'image-vision', label: 'Image Vision', icon: Image },
    { id: 'image-generator', label: 'AI Image Generator', icon: Wand2 },
    { id: 'pdf-creator', label: 'PDF Creator', icon: FilePlus },
    { id: 'api-tester', label: 'API Tester (Postman)', icon: Terminal },
    { id: 'voice', label: 'Voice Assistant', icon: Mic },
    { id: 'character', label: 'Character Studio', icon: Sparkles }
  ];

  const isSpeaking = currentState === AtlasState.SPEAKING;

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
      {/* Brand Header with Character Collar Emblem A Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingLeft: '4px' }}>
        <AtlasEmblemLogo size={36} />
        <div>
          <div style={{ fontSize: '17px', fontWeight: 700, letterSpacing: '-0.3px', color: '#fff' }}>Atlas AI Suite</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Desktop AI Product Suite</div>
        </div>
      </div>

      {/* AI Product Suite Navigation Items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1, overflowY: 'auto' }}>
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
                padding: '9px 12px',
                borderRadius: '10px',
                border: 'none',
                background: isActive ? 'linear-gradient(90deg, rgba(168, 85, 247, 0.25), rgba(56, 189, 248, 0.1))' : 'transparent',
                color: isActive ? '#fff' : 'var(--text-muted)',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                textAlign: 'left',
                borderLeft: isActive ? '3px solid #a855f7' : '3px solid transparent'
              }}
            >
              <Icon size={17} color={isActive ? '#a855f7' : 'var(--text-muted)'} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Voice Agent Sidebar Widget */}
      <div
        style={{
          marginTop: '12px',
          background: 'rgba(20, 26, 42, 0.8)',
          border: '1px solid rgba(168, 85, 247, 0.25)',
          borderRadius: '14px',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <AtlasEmblemLogo size={28} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', position: 'absolute', bottom: 0, right: 0, border: '2px solid #0a0e18' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>Atlas Anime Voice</div>
            <div style={{ fontSize: '10px', color: isSpeaking ? '#34d399' : '#a855f7', fontWeight: 500 }}>
              {isSpeaking ? '🗣️ Speaking Output...' : isMicOn ? 'Cute Voice Active' : 'Standby'}
            </div>
          </div>
        </div>

        {/* Live Audio Spectrum Canvas (Animates on isListening OR isSpeaking) */}
        <div style={{ height: '28px', width: '100%', borderRadius: '6px', overflow: 'hidden', background: 'rgba(0, 0, 0, 0.3)' }}>
          <AudioWaveformVisualizer isListening={isMicOn || isSpeaking} isSpeaking={isSpeaking} />
        </div>

        {/* Voice Control Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '2px' }}>
          <button
            onClick={() => setIsMicOn(!isMicOn)}
            style={{ background: isMicOn ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.05)', border: 'none', borderRadius: '6px', padding: '5px', color: isMicOn ? '#a855f7' : 'var(--text-muted)', cursor: 'pointer' }}
          >
            {isMicOn ? <Mic size={13} /> : <MicOff size={13} />}
          </button>
          <button
            onClick={() => setIsMuted(!isMuted)}
            style={{ background: isMuted ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.05)', border: 'none', borderRadius: '6px', padding: '5px', color: isMuted ? '#ef4444' : 'var(--text-muted)', cursor: 'pointer' }}
          >
            {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
          </button>
          <button
            onClick={() => setActiveTab('voice')}
            style={{ background: 'rgba(255, 255, 255, 0.05)', border: 'none', borderRadius: '6px', padding: '5px', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <Sliders size={13} />
          </button>
        </div>
      </div>
    </aside>
  );
};
