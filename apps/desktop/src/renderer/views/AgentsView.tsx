import React, { useState } from 'react';
import { AtlasState } from '@atlas-os/shared';
import { AgentExecutionPlan, AgentMessage } from '@atlas-os/shared';
import { GlassPanel, Button } from '@atlas-os/ui';
import { Users, Bot, CheckCircle2, Clock, Play, MessageSquare, Shield, Code, Search, Brain, ListChecks } from 'lucide-react';

export const AgentsView: React.FC = () => {
  const [goalInput, setGoalInput] = useState('');
  const [currentPlan, setCurrentPlan] = useState<AgentExecutionPlan | null>(null);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecuteAgentPlan = async () => {
    if (!goalInput.trim() || isExecuting) return;

    setIsExecuting(true);
    if (window.atlasAPI) window.atlasAPI.setState(AtlasState.PLANNING);

    try {
      const res = await fetch('http://localhost:3001/api/agents/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: goalInput })
      });
      const data = await res.json();

      if (data.success && data.plan) {
        setCurrentPlan(data.plan);
        setMessages(data.messages || []);
        if (window.atlasAPI) window.atlasAPI.setState(AtlasState.SUCCESS);
      } else {
        if (window.atlasAPI) window.atlasAPI.setState(AtlasState.ERROR);
      }
    } catch (e) {
      if (window.atlasAPI) window.atlasAPI.setState(AtlasState.ERROR);
    } finally {
      setIsExecuting(false);
      setTimeout(() => {
        if (window.atlasAPI) window.atlasAPI.setState(AtlasState.IDLE);
      }, 2500);
    }
  };

  const agentCards = [
    { role: 'PLANNER', title: 'Planner Agent', icon: ListChecks, color: 'var(--accent-cyan)', desc: 'Decomposes goals into execution steps' },
    { role: 'RESEARCH', title: 'Research Agent', icon: Search, color: 'var(--accent-purple)', desc: 'Inspects local files & RAG facts' },
    { role: 'CODE', title: 'Code Agent', icon: Code, color: 'var(--accent-emerald)', desc: 'Synthesizes code edits & modules' },
    { role: 'REVIEW', title: 'Review Agent', icon: Shield, color: 'var(--accent-amber)', desc: 'Audits syntax & security permissions' },
    { role: 'MEMORY', title: 'Memory Agent', icon: Brain, color: '#f43f5e', desc: 'Persists task decision logs' }
  ];

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 600 }}>Multi-Agent Orchestration Engine</h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            Autonomous subagent network (Planner, Research, Code, Review, Memory) executing step DAGs
          </p>
        </div>
      </div>

      {/* Goal Input Hero Bar */}
      <GlassPanel style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Users size={22} color="var(--accent-cyan)" />
        <input
          type="text"
          placeholder="Enter a complex development goal for the Multi-Agent network (e.g. Implement user authentication middleware)..."
          value={goalInput}
          onChange={(e) => setGoalInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleExecuteAgentPlan()}
          disabled={isExecuting}
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '15px' }}
        />
        <Button variant="primary" onClick={handleExecuteAgentPlan} disabled={isExecuting}>
          <Play size={15} /> Execute Multi-Agent Plan
        </Button>
      </GlassPanel>

      {/* Specialized Subagents Status Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px' }}>
        {agentCards.map((agent) => {
          const Icon = agent.icon;
          const isActive = currentPlan?.steps.some((s) => s.assignedAgent === agent.role && s.status === 'RUNNING');
          const isDone = currentPlan?.steps.some((s) => s.assignedAgent === agent.role && s.status === 'DONE');

          return (
            <GlassPanel key={agent.role} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Icon size={20} color={agent.color} />
                <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: isDone ? 'rgba(52, 211, 153, 0.15)' : 'var(--bg-secondary)', color: isDone ? 'var(--accent-emerald)' : 'var(--text-dim)', border: '1px solid var(--border-glass)' }}>
                  {isDone ? 'DONE' : isActive ? 'RUNNING' : 'IDLE'}
                </span>
              </div>
              <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-main)', marginTop: '4px' }}>{agent.title}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.3 }}>{agent.desc}</div>
            </GlassPanel>
          );
        })}
      </div>

      {/* Active Execution Plan Timeline & Step Progress */}
      {currentPlan && (
        <GlassPanel style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ListChecks size={18} color="var(--accent-cyan)" />
              Active Plan Steps DAG ({currentPlan.steps.length} Steps)
            </div>
            <span style={{ fontSize: '12px', color: 'var(--accent-emerald)', fontWeight: 600 }}>
              Status: {currentPlan.status}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {currentPlan.steps.map((step) => (
              <div key={step.id} style={{ background: 'var(--bg-secondary)', padding: '14px 18px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--bg-glass-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', color: 'var(--accent-cyan)' }}>
                    {step.stepNumber}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>{step.description}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Assigned Subagent: <strong style={{ color: 'var(--accent-purple)' }}>{step.assignedAgent}</strong>
                      {step.resultSummary && ` • ${step.resultSummary}`}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {step.status === 'DONE' ? (
                    <span style={{ fontSize: '12px', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                      <CheckCircle2 size={16} /> Completed ({step.executionTimeMs}ms)
                    </span>
                  ) : (
                    <span style={{ fontSize: '12px', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={16} /> {step.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      )}

      {/* Inter-Agent Communication Messages Stream */}
      {messages.length > 0 && (
        <GlassPanel style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} color="var(--accent-purple)" />
            Inter-Agent Communication Broadcast Logs
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ fontSize: '12px', background: 'var(--bg-secondary)', padding: '10px 14px', borderRadius: '4px', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Bot size={16} color="var(--accent-cyan)" />
                <span style={{ fontWeight: 700, color: 'var(--accent-purple)' }}>[{msg.fromAgent}]</span>
                <span style={{ color: 'var(--text-main)' }}>{msg.message}</span>
                <span style={{ marginLeft: 'auto', color: 'var(--text-dim)', fontSize: '11px' }}>{msg.timestamp}</span>
              </div>
            ))}
          </div>
        </GlassPanel>
      )}
    </div>
  );
};
