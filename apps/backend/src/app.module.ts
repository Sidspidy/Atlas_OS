import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { HealthModule } from './health/health.module';
import { FilesModule } from './files/files.module';
import { MemoryModule } from './memory/memory.module';
import { AIModule } from './ai/ai.module';
import { CodeModule } from './code/code.module';
import { TerminalModule } from './terminal/terminal.module';
import { VoiceModule } from './voice/voice.module';
import { VisionModule } from './vision/vision.module';
import { AgentsModule } from './agents/agents.module';
import { WorkflowsModule } from './workflows/workflows.module';
import { ProactiveModule } from './proactive/proactive.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { ObservabilityModule } from './observability/observability.module';
import { SecurityModule } from './security/security.module';
import { StateGateway } from './gateway/state.gateway';

@Module({
  imports: [DatabaseModule, RedisModule, HealthModule, FilesModule, MemoryModule, AIModule, CodeModule, TerminalModule, VoiceModule, VisionModule, AgentsModule, WorkflowsModule, ProactiveModule, IntegrationsModule, ObservabilityModule, SecurityModule],
  providers: [StateGateway]
})
export class AppModule {}
