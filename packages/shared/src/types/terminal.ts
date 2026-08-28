export type RiskTier = 'LOW' | 'MEDIUM' | 'HIGH';

export type PermissionDecision = 'ALLOW_ONCE' | 'ALLOW_ALWAYS' | 'DENY';

export interface CommandExecutionRequest {
  id: string;
  command: string;
  cwd?: string;
  riskTier: RiskTier;
  warning?: string;
  requiresPermission: boolean;
}

export interface CommandExecutionResult {
  id: string;
  command: string;
  pid?: number;
  stdout: string;
  stderr: string;
  exitCode: number | null;
  executionTimeMs: number;
  success: boolean;
}

export interface ProcessStatusRecord {
  pid: number;
  command: string;
  startedAt: string;
  cpuPercent?: number;
  memoryMb?: number;
}
