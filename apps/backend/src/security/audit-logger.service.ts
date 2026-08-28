import { Injectable } from '@nestjs/common';
import { SecurityAuditRecord } from '@atlas-os/shared';

@Injectable()
export class AuditLoggerService {
  private auditLogs: SecurityAuditRecord[] = [];

  constructor() {
    this.seedDefaultAuditLogs();
  }

  public getAuditLogs(): SecurityAuditRecord[] {
    return this.auditLogs;
  }

  public logEvent(event: Omit<SecurityAuditRecord, 'id' | 'timestamp'>) {
    const record: SecurityAuditRecord = {
      id: `audit_${Date.now()}_${Math.random()}`,
      timestamp: new Date().toLocaleTimeString(),
      ...event
    };
    this.auditLogs.unshift(record);
    return record;
  }

  private seedDefaultAuditLogs() {
    this.auditLogs = [
      {
        id: 'audit_1',
        timestamp: new Date(Date.now() - 120000).toLocaleTimeString(),
        eventType: 'TERMINAL_CMD',
        riskLevel: 'HIGH',
        source: 'TerminalAgent',
        description: 'Command "pnpm --filter @atlas-os/desktop build" requested permission approval',
        allowed: true
      },
      {
        id: 'audit_2',
        timestamp: new Date(Date.now() - 300000).toLocaleTimeString(),
        eventType: 'CREDENTIAL_ACCESS',
        riskLevel: 'MEDIUM',
        source: 'ModelRouterService',
        description: 'Read OPENAI_API_KEY from AES-256-GCM Credential Vault',
        allowed: true
      },
      {
        id: 'audit_3',
        timestamp: new Date(Date.now() - 600000).toLocaleTimeString(),
        eventType: 'IPC_CALL',
        riskLevel: 'LOW',
        source: 'ElectronRenderer',
        description: 'IPC Channel atlas:capture-screen validated origin app://atlasshell',
        allowed: true
      }
    ];
  }
}
