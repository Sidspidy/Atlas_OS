import React, { useEffect, useState } from 'react';
import { AtlasState } from '@atlas-os/shared';
import { WorkflowDefinition, WorkflowExecutionLog } from '@atlas-os/shared';
import { GlassPanel, Button } from '@atlas-os/ui';
import { Workflow, Play, Clock, Zap, ArrowRight, RefreshCw, CheckCircle2, Pause, Power, Terminal, Bell, Globe } from 'lucide-react';

export const WorkflowsView: React.FC = () => {
  const [workflows, setWorkflows] = useState<WorkflowDefinition[]>([]);
  const [logs, setLogs] = useState<WorkflowExecutionLog[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const fetchWorkflows = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/workflows/list');
      const data = await res.json();
      if (data && data.workflows) {
        setWorkflows(data.workflows);
        setLogs(data.logs || []);
      }
    } catch (e) {
      console.warn('[WorkflowsView] Failed to fetch workflows:', e);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const handleTriggerWorkflow = async (id: string) => {
    setIsExecuting(true);
    if (window.atlasAPI) window.atlasAPI.setState(AtlasState.WORKING);

    try {
      const res = await fetch(`http://localhost:3001/api/workflows/trigger/${id}`, { method: 'POST' });
      const data = await res.json();

      if (data.success && data.log) {
        setLogs((prev) => [data.log, ...prev]);
        if (window.atlasAPI) window.atlasAPI.setState(AtlasState.SUCCESS);
        await fetchWorkflows();
      }
    } catch (e) {
      if (window.atlasAPI) window.atlasAPI.setState(AtlasState.ERROR);
    } finally {
      setIsExecuting(false);
      setTimeout(() => {
        if (window.atlasAPI) window.atlasAPI.setState(AtlasState.IDLE);
      }, 2000);
    }
  };

  const handleToggleWorkflow = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/workflows/toggle/${id}`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setWorkflows((prev) =>
          prev.map((w) => (w.id === id ? { ...w, active: data.active } : w))
        );
      }
    } catch (e) {
      console.warn('[WorkflowsView] Toggle failed:', e);
    }
  };

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 600 }}>Workflow Automation Engine & DAG Builder</h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            Automate developer workflows connecting cron triggers, file change watchers, terminal commands & Webhook actions
          </p>
        </div>
        <Button variant="ghost" onClick={fetchWorkflows}>
          <RefreshCw size={15} /> Refresh Rules
        </Button>
      </div>

      {/* Active Workflows Cards & Node Canvas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {workflows.map((wf) => (
          <GlassPanel key={wf.id} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Workflow size={22} color={wf.active ? 'var(--accent-cyan)' : 'var(--text-dim)'} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '16px', color: 'var(--text-main)' }}>{wf.name}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>{wf.description}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={() => handleToggleWorkflow(wf.id)}
                  style={{
                    background: wf.active ? 'rgba(52, 211, 153, 0.15)' : 'var(--bg-secondary)',
                    border: wf.active ? '1px solid var(--accent-emerald)' : '1px solid var(--border-glass)',
                    color: wf.active ? 'var(--accent-emerald)' : 'var(--text-muted)',
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Power size={13} color={wf.active ? 'var(--accent-emerald)' : 'var(--text-muted)'} />
                  {wf.active ? 'Active Rule' : 'Paused'}
                </button>

                <Button variant="primary" onClick={() => handleTriggerWorkflow(wf.id)} disabled={isExecuting}>
                  <Play size={14} /> Trigger Now
                </Button>
              </div>
            </div>

            {/* Visual Node Graph Graph Connection Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-secondary)', padding: '14px 18px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', overflowX: 'auto' }}>
              {wf.nodes.map((node, idx) => (
                <React.Fragment key={node.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-glass-hover)', padding: '8px 14px', borderRadius: 'var(--radius-sm)', border: node.type === 'TRIGGER' ? '1px solid var(--accent-cyan)' : '1px solid var(--accent-purple)' }}>
                    {node.nodeType === 'CRON' || node.nodeType === 'FILE_WATCH' || node.nodeType === 'WEBHOOK' ? (
                      <Zap size={16} color="var(--accent-cyan)" />
                    ) : node.nodeType === 'TERMINAL_CMD' ? (
                      <Terminal size={16} color="var(--accent-purple)" />
                    ) : node.nodeType === 'NOTIFICATION' ? (
                      <Bell size={16} color="var(--accent-purple)" />
                    ) : (
                      <Globe size={16} color="var(--accent-purple)" />
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: node.type === 'TRIGGER' ? 'var(--accent-cyan)' : 'var(--accent-purple)', textTransform: 'uppercase' }}>
                        {node.type}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap' }}>
                        {node.label}
                      </span>
                    </div>
                  </div>

                  {idx < wf.nodes.length - 1 && (
                    <ArrowRight size={16} color="var(--text-dim)" style={{ flexShrink: 0 }} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </GlassPanel>
        ))}
      </div>

      {/* Execution Logs Drawer */}
      <GlassPanel style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={18} color="var(--accent-cyan)" />
          Workflow Execution Log Stream
        </div>

        {logs.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
            No workflow execution logs recorded yet. Click "Trigger Now" on a rule above.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto' }}>
            {logs.map((log) => (
              <div key={log.id} style={{ background: 'var(--bg-secondary)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                  <span style={{ color: 'var(--accent-emerald)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={14} /> Status: {log.status} ({log.durationMs}ms)
                  </span>
                  <span style={{ color: 'var(--text-dim)' }}>{new Date(log.executedAt).toLocaleTimeString()}</span>
                </div>
                <pre style={{ margin: 0, fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-muted)', whiteSpace: 'pre-wrap' }}>
                  {log.outputSummary}
                </pre>
              </div>
            ))}
          </div>
        )}
      </GlassPanel>
    </div>
  );
};
