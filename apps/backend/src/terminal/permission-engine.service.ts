import { Injectable } from '@nestjs/common';
import { PermissionDecision } from '@atlas-os/shared';

@Injectable()
export class PermissionEngineService {
  private allowedAlwaysCommands: Set<string> = new Set();

  public isCommandPreApproved(cmd: string): boolean {
    const base = cmd.trim().toLowerCase().split(' ')[0];
    return this.allowedAlwaysCommands.has(base);
  }

  public registerDecision(cmd: string, decision: PermissionDecision): void {
    if (decision === 'ALLOW_ALWAYS') {
      const base = cmd.trim().toLowerCase().split(' ')[0];
      this.allowedAlwaysCommands.add(base);
    }
  }
}
