import React from 'react';
import { Search, Moon, Sun, Minimize2 } from 'lucide-react';
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
        borderBottom: '1px solid var(--border-glass)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(16px)',
        WebkitAppRegion: 'drag'
      } as React.CSSProperties}
    >
      {/* Universal Command Bar Input */}
      <div
        onClick={onOpenCommandBar}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'var(--bg-secondary)',
          padding: '8px 16px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-glass)',
          width: '360px',
          cursor: 'pointer',
          WebkitAppRegion: 'no-drag'
        } as React.CSSProperties}
      >
        <Search size={16} color="var(--text-muted)" />
        <input
          type="text"
          placeholder="Ask Atlas or search commands... (Ctrl+Space)"
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-main)',
            fontSize: '13px',
            width: '100%'
          }}
        />
        <span
          style={{
            fontSize: '11px',
            color: 'var(--text-dim)',
            background: 'var(--border-glass)',
            padding: '2px 6px',
            borderRadius: '4px'
          }}
        >
          Ctrl+Space
        </span>
      </div>

      {/* Action Items */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        <StatusIndicator
          status={backendHealth === 'ok' ? 'online' : backendHealth === 'degraded' ? 'warning' : 'offline'}
          label={backendHealth === 'ok' ? 'System Operational' : 'Backend Offline'}
        />

        <button
          onClick={toggleTheme}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: 'var(--radius-sm)'
          }}
          title="Toggle Dark/Light Theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          onClick={handleMinimizeToCompanion}
          style={{
            background: 'var(--bg-glass-hover)',
            border: '1px solid var(--border-glass)',
            color: 'var(--accent-cyan)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: 500
          }}
          title="Minimize to Floating Companion"
        >
          <Minimize2 size={14} />
          Companion Mode
        </button>
      </div>
    </header>
  );
};
