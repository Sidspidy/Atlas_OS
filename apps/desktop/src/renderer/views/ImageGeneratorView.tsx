import React, { useState } from 'react';
import { GlassPanel, Button } from '@atlas-os/ui';
import { Image, Sparkles, Download, RefreshCw, Wand2, Layers } from 'lucide-react';
import { speakCuteAnimeVoice } from '../utils/speechVoice.js';

export const ImageGeneratorView: React.FC = () => {
  const [prompt, setPrompt] = useState('Cyberpunk futuristic cute anime robot companion, neon lights, 8k resolution');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16'>('1:1');

  const presetPrompts = [
    'Futuristic cute anime girl robot companion floating in space, high detail, neon glow',
    '3D isometric cyberpunk city dashboard with holographic UI displays, 8k render',
    'Chibi fluffy white mascot wearing glowing VR visor headset, digital art wallpaper',
    'Ultra-realistic luxury AI workstation desk setup with dual monitors and RGB lighting'
  ];

  const handleGenerateImage = async (promptToUse?: string) => {
    const activePrompt = promptToUse || prompt;
    if (!activePrompt.trim() || isGenerating) return;

    setIsGenerating(true);
    let width = 1024;
    let height = 1024;
    if (aspectRatio === '16:9') {
      width = 1280;
      height = 720;
    } else if (aspectRatio === '9:16') {
      width = 720;
      height = 1280;
    }

    try {
      const res = await fetch('http://localhost:3001/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: activePrompt, width, height })
      });
      const data = await res.json();
      if (data.success && data.imageUrl) {
        setImageUrl(data.imageUrl);
        speakCuteAnimeVoice('AI image generation complete!');
      }
    } catch (e) {
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 600 }}>AI Image Generator Studio</h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            High-speed AI text-to-image creation engine with customizable aspect ratios and style presets
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '24px' }}>
        {/* Main Display Canvas */}
        <GlassPanel style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '440px', padding: '24px' }}>
          {isGenerating ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <RefreshCw size={36} color="#a855f7" className="atlas-spin" />
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#fff' }}>Generating AI Artwork...</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Rendering neural diffusion prompt models</div>
            </div>
          ) : imageUrl ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%' }}>
              <img
                src={imageUrl}
                alt="AI Generated Artwork"
                style={{
                  maxWidth: '100%',
                  maxHeight: '420px',
                  borderRadius: '16px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              />
              <div style={{ display: 'flex', gap: '12px' }}>
                <a
                  href={imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  download="atlas_ai_art.png"
                  style={{ textDecoration: 'none' }}
                >
                  <Button variant="primary">
                    <Download size={16} /> Open & Save High-Res Image
                  </Button>
                </a>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', color: 'var(--text-muted)' }}>
              <Image size={56} color="var(--text-dim)" />
              <div style={{ fontSize: '15px', fontWeight: 600 }}>No Image Generated Yet</div>
              <div style={{ fontSize: '13px' }}>Type a prompt on the right and click "Generate AI Artwork"</div>
            </div>
          )}
        </GlassPanel>

        {/* Prompt Input Sidebar */}
        <GlassPanel style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wand2 size={18} color="#a855f7" />
            Prompt & Generation Controls
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>Text Prompt:</label>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate in detail..."
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                padding: '12px',
                color: '#fff',
                fontSize: '13px',
                outline: 'none',
                resize: 'none'
              }}
            />
          </div>

          {/* Aspect Ratio Buttons */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Aspect Ratio:</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['1:1', '16:9', '9:16'] as const).map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  style={{
                    flex: 1,
                    background: aspectRatio === ratio ? 'rgba(168, 85, 247, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                    border: aspectRatio === ratio ? '1px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          <Button variant="primary" onClick={() => handleGenerateImage()} disabled={isGenerating}>
            <Sparkles size={16} /> Generate AI Artwork
          </Button>

          {/* Presets */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>Preset Prompts:</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {presetPrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPrompt(p);
                    handleGenerateImage(p);
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    textAlign: 'left',
                    color: 'var(--text-muted)',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  ✨ {p.slice(0, 45)}...
                </button>
              ))}
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};
