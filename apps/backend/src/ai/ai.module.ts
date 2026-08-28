import { Module } from '@nestjs/common';
import { ModelRouterService } from './model-router.service';
import { ToolRegistryService } from './tool-registry.service';
import { ChatService } from './chat.service';
import { AIController } from './ai.controller';
import { SettingsController } from './settings.controller';
import { FilesModule } from '../files/files.module';
import { MemoryModule } from '../memory/memory.module';

@Module({
  imports: [FilesModule, MemoryModule],
  providers: [ModelRouterService, ToolRegistryService, ChatService],
  controllers: [AIController, SettingsController],
  exports: [ModelRouterService, ToolRegistryService, ChatService]
})
export class AIModule {}
