import { Injectable } from '@nestjs/common';
import { ProactiveSuggestion } from '@atlas-os/shared';

@Injectable()
export class SystemMonitorService {
  private suggestions: Map<string, ProactiveSuggestion> = new Map();

  constructor() {
    this.seedDefaultSuggestions();
  }

  public getSuggestions(): ProactiveSuggestion[] {
    return Array.from(this.suggestions.values());
  }

  public dismissSuggestion(id: string): boolean {
    return this.suggestions.delete(id);
  }

  private seedDefaultSuggestions() {
    const defaults: ProactiveSuggestion[] = [
      {
        id: 'sugg_1',
        category: 'GIT_STATUS',
        priority: 'MEDIUM',
        title: 'Uncommitted Workspace Changes',
        message: 'You have modified files in your active workspace branch. Consider creating a commit or branch backup.',
        actionLabel: 'Git Status Check',
        actionId: 'check_git',
        createdAt: new Date().toISOString()
      },
      {
        id: 'sugg_2',
        category: 'BUILD_HEALTH',
        priority: 'LOW',
        title: 'Monorepo Build Verification Passed',
        message: 'All 6 packages and applications compiled cleanly with zero build errors.',
        actionLabel: 'View Build Logs',
        actionId: 'view_build',
        createdAt: new Date().toISOString()
      },
      {
        id: 'sugg_3',
        category: 'ENV_CONFIG',
        priority: 'HIGH',
        title: 'OpenAI API Key Unconfigured',
        message: 'Running with local fallback embedding & LLM model generators. Add OPENAI_API_KEY to enable cloud models.',
        actionLabel: 'Configure Key',
        actionId: 'config_key',
        createdAt: new Date().toISOString()
      }
    ];

    defaults.forEach((s) => this.suggestions.set(s.id, s));
  }
}
