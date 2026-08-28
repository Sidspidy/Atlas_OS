export type IntegrationProvider = 'GITHUB' | 'SLACK' | 'DOCKER' | 'LINEAR';

export interface IntegrationStatus {
  provider: IntegrationProvider;
  name: string;
  connected: boolean;
  accountOrWorkspace?: string;
  lastSyncedAt?: string;
}

export interface GitHubPRRecord {
  id: number;
  title: string;
  author: string;
  branch: string;
  status: 'open' | 'merged' | 'closed';
  url: string;
}

export interface DockerContainerRecord {
  id: string;
  name: string;
  image: string;
  status: 'running' | 'stopped' | 'paused';
  ports: string;
  created: string;
}

export interface LinearIssueRecord {
  id: string;
  identifier: string;
  title: string;
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  status: 'In Progress' | 'Todo' | 'Done';
  assignee: string;
}
