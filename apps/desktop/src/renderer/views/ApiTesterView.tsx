import React, { useState } from 'react';
import { GlassPanel, Button } from '@atlas-os/ui';
import { Terminal, Send, Play, CheckCircle2, AlertCircle, Clock, Copy, Code, Layers } from 'lucide-react';
import { speakCuteAnimeVoice } from '../utils/speechVoice.js';

export const ApiTesterView: React.FC = () => {
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [url, setUrl] = useState('http://localhost:3001/api/proactive/system-stats');
  const [headersJson, setHeadersJson] = useState('{\n  "Content-Type": "application/json"\n}');
  const [bodyJson, setBodyJson] = useState('{\n  "query": "open file explorer"\n}');
  const [activeTab, setActiveTab] = useState<'body' | 'headers'>('headers');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseTimeMs, setResponseTimeMs] = useState<number | null>(null);
  const [responseData, setResponseData] = useState<string>('');
  const [isSending, setIsSending] = useState(false);

  const presetApis = [
    { name: 'System Hardware Stats', method: 'GET', url: 'http://localhost:3001/api/proactive/system-stats' },
    { name: 'AI Chat Endpoint', method: 'POST', url: 'http://localhost:3001/api/ai/chat', body: '{\n  "query": "check CPU status"\n}' },
    { name: 'PDF Files Scan', method: 'GET', url: 'http://localhost:3001/api/ai/pdf-files' },
    { name: 'System Status Health', method: 'GET', url: 'http://localhost:3001/api/status' }
  ];

  const handleSendRequest = async () => {
    if (!url.trim() || isSending) return;

    setIsSending(true);
    const startTime = Date.now();

    try {
      let parsedHeaders = {};
      try {
        parsedHeaders = JSON.parse(headersJson);
      } catch (e) {}

      const options: RequestInit = {
        method,
        headers: parsedHeaders
      };

      if (method !== 'GET' && method !== 'HEAD') {
        options.body = bodyJson;
      }

      const res = await fetch(url, options);
      const duration = Date.now() - startTime;
      setResponseStatus(res.status);
      setResponseTimeMs(duration);

      const data = await res.json();
      setResponseData(JSON.stringify(data, null, 2));
      speakCuteAnimeVoice(`API request returned status ${res.status} OK in ${duration} milliseconds!`);
    } catch (e: any) {
      setResponseStatus(500);
      setResponseTimeMs(Date.now() - startTime);
      setResponseData(JSON.stringify({ error: e.message || 'Failed to fetch API endpoint' }, null, 2));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 600 }}>Postman API Client & HTTP Tester Suite</h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            Execute REST API calls, inspect JSON responses, response times, and HTTP status codes
          </p>
        </div>
      </div>

      {/* Main Request Bar */}
      <GlassPanel style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        {/* Method Selector */}
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value as any)}
          style={{
            background: 'rgba(168, 85, 247, 0.2)',
            border: '1px solid #a855f7',
            borderRadius: '10px',
            padding: '10px 14px',
            color: '#a855f7',
            fontWeight: 800,
            fontSize: '14px',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>

        {/* URL Input */}
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="http://localhost:3001/api/..."
          style={{
            flex: 1,
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '10px 14px',
            color: '#fff',
            fontSize: '14px',
            fontFamily: 'monospace',
            outline: 'none'
          }}
        />

        <Button variant="primary" onClick={handleSendRequest} disabled={isSending}>
          <Send size={16} /> Send Request
        </Button>
      </GlassPanel>

      {/* Preset API Quick Buttons */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>Quick Presets:</span>
        {presetApis.map((api, i) => (
          <button
            key={i}
            onClick={() => {
              setMethod(api.method as any);
              setUrl(api.url);
              if (api.body) setBodyJson(api.body);
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              padding: '6px 12px',
              color: '#fff',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <strong style={{ color: api.method === 'GET' ? '#34d399' : '#38bdf8' }}>{api.method}</strong>
            <span>{api.name}</span>
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Request Tabs (Headers & Body) */}
        <GlassPanel style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', gap: '16px' }}>
            <button
              onClick={() => setActiveTab('headers')}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === 'headers' ? '2px solid #38bdf8' : '2px solid transparent',
                color: activeTab === 'headers' ? '#38bdf8' : 'var(--text-muted)',
                padding: '8px 12px',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Headers JSON
            </button>
            <button
              onClick={() => setActiveTab('body')}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === 'body' ? '2px solid #38bdf8' : '2px solid transparent',
                color: activeTab === 'body' ? '#38bdf8' : 'var(--text-muted)',
                padding: '8px 12px',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Request Body JSON
            </button>
          </div>

          {activeTab === 'headers' ? (
            <textarea
              rows={12}
              value={headersJson}
              onChange={(e) => setHeadersJson(e.target.value)}
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '12px',
                color: '#38bdf8',
                fontSize: '13px',
                fontFamily: 'monospace',
                outline: 'none',
                resize: 'none'
              }}
            />
          ) : (
            <textarea
              rows={12}
              value={bodyJson}
              onChange={(e) => setBodyJson(e.target.value)}
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '12px',
                color: '#a855f7',
                fontSize: '13px',
                fontFamily: 'monospace',
                outline: 'none',
                resize: 'none'
              }}
            />
          )}
        </GlassPanel>

        {/* Response Viewer */}
        <GlassPanel style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Code size={18} color="#34d399" />
              API Response Output
            </div>
            {responseStatus !== null && (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '12px' }}>
                <span style={{ color: responseStatus >= 200 && responseStatus < 300 ? '#34d399' : '#ef4444', fontWeight: 700 }}>
                  {responseStatus} {responseStatus === 200 ? 'OK' : ''}
                </span>
                <span style={{ color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> {responseTimeMs}ms
                </span>
              </div>
            )}
          </div>

          <textarea
            rows={12}
            readOnly
            value={responseData}
            placeholder="JSON API response output will appear here..."
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '10px',
              padding: '12px',
              color: '#34d399',
              fontSize: '13px',
              fontFamily: 'monospace',
              outline: 'none',
              resize: 'none'
            }}
          />
        </GlassPanel>
      </div>
    </div>
  );
};
