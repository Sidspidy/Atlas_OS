import React from 'react';

interface AtlasEmblemLogoProps {
  size?: number;
}

export const AtlasEmblemLogo: React.FC<AtlasEmblemLogoProps> = ({ size = 34 }) => {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%, #1e1b4b 0%, #090d16 100%)',
        border: '1.5px solid rgba(168, 85, 247, 0.6)',
        boxShadow: '0 0 16px rgba(168, 85, 247, 0.4), inset 0 0 8px rgba(56, 189, 248, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      {/* Inner Neon Ring */}
      <div
        style={{
          width: '72%',
          height: '72%',
          borderRadius: '50%',
          border: '1.5px solid #38bdf8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 8px rgba(56, 189, 248, 0.6)'
        }}
      >
        {/* Character Chest Collar Emblem A */}
        <span
          style={{
            fontSize: `${size * 0.44}px`,
            fontWeight: 900,
            background: 'linear-gradient(180deg, #ffffff 0%, #38bdf8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 4px rgba(56, 189, 248, 0.8))',
            fontFamily: 'sans-serif'
          }}
        >
          A
        </span>
      </div>
    </div>
  );
};
