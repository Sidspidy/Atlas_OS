export type ProactiveRuleCategory = 'GIT_STATUS' | 'BUILD_HEALTH' | 'MEMORY_REMINDER' | 'ENV_CONFIG';

export type ProactivePriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface ProactiveSuggestion {
  id: string;
  category: ProactiveRuleCategory;
  priority: ProactivePriority;
  title: string;
  message: string;
  actionLabel?: string;
  actionId?: string;
  createdAt: string;
}

export interface WorkspaceContextSummary {
  activeProjectName: string;
  projectRoot: string;
  totalIndexedFiles: number;
  totalMemoryNodes: number;
  uncommittedGitFiles: number;
  backendHealth: 'ok' | 'degraded' | 'down';
  lastUpdated: string;
}

export interface ProactiveConfig {
  sensitivity: 'LOW' | 'NORMAL' | 'HIGH';
  categories: Record<ProactiveRuleCategory, boolean>;
}
