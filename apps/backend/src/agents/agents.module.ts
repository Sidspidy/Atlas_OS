import { Module } from '@nestjs/common';
import { PlannerAgentService } from './planner-agent.service';
import { SubagentsService } from './subagents.service';
import { AgentOrchestratorService } from './agent-orchestrator.service';
import { AgentsController } from './agents.controller';
import { FilesModule } from '../files/files.module';
import { MemoryModule } from '../memory/memory.module';

@Module({
  imports: [FilesModule, MemoryModule],
  providers: [PlannerAgentService, SubagentsService, AgentOrchestratorService],
  controllers: [AgentsController],
  exports: [PlannerAgentService, SubagentsService, AgentOrchestratorService]
})
export class AgentsModule {}
