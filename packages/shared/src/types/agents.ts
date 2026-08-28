export type AgentRole = 'PLANNER' | 'RESEARCH' | 'CODE' | 'REVIEW' | 'MEMORY';

export type SubagentStatus = 'IDLE' | 'RUNNING' | 'DONE' | 'FAILED';

export interface AgentTaskStep {
  id: string;
  stepNumber: number;
  assignedAgent: AgentRole;
  description: string;
  status: SubagentStatus;
  resultSummary?: string;
  executionTimeMs?: number;
}

export interface AgentMessage {
  id: string;
  fromAgent: AgentRole;
  toAgent: AgentRole | 'ALL';
  message: string;
  timestamp: string;
}

export interface AgentExecutionPlan {
  id: string;
  goal: string;
  steps: AgentTaskStep[];
  status: 'PLANNING' | 'EXECUTING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  completedAt?: string;
}
