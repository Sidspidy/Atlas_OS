import React from 'react';
import { Search, Bell, Settings, Moon, Sun, Minimize2, User } from 'lucide-react';
import { StatusIndicator, useTheme } from '@atlas-os/ui';

interface HeaderProps {
  backendHealth: 'ok' | 'degraded' | 'down';
  onOpenCommandBar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ backendHealth, onOpenCommandBar }) => {
  const { theme, toggleTheme } = useTheme();

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
        background: 'rgba(10, 14, 24, 0.8)',
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
        <span style={{ fontSize: '13px', color: 'var(--text-muted)', flex: 1 }}>Search anything...</span>
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

      {/* Action Items & Profile Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px', WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        <StatusIndicator
          status={backendHealth === 'ok' ? 'online' : backendHealth === 'degraded' ? 'warning' : 'offline'}
          label={backendHealth === 'ok' ? 'System Operational' : 'Backend Offline'}
        />

        {/* Notification Bell Badge */}
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <Bell size={18} color="var(--text-muted)" />
          <span
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: '#ef4444',
              color: '#fff',
              fontSize: '9px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            3
          </span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px'
          }}
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

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

        {/* User Profile Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '8px', borderLeft: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #a855f7, #38bdf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px rgba(168, 85, 247, 0.4)' }}>
            <User size={16} color="#fff" />
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>Arjun</span>
        </div>
      </div>
    </header>
  );
};
