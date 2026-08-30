import React, { useEffect, useState } from 'react';
import { GlassPanel, Button } from '@atlas-os/ui';
import { FileText, Search, Sparkles, Download, CheckCircle2, RefreshCw, BookOpen, FileCode } from 'lucide-react';
import { speakCuteAnimeVoice } from '../utils/speechVoice.js';

export const PdfAnalyzerView: React.FC = () => {
  const [pdfFiles, setPdfFiles] = useState<{ name: string; fullPath: string; sizeMb: string }[]>([]);
  const [selectedPdf, setSelectedPdf] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [qaHistory, setQaHistory] = useState<{ q: string; a: string }[]>([]);

  const fetchLocalPdfs = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/ai/pdf-files');
      const data = await res.json();
      if (data.success && data.pdfs) {
        setPdfFiles(data.pdfs);
        if (data.pdfs.length > 0) {
          handleAnalyzePdf(data.pdfs[0].fullPath);
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchLocalPdfs();
  }, []);

  const handleAnalyzePdf = async (filePath: string) => {
    setSelectedPdf(filePath);
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/ai/analyze-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath })
      });
      const data = await res.json();
      if (data.success && data.analysis) {
        setAnalysisResult(data.analysis);
        speakCuteAnimeVoice(`PDF analysis complete for ${data.analysis.fileName}!`);
      }
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!question.trim() || isLoading) return;
    const userQ = question;
    setQuestion('');
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:3001/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `Regarding PDF file "${selectedPdf}": ${userQ}` })
      });
      const data = await res.json();
      const answer = data.message?.text || 'Analysis complete.';

      setQaHistory((prev) => [...prev, { q: userQ, a: answer }]);
      speakCuteAnimeVoice(answer.slice(0, 100));
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 600 }}>PDF Document Analyzer & Summary AI</h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            Select any local PDF document from your system to extract summaries, key insights, and ask questions
          </p>
        </div>
        <Button variant="ghost" onClick={fetchLocalPdfs}>
          <RefreshCw size={15} /> Refresh Local PDFs
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>
        {/* PDF File Picker Sidebar */}
        <GlassPanel style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} color="#38bdf8" />
            Local System PDFs ({pdfFiles.length})
          </div>

          {pdfFiles.length === 0 ? (
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', padding: '16px', textAlign: 'center' }}>
              No PDF files found in Downloads. Place any PDF in your Downloads folder to analyze!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {pdfFiles.map((pdf, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnalyzePdf(pdf.fullPath)}
                  style={{
                    background: selectedPdf === pdf.fullPath ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    border: selectedPdf === pdf.fullPath ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '10px',
                    padding: '12px',
                    textAlign: 'left',
                    color: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '13px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    📄 {pdf.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Size: {pdf.sizeMb}</div>
                </button>
              ))}
            </div>
          )}
        </GlassPanel>

        {/* Main PDF Content Analysis & Q&A View */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {analysisResult && (
            <GlassPanel style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: '17px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BookOpen size={20} color="#a855f7" />
                  {analysisResult.fileName}
                </div>
                <span style={{ fontSize: '12px', background: 'rgba(168, 85, 247, 0.2)', color: '#a855f7', padding: '4px 10px', borderRadius: '12px', fontWeight: 600 }}>
                  {analysisResult.pageCount} Pages Analyzed
                </span>
              </div>

              <div style={{ fontSize: '14px', lineHeight: 1.6, background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <strong>Executive Summary:</strong>
                <p style={{ margin: '6px 0 0 0', color: 'var(--text-muted)' }}>{analysisResult.summary}</p>
              </div>

              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '8px' }}>Key Document Takeaways:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {analysisResult.keyTakeaways.map((item: string, i: number) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
                      <CheckCircle2 size={14} color="#34d399" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </GlassPanel>
          )}

          {/* Q&A Chat Over Selected PDF */}
          <GlassPanel style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="#38bdf8" />
              Ask Questions About This PDF
            </div>

            {/* QA History */}
            {qaHistory.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: 'rgba(255, 255, 255, 0.03)', padding: '12px 16px', borderRadius: '10px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#38bdf8' }}>Q: {item.q}</div>
                <div style={{ fontSize: '13px', color: '#fff', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{item.a}</div>
              </div>
            ))}

            {/* Input Box */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
                placeholder="Ask anything about this PDF document..."
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: '#fff',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
              <Button variant="primary" onClick={handleAskQuestion} disabled={isLoading}>
                Ask PDF
              </Button>
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
};
