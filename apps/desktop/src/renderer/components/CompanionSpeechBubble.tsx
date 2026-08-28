import React from 'react';
import { X, Sparkles, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export interface SpeechNotification {
  id: string;
  title: string;
  message: string;
  actions?: { label: string; actionId: string }[];
  type?: 'info' | 'warning' | 'success' | 'error';
}

interface CompanionSpeechBubbleProps {
  notification: SpeechNotification;
  onDismiss: () => void;
  onActionClick: (actionId: string) => void;
}

export const CompanionSpeechBubble: React.FC<CompanionSpeechBubbleProps> = ({
  notification,
  onDismiss,
  onActionClick
}) => {
  const iconMap = {
    info: <Info size={16} color="var(--accent-cyan)" />,
    warning: <AlertTriangle size={16} color="var(--accent-amber)" />,
    success: <CheckCircle size={16} color="var(--accent-emerald)" />,
    error: <AlertTriangle size={16} color="var(--accent-rose)" />
  };

  const currentIcon = iconMap[notification.type || 'info'];

  return (
    <div
      style={{
        position: 'absolute',
        top: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '280px',
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid var(--border-glass)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 14px',
        boxShadow: 'var(--shadow-glass), var(--glow-cyan)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        animation: 'bubble-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}
    >
      {/* Header Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600 }}>
          {currentIcon}
          <span>{notification.title}</span>
        </div>
        <button
          onClick={onDismiss}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-dim)',
            cursor: 'pointer',
            padding: '2px',
            borderRadius: '4px'
          }}
        >
          <X size={14} />
        </button>
      </div>

      {/* Message Body */}
      <div style={{ fontSize: '12px', color: 'var(--text-main)', lineHeight: 1.4 }}>
        {notification.message}
      </div>

      {/* Action Buttons */}
      {notification.actions && notification.actions.length > 0 && (
        <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
          {notification.actions.map((act) => (
            <button
              key={act.actionId}
              onClick={() => onActionClick(act.actionId)}
              style={{
                background: 'var(--bg-glass-hover)',
                border: '1px solid var(--border-glass)',
                color: 'var(--accent-cyan)',
                borderRadius: 'var(--radius-sm)',
                padding: '4px 8px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {act.label}
            </button>
          ))}
        </div>
      )}

      {/* Embedded Animation */}
      <style>{`
        @keyframes bubble-pop {
          0% { opacity: 0; transform: translate(-50%, -10px) scale(0.9); }
          100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
        }
      `}</style>
    </div>
  );
};
