import { Injectable } from '@nestjs/common';
import { AgentExecutionPlan, AgentTaskStep } from '@atlas-os/shared';

@Injectable()
export class PlannerAgentService {
  public createPlan(goal: string): AgentExecutionPlan {
    const planId = `plan_${Date.now()}`;
    const steps: AgentTaskStep[] = [
      {
        id: `${planId}_step_1`,
        stepNumber: 1,
        assignedAgent: 'RESEARCH',
        description: `Gather workspace file context and memory facts for "${goal}"`,
        status: 'IDLE'
      },
      {
        id: `${planId}_step_2`,
        stepNumber: 2,
        assignedAgent: 'CODE',
        description: `Synthesize code modifications and implementation files for "${goal}"`,
        status: 'IDLE'
      },
      {
        id: `${planId}_step_3`,
        stepNumber: 3,
        assignedAgent: 'REVIEW',
        description: `Audit syntax correctness, TypeScript types, and permission rules`,
        status: 'IDLE'
      },
      {
        id: `${planId}_step_4`,
        stepNumber: 4,
        assignedAgent: 'MEMORY',
        description: `Persist decision logs and architecture changes into vector memory graph`,
        status: 'IDLE'
      }
    ];

    return {
      id: planId,
      goal,
      steps,
      status: 'PLANNING',
      createdAt: new Date().toISOString()
    };
  }
}
