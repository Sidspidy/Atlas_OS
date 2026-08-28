export type WorkflowTriggerType = 'CRON' | 'FILE_WATCH' | 'WEBHOOK' | 'MANUAL';

export type WorkflowActionType = 'TERMINAL_CMD' | 'AI_PROMPT' | 'NOTIFICATION' | 'HTTP_REQUEST';

export interface WorkflowNode {
  id: string;
  type: 'TRIGGER' | 'ACTION';
  label: string;
  nodeType: WorkflowTriggerType | WorkflowActionType;
  config: Record<string, any>;
}

export interface WorkflowExecutionLog {
  id: string;
  workflowId: string;
  status: 'SUCCESS' | 'FAILED';
  executedAt: string;
  durationMs: number;
  outputSummary: string;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  active: boolean;
  nodes: WorkflowNode[];
  lastExecutedAt?: string;
}
