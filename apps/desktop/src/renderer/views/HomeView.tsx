import React, { useState } from 'react';
import { AtlasState } from '@atlas-os/shared';
import { AtlasCharacter, GlassPanel, Button } from '@atlas-os/ui';
import { Mic, Send, CheckCircle2, Clock, Calendar, Activity, Cpu, Layers, AlertCircle, ArrowUpRight, Code, Terminal, Camera, Folder, Settings, Sparkles } from 'lucide-react';

export const HomeView: React.FC = () => {
  const [currentState, setCurrentState] = useState<AtlasState>(AtlasState.IDLE);
  const [promptInput, setPromptInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [latestAiResponse, setLatestAiResponse] = useState<string | null>(null);

  const handleAskAtlas = async (overridePrompt?: string) => {
    const textToSend = overridePrompt || promptInput;
    if (!textToSend.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setCurrentState(AtlasState.THINKING);
    if (window.atlasAPI) window.atlasAPI.setState(AtlasState.THINKING);

    try {
      const res = await fetch('http://localhost:3001/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSend })
      });
      const data = await res.json();
      if (data.success && data.message?.text) {
        setLatestAiResponse(data.message.text);
        setCurrentState(AtlasState.SUCCESS);
        if (window.atlasAPI) window.atlasAPI.setState(AtlasState.SUCCESS);
      }
    } catch (e) {
      setCurrentState(AtlasState.ERROR);
      if (window.atlasAPI) window.atlasAPI.setState(AtlasState.ERROR);
    } finally {
      setIsSubmitting(false);
      setPromptInput('');
      setTimeout(() => {
        setCurrentState(AtlasState.IDLE);
        if (window.atlasAPI) window.atlasAPI.setState(AtlasState.IDLE);
      }, 3000);
    }
  };

  return (
    <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
      {/* Top Greeting & Date Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#fff' }}>Good morning, Arjun 👋</h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '13px' }}>
            Thursday, May 29, 2025 • 09:42 AM
          </p>
        </div>

        {/* Live System Operational Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.2)', padding: '6px 14px', borderRadius: '20px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 10px #34d399' }} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#34d399' }}>System is running smooth</span>
        </div>
      </div>

      {/* Main Grid: Left Hero Creature Card & Right System Overview + Notifications */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
        {/* Left: Atlas Creature Hero Card */}
        <GlassPanel style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', position: 'relative', overflow: 'hidden' }}>
          {/* Speech Toast Bubble */}
          <div style={{ background: 'rgba(20, 26, 42, 0.9)', border: '1px solid rgba(168, 85, 247, 0.4)', borderRadius: '16px', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px', boxShadow: '0 8px 24px rgba(168, 85, 247, 0.2)' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>I'm all set!</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>3 tasks need your attention today.</div>
            </div>
            <button style={{ background: '#a855f7', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
              View
            </button>
          </div>

          {/* Creature Renderer */}
          <AtlasCharacter size="lg" state={currentState} />

          {/* Latest Live Response Box */}
          {latestAiResponse && (
            <div style={{ width: '100%', marginTop: '16px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '12px 16px', borderRadius: '12px', fontSize: '13px', color: '#fff', lineHeight: 1.5 }}>
              ✨ <strong>Gemini AI:</strong> {latestAiResponse}
            </div>
          )}

          {/* Integrated Prompt Bar */}
          <div style={{ width: '100%', marginTop: '24px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskAtlas()}
                placeholder="Ask me anything or give a command..."
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '14px',
                  padding: '12px 42px 12px 16px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <Mic size={16} color="var(--text-muted)" style={{ position: 'absolute', right: '14px', cursor: 'pointer' }} />
            </div>

            <button
              onClick={() => handleAskAtlas()}
              disabled={isSubmitting}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #a855f7, #38bdf8)',
                border: 'none',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 0 16px rgba(168, 85, 247, 0.4)'
              }}
            >
              <Send size={18} />
            </button>
          </div>
        </GlassPanel>

        {/* Right: System Overview & Recent Notifications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* System Overview Gauge Card */}
          <GlassPanel style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={18} color="#38bdf8" />
              System Overview
            </div>

            {/* 3 Circular Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', textAlign: 'center' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>CPU</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#a855f7', marginTop: '4px' }}>23%</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>RAM</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#38bdf8', marginTop: '4px' }}>45%</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>DISK</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#34d399', marginTop: '4px' }}>62%</div>
              </div>
            </div>
          </GlassPanel>

          {/* Recent Notifications Card */}
          <GlassPanel style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>Recent Notifications</span>
              <span style={{ fontSize: '12px', color: '#a855f7', cursor: 'pointer' }}>View all</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={notifItemStyle}>
                <CheckCircle2 size={16} color="#34d399" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>Build completed</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>PawMart Backend</div>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>09:30 AM</span>
              </div>

              <div style={notifItemStyle}>
                <Layers size={16} color="#38bdf8" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>3 new commits</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>in pawmart/frontend</div>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>09:18 AM</span>
              </div>

              <div style={notifItemStyle}>
                <Clock size={16} color="#fbbf24" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>Meeting in 30 min</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Project Review Call</div>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>09:10 AM</span>
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>

      {/* Bottom Section 3-Column Grid: Agenda, Atlas in Action, Quick Access */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: '24px' }}>
        {/* Column 1: Today's Agenda */}
        <GlassPanel style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>Today's Agenda</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>View calendar</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { time: '10:00 AM', title: 'Project Review', dur: '30m', color: '#a855f7' },
              { time: '12:00 PM', title: 'Lunch Break', dur: '1h', color: '#38bdf8' },
              { time: '02:00 PM', title: 'Code Refactoring', dur: '2h', color: '#34d399' },
              { time: '04:30 PM', title: 'Client Call', dur: '1h', color: '#fbbf24' }
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', background: 'rgba(255, 255, 255, 0.03)', padding: '8px 12px', borderRadius: '8px', borderLeft: `3px solid ${item.color}` }}>
                <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>{item.time}</span>
                <span style={{ flex: 1, color: '#fff', fontWeight: 500 }}>{item.title}</span>
                <span style={{ color: 'var(--text-dim)' }}>{item.dur}</span>
              </div>
            ))}
          </div>
        </GlassPanel>

        {/* Column 2: Atlas in Action */}
        <GlassPanel style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>Atlas in Action</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>View all tasks</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'Analyzing codebase...', progress: 60, color: '#a855f7' },
              { label: 'Searching documentation...', progress: 80, color: '#38bdf8' },
              { label: 'Checking dependencies...', progress: 45, color: '#34d399' },
              { label: 'Preparing summary...', progress: 20, color: '#fbbf24' }
            ].map((task, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#fff' }}>{task.label}</span>
                  <span style={{ color: task.color, fontWeight: 600 }}>{task.progress}%</span>
                </div>
                <div style={{ height: '6px', width: '100%', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${task.progress}%`, background: task.color, borderRadius: '3px' }} />
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>

        {/* Column 3: Quick Access Grid */}
        <GlassPanel style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <span style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>Quick Access</span>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[
              { label: 'Voice Command', icon: Mic, color: '#a855f7', prompt: 'Voice command assistant active' },
              { label: 'Code Assistant', icon: Code, color: '#38bdf8', prompt: 'Analyze codebase structure' },
              { label: 'AI Terminal', icon: Terminal, color: '#34d399', prompt: 'Run build test check' },
              { label: 'Take Screenshot', icon: Camera, color: '#fbbf24', prompt: 'Capture screen and analyze' },
              { label: 'Open Project', icon: Folder, color: '#f43f5e', prompt: 'List active indexed workspace files' },
              { label: 'Settings', icon: Settings, color: '#a855f7', prompt: 'Open settings' }
            ].map((btn, idx) => {
              const Icon = btn.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleAskAtlas(btn.prompt)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '10px',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#fff',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={18} color={btn.color} />
                  <span>{btn.label}</span>
                </button>
              );
            })}
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};

const notifItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  background: 'rgba(255, 255, 255, 0.03)',
  padding: '10px 12px',
  borderRadius: '8px',
  border: '1px solid rgba(255, 255, 255, 0.06)'
};
