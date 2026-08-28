import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuditLoggerService } from './audit-logger.service';
import { CredentialVaultService } from './credential-vault.service';
import { SecurityValidatorService } from './security-validator.service';

@Controller('api/security')
export class SecurityController {
  constructor(
    private readonly auditLogger: AuditLoggerService,
    private readonly vault: CredentialVaultService,
    private readonly validator: SecurityValidatorService
  ) {}

  @Get('audit')
  getAuditLogs() {
    return {
      success: true,
      logs: this.auditLogger.getAuditLogs()
    };
  }

  @Get('score')
  getScore() {
    return {
      success: true,
      report: this.validator.getSecurityScore()
    };
  }

  @Get('vault/list')
  getVaultList() {
    return {
      success: true,
      items: this.vault.getVaultItems()
    };
  }

  @Post('vault/set')
  setVaultSecret(@Body() body: { key: string; provider: string; value: string }) {
    if (!body.key || !body.value) {
      return { success: false, error: 'Key and value are required' };
    }
    const item = this.vault.storeCredential(body.key, body.provider || 'Custom Provider', body.value);
    this.auditLogger.logEvent({
      eventType: 'CREDENTIAL_ACCESS',
      riskLevel: 'MEDIUM',
      source: 'SecurityController',
      description: `Stored key "${body.key}" into AES-256-GCM Credential Vault`,
      allowed: true
    });
    return { success: true, item };
  }
}
