import React, { useEffect, useState } from 'react';
import { ProjectMetadata, CodeSymbolRecord } from '@atlas-os/shared';
import { GlassPanel, Button } from '@atlas-os/ui';
import { Code, GitBranch, Layers, Search, ExternalLink, Play, Tag, Terminal, Cpu } from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const [metadata, setMetadata] = useState<ProjectMetadata | null>(null);
  const [symbols, setSymbols] = useState<CodeSymbolRecord[]>([]);
  const [symbolQuery, setSymbolQuery] = useState('');

  const loadProjectInfo = async () => {
    if (window.atlasAPI) {
      const res = await window.atlasAPI.detectProject('e:/my_projects');
      if (res && res.metadata) {
        setMetadata(res.metadata);
      }

      const symRes = await window.atlasAPI.searchSymbols(symbolQuery);
      if (symRes && symRes.symbols) {
        setSymbols(symRes.symbols);
      }
    }
  };

  useEffect(() => {
    loadProjectInfo();
  }, [symbolQuery]);

  const handleOpenVSCode = (filePath?: string, line?: number) => {
    if (window.atlasAPI) {
      window.atlasAPI.openVSCode({ filePath, line, projectRoot: metadata?.rootPath });
    }
  };

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 600 }}>Code Intelligence & Project Analysis</h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            Automatic framework detection, symbol search, npm script triggers & VS Code launcher
          </p>
        </div>
        <Button variant="primary" onClick={() => handleOpenVSCode()}>
          <ExternalLink size={16} /> Open in VS Code
        </Button>
      </div>

      {/* Active Project Hero Card */}
      <GlassPanel style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-sm)', background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Code size={24} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 600 }}>{metadata?.name || 'Atlas OS Monorepo'}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>{metadata?.rootPath || 'e:/my_projects'}</div>
            </div>
          </div>
          <span style={{ fontSize: '12px', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid var(--border-glow)', padding: '4px 10px', borderRadius: 'var(--radius-full)', color: 'var(--accent-cyan)', fontWeight: 600 }}>
            Package Manager: {metadata?.packageManager || 'pnpm'}
          </span>
        </div>

        {/* Framework Stack Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Detected Framework Stack:</span>
          {(metadata?.frameworks || ['React', 'NestJS', 'Node.js', 'Docker']).map((fw, idx) => (
            <span key={idx} style={{ fontSize: '11px', fontWeight: 600, background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', padding: '3px 10px', borderRadius: '4px', color: 'var(--accent-purple)' }}>
              <Tag size={10} style={{ marginRight: '4px' }} /> {fw}
            </span>
          ))}
        </div>

        {/* Overview Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginTop: '8px' }}>
          <StatCard title="Packages" value="3 packages" icon={Layers} color="var(--accent-cyan)" />
          <StatCard title="Applications" value="2 apps" icon={Code} color="var(--accent-purple)" />
          <StatCard title="Git Repository" value="git status ok" icon={GitBranch} color="var(--accent-emerald)" />
          <StatCard title="Docker Support" value={metadata?.hasDocker ? 'Docker Compose Ready' : 'Configured'} icon={Cpu} color="var(--accent-amber)" />
        </div>

        {/* NPM Scripts Bar */}
        {metadata?.scripts && Object.keys(metadata.scripts).length > 0 && (
          <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Workspace Scripts</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {Object.entries(metadata.scripts).map(([name, cmd]) => (
                <button
                  key={name}
                  onClick={() => {
                    if (window.atlasAPI) window.atlasAPI.showNotification({ title: 'Terminal Task', message: `Executing script: ${name} (${cmd})`, type: 'info' });
                  }}
                  style={scriptBtnStyle}
                  title={cmd}
                >
                  <Play size={11} color="var(--accent-cyan)" /> {name}
                </button>
              ))}
            </div>
          </div>
        )}
      </GlassPanel>

      {/* Code Symbol Search & AST Inspection Panel */}
      <GlassPanel style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search size={18} color="var(--accent-cyan)" />
            Code Symbol Scanner (Classes, Functions, Interfaces, REST Routes)
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{symbols.length} symbols found</span>
        </div>

        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-secondary)', padding: '10px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search symbols by name or file path (e.g. AtlasCharacter, HealthController)..."
            value={symbolQuery}
            onChange={(e) => setSymbolQuery(e.target.value)}
            style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '14px', width: '100%' }}
          />
        </div>

        {/* Symbols List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto' }}>
          {symbols.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
              No symbol matches found for query "{symbolQuery}".
            </div>
          ) : (
            symbols.map((sym) => (
              <div key={sym.id} style={symbolRowStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: 'var(--bg-glass-hover)', color: 'var(--accent-cyan)', border: '1px solid var(--border-glass)', textTransform: 'uppercase' }}>
                    {sym.symbolType}
                  </span>
                  <strong style={{ fontSize: '14px', color: 'var(--text-main)' }}>{sym.name}</strong>
                  <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                    {sym.filePath} : line {sym.line}
                  </span>
                </div>
                <button
                  onClick={() => handleOpenVSCode(sym.filePath, sym.line)}
                  style={{
                    background: 'var(--bg-glass-hover)',
                    border: '1px solid var(--border-glass)',
                    color: 'var(--accent-cyan)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <ExternalLink size={12} style={{ marginRight: '4px' }} /> Open in VS Code
                </button>
              </div>
            ))
          )}
        </div>
      </GlassPanel>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: string; icon: any; color: string }> = ({ title, value, icon: Icon, color }) => (
  <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
    <Icon size={18} color={color} style={{ marginBottom: '6px' }} />
    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{title}</div>
    <div style={{ fontSize: '15px', fontWeight: 600, marginTop: '2px' }}>{value}</div>
  </div>
);

const scriptBtnStyle: React.CSSProperties = {
  background: 'var(--bg-secondary)',
  border: '1px solid var(--border-glass)',
  color: 'var(--text-main)',
  borderRadius: 'var(--radius-sm)',
  padding: '5px 10px',
  fontSize: '12px',
  fontWeight: 500,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px'
};

const symbolRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: 'var(--bg-secondary)',
  padding: '10px 14px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border-glass)'
};
