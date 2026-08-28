import { Module } from '@nestjs/common';
import { WorkflowExecutorService } from './workflow-executor.service';
import { WorkflowSchedulerService } from './workflow-scheduler.service';
import { WorkflowsController } from './workflows.controller';
import { TerminalModule } from '../terminal/terminal.module';
import { AIModule } from '../ai/ai.module';

@Module({
  imports: [TerminalModule, AIModule],
  providers: [WorkflowExecutorService, WorkflowSchedulerService],
  controllers: [WorkflowsController],
  exports: [WorkflowExecutorService, WorkflowSchedulerService]
})
export class WorkflowsModule {}
