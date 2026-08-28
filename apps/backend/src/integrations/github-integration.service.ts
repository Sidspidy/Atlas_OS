import { Injectable } from '@nestjs/common';
import { GitHubPRRecord } from '@atlas-os/shared';

@Injectable()
export class GitHubIntegrationService {
  public async getPullRequests(): Promise<GitHubPRRecord[]> {
    return [
      {
        id: 101,
        title: 'feat(phase-14): Implement Integrations Engine suite',
        author: 'atlas-dev',
        branch: 'feature/phase-14-integrations',
        status: 'open',
        url: 'https://github.com/atlas-os/monorepo/pull/101'
      },
      {
        id: 100,
        title: 'fix(voice): Update TTS speech rate synthesis parameter',
        author: 'atlas-dev',
        branch: 'fix/voice-rate',
        status: 'merged',
        url: 'https://github.com/atlas-os/monorepo/pull/100'
      }
    ];
  }
}
