export interface TokenUsageMetric {
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
}

export interface LatencyMetric {
  endpoint: string;
  p50Ms: number;
  p95Ms: number;
  p99Ms: number;
  requestCount: number;
}

export interface AgentTraceSpan {
  id: string;
  parentId?: string;
  agentRole: string;
  operationName: string;
  status: 'SUCCESS' | 'FAILED';
  durationMs: number;
  startTime: string;
  inputPayload?: string;
  outputPayload?: string;
}

export interface ObservabilitySummary {
  totalTokens: number;
  totalEstimatedCostUsd: number;
  averageLatencyMs: number;
  totalTraceCount: number;
  modelBreakdown: TokenUsageMetric[];
  latencyMetrics: LatencyMetric[];
}
