import React, { useEffect, useState } from 'react';
import { AtlasState } from '@atlas-os/shared';
import { EYE_EXPRESSION_MAP, EyeExpressionConfig } from '@atlas-os/character';
import { AtlasEyeCanvas } from './AtlasEyeCanvas.js';

interface AtlasCharacterProps {
  state?: AtlasState;
  size?: 'sm' | 'md' | 'lg' | 'companion';
  interactive?: boolean;
  onStateClick?: () => void;
}

export const AtlasCharacter: React.FC<AtlasCharacterProps> = ({
  state = AtlasState.IDLE,
  size = 'md',
  interactive = true,
  onStateClick
}) => {
  const [currentConfig, setCurrentConfig] = useState<EyeExpressionConfig>(EYE_EXPRESSION_MAP[state]);
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setCurrentConfig(EYE_EXPRESSION_MAP[state] || EYE_EXPRESSION_MAP[AtlasState.IDLE]);
  }, [state]);

  const handleMouseMoveWrapper = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const tiltX = (e.clientY - centerY) / (rect.height / 2);
    const tiltY = (e.clientX - centerX) / (rect.width / 2);
    setTilt({ x: tiltX * -8, y: tiltY * 8 });
  };

  const handleMouseLeaveWrapper = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const sizeMap = {
    sm: { width: 100, height: 100, eyeCanvasWidth: 70, eyeCanvasHeight: 35, eyeSize: 12 },
    md: { width: 180, height: 180, eyeCanvasWidth: 120, eyeCanvasHeight: 50, eyeSize: 20 },
    lg: { width: 260, height: 260, eyeCanvasWidth: 170, eyeCanvasHeight: 70, eyeSize: 28 },
    companion: { width: 150, height: 150, eyeCanvasWidth: 100, eyeCanvasHeight: 45, eyeSize: 16 }
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
      onMouseMove={handleMouseMoveWrapper}
      onMouseLeave={handleMouseLeaveWrapper}
      onClick={onStateClick}
    >
      {/* Outer Fluffy Aura / Floating Halo */}
      <div
        style={{
          position: 'absolute',
          inset: -12,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${currentConfig.glowColor} 0%, rgba(0,0,0,0) 72%)`,
          transform: isHovered ? 'scale(1.12)' : 'scale(1)',
          transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), background 0.5s ease',
          pointerEvents: 'none'
        }}
      />

      {/* Floating Body Silhouette */}
      <div
        style={{
          width: currentSize.width * 0.85,
          height: currentSize.height * 0.75,
          borderRadius: '45% 45% 50% 50%',
          background: 'linear-gradient(180deg, #ffffff 0%, #e2e8f0 100%)',
          boxShadow: `0 14px 35px rgba(0,0,0,0.38), inset 0 2px 10px rgba(255,255,255,0.95)`,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${isHovered ? 'scale(1.03)' : 'scale(1)'}`,
          animation: state === AtlasState.SLEEP ? 'none' : 'atlas-float 4s ease-in-out infinite alternate',
          transition: 'transform 0.15s ease-out, background 0.3s ease'
        }}
      >
        {/* Glowing Translucent Ear Left */}
        <div
          style={{
            position: 'absolute',
            top: -12,
            left: 15,
            width: currentSize.width * 0.22,
            height: currentSize.height * 0.25,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(192, 132, 252, 0.45))',
            borderRadius: '50% 50% 20% 80%',
            transform: 'rotate(-20deg)',
            boxShadow: '0 4px 12px rgba(192, 132, 252, 0.35)'
          }}
        />
        {/* Glowing Translucent Ear Right */}
        <div
          style={{
            position: 'absolute',
            top: -12,
            right: 15,
            width: currentSize.width * 0.22,
            height: currentSize.height * 0.25,
            background: 'linear-gradient(225deg, rgba(255,255,255,0.95), rgba(56, 189, 248, 0.45))',
            borderRadius: '50% 50% 80% 20%',
            transform: 'rotate(20deg)',
            boxShadow: '0 4px 12px rgba(56, 189, 248, 0.35)'
          }}
        />

        {/* Dark Glass Digital Display Face */}
        <div
          style={{
            width: '74%',
            height: '56%',
            borderRadius: '30px',
            background: 'radial-gradient(circle at 50% 30%, #1e293b 0%, #090d16 100%)',
            border: '1.5px solid rgba(255,255,255,0.18)',
            boxShadow: 'inset 0 4px 14px rgba(0,0,0,0.85), 0 0 18px rgba(56, 189, 248, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Subtle Screen Reflection Glare */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '42%',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 100%)',
              pointerEvents: 'none'
            }}
          />

          {/* HTML5 Canvas Dynamic Digital Eyes */}
          <AtlasEyeCanvas
            state={state}
            eyeSize={currentSize.eyeSize}
            width={currentSize.eyeCanvasWidth}
            height={currentSize.eyeCanvasHeight}
          />
        </div>
      </div>

      {/* Embedded Animation Styles */}
      <style>{`
        @keyframes atlas-float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-7px) rotate(0.9deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
      `}</style>
    </div>
  );
};
