import React from 'react';

interface StatusIndicatorProps {
  status: 'online' | 'busy' | 'warning' | 'offline';
  label?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, label }) => {
  const colorMap = {
    online: '#34d399',
    busy: '#38bdf8',
    warning: '#fbbf24',
    offline: '#64748b'
  };

  const color = colorMap[status];

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: color,
          boxShadow: `0 0 8px ${color}`
        }}
      />
      {label && <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{label}</span>}
    </div>
  );
};
