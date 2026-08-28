import { Injectable } from '@nestjs/common';
import { WorkflowDefinition, WorkflowExecutionLog } from '@atlas-os/shared';
import { WorkflowExecutorService } from './workflow-executor.service';

@Injectable()
export class WorkflowSchedulerService {
  private workflows: Map<string, WorkflowDefinition> = new Map();
  private logs: WorkflowExecutionLog[] = [];

  constructor(private readonly executor: WorkflowExecutorService) {
    this.seedDefaultWorkflows();
  }

  public getWorkflows(): WorkflowDefinition[] {
    return Array.from(this.workflows.values());
  }

  public getLogs(): WorkflowExecutionLog[] {
    return this.logs;
  }

  public async triggerWorkflow(id: string): Promise<WorkflowExecutionLog | null> {
    const wf = this.workflows.get(id);
    if (!wf) return null;

    const log = await this.executor.executeWorkflow(wf);
    this.logs.unshift(log);
    return log;
  }

  public toggleWorkflow(id: string): boolean {
    const wf = this.workflows.get(id);
    if (wf) {
      wf.active = !wf.active;
      return wf.active;
    }
    return false;
  }

  private seedDefaultWorkflows() {
    const defaults: WorkflowDefinition[] = [
      {
        id: 'wf_1',
        name: 'Daily Workspace Build & Health Check',
        description: 'Runs monorepo build, checks backend health, and logs diagnostic summary at 9 AM daily.',
        active: true,
        nodes: [
          { id: 'n_1', type: 'TRIGGER', label: 'Cron Schedule (Daily 9:00 AM)', nodeType: 'CRON', config: { cron: '0 9 * * *' } },
          { id: 'n_2', type: 'ACTION', label: 'Run Build Task', nodeType: 'TERMINAL_CMD', config: { command: 'pnpm --filter @atlas-os/shared build' } },
          { id: 'n_3', type: 'ACTION', label: 'AI Health Summary', nodeType: 'AI_PROMPT', config: { prompt: 'Summarize system diagnostic health' } }
        ]
      },
      {
        id: 'wf_2',
        name: 'Auto Test Runner on File Change',
        description: 'Monitors local workspace source code changes and runs unit tests automatically.',
        active: true,
        nodes: [
          { id: 'n_4', type: 'TRIGGER', label: 'File Change Watcher (*.ts, *.tsx)', nodeType: 'FILE_WATCH', config: { pattern: '**/*.ts' } },
          { id: 'n_5', type: 'ACTION', label: 'Execute Fast Test Suite', nodeType: 'TERMINAL_CMD', config: { command: 'pnpm test' } },
          { id: 'n_6', type: 'ACTION', label: 'Desktop Toast Alert', nodeType: 'NOTIFICATION', config: { title: 'Test Runner Alert' } }
        ]
      },
      {
        id: 'wf_3',
        name: 'Slack / Discord Webhook Integration',
        description: 'Sends automated workspace summary payload to configured HTTP Webhook endpoint.',
        active: false,
        nodes: [
          { id: 'n_7', type: 'TRIGGER', label: 'Incoming HTTP Webhook', nodeType: 'WEBHOOK', config: { endpoint: '/api/webhooks/atlas' } },
          { id: 'n_8', type: 'ACTION', label: 'Post Status Payload', nodeType: 'HTTP_REQUEST', config: { url: 'http://localhost:3001/health' } }
        ]
      }
    ];

    defaults.forEach((w) => this.workflows.set(w.id, w));
  }
}
