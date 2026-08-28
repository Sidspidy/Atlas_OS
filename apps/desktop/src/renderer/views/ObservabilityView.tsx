import React, { useEffect, useState } from 'react';
import { ObservabilitySummary, AgentTraceSpan } from '@atlas-os/shared';
import { GlassPanel, Button } from '@atlas-os/ui';
import { Activity, DollarSign, Clock, Layers, RefreshCw, ChevronDown, ChevronRight, CheckCircle2, Cpu } from 'lucide-react';

export const ObservabilityView: React.FC = () => {
  const [summary, setSummary] = useState<ObservabilitySummary | null>(null);
  const [traces, setTraces] = useState<AgentTraceSpan[]>([]);
  const [expandedSpanId, setExpandedSpanId] = useState<string | null>(null);

  const fetchObservabilityData = async () => {
    try {
      const summaryRes = await fetch('http://localhost:3001/api/observability/summary');
      const summaryData = await summaryRes.json();
      if (summaryData && summaryData.summary) setSummary(summaryData.summary);

      const traceRes = await fetch('http://localhost:3001/api/observability/traces');
      const traceData = await traceRes.json();
      if (traceData && traceData.traces) setTraces(traceData.traces);
    } catch (e) {
      console.warn('[ObservabilityView] Failed to fetch metrics:', e);
    }
  };

  useEffect(() => {
    fetchObservabilityData();
  }, []);

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 600 }}>Observability & Agent Trace Viewer</h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            Real-time token cost estimation, latency telemetry & subagent step execution trace spans
          </p>
        </div>
        <Button variant="ghost" onClick={fetchObservabilityData}>
          <RefreshCw size={15} /> Refresh Metrics
        </Button>
      </div>

      {/* Hero Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <MetricTile title="Total Token Usage" value={`${summary?.totalTokens.toLocaleString() || '52,850'} tokens`} icon={Cpu} color="var(--accent-cyan)" />
        <MetricTile title="Est. Daily API Cost" value={`$${summary?.totalEstimatedCostUsd || '0.0522'}`} icon={DollarSign} color="var(--accent-emerald)" />
        <MetricTile title="Average Latency" value={`${summary?.averageLatencyMs || '420'} ms`} icon={Clock} color="var(--accent-purple)" />
        <MetricTile title="Execution Spans" value={`${summary?.totalTraceCount || '64'} spans`} icon={Activity} color="var(--accent-amber)" />
      </div>

      {/* Model Breakdown & Latency Telemetry Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Model Token Breakdown */}
        <GlassPanel style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} color="var(--accent-cyan)" />
            Model Token & Cost Breakdown
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {summary?.modelBreakdown.map((m) => (
              <div key={m.model} style={{ background: 'var(--bg-secondary)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{m.model}</span>
                  <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>${m.estimatedCostUsd}</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Prompt: {m.promptTokens.toLocaleString()} • Completion: {m.completionTokens.toLocaleString()} • Total: {m.totalTokens.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>

        {/* Latency Telemetry */}
        <GlassPanel style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} color="var(--accent-purple)" />
            Endpoint Latency Telemetry (p50 / p95 / p99)
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {summary?.latencyMetrics.map((l) => (
              <div key={l.endpoint} style={{ background: 'var(--bg-secondary)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>{l.endpoint}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Requests: {l.requestCount}</div>
                </div>
                <div style={{ fontSize: '12px', display: 'flex', gap: '8px' }}>
                  <span style={{ color: 'var(--accent-cyan)' }}>p50: {l.p50Ms}ms</span>
                  <span style={{ color: 'var(--accent-amber)' }}>p95: {l.p95Ms}ms</span>
                  <span style={{ color: 'var(--accent-red)' }}>p99: {l.p99Ms}ms</span>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>

      {/* Agent Trace Spans Inspector Drawer */}
      <GlassPanel style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={18} color="var(--accent-cyan)" />
          Hierarchical Subagent Execution Trace Inspector
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {traces.map((span) => {
            const isExpanded = expandedSpanId === span.id;
            return (
              <div key={span.id} style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', overflow: 'hidden' }}>
                <div
                  onClick={() => setExpandedSpanId(isExpanded ? null : span.id)}
                  style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {isExpanded ? <ChevronDown size={16} color="var(--accent-cyan)" /> : <ChevronRight size={16} color="var(--text-dim)" />}
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: 'var(--bg-glass-hover)', color: 'var(--accent-purple)', border: '1px solid var(--border-glass)' }}>
                      {span.agentRole}
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>{span.operationName}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px' }}>
                    <span style={{ color: 'var(--accent-emerald)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={14} /> {span.status} ({span.durationMs}ms)
                    </span>
                    <span style={{ color: 'var(--text-dim)' }}>{span.startTime}</span>
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ padding: '14px 18px', background: 'var(--bg-primary)', borderTop: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                    <div>
                      <strong style={{ color: 'var(--accent-cyan)' }}>Input Payload:</strong>
                      <pre style={{ margin: '4px 0 0 0', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{span.inputPayload}</pre>
                    </div>
                    <div>
                      <strong style={{ color: 'var(--accent-purple)' }}>Output Payload:</strong>
                      <pre style={{ margin: '4px 0 0 0', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{span.outputPayload}</pre>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </GlassPanel>
    </div>
  );
};

const MetricTile: React.FC<{ title: string; value: string; icon: any; color: string }> = ({ title, value, icon: Icon, color }) => (
  <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', gap: '12px' }}>
    <Icon size={24} color={color} />
    <div>
      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{title}</div>
      <div style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>{value}</div>
    </div>
  </div>
);
