import React from 'react';
import { Home, MessageSquare, Folder, Code, Brain, Settings, Zap, Activity } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'home', label: 'Atlas Home', icon: Home },
    { id: 'ask', label: 'Ask Atlas', icon: MessageSquare },
    { id: 'files', label: 'Local Files', icon: Folder },
    { id: 'projects', label: 'Projects & Code', icon: Code },
    { id: 'memory', label: 'AI Memory', icon: Brain },
    { id: 'automation', label: 'Automation', icon: Zap },
    { id: 'activity', label: 'Activity Log', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside
      style={{
        width: '240px',
        height: '100vh',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-glass)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        boxSizing: 'border-box'
      }}
    >
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', paddingLeft: '8px' }}>
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
            boxShadow: 'var(--glow-cyan)'
          }}
        />
        <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.5px' }}>Atlas OS</span>
      </div>

      {/* Navigation Items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
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
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: isActive ? 'var(--bg-glass-hover)' : 'transparent',
                color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left'
              }}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Version Tag */}
      <div style={{ fontSize: '12px', color: 'var(--text-dim)', paddingLeft: '8px' }}>
        Atlas OS v0.1.0 (Phase 1)
      </div>
    </aside>
  );
};
