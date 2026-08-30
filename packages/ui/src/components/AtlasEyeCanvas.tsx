import React, { useEffect, useRef, useState } from 'react';
import { AtlasState } from '@atlas-os/shared';
import { EYE_EXPRESSION_MAP, EyeExpressionConfig } from '@atlas-os/character';

interface AtlasEyeCanvasProps {
  state: AtlasState;
  eyeSize?: number;
  width?: number;
  height?: number;
}

export const AtlasEyeCanvas: React.FC<AtlasEyeCanvasProps> = ({
  state,
  eyeSize = 20,
  width = 120,
  height = 50
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: width / 2, y: height / 2 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const relX = (e.clientX / Math.max(1, window.innerWidth)) * width;
      const relY = (e.clientY / Math.max(1, window.innerHeight)) * height;
      setMousePos({ x: relX, y: relY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [width, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let startTime = Date.now();
    let isBlinking = false;
    let nextBlinkTime = Date.now() + 3000;

    const config: EyeExpressionConfig = EYE_EXPRESSION_MAP[state] || EYE_EXPRESSION_MAP[AtlasState.IDLE];

    const render = () => {
      const now = Date.now();
      const elapsed = (now - startTime) / 1000;
      ctx.clearRect(0, 0, width, height);

      // Handle Blinking logic
      if (config.blinkIntervalMs > 0) {
        if (now > nextBlinkTime) {
          isBlinking = true;
          setTimeout(() => {
            isBlinking = false;
            nextBlinkTime = Date.now() + config.blinkIntervalMs + (Math.random() * 2000 - 1000);
          }, 150);
        }
      }

      // Scaled Eye Tracking Offset: Gentle for companion mini window (6px), wider for main app (16px)
      let offsetX = 0;
      let offsetY = 0;
      if (config.enableCursorTracking) {
        const dx = (mousePos.x - width / 2) / (width / 2);
        const dy = (mousePos.y - height / 2) / (height / 2);
        const maxOffset = eyeSize < 18 ? 6 : 16;
        offsetX = Math.max(-maxOffset, Math.min(maxOffset, dx * maxOffset));
        offsetY = Math.max(-maxOffset, Math.min(maxOffset, dy * maxOffset));
      }

      const leftEyeCenter = { x: width * 0.3 + offsetX, y: height * 0.5 + offsetY };
      const rightEyeCenter = { x: width * 0.7 + offsetX, y: height * 0.5 + offsetY };

      // Neon Screen Glow
      ctx.fillStyle = config.primaryColor;
      ctx.shadowColor = config.primaryColor;
      ctx.shadowBlur = 18;

      if (isBlinking || config.eyeType === 'closed') {
        // Sleeping / Closed Cute Curved Eye Arches
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = config.primaryColor;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.arc(leftEyeCenter.x, leftEyeCenter.y + 2, eyeSize * 0.45, 0.15 * Math.PI, 0.85 * Math.PI);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(rightEyeCenter.x, rightEyeCenter.y + 2, eyeSize * 0.45, 0.15 * Math.PI, 0.85 * Math.PI);
        ctx.stroke();
      } else if (config.eyeType === 'equalizer' || config.eyeType === 'waveform') {
        // Vocal Speech Waves & Listening Equalizer Bar Matrix
        const barWidth = 4;
        const gap = 5;
        const totalWidth = 6 * barWidth + 5 * gap;
        const startX = (width - totalWidth) / 2;

        for (let i = 0; i < 6; i++) {
          const h = 8 + Math.sin(elapsed * 12 + i * 1.2) * 16;
          const x = startX + i * (barWidth + gap);
          const y = (height - h) / 2;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, h, 3);
          ctx.fill();
        }
      } else if (config.eyeType === 'scanning') {
        // Thinking Scanning Orbit Rings
        const radius = eyeSize * 0.55;
        ctx.lineWidth = 3;
        ctx.strokeStyle = config.primaryColor;

        ctx.beginPath();
        ctx.arc(leftEyeCenter.x, leftEyeCenter.y, radius, elapsed * 4, elapsed * 4 + 1.4 * Math.PI);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(rightEyeCenter.x, rightEyeCenter.y, radius, -elapsed * 4, -elapsed * 4 + 1.4 * Math.PI);
        ctx.stroke();
      } else if (config.eyeType === 'radar') {
        // Searching Radar Sweep
        const sweepAngle = elapsed * 3.5;
        const r = eyeSize * 0.65;

        [leftEyeCenter, rightEyeCenter].forEach((center) => {
          ctx.beginPath();
          ctx.arc(center.x, center.y, r, 0, 2 * Math.PI);
          ctx.lineWidth = 2;
          ctx.strokeStyle = config.primaryColor;
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(center.x, center.y);
          ctx.arc(center.x, center.y, r, sweepAngle, sweepAngle + 0.6);
          ctx.fillStyle = config.glowColor;
          ctx.fill();
        });
      } else if (config.eyeType === 'spinner') {
        // Working Spinning Ring
        const angle = elapsed * 6;
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = config.primaryColor;

        [leftEyeCenter, rightEyeCenter].forEach((center) => {
          ctx.beginPath();
          ctx.arc(center.x, center.y, eyeSize * 0.55, angle, angle + 1.3 * Math.PI);
          ctx.stroke();
        });
      } else if (config.eyeType === 'stars') {
        // Success Sparkling Victory Arches
        ctx.lineWidth = 4;
        ctx.strokeStyle = config.primaryColor;
        ctx.lineCap = 'round';

        [leftEyeCenter, rightEyeCenter].forEach((center) => {
          ctx.beginPath();
          ctx.arc(center.x, center.y + 4, eyeSize * 0.55, 1.15 * Math.PI, 1.85 * Math.PI);
          ctx.stroke();
        });
      } else if (config.eyeType === 'warning') {
        // Warning Alert
        [leftEyeCenter, rightEyeCenter].forEach((center) => {
          ctx.fillRect(center.x - 2.5, center.y - 9, 5, 11);
          ctx.fillRect(center.x - 2.5, center.y + 5, 5, 5);
        });
      } else if (config.eyeType === 'error') {
        // Error Slanted Cross
        const sz = 7;
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = config.primaryColor;
        ctx.lineCap = 'round';

        [leftEyeCenter, rightEyeCenter].forEach((center) => {
          ctx.beginPath();
          ctx.moveTo(center.x - sz, center.y - sz);
          ctx.lineTo(center.x + sz, center.y + sz);
          ctx.moveTo(center.x + sz, center.y - sz);
          ctx.lineTo(center.x - sz, center.y + sz);
          ctx.stroke();
        });
      } else {
        // Default / Excited Animated Pupils with Dual Shimmer Glints
        const currentScale = config.pupilScale + Math.sin(elapsed * 2.5) * 0.04;
        const currentEyeRadius = (eyeSize / 2) * currentScale;

        // Outer Eye Base Circle
        ctx.beginPath();
        ctx.arc(leftEyeCenter.x, leftEyeCenter.y, currentEyeRadius, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(rightEyeCenter.x, rightEyeCenter.y, currentEyeRadius, 0, 2 * Math.PI);
        ctx.fill();

        // Primary Pupil Glint (Top-Left)
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 4;

        ctx.beginPath();
        ctx.arc(leftEyeCenter.x - currentEyeRadius * 0.35, leftEyeCenter.y - currentEyeRadius * 0.35, currentEyeRadius * 0.32, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(rightEyeCenter.x - currentEyeRadius * 0.35, rightEyeCenter.y - currentEyeRadius * 0.35, currentEyeRadius * 0.32, 0, 2 * Math.PI);
        ctx.fill();

        // Secondary Shimmer Sparkle Glint (Bottom-Right)
        ctx.beginPath();
        ctx.arc(leftEyeCenter.x + currentEyeRadius * 0.35, leftEyeCenter.y + currentEyeRadius * 0.3, currentEyeRadius * 0.16, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(rightEyeCenter.x + currentEyeRadius * 0.35, rightEyeCenter.y + currentEyeRadius * 0.3, currentEyeRadius * 0.16, 0, 2 * Math.PI);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [state, eyeSize, width, height, mousePos]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ display: 'block', pointerEvents: 'none' }}
    />
  );
};
