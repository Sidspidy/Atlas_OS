import React from 'react';
import { Search, Minimize2, User } from 'lucide-react';
import { StatusIndicator, AtlasEmblemLogo } from '@atlas-os/ui';

interface HeaderProps {
  backendHealth: 'ok' | 'degraded' | 'down';
  onOpenCommandBar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ backendHealth, onOpenCommandBar }) => {
  const handleMinimizeToCompanion = () => {
    if (window.atlasAPI) {
      window.atlasAPI.minimizeToCompanion();
    }
  };

  return (
    <header
      style={{
        height: '64px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        background: 'rgba(10, 14, 24, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitAppRegion: 'drag',
        zIndex: 9
      } as React.CSSProperties}
    >
      {/* Universal Search Bar */}
      <div
        onClick={onOpenCommandBar}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '8px 18px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          width: '380px',
          cursor: 'pointer',
          WebkitAppRegion: 'no-drag'
        } as React.CSSProperties}
      >
        <Search size={16} color="var(--text-muted)" />
        <span style={{ fontSize: '13px', color: 'var(--text-muted)', flex: 1 }}>Search AI tools, documents...</span>
        <span
          style={{
            fontSize: '11px',
            color: 'var(--text-dim)',
            background: 'rgba(255, 255, 255, 0.08)',
            padding: '2px 8px',
            borderRadius: '6px',
            fontFamily: 'monospace'
          }}
        >
          Ctrl + K
        </span>
      </div>

      {/* Action Items & System Profile Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px', WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        <StatusIndicator
          status={backendHealth === 'ok' ? 'online' : backendHealth === 'degraded' ? 'warning' : 'offline'}
          label={backendHealth === 'ok' ? 'System Operational' : 'Backend Offline'}
        />

        {/* Companion Mode Button */}
        <button
          onClick={handleMinimizeToCompanion}
          style={{
            background: 'rgba(168, 85, 247, 0.15)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            color: '#a855f7',
            padding: '6px 14px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: 600
          }}
        >
          <Minimize2 size={14} />
          Companion
        </button>

        {/* System Logged-In User Profile Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '8px', borderLeft: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <AtlasEmblemLogo size={32} />
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>ShadowStorm</span>
        </div>
      </div>
    </header>
  );
};
