import { Controller, Get, Post, Param } from '@nestjs/common';
import { GitHubIntegrationService } from './github-integration.service';
import { DockerIntegrationService } from './docker-integration.service';
import { SlackIntegrationService } from './slack-integration.service';
import { LinearIntegrationService } from './linear-integration.service';
import { IntegrationStatus } from '@atlas-os/shared';

@Controller('api/integrations')
export class IntegrationsController {
  constructor(
    private readonly github: GitHubIntegrationService,
    private readonly docker: DockerIntegrationService,
    private readonly slack: SlackIntegrationService,
    private readonly linear: LinearIntegrationService
  ) {}

  @Get('status')
  getStatus() {
    const statuses: IntegrationStatus[] = [
      { provider: 'GITHUB', name: 'GitHub Workspace', connected: true, accountOrWorkspace: 'atlas-os/monorepo', lastSyncedAt: new Date().toISOString() },
      { provider: 'SLACK', name: 'Slack Notifications', connected: true, accountOrWorkspace: '#dev-alerts', lastSyncedAt: new Date().toISOString() },
      { provider: 'DOCKER', name: 'Docker Engine', connected: true, accountOrWorkspace: 'local-daemon', lastSyncedAt: new Date().toISOString() },
      { provider: 'LINEAR', name: 'Linear Workspace', connected: true, accountOrWorkspace: 'Atlas Team', lastSyncedAt: new Date().toISOString() }
    ];
    return { success: true, statuses };
  }

  @Get('github/prs')
  async getGitHubPRs() {
    const prs = await this.github.getPullRequests();
    return { success: true, prs };
  }

  @Get('docker/containers')
  getDockerContainers() {
    const containers = this.docker.getContainers();
    return { success: true, containers };
  }

  @Post('docker/toggle/:id')
  toggleDockerContainer(@Param('id') id: string) {
    const updated = this.docker.toggleContainer(id);
    return { success: !!updated, container: updated };
  }

  @Get('linear/issues')
  async getLinearIssues() {
    const issues = await this.linear.getIssues();
    return { success: true, issues };
  }
}
