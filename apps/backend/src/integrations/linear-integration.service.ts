import { Injectable } from '@nestjs/common';
import { LinearIssueRecord } from '@atlas-os/shared';

@Injectable()
export class LinearIntegrationService {
  public async getIssues(): Promise<LinearIssueRecord[]> {
    return [
      {
        id: 'lin_1',
        identifier: 'ATL-14',
        title: 'Integrations Engine: GitHub & Docker Connectors',
        priority: 'High',
        status: 'In Progress',
        assignee: 'Atlas AI'
      },
      {
        id: 'lin_2',
        identifier: 'ATL-15',
        title: 'Observability & Token Trace Viewer',
        priority: 'Medium',
        status: 'Todo',
        assignee: 'Unassigned'
      }
    ];
  }
}
