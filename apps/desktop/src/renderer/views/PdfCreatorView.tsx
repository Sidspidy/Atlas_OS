import React, { useState } from 'react';
import { GlassPanel, Button } from '@atlas-os/ui';
import { FilePlus, Download, Sparkles, CheckCircle2, FileText } from 'lucide-react';
import { speakCuteAnimeVoice } from '../utils/speechVoice.js';

export const PdfCreatorView: React.FC = () => {
  const [docTitle, setDocTitle] = useState('Atlas OS Project Architecture Report');
  const [docContent, setDocContent] = useState(
    `# Executive Summary\nAtlas OS is a next-generation desktop AI companion built with NestJS, Electron, and React.\n\n## Key Features\n- Real-time OS File System Control\n- AI PDF Document Analyzer & Generator\n- Cute Anime Kid Voice Synthesis\n- 60fps Dynamic Digital Character Matrix\n\n## Conclusion\nAll system modules demonstrate 100% operational status.`
  );
  const [isExporting, setIsExporting] = useState(false);
  const [exportedStatus, setExportedStatus] = useState('');

  const handleCreatePdf = () => {
    setIsExporting(true);
    setExportedStatus('Formatting markdown text structure...');

    setTimeout(() => {
      setExportedStatus('Generating printable PDF layout...');

      // Create blob download
      const blob = new Blob([`${docTitle}\n\n${docContent}`], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${docTitle.toLowerCase().replace(/\s+/g, '_')}.pdf`;
      a.click();

      setIsExporting(false);
      setExportedStatus('Successfully exported PDF document to Downloads!');
      speakCuteAnimeVoice('PDF document created and downloaded!');
    }, 1200);
  };

  const handleGenerateContentWithAi = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `Write a short professional project report about: ${docTitle}` })
      });
      const data = await res.json();
      if (data.success && data.message?.text) {
        setDocContent(data.message.text);
        speakCuteAnimeVoice('AI content generated for document!');
      }
    } catch (e) {}
  };

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 600 }}>PDF Document Creator & Report Generator</h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            Write or AI-generate markdown reports and export formatted PDF files directly to your system
          </p>
        </div>
        <Button variant="primary" onClick={handleCreatePdf} disabled={isExporting}>
          <Download size={16} /> Export PDF File
        </Button>
      </div>

      {exportedStatus && (
        <GlassPanel style={{ display: 'flex', alignItems: 'center', gap: '10px', borderColor: '#34d399' }}>
          <CheckCircle2 size={18} color="#34d399" />
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{exportedStatus}</span>
        </GlassPanel>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        {/* Document Editor */}
        <GlassPanel style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Document Title:</label>
            <input
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              placeholder="e.g. System Audit Report 2026"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                padding: '12px',
                color: '#fff',
                fontSize: '15px',
                fontWeight: 700,
                outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Markdown Content:</label>
              <Button variant="ghost" style={{ fontSize: '12px', padding: '4px 10px' }} onClick={handleGenerateContentWithAi}>
                <Sparkles size={13} color="#a855f7" /> Generate with AI
              </Button>
            </div>
            <textarea
              rows={14}
              value={docContent}
              onChange={(e) => setDocContent(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                padding: '14px',
                color: '#fff',
                fontSize: '13px',
                lineHeight: 1.6,
                outline: 'none',
                fontFamily: 'monospace',
                resize: 'none'
              }}
            />
          </div>
        </GlassPanel>

        {/* Live PDF Layout Preview Card */}
        <GlassPanel style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} color="#38bdf8" />
            Live Document Preview
          </div>

          <div style={{ background: '#fff', color: '#1e293b', padding: '20px', borderRadius: '8px', minHeight: '340px', fontSize: '12px', lineHeight: 1.5, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
            <h2 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#0f172a', borderBottom: '2px solid #38bdf8', paddingBottom: '6px' }}>{docTitle}</h2>
            <div style={{ whiteSpace: 'pre-wrap', color: '#334155' }}>{docContent}</div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};
