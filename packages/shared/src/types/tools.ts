export type ToolRiskLevel = 'low' | 'medium' | 'high';

export interface ToolDefinition {
  name: string;
  description: string;
  riskLevel: ToolRiskLevel;
  requiredPermission?: string;
  inputSchema: Record<string, any>;
}

export interface ToolResult {
  toolName: string;
  success: boolean;
  result: any;
  error?: string;
  executionTimeMs: number;
}

export interface ContextualAction {
  label: string;
  actionId: string;
  payload?: any;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'atlas' | 'system';
  text: string;
  timestamp: string;
  toolCalls?: ToolResult[];
  actions?: ContextualAction[];
  sources?: string[];
}
