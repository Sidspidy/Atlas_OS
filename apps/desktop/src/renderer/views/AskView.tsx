import React, { useState } from 'react';
import { AtlasState } from '@atlas-os/shared';
import { AIChatMessage } from '@atlas-os/shared';
import { GlassPanel, Button } from '@atlas-os/ui';
import { Send, Bot, User, Terminal, Sparkles, FileCode, CheckCircle2, ShieldCheck } from 'lucide-react';

interface AskViewProps {
  initialPrompt?: string;
}

export const AskView: React.FC<AskViewProps> = ({ initialPrompt }) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'msg_0',
      sender: 'atlas',
      text: 'Hello! I am Atlas. I inspect your local codebase, run safe development tools, and answer questions grounded in your workspace files. What would you like to build or check today?',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [input, setInput] = useState(initialPrompt || '');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isProcessing) return;

    const userMsg: AIChatMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);

    // Update Atlas State Machine: IDLE -> THINKING -> SEARCHING -> WORKING -> SUCCESS
    if (window.atlasAPI) window.atlasAPI.setState(AtlasState.THINKING);

    setTimeout(async () => {
      if (window.atlasAPI) window.atlasAPI.setState(AtlasState.SEARCHING);

      try {
        const response = await fetch('http://localhost:3001/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: textToSend })
        });

        if (window.atlasAPI) window.atlasAPI.setState(AtlasState.WORKING);
        const data = await response.json();

        if (data.success && data.message) {
          if (window.atlasAPI) window.atlasAPI.setState(AtlasState.SUCCESS);
          setMessages((prev) => [...prev, data.message]);
        }
      } catch (e) {
        if (window.atlasAPI) window.atlasAPI.setState(AtlasState.ERROR);
        setMessages((prev) => [
          ...prev,
          {
            id: `msg_err_${Date.now()}`,
            sender: 'atlas',
            text: 'I encountered an issue connecting to the local backend service.',
            timestamp: new Date().toLocaleTimeString(),
            actions: [{ label: 'Check Backend Status', actionId: 'check_status' }]
          }
        ]);
      } finally {
        setIsProcessing(false);
        setTimeout(() => {
          if (window.atlasAPI) window.atlasAPI.setState(AtlasState.IDLE);
        }, 2500);
      }
    }, 600);
  };

  const handleActionClick = (actionId: string, payload?: any) => {
    if (actionId === 'open_file') {
      handleSend(`Read content from file ${payload?.query || 'auth.service.ts'}`);
    } else {
      handleSend(`Explain solution and architectural recommendations for ${actionId}`);
    }
  };

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 600 }}>AI Command Stream</h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '13px' }}>
            Interactive AI workspace with tool execution traces & grounded source citations
          </p>
        </div>
      </div>

      {/* Messages Stream */}
      <GlassPanel style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px' }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: msg.sender === 'atlas' ? 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))' : 'var(--bg-glass-hover)',
                boxShadow: msg.sender === 'atlas' ? 'var(--glow-cyan)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              {msg.sender === 'atlas' ? <Bot size={20} color="#fff" /> : <User size={20} color="var(--text-main)" />}
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontWeight: 600, fontSize: '14px', color: msg.sender === 'atlas' ? 'var(--accent-cyan)' : 'var(--text-main)' }}>
                  {msg.sender === 'atlas' ? 'Atlas Assistant' : 'You'}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{msg.timestamp}</span>
              </div>

              {/* Message Text */}
              <div style={{ fontSize: '14px', lineHeight: 1.6, background: 'var(--bg-secondary)', padding: '14px 18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                {msg.text}
              </div>

              {/* Executed Tools Trace Cards */}
              {msg.toolCalls && msg.toolCalls.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                  {msg.toolCalls.map((t, tIdx) => (
                    <div key={tIdx} style={{ fontSize: '12px', background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Terminal size={14} color="var(--accent-cyan)" />
                      <span>Executed Tool: <strong style={{ color: 'var(--accent-cyan)' }}>{t.toolName}</strong> ({t.executionTimeMs}ms)</span>
                      <CheckCircle2 size={14} color="var(--accent-emerald)" style={{ marginLeft: 'auto' }} />
                    </div>
                  ))}
                </div>
              )}

              {/* Grounded Sources Badges */}
              {msg.sources && msg.sources.length > 0 && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                  {msg.sources.map((src, sIdx) => (
                    <span key={sIdx} style={{ fontSize: '11px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', padding: '2px 8px', borderRadius: '4px', color: 'var(--accent-purple)' }}>
                      <FileCode size={10} style={{ marginRight: '4px' }} /> Grounded Source: {src}
                    </span>
                  ))}
                </div>
              )}

              {/* Contextual Action Buttons */}
              {msg.actions && msg.actions.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                  {msg.actions.map((act, aIdx) => (
                    <Button key={aIdx} variant="default" style={{ fontSize: '12px', padding: '5px 12px' }} onClick={() => handleActionClick(act.actionId, act.payload)}>
                      <Sparkles size={12} color="var(--accent-purple)" />
                      {act.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </GlassPanel>

      {/* Input Box */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask Atlas about your codebase, files, memory, or run tools..."
          disabled={isProcessing}
          style={{
            flex: 1,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 18px',
            color: 'var(--text-main)',
            fontSize: '14px',
            outline: 'none'
          }}
        />
        <Button variant="primary" onClick={() => handleSend()} disabled={isProcessing}>
          <Send size={16} />
        </Button>
      </div>
    </div>
  );
};
