import React from 'react';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  glow?: boolean;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({ children, className = '', style, glow = false }) => {
  return (
    <div
      className={`atlas-glass ${className}`}
      style={{
        padding: '20px',
        boxShadow: glow ? 'var(--glow-cyan)' : 'var(--shadow-glass)',
        ...style
      }}
    >
      {children}
    </div>
  );
};
