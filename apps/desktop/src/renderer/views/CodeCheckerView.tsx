import React, { useState } from 'react';
import { GlassPanel, Button } from '@atlas-os/ui';
import { Code, ShieldCheck, CheckCircle2, RefreshCw, Bug, Sparkles, Terminal } from 'lucide-react';
import { speakCuteAnimeVoice } from '../utils/speechVoice.js';

export const CodeCheckerView: React.FC = () => {
  const [codeSnippet, setCodeSnippet] = useState(
    `function calculateTotal(items) {\n  let total = 0;\n  for (let i = 0; i < items.length; i++) {\n    total += items[i].price;\n  }\n  return total;\n}`
  );
  const [auditResult, setAuditResult] = useState<string>('');
  const [isAuditing, setIsAuditing] = useState(false);

  const handleAuditCode = async () => {
    if (!codeSnippet.trim() || isAuditing) return;
    setIsAuditing(true);

    try {
      const res = await fetch('http://localhost:3001/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `Audit this code snippet for bugs, performance, security, and suggest auto-fixes:\n\`\`\`javascript\n${codeSnippet}\n\`\`\`` })
      });
      const data = await res.json();
      if (data.success && data.message?.text) {
        setAuditResult(data.message.text);
        speakCuteAnimeVoice('AI code security and performance audit complete!');
      }
    } catch (e) {
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 600 }}>AI Code Checker & Security Auditor</h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            Paste any JavaScript, TypeScript, Python, or C++ code snippet for instant bug scanning, security auditing, and auto-fix refactoring
          </p>
        </div>
        <Button variant="primary" onClick={handleAuditCode} disabled={isAuditing}>
          {isAuditing ? <RefreshCw size={16} className="atlas-spin" /> : <ShieldCheck size={16} />}
          Run Code Audit
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Code Input Panel */}
        <GlassPanel style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Code size={18} color="#38bdf8" />
            Input Code Snippet
          </div>
          <textarea
            rows={16}
            value={codeSnippet}
            onChange={(e) => setCodeSnippet(e.target.value)}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '14px',
              color: '#34d399',
              fontSize: '13px',
              lineHeight: 1.5,
              outline: 'none',
              fontFamily: 'monospace',
              resize: 'none'
            }}
          />
        </GlassPanel>

        {/* Audit Results Panel */}
        <GlassPanel style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bug size={18} color="#a855f7" />
            AI Vulnerability & Performance Audit
          </div>

          {auditResult ? (
            <div style={{ fontSize: '13px', lineHeight: 1.6, background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)', whiteSpace: 'pre-wrap', color: '#fff' }}>
              {auditResult}
            </div>
          ) : (
            <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
              Click "Run Code Audit" to scan your code snippet for bugs and security vulnerabilities!
            </div>
          )}
        </GlassPanel>
      </div>
    </div>
  );
};
