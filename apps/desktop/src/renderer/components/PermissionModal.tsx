import React from 'react';
import { ShieldAlert, CheckCircle, Lock, AlertTriangle, X } from 'lucide-react';
import { RiskTier, PermissionDecision } from '@atlas-os/shared';
import { Button } from '@atlas-os/ui';

interface PermissionModalProps {
  isOpen: boolean;
  command: string;
  riskTier: RiskTier;
  warning?: string;
  onRespond: (decision: PermissionDecision) => void;
}

export const PermissionModal: React.FC<PermissionModalProps> = ({
  isOpen,
  command,
  riskTier,
  warning,
  onRespond
}) => {
  if (!isOpen) return null;

  const isHigh = riskTier === 'HIGH';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(10px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        style={{
          width: '520px',
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(20px)',
          border: isHigh ? '2px solid var(--accent-red)' : '2px solid var(--accent-amber)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: isHigh ? 'var(--shadow-glass), 0 0 25px rgba(239, 68, 68, 0.4)' : 'var(--shadow-glass), 0 0 25px rgba(245, 158, 11, 0.4)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          animation: 'modal-bounce 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: isHigh ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isHigh ? <ShieldAlert size={22} color="var(--accent-red)" /> : <AlertTriangle size={22} color="var(--accent-amber)" />}
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>
              Atlas Permission Request
            </div>
            <div style={{ fontSize: '12px', color: isHigh ? 'var(--accent-red)' : 'var(--accent-amber)', fontWeight: 600 }}>
              Risk Tier: {riskTier} RISK COMMAND
            </div>
          </div>
        </div>

        {/* Command Box */}
        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Atlas is requesting explicit authorization to execute the following terminal command on your machine:
        </div>

        <div style={{ background: 'var(--bg-secondary)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', fontFamily: 'monospace', fontSize: '13px', color: 'var(--accent-cyan)' }}>
          $ {command}
        </div>

        {warning && (
          <div style={{ fontSize: '12px', color: 'var(--text-dim)', background: 'rgba(245, 158, 11, 0.08)', padding: '8px 12px', borderRadius: '4px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
            ⚠️ {warning}
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
          <Button variant="ghost" onClick={() => onRespond('DENY')}>
            <X size={14} /> Deny
          </Button>
          <Button variant="default" onClick={() => onRespond('ALLOW_ONCE')}>
            <CheckCircle size={14} /> Allow Once
          </Button>
          <Button variant="primary" onClick={() => onRespond('ALLOW_ALWAYS')}>
            <Lock size={14} /> Allow Always
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes modal-bounce {
          0% { opacity: 0; transform: scale(0.92); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};
