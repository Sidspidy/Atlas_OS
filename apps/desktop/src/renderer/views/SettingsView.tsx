import React, { useEffect, useState } from 'react';
import { GlassPanel, Button, useTheme } from '@atlas-os/ui';
import { Shield, Moon, Sun, Monitor, Key, Eye, EyeOff, CheckCircle2, AlertCircle, RefreshCw, Sparkles, Cpu, Layers } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const [activeProvider, setActiveProvider] = useState<'GEMINI' | 'OPENAI'>('GEMINI');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [keyStatus, setKeyStatus] = useState<{
    activeProvider: 'GEMINI' | 'OPENAI';
    hasOpenAiKey: boolean;
    hasGeminiKey: boolean;
    maskedOpenAiKey: string;
    maskedGeminiKey: string;
    selectedModel: string;
    selectedEmbedding: string;
  } | null>(null);

  const [isVerifying, setIsVerifying] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchKeyStatus = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/settings/keys');
      const data = await res.json();
      if (data && data.success) {
        setKeyStatus(data);
        if (data.activeProvider) {
          setActiveProvider(data.activeProvider);
        }
      }
    } catch (e) {
      console.warn('[SettingsView] Failed to fetch key status:', e);
    }
  };

  useEffect(() => {
    fetchKeyStatus();
  }, []);

  const handleSelectProvider = async (provider: 'GEMINI' | 'OPENAI') => {
    setActiveProvider(provider);
    try {
      await fetch('http://localhost:3001/api/settings/provider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider })
      });
      await fetchKeyStatus();
    } catch (e) {}
  };

  const handleVerifyAndSaveKey = async () => {
    if (!apiKeyInput.trim()) {
      setFeedback({ type: 'error', message: `Please enter a valid ${activeProvider === 'GEMINI' ? 'Gemini' : 'OpenAI'} API key` });
      return;
    }

    setIsVerifying(true);
    setFeedback(null);

    const endpoint = activeProvider === 'GEMINI' ? 'verify-gemini-key' : 'verify-key';

    try {
      const res = await fetch(`http://localhost:3001/api/settings/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKeyInput })
      });
      const data = await res.json();

      if (data.success) {
        setFeedback({ type: 'success', message: data.message });
        setApiKeyInput('');
        await fetchKeyStatus();
      } else {
        setFeedback({ type: 'error', message: data.error || 'Connection failed' });
      }
    } catch (e: any) {
      setFeedback({ type: 'error', message: `Failed to connect to backend: ${e.message}` });
    } finally {
      setIsVerifying(false);
    }
  };

  const isConnected = activeProvider === 'GEMINI' ? keyStatus?.hasGeminiKey : keyStatus?.hasOpenAiKey;
  const currentMaskedKey = activeProvider === 'GEMINI' ? keyStatus?.maskedGeminiKey : keyStatus?.maskedOpenAiKey;

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 600 }}>Atlas OS AI System Settings</h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            Google Gemini Pro & OpenAI API key management, model router, themes & security
          </p>
        </div>
        <Button variant="ghost" onClick={fetchKeyStatus}>
          <RefreshCw size={15} /> Refresh Status
        </Button>
      </div>

      {/* Provider Selection Tabs */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={() => handleSelectProvider('GEMINI')}
          style={{
            flex: 1,
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            background: activeProvider === 'GEMINI' ? 'rgba(56, 189, 248, 0.12)' : 'var(--bg-secondary)',
            border: activeProvider === 'GEMINI' ? '2px solid var(--accent-cyan)' : '1px solid var(--border-glass)',
            color: activeProvider === 'GEMINI' ? 'var(--accent-cyan)' : 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '15px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}
        >
          <Sparkles size={20} color="var(--accent-cyan)" />
          Google Gemini Pro (Recommended)
        </button>

        <button
          onClick={() => handleSelectProvider('OPENAI')}
          style={{
            flex: 1,
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            background: activeProvider === 'OPENAI' ? 'rgba(168, 85, 247, 0.12)' : 'var(--bg-secondary)',
            border: activeProvider === 'OPENAI' ? '2px solid var(--accent-purple)' : '1px solid var(--border-glass)',
            color: activeProvider === 'OPENAI' ? 'var(--accent-purple)' : 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '15px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}
        >
          <Cpu size={20} color="var(--accent-purple)" />
          OpenAI Models
        </button>
      </div>

      {/* AI Key & Model Router Config */}
      <GlassPanel style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Key size={20} color={activeProvider === 'GEMINI' ? 'var(--accent-cyan)' : 'var(--accent-purple)'} />
            {activeProvider === 'GEMINI' ? 'Google Gemini Pro API Configuration' : 'OpenAI API Configuration'}
          </div>
          <span style={{ fontSize: '12px', fontWeight: 600, padding: '4px 12px', borderRadius: 'var(--radius-full)', background: isConnected ? 'rgba(52, 211, 153, 0.15)' : 'rgba(251, 191, 36, 0.15)', color: isConnected ? 'var(--accent-emerald)' : 'var(--accent-amber)', border: '1px solid var(--border-glass)' }}>
            {isConnected ? `CONNECTED TO ${activeProvider}` : 'LOCAL FALLBACK ACTIVE'}
          </span>
        </div>

        <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          {activeProvider === 'GEMINI' ? (
            <span>Enter your <strong>Google Gemini API key</strong> to unlock live <strong>gemini-3.6-flash</strong> chat, <strong>gemini-2.5-flash</strong> reasoning, multimodal Vision analysis, and <strong>gemini-embedding-001</strong> (3072-dim) vector RAG memory.</span>
          ) : (
            <span>Enter your <strong>OpenAI API key</strong> (<code>sk-...</code>) to enable live <strong>gpt-4o-mini</strong> chat, <strong>gpt-4o</strong> vision analysis, <strong>text-embedding-3-small</strong> vector memory, and <strong>tts-1</strong> voice synthesis.</span>
          )}
        </div>

        {/* Input & Action Row */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type={showKey ? 'text' : 'password'}
              placeholder={activeProvider === 'GEMINI' ? 'Paste Google Gemini API Key' : 'Paste OpenAI API Key (sk-...)'}
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 40px 10px 14px',
                color: 'var(--text-main)',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            <button
              onClick={() => setShowKey(!showKey)}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <Button variant="primary" onClick={handleVerifyAndSaveKey} disabled={isVerifying}>
            {isVerifying ? <RefreshCw size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle2 size={15} />}
            {isVerifying ? 'Testing Key...' : `Test & Save ${activeProvider === 'GEMINI' ? 'Gemini' : 'OpenAI'} Key`}
          </Button>
        </div>

        {/* Feedback Alert Banner */}
        {feedback && (
          <div style={{ fontSize: '13px', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', background: feedback.type === 'success' ? 'rgba(52, 211, 153, 0.12)' : 'rgba(239, 68, 68, 0.12)', color: feedback.type === 'success' ? 'var(--accent-emerald)' : 'var(--accent-red)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {feedback.message}
          </div>
        )}

        {/* Active Provider Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginTop: '4px' }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Active {activeProvider} Key</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)', marginTop: '4px', fontFamily: 'monospace' }}>
              {currentMaskedKey || 'Unconfigured'}
            </div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Active Chat Model</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: activeProvider === 'GEMINI' ? 'var(--accent-cyan)' : 'var(--accent-purple)', marginTop: '4px' }}>
              {activeProvider === 'GEMINI' ? 'gemini-3.6-flash' : 'gpt-4o-mini'}
            </div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Vector Embedding Model</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent-emerald)', marginTop: '4px' }}>
              {activeProvider === 'GEMINI' ? 'gemini-embedding-001 (3072-dim)' : 'text-embedding-3-small'}
            </div>
          </div>
        </div>
      </GlassPanel>

      {/* Theme & Interface */}
      <GlassPanel style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Monitor size={20} color="var(--accent-cyan)" /> Theme & Interface
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px' }}>Theme Preference</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Currently using {theme} mode</div>
          </div>
          <button onClick={toggleTheme} className="atlas-button">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />} Switch Theme
          </button>
        </div>
      </GlassPanel>
    </div>
  );
};
