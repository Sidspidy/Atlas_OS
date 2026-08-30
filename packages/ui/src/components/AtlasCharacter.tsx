import React, { useEffect, useState } from 'react';
import { AtlasState } from '@atlas-os/shared';
import { EYE_EXPRESSION_MAP, EyeExpressionConfig } from '@atlas-os/character';
import { AtlasEyeCanvas } from './AtlasEyeCanvas.js';

interface AtlasCharacterProps {
  state?: AtlasState;
  size?: 'sm' | 'md' | 'lg' | 'companion';
  interactive?: boolean;
  onStateClick?: () => void;
  showGlow?: boolean;
}

export const AtlasCharacter: React.FC<AtlasCharacterProps> = ({
  state = AtlasState.IDLE,
  size = 'md',
  interactive = true,
  onStateClick,
  showGlow = false
}) => {
  const [activeState, setActiveState] = useState<AtlasState>(state);
  const [currentConfig, setCurrentConfig] = useState<EyeExpressionConfig>(EYE_EXPRESSION_MAP[state]);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setActiveState(state);
    setCurrentConfig(EYE_EXPRESSION_MAP[state] || EYE_EXPRESSION_MAP[AtlasState.IDLE]);
  }, [state]);

  // Listen to global IPC Atlas State Changes
  useEffect(() => {
    if ((window as any).atlasAPI && (window as any).atlasAPI.onStateChanged) {
      const unsubscribe = (window as any).atlasAPI.onStateChanged((newStateStr: string) => {
        const newState = newStateStr as AtlasState;
        setActiveState(newState);
        setCurrentConfig(EYE_EXPRESSION_MAP[newState] || EYE_EXPRESSION_MAP[AtlasState.IDLE]);
      });
      return () => {
        if (typeof unsubscribe === 'function') unsubscribe();
      };
    }
  }, []);

  // Global mouse tracking across the entire screen
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const tiltX = (e.clientY - centerY) / (window.innerHeight / 2);
      const tiltY = (e.clientX - centerX) / (window.innerWidth / 2);
      setTilt({ x: Math.max(-10, Math.min(10, tiltX * -10)), y: Math.max(-10, Math.min(10, tiltY * 10)) });
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  const sizeMap = {
    sm: { width: 110, height: 165, eyeCanvasWidth: 70, eyeCanvasHeight: 35, eyeSize: 12, visorTop: '45%', visorWidth: '60%', visorHeight: '22%' },
    md: { width: 170, height: 255, eyeCanvasWidth: 120, eyeCanvasHeight: 50, eyeSize: 20, visorTop: '45%', visorWidth: '60%', visorHeight: '22%' },
    lg: { width: 240, height: 360, eyeCanvasWidth: 170, eyeCanvasHeight: 70, eyeSize: 28, visorTop: '45%', visorWidth: '60%', visorHeight: '22%' },
    companion: { width: 140, height: 210, eyeCanvasWidth: 100, eyeCanvasHeight: 45, eyeSize: 16, visorTop: '45%', visorWidth: '60%', visorHeight: '22%' }
  };

  const currentSize = sizeMap[size];

  return (
    <div
      className="atlas-character-wrapper"
      style={{
        width: currentSize.width,
        height: currentSize.height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: interactive ? 'pointer' : 'default',
        userSelect: 'none',
        perspective: '600px'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onStateClick}
    >
      {/* Optional Glow */}
      {showGlow && (
        <div
          style={{
            position: 'absolute',
            inset: -16,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${currentConfig.glowColor} 0%, rgba(0,0,0,0) 70%)`,
            transform: isHovered ? 'scale(1.15)' : 'scale(1)',
            transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), background 0.5s ease',
            pointerEvents: 'none',
            opacity: 0.6
          }}
        />
      )}

      {/* Fluffy Character Head Container */}
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${isHovered ? 'scale(1.04)' : 'scale(1)'}`,
          animation: activeState === AtlasState.SLEEP ? 'none' : 'atlas-float 4s ease-in-out infinite alternate',
          transition: 'transform 0.1s ease-out'
        }}
      >
        {/* High-Resolution Transparent Character Head Image */}
        <img
          src={`/assets/atlas_head.png?v=3`}
          alt="Atlas Companion Head"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            filter: isHovered ? 'brightness(1.06)' : 'none',
            transition: 'filter 0.3s ease'
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = `./assets/atlas_head.png?v=3`;
          }}
        />

        {/* Digital Eyes Overlay Container (Positioned inside Black Visor Screen) */}
        <div
          style={{
            position: 'absolute',
            top: currentSize.visorTop,
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: currentSize.visorWidth,
            height: currentSize.visorHeight,
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            pointerEvents: 'none'
          }}
        >
          {/* Subtle Glare Lens Reflection */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '45%',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 100%)',
              zIndex: 2,
              pointerEvents: 'none'
            }}
          />

          {/* HTML5 Canvas Dynamic Digital Eyes Matrix */}
          <AtlasEyeCanvas
            state={activeState}
            eyeSize={currentSize.eyeSize}
            width={currentSize.eyeCanvasWidth}
            height={currentSize.eyeCanvasHeight}
          />
        </div>
      </div>

      {/* Floating Breathing Animation Styles */}
      <style>{`
        @keyframes atlas-float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(0.8deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
      `}</style>
    </div>
  );
};
