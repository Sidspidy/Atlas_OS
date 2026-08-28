import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { RiskEvaluatorService } from './risk-evaluator.service';
import { ProcessManagerService } from './process-manager.service';
import { PermissionEngineService } from './permission-engine.service';
import { PermissionDecision } from '@atlas-os/shared';

@Controller('api/terminal')
export class TerminalController {
  constructor(
    private readonly riskEvaluator: RiskEvaluatorService,
    private readonly processManager: ProcessManagerService,
    private readonly permissionEngine: PermissionEngineService
  ) {}

  @Post('run')
  async runCommand(@Body() body: { command: string; cwd?: string; decision?: PermissionDecision }) {
    if (!body.command) {
      return { success: false, error: 'Command is required' };
    }

    const evaluation = this.riskEvaluator.evaluateCommand(body.command);

    // If pre-approved or user provided ALLOW decision
    const preApproved = this.permissionEngine.isCommandPreApproved(body.command);
    const userAllowed = body.decision === 'ALLOW_ONCE' || body.decision === 'ALLOW_ALWAYS';

    if (body.decision) {
      this.permissionEngine.registerDecision(body.command, body.decision);
    }

    if (evaluation.requiresPermission && !preApproved && !userAllowed) {
      return {
        success: false,
        requiresPermission: true,
        riskTier: evaluation.riskTier,
        warning: evaluation.warning,
        command: body.command
      };
    }

    // Execute Command
    const result = await this.processManager.executeCommand(body.command, body.cwd);
    return {
      success: result.success,
      requiresPermission: false,
      result
    };
  }

  @Get('processes')
  getProcesses() {
    return {
      processes: this.processManager.getActiveProcesses()
    };
  }

  @Post('kill/:pid')
  killProcess(@Param('pid') pid: string) {
    const pidNum = parseInt(pid, 10);
    const killed = this.processManager.killProcess(pidNum);
    return { success: killed, pid: pidNum };
  }
}
