import React, { useEffect, useState } from 'react';
import { ProactiveSuggestion, WorkspaceContextSummary } from '@atlas-os/shared';
import { GlassPanel, Button } from '@atlas-os/ui';
import { Sparkles, BellRing, GitBranch, Layers, Database, ShieldCheck, RefreshCw, X, Sliders, CheckCircle2, AlertTriangle } from 'lucide-react';

export const ProactiveView: React.FC = () => {
  const [summary, setSummary] = useState<WorkspaceContextSummary | null>(null);
  const [suggestions, setSuggestions] = useState<ProactiveSuggestion[]>([]);
  const [sensitivity, setSensitivity] = useState<'LOW' | 'NORMAL' | 'HIGH'>('NORMAL');

  const fetchProactiveData = async () => {
    try {
      const summaryRes = await fetch('http://localhost:3001/api/proactive/summary');
      const summaryData = await summaryRes.json();
      if (summaryData && summaryData.summary) {
        setSummary(summaryData.summary);
      }

      const suggRes = await fetch('http://localhost:3001/api/proactive/suggestions');
      const suggData = await suggRes.json();
      if (suggData && suggData.suggestions) {
        setSuggestions(suggData.suggestions);
      }
    } catch (e) {
      console.warn('[ProactiveView] Failed to fetch proactive data:', e);
    }
  };

  useEffect(() => {
    fetchProactiveData();
  }, []);

  const handleDismissSuggestion = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/proactive/dismiss/${id}`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSuggestions((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (e) {
      console.warn('[ProactiveView] Dismiss failed:', e);
    }
  };

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 600 }}>Proactive Intelligence & Context Summaries</h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            Non-intrusive background system monitoring, context summaries & actionable proactive notifications
          </p>
        </div>
        <Button variant="ghost" onClick={fetchProactiveData}>
          <RefreshCw size={15} /> Refresh Summary
        </Button>
      </div>

      {/* Workspace Context Summary Hero Card */}
      <GlassPanel style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 600, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={20} color="var(--accent-cyan)" />
            Active Workspace Context Summary
          </div>
          <span style={{ fontSize: '12px', color: 'var(--accent-emerald)', background: 'rgba(52, 211, 153, 0.15)', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontWeight: 600, border: '1px solid var(--border-glass)' }}>
            <CheckCircle2 size={12} style={{ marginRight: '4px' }} /> Backend Operational
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
          <SummaryTile title="Active Project" value={summary?.activeProjectName || 'Atlas OS'} icon={Layers} color="var(--accent-cyan)" />
          <SummaryTile title="Indexed Workspace Files" value={`${summary?.totalIndexedFiles || 48} files`} icon={Layers} color="var(--accent-purple)" />
          <SummaryTile title="AI Memory Graph" value={`${summary?.totalMemoryNodes || 12} nodes`} icon={Database} color="var(--accent-emerald)" />
          <SummaryTile title="Git Uncommitted" value={`${summary?.uncommittedGitFiles || 3} files`} icon={GitBranch} color="var(--accent-amber)" />
        </div>
      </GlassPanel>

      {/* Active Proactive Suggestions List */}
      <GlassPanel style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BellRing size={18} color="var(--accent-cyan)" />
            Proactive Suggestions ({suggestions.length})
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sliders size={14} color="var(--text-muted)" />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Sensitivity:</span>
            {(['LOW', 'NORMAL', 'HIGH'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSensitivity(lvl)}
                style={{
                  background: sensitivity === lvl ? 'var(--accent-cyan)' : 'var(--bg-secondary)',
                  color: sensitivity === lvl ? '#000' : 'var(--text-muted)',
                  border: '1px solid var(--border-glass)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {suggestions.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
            No pending proactive suggestions. All system monitors reporting healthy status!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {suggestions.map((sugg) => (
              <div
                key={sugg.id}
                style={{
                  background: 'var(--bg-secondary)',
                  padding: '16px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-glass)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: sugg.priority === 'HIGH' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {sugg.priority === 'HIGH' ? <AlertTriangle size={18} color="var(--accent-red)" /> : <Sparkles size={18} color="var(--accent-cyan)" />}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: 'var(--bg-glass-hover)', color: 'var(--accent-cyan)', border: '1px solid var(--border-glass)' }}>
                        {sugg.category}
                      </span>
                      <strong style={{ fontSize: '15px', color: 'var(--text-main)' }}>{sugg.title}</strong>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                      {sugg.message}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {sugg.actionLabel && (
                    <Button
                      variant="primary"
                      onClick={() => {
                        if (window.atlasAPI) window.atlasAPI.showNotification({ title: sugg.title, message: sugg.message, type: 'info' });
                      }}
                      style={{ fontSize: '12px', padding: '5px 12px' }}
                    >
                      {sugg.actionLabel}
                    </Button>
                  )}
                  <button
                    onClick={() => handleDismissSuggestion(sugg.id)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '6px' }}
                    title="Dismiss Suggestion"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassPanel>
    </div>
  );
};

const SummaryTile: React.FC<{ title: string; value: string; icon: any; color: string }> = ({ title, value, icon: Icon, color }) => (
  <div style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
    <Icon size={18} color={color} style={{ marginBottom: '6px' }} />
    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{title}</div>
    <div style={{ fontSize: '15px', fontWeight: 600, marginTop: '2px' }}>{value}</div>
  </div>
);
