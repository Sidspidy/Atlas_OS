import { Injectable } from '@nestjs/common';
import { RiskTier } from '@atlas-os/shared';

@Injectable()
export class RiskEvaluatorService {
  public evaluateCommand(cmd: string): { riskTier: RiskTier; warning?: string; requiresPermission: boolean } {
    const trimmed = cmd.trim().toLowerCase();

    // HIGH RISK PATTERNS
    if (
      trimmed.includes('rm -rf') ||
      trimmed.includes('del /s') ||
      trimmed.includes('git push --force') ||
      trimmed.includes('format ') ||
      trimmed.includes('drop database') ||
      trimmed.includes('shutdown')
    ) {
      return {
        riskTier: 'HIGH',
        warning: 'High Risk Action: Command performs permanent file deletion or destructive remote repository mutation!',
        requiresPermission: true
      };
    }

    // MEDIUM RISK PATTERNS
    if (
      trimmed.startsWith('pnpm install') ||
      trimmed.startsWith('npm install') ||
      trimmed.startsWith('pnpm add') ||
      trimmed.startsWith('mkdir') ||
      trimmed.startsWith('git commit') ||
      trimmed.startsWith('npm run dev') ||
      trimmed.startsWith('pnpm dev')
    ) {
      return {
        riskTier: 'MEDIUM',
        warning: 'Medium Risk Action: Command modifies workspace dependencies, files, or spawns long-running dev servers.',
        requiresPermission: true
      };
    }

    // LOW RISK PATTERNS (DEFAULT READ-ONLY / BUILD CHECKS)
    return {
      riskTier: 'LOW',
      requiresPermission: false
    };
  }
}
