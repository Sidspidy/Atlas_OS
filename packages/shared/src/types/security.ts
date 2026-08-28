export type SecurityRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface SecurityAuditRecord {
  id: string;
  timestamp: string;
  eventType: 'IPC_CALL' | 'TERMINAL_CMD' | 'CREDENTIAL_ACCESS' | 'PERMISSION_GRANT';
  riskLevel: SecurityRiskLevel;
  source: string;
  description: string;
  allowed: boolean;
}

export interface CredentialVaultItem {
  key: string;
  provider: string;
  encryptedValue: string;
  updatedAt: string;
}

export interface SecurityScoreReport {
  score: number;
  grade: 'A+' | 'A' | 'B' | 'C';
  ipcLockdownActive: boolean;
  credentialVaultActive: boolean;
  contextIsolationActive: boolean;
  auditLoggingActive: boolean;
}
