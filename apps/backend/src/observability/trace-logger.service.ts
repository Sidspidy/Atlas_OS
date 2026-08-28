import { Injectable } from '@nestjs/common';
import { AgentTraceSpan } from '@atlas-os/shared';

@Injectable()
export class TraceLoggerService {
  private spans: AgentTraceSpan[] = [];

  constructor() {
    this.seedDefaultSpans();
  }

  public getTraces(): AgentTraceSpan[] {
    return this.spans;
  }

  private seedDefaultSpans() {
    const parentId = `span_root_01`;
    this.spans = [
      {
        id: parentId,
        agentRole: 'PLANNER',
        operationName: 'Goal Decomposition Pipeline',
        status: 'SUCCESS',
        durationMs: 310,
        startTime: new Date(Date.now() - 60000).toLocaleTimeString(),
        inputPayload: 'Goal: "Implement auth middleware for NestJS API"',
        outputPayload: 'Plan created with 4 step DAG'
      },
      {
        id: `span_child_1`,
        parentId,
        agentRole: 'RESEARCH',
        operationName: 'Workspace RAG Vector Context Fetch',
        status: 'SUCCESS',
        durationMs: 140,
        startTime: new Date(Date.now() - 55000).toLocaleTimeString(),
        inputPayload: 'Query: auth middleware NestJS',
        outputPayload: 'Found 48 indexed workspace files & 12 memory chunks'
      },
      {
        id: `span_child_2`,
        parentId,
        agentRole: 'CODE',
        operationName: 'Auth Middleware Synthesis',
        status: 'SUCCESS',
        durationMs: 480,
        startTime: new Date(Date.now() - 48000).toLocaleTimeString(),
        inputPayload: 'Target: auth.middleware.ts',
        outputPayload: 'Generated AuthGuard and JWT extraction logic'
      },
      {
        id: `span_child_3`,
        parentId,
        agentRole: 'REVIEW',
        operationName: 'Monorepo Build Audit',
        status: 'SUCCESS',
        durationMs: 620,
        startTime: new Date(Date.now() - 40000).toLocaleTimeString(),
        inputPayload: 'Audit target: @atlas-os/backend',
        outputPayload: '0 build compilation errors detected'
      },
      {
        id: `span_child_4`,
        parentId,
        agentRole: 'MEMORY',
        operationName: 'Vector Graph Persistence',
        status: 'SUCCESS',
        durationMs: 90,
        startTime: new Date(Date.now() - 30000).toLocaleTimeString(),
        inputPayload: 'Decision record: AuthGuard added',
        outputPayload: 'Persisted memory node ID mem_992'
      }
    ];
  }
}
