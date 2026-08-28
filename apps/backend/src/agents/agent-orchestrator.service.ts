import { Injectable } from '@nestjs/common';
import { PlannerAgentService } from './planner-agent.service';
import { SubagentsService } from './subagents.service';
import { AgentExecutionPlan, AgentMessage } from '@atlas-os/shared';

@Injectable()
export class AgentOrchestratorService {
  private currentPlan: AgentExecutionPlan | null = null;
  private messages: AgentMessage[] = [];

  constructor(
    private readonly plannerAgent: PlannerAgentService,
    private readonly subagents: SubagentsService
  ) {}

  public async createAndExecutePlan(goal: string): Promise<AgentExecutionPlan> {
    const plan = this.plannerAgent.createPlan(goal);
    this.currentPlan = plan;
    this.messages = [];

    this.addMessage('PLANNER', 'ALL', `Decomposed goal "${goal}" into 4 execution steps.`);

    // Execute steps sequentially
    plan.status = 'EXECUTING';

    for (const step of plan.steps) {
      step.status = 'RUNNING';
      this.addMessage(step.assignedAgent, 'ALL', `Executing step ${step.stepNumber}: ${step.description}`);

      const execResult = await this.subagents.executeStep(step, goal);

      step.status = execResult.success ? 'DONE' : 'FAILED';
      step.resultSummary = execResult.resultSummary;
      step.executionTimeMs = execResult.executionTimeMs;

      this.addMessage(step.assignedAgent, 'ALL', execResult.resultSummary);
    }

    plan.status = 'COMPLETED';
    plan.completedAt = new Date().toISOString();
    return plan;
  }

  public getCurrentPlan(): AgentExecutionPlan | null {
    return this.currentPlan;
  }

  public getMessages(): AgentMessage[] {
    return this.messages;
  }

  private addMessage(fromAgent: any, toAgent: any, message: string) {
    this.messages.push({
      id: `msg_${Date.now()}_${Math.random()}`,
      fromAgent,
      toAgent,
      message,
      timestamp: new Date().toLocaleTimeString()
    });
  }
}
