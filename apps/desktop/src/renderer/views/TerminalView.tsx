import React, { useEffect, useState } from 'react';
import { AtlasState } from '@atlas-os/shared';
import { CommandExecutionResult, ProcessStatusRecord, PermissionDecision } from '@atlas-os/shared';
import { GlassPanel, Button } from '@atlas-os/ui';
import { Terminal, Play, Shield, AlertTriangle, RefreshCw, XCircle, CheckCircle2 } from 'lucide-react';
import { PermissionModal } from '../components/PermissionModal.js';

export const TerminalView: React.FC = () => {
  const [commandInput, setCommandInput] = useState('');
  const [logs, setLogs] = useState<CommandExecutionResult[]>([]);
  const [activeProcesses, setActiveProcesses] = useState<ProcessStatusRecord[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);

  // Permission Request Modal State
  const [pendingCommand, setPendingCommand] = useState<{ command: string; riskTier: any; warning?: string } | null>(null);

  const fetchActiveProcesses = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/terminal/processes');
      const data = await res.json();
      if (data && data.processes) {
        setActiveProcesses(data.processes);
      }
    } catch (e) {
      console.warn('[TerminalView] Failed to fetch processes:', e);
    }
  };

  useEffect(() => {
    fetchActiveProcesses();
    const interval = setInterval(fetchActiveProcesses, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRunCommand = async (cmdToRun?: string, decision?: PermissionDecision) => {
    const targetCmd = cmdToRun || commandInput;
    if (!targetCmd.trim()) return;

    setIsExecuting(true);
    if (window.atlasAPI) window.atlasAPI.setState(AtlasState.WORKING);

    try {
      const res = await fetch('http://localhost:3001/api/terminal/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: targetCmd, decision })
      });
      const data = await res.json();

      if (data.requiresPermission) {
        // Trigger Permission Modal & Set Atlas state to AWAITING_PERMISSION
        if (window.atlasAPI) window.atlasAPI.setState(AtlasState.AWAITING_PERMISSION);
        setPendingCommand({
          command: data.command,
          riskTier: data.riskTier,
          warning: data.warning
        });
      } else if (data.result) {
        setLogs((prev) => [data.result, ...prev]);
        setCommandInput('');
        if (window.atlasAPI) window.atlasAPI.setState(AtlasState.SUCCESS);
        await fetchActiveProcesses();
      }
    } catch (e) {
      if (window.atlasAPI) window.atlasAPI.setState(AtlasState.ERROR);
    } finally {
      setIsExecuting(false);
      setTimeout(() => {
        if (window.atlasAPI) window.atlasAPI.setState(AtlasState.IDLE);
      }, 2000);
    }
  };

  const handlePermissionDecision = (decision: PermissionDecision) => {
    if (!pendingCommand) return;
    const cmd = pendingCommand.command;
    setPendingCommand(null);

    if (decision === 'DENY') {
      if (window.atlasAPI) window.atlasAPI.setState(AtlasState.PAUSED);
      setTimeout(() => {
        if (window.atlasAPI) window.atlasAPI.setState(AtlasState.IDLE);
      }, 1500);
      return;
    }

    // Re-execute with permission decision
    handleRunCommand(cmd, decision);
  };

  const handleKillProcess = async (pid: number) => {
    try {
      const res = await fetch(`http://localhost:3001/api/terminal/kill/${pid}`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success) {
        setActiveProcesses((prev) => prev.filter((p) => p.pid !== pid));
      }
    } catch (e) {
      console.warn('[TerminalView] Failed to kill process:', e);
    }
  };

  return (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 600 }}>Terminal Agent & Permission Engine</h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            Sandboxed process execution, risk evaluation, live terminal stdout stream & process tracking
          </p>
        </div>
        <Button variant="ghost" onClick={fetchActiveProcesses}>
          <RefreshCw size={15} /> Refresh Processes
        </Button>
      </div>

      {/* Command Bar Input */}
      <GlassPanel style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Terminal size={20} color="var(--accent-cyan)" />
        <input
          type="text"
          placeholder="Type a CLI command to execute (e.g. pnpm --version, git status, mkdir test_dir)..."
          value={commandInput}
          onChange={(e) => setCommandInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleRunCommand()}
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-main)', fontSize: '14px', fontFamily: 'monospace' }}
        />
        <Button variant="primary" onClick={() => handleRunCommand()} disabled={isExecuting}>
          <Play size={15} /> Run Command
        </Button>
      </GlassPanel>

      {/* Active Running Processes Table */}
      <GlassPanel style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={18} color="var(--accent-emerald)" />
          Active Background Child Processes ({activeProcesses.length})
        </div>

        {activeProcesses.length === 0 ? (
          <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
            No background processes currently running.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {activeProcesses.map((proc) => (
              <div key={proc.pid} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-secondary)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-cyan)', background: 'var(--bg-glass-hover)', padding: '2px 8px', borderRadius: '4px' }}>
                    PID: {proc.pid}
                  </span>
                  <span style={{ fontSize: '13px', fontFamily: 'monospace', color: 'var(--text-main)' }}>{proc.command}</span>
                </div>
                <button
                  onClick={() => handleKillProcess(proc.pid)}
                  style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--accent-red)', padding: '4px 10px', borderRadius: 'var(--radius-sm)', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                >
                  <XCircle size={12} style={{ marginRight: '4px' }} /> Kill Process
                </button>
              </div>
            ))}
          </div>
        )}
      </GlassPanel>

      {/* Terminal Output Log Stream */}
      <GlassPanel style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Terminal size={18} color="var(--accent-cyan)" />
          Execution Log & Stdout Output
        </div>

        {logs.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
            No commands executed yet in this session.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '380px', overflowY: 'auto' }}>
            {logs.map((log) => (
              <div key={log.id} style={{ background: 'var(--bg-secondary)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                  <div style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--accent-cyan)' }}>$ {log.command}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: log.success ? 'var(--accent-emerald)' : 'var(--accent-red)', fontWeight: 600 }}>
                      Exit Code: {log.exitCode}
                    </span>
                    <span style={{ color: 'var(--text-dim)' }}>{log.executionTimeMs}ms</span>
                  </div>
                </div>

                {log.stdout && (
                  <pre style={{ margin: 0, padding: '10px', background: 'rgba(0,0,0,0.4)', borderRadius: '4px', fontSize: '12px', fontFamily: 'monospace', color: '#e2e8f0', whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
                    {log.stdout}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </GlassPanel>

      {/* Permission Modal Component */}
      {pendingCommand && (
        <PermissionModal
          isOpen={!!pendingCommand}
          command={pendingCommand.command}
          riskTier={pendingCommand.riskTier}
          warning={pendingCommand.warning}
          onRespond={handlePermissionDecision}
        />
      )}
    </div>
  );
};
