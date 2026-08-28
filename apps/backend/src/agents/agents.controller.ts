import { Controller, Post, Get, Body } from '@nestjs/common';
import { AgentOrchestratorService } from './agent-orchestrator.service';
import { PlannerAgentService } from './planner-agent.service';

@Controller('api/agents')
export class AgentsController {
  constructor(
    private readonly orchestrator: AgentOrchestratorService,
    private readonly planner: PlannerAgentService
  ) {}

  @Post('plan')
  createPlan(@Body() body: { goal: string }) {
    if (!body.goal) {
      return { success: false, error: 'Goal is required' };
    }
    const plan = this.planner.createPlan(body.goal);
    return { success: true, plan };
  }

  @Post('execute')
  async executePlan(@Body() body: { goal: string }) {
    if (!body.goal) {
      return { success: false, error: 'Goal is required' };
    }
    const plan = await this.orchestrator.createAndExecutePlan(body.goal);
    return {
      success: true,
      plan,
      messages: this.orchestrator.getMessages()
    };
  }

  @Get('status')
  getStatus() {
    return {
      success: true,
      currentPlan: this.orchestrator.getCurrentPlan(),
      messages: this.orchestrator.getMessages()
    };
  }
}
