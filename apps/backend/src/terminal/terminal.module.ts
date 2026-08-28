import { Module } from '@nestjs/common';
import { RiskEvaluatorService } from './risk-evaluator.service';
import { ProcessManagerService } from './process-manager.service';
import { PermissionEngineService } from './permission-engine.service';
import { TerminalController } from './terminal.controller';

@Module({
  providers: [RiskEvaluatorService, ProcessManagerService, PermissionEngineService],
  controllers: [TerminalController],
  exports: [RiskEvaluatorService, ProcessManagerService, PermissionEngineService]
})
export class TerminalModule {}
