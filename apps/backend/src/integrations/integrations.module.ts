import { Module } from '@nestjs/common';
import { GitHubIntegrationService } from './github-integration.service';
import { DockerIntegrationService } from './docker-integration.service';
import { SlackIntegrationService } from './slack-integration.service';
import { LinearIntegrationService } from './linear-integration.service';
import { IntegrationsController } from './integrations.controller';

@Module({
  providers: [GitHubIntegrationService, DockerIntegrationService, SlackIntegrationService, LinearIntegrationService],
  controllers: [IntegrationsController],
  exports: [GitHubIntegrationService, DockerIntegrationService, SlackIntegrationService, LinearIntegrationService]
})
export class IntegrationsModule {}
