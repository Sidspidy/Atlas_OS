import { Injectable } from '@nestjs/common';
import { TokenUsageMetric, LatencyMetric, ObservabilitySummary } from '@atlas-os/shared';

@Injectable()
export class TelemetryService {
  public getSummary(): ObservabilitySummary {
    const modelBreakdown: TokenUsageMetric[] = [
      {
        model: 'gpt-4o-mini',
        promptTokens: 14250,
        completionTokens: 3800,
        totalTokens: 18050,
        estimatedCostUsd: 0.0054
      },
      {
        model: 'gpt-4o (Vision / Code)',
        promptTokens: 8200,
        completionTokens: 2100,
        totalTokens: 10300,
        estimatedCostUsd: 0.0463
      },
      {
        model: 'text-embedding-3-small',
        promptTokens: 24500,
        completionTokens: 0,
        totalTokens: 24500,
        estimatedCostUsd: 0.0005
      }
    ];

    const latencyMetrics: LatencyMetric[] = [
      { endpoint: 'POST /api/ai/chat', p50Ms: 240, p95Ms: 580, p99Ms: 920, requestCount: 42 },
      { endpoint: 'POST /api/vision/analyze', p50Ms: 1100, p95Ms: 1850, p99Ms: 2400, requestCount: 14 },
      { endpoint: 'POST /api/agents/execute', p50Ms: 650, p95Ms: 1200, p99Ms: 1600, requestCount: 8 }
    ];

    const totalTokens = modelBreakdown.reduce((acc, m) => acc + m.totalTokens, 0);
    const totalCost = modelBreakdown.reduce((acc, m) => acc + m.estimatedCostUsd, 0);

    return {
      totalTokens,
      totalEstimatedCostUsd: parseFloat(totalCost.toFixed(4)),
      averageLatencyMs: 420,
      totalTraceCount: 64,
      modelBreakdown,
      latencyMetrics
    };
  }
}
