import { Module } from '@nestjs/common';
import { AuditLoggerService } from './audit-logger.service';
import { CredentialVaultService } from './credential-vault.service';
import { SecurityValidatorService } from './security-validator.service';
import { SecurityController } from './security.controller';

@Module({
  providers: [AuditLoggerService, CredentialVaultService, SecurityValidatorService],
  controllers: [SecurityController],
  exports: [AuditLoggerService, CredentialVaultService, SecurityValidatorService]
})
export class SecurityModule {}
