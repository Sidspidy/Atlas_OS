import React, { useState, useEffect } from 'react';
import { Search, Terminal, FileCode, Brain, Zap, X } from 'lucide-react';

interface CommandBarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCommand: (query: string) => void;
}

export const CommandBarModal: React.FC<CommandBarModalProps> = ({ isOpen, onClose, onSelectCommand }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickCommands = [
    { icon: Terminal, title: 'Find where JWT authentication is implemented', category: 'Code Intelligence' },
    { icon: FileCode, title: 'Index active project directory', category: 'File System Engine' },
    { icon: Brain, title: 'Search persistent AI memory graph', category: 'AI Memory' },
    { icon: Zap, title: 'Check backend operational health status', category: 'System Diagnostic' }
  ];

  const filteredCommands = quickCommands.filter(c =>
    !query.trim() || c.title.toLowerCase().includes(query.toLowerCase()) || c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '100px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '640px',
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--border-glass)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-glass), var(--glow-cyan)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'command-modal-pop 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderBottom: '1px solid var(--border-glass)' }}>
          <Search size={20} color="var(--accent-cyan)" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command, file search, or question for Atlas... (Esc to exit)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query.trim()) {
                onSelectCommand(query);
                onClose();
              }
            }}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-main)',
              fontSize: '16px',
              width: '100%'
            }}
          />
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Filtered Quick Actions & Commands */}
        <div style={{ padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '360px', overflowY: 'auto' }}>
          {filteredCommands.map((cmd, idx) => {
            const Icon = cmd.icon;
            return (
              <div
                key={idx}
                onClick={() => {
                  onSelectCommand(cmd.title);
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 16px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease'
                }}
                className="command-row-hover"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={18} color="var(--accent-cyan)" />
                  <span style={{ fontSize: '14px', color: 'var(--text-main)' }}>{cmd.title}</span>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-dim)', background: 'var(--bg-secondary)', padding: '3px 8px', borderRadius: '4px' }}>
                  {cmd.category}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes command-modal-pop {
          0% { opacity: 0; transform: translateY(-12px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .command-row-hover:hover {
          background: var(--bg-glass-hover);
        }
      `}</style>
    </div>
  );
};
