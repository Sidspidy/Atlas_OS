import React, { useEffect, useState } from 'react';
import { IntegrationStatus, GitHubPRRecord, DockerContainerRecord, LinearIssueRecord } from '@atlas-os/shared';
import { GlassPanel, Button } from '@atlas-os/ui';
import { Layers, GitPullRequest, Container, MessageSquare, CheckCircle2, RefreshCw, Power, ExternalLink, Tag } from 'lucide-react';

export const IntegrationsView: React.FC = () => {
  const [statuses, setStatuses] = useState<IntegrationStatus[]>([]);
  const [prs, setPRs] = useState<GitHubPRRecord[]>([]);
  const [containers, setContainers] = useState<DockerContainerRecord[]>([]);
  const [issues, setIssues] = useState<LinearIssueRecord[]>([]);

  const fetchIntegrationsData = async () => {
    try {
      const statusRes = await fetch('http://localhost:3001/api/integrations/status');
      const statusData = await statusRes.json();
      if (statusData && statusData.statuses) setStatuses(statusData.statuses);

      const prRes = await fetch('http://localhost:3001/api/integrations/github/prs');
      const prData = await prRes.json();
      if (prData && prData.prs) setPRs(prData.prs);

      const dockerRes = await fetch('http://localhost:3001/api/integrations/docker/containers');
      const dockerData = await dockerRes.json();
      if (dockerData && dockerData.containers) setContainers(dockerData.containers);

      const linearRes = await fetch('http://localhost:3001/api/integrations/linear/issues');
      const linearData = await linearRes.json();
      if (linearData && linearData.issues) setIssues(linearData.issues);
    } catch (e) {
      console.warn('[IntegrationsView] Failed to fetch integrations data:', e);
    }
  };

  useEffect(() => {
    fetchIntegrationsData();
  }, []);

  const handleToggleContainer = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/integrations/docker/toggle/${id}`, { method: 'POST' });
      const data = await res.json();
      if (data.success && data.container) {
        setContainers((prev) =>
          prev.map((c) => (c.id === id ? data.container : c))
        );
      }
    } catch (e) {
      console.warn('[IntegrationsView] Toggle container failed:', e);
    }
  };

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 600 }}>Integrations Engine Suite</h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            Connected developer tools (GitHub, Slack, Docker, Linear) & workspace automation connectors
          </p>
        </div>
        <Button variant="ghost" onClick={fetchIntegrationsData}>
          <RefreshCw size={15} /> Sync Status
        </Button>
      </div>

      {/* Provider Status Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {statuses.map((item) => (
          <GlassPanel key={item.provider} style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '15px', color: 'var(--text-main)' }}>{item.name}</strong>
              <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: item.connected ? 'rgba(52, 211, 153, 0.15)' : 'var(--bg-secondary)', color: item.connected ? 'var(--accent-emerald)' : 'var(--text-dim)', border: '1px solid var(--border-glass)' }}>
                {item.connected ? 'CONNECTED' : 'DISCONNECTED'}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.accountOrWorkspace}</div>
          </GlassPanel>
        ))}
      </div>

      {/* Docker Containers Inspector */}
      <GlassPanel style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Container size={18} color="var(--accent-cyan)" />
            Docker Containers Inspector ({containers.length})
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {containers.map((c) => (
            <div key={c.id} style={{ background: 'var(--bg-secondary)', padding: '14px 18px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <Container size={20} color="var(--accent-cyan)" />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>{c.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Image: {c.image} • Ports: {c.ports}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: c.status === 'running' ? 'var(--accent-emerald)' : 'var(--accent-red)' }}>
                  {c.status.toUpperCase()}
                </span>
                <button
                  onClick={() => handleToggleContainer(c.id)}
                  style={{
                    background: c.status === 'running' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(52, 211, 153, 0.15)',
                    border: '1px solid var(--border-glass)',
                    color: c.status === 'running' ? 'var(--accent-red)' : 'var(--accent-emerald)',
                    padding: '5px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Power size={12} style={{ marginRight: '4px' }} />
                  {c.status === 'running' ? 'Stop' : 'Start'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </GlassPanel>

      {/* GitHub PRs & Linear Issues Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* GitHub PRs */}
        <GlassPanel style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GitPullRequest size={18} color="var(--accent-purple)" />
            GitHub Active Pull Requests ({prs.length})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {prs.map((pr) => (
              <div key={pr.id} style={{ background: 'var(--bg-secondary)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>#{pr.id} {pr.title}</span>
                  <span style={{ fontSize: '11px', color: 'var(--accent-emerald)', fontWeight: 600 }}>{pr.status.toUpperCase()}</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Branch: {pr.branch} • Author: {pr.author}</div>
              </div>
            ))}
          </div>
        </GlassPanel>

        {/* Linear Issues */}
        <GlassPanel style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Tag size={18} color="var(--accent-cyan)" />
            Linear Workspace Issues ({issues.length})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {issues.map((iss) => (
              <div key={iss.id} style={{ background: 'var(--bg-secondary)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>[{iss.identifier}] {iss.title}</span>
                  <span style={{ fontSize: '11px', color: 'var(--accent-purple)', fontWeight: 600 }}>{iss.status}</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Priority: {iss.priority} • Assignee: {iss.assignee}</div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};
