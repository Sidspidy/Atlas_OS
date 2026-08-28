import React, { useState } from 'react';
import { AtlasState } from '@atlas-os/shared';
import { VisionAnalysisResult } from '@atlas-os/shared';
import { GlassPanel, Button } from '@atlas-os/ui';
import { Camera, Eye, AlertCircle, CheckCircle2, FileText, Layout, RefreshCw, Sparkles } from 'lucide-react';

export const VisionView: React.FC = () => {
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<VisionAnalysisResult | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleCaptureScreen = async () => {
    if (!window.atlasAPI) return;
    setIsCapturing(true);
    window.atlasAPI.setState(AtlasState.SEARCHING);

    const res = await window.atlasAPI.captureScreen();
    if (res && res.success && res.dataUrl) {
      setScreenshotUrl(res.dataUrl);
      window.atlasAPI.setState(AtlasState.WORKING);
      setIsAnalyzing(true);

      const analysisRes = await window.atlasAPI.analyzeVision(res.dataUrl);
      if (analysisRes && analysisRes.result) {
        setAnalysis(analysisRes.result);
        window.atlasAPI.setState(AtlasState.SUCCESS);
      } else {
        window.atlasAPI.setState(AtlasState.ERROR);
      }
      setIsAnalyzing(false);
    } else {
      window.atlasAPI.setState(AtlasState.ERROR);
    }

    setIsCapturing(false);
    setTimeout(() => {
      window.atlasAPI?.setState(AtlasState.IDLE);
    }, 2000);
  };

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 600 }}>Vision & Screen-Aware AI Engine</h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            Desktop screenshot capture, visual element breakdown, OCR text extraction & stack trace error analysis
          </p>
        </div>
        <Button variant="primary" onClick={handleCaptureScreen} disabled={isCapturing || isAnalyzing}>
          <Camera size={16} /> Capture Screen & Analyze
        </Button>
      </div>

      {/* Screenshot Preview & Vision Results Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        {/* Left: Screen Image Canvas Preview */}
        <GlassPanel style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Eye size={18} color="var(--accent-cyan)" />
            Captured Screen Canvas Preview
          </div>

          {!screenshotUrl ? (
            <div style={{ height: '320px', borderRadius: 'var(--radius-sm)', border: '2px dashed var(--border-glass)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: '10px' }}>
              <Camera size={36} color="var(--text-dim)" />
              <span style={{ fontSize: '14px' }}>Click "Capture Screen & Analyze" to take a desktop snapshot</span>
            </div>
          ) : (
            <div style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
              <img src={screenshotUrl} alt="Captured Screen" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          )}
        </GlassPanel>

        {/* Right: Vision AI Diagnostics & OCR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Error Diagnostic Card */}
          <GlassPanel style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderColor: 'var(--accent-amber)' }}>
            <div style={{ fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={18} color="var(--accent-amber)" />
              Error Diagnostics & Stack Trace Analyzer
            </div>

            {analysis?.errorDiagnostic ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent-amber)' }}>
                  {analysis.errorDiagnostic.detectedError}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {analysis.errorDiagnostic.summary}
                </div>
                <div style={{ fontSize: '12px', background: 'rgba(56, 189, 248, 0.08)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(56, 189, 248, 0.2)', color: 'var(--accent-cyan)' }}>
                  💡 Suggested Fix: {analysis.errorDiagnostic.suggestedFix}
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                No active compilation errors detected in screenshot trace.
              </div>
            )}
          </GlassPanel>

          {/* Detected UI Elements & Text Snippets */}
          <GlassPanel style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layout size={18} color="var(--accent-purple)" />
              Detected Visual Layout & OCR Text Snippets
            </div>

            {!analysis ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                Screen analysis data will appear here after capturing screen.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
                {analysis.ocrText.map((snippet, idx) => (
                  <div key={idx} style={{ fontSize: '12px', background: 'var(--bg-secondary)', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={14} color="var(--accent-purple)" />
                    <span style={{ color: 'var(--text-main)', fontFamily: 'monospace' }}>{snippet}</span>
                  </div>
                ))}
              </div>
            )}
          </GlassPanel>
        </div>
      </div>
    </div>
  );
};
