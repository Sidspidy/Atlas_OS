import React, { useEffect, useRef } from 'react';

interface AudioWaveformVisualizerProps {
  isListening: boolean;
  isSpeaking: boolean;
}

export const AudioWaveformVisualizer: React.FC<AudioWaveformVisualizerProps> = ({ isListening, isSpeaking }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      ctx.beginPath();
      ctx.lineWidth = 3;

      if (isSpeaking) {
        ctx.strokeStyle = '#c084fc'; // Purple glow for TTS speaking
      } else if (isListening) {
        ctx.strokeStyle = '#38bdf8'; // Cyan glow for mic listening
      } else {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      }

      const amplitude = isSpeaking ? 30 : isListening ? 20 : 4;
      const frequency = isSpeaking ? 0.05 : isListening ? 0.03 : 0.01;

      for (let x = 0; x < width; x++) {
        const y = centerY + Math.sin(x * frequency + phase) * amplitude * Math.sin((x / width) * Math.PI);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();
      phase += 0.08;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isListening, isSpeaking]);

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={100}
      style={{
        width: '100%',
        height: '100px',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-glass)'
      }}
    />
  );
};
