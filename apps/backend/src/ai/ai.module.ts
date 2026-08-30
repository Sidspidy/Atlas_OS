import { Module } from '@nestjs/common';
import { ModelRouterService } from './model-router.service';
import { SystemToolsService } from './system-tools.service';
import { AtlasSystemControlService } from './atlas-system-control.service';
import { PdfService } from './pdf-service';
import { ImageGenService } from './image-gen.service';
import { ToolRegistryService } from './tool-registry.service';
import { ChatService } from './chat.service';
import { AIController } from './ai.controller';
import { SettingsController } from './settings.controller';
import { FilesModule } from '../files/files.module';
import { MemoryModule } from '../memory/memory.module';

@Module({
  imports: [FilesModule, MemoryModule],
  providers: [
    ModelRouterService,
    SystemToolsService,
    AtlasSystemControlService,
    PdfService,
    ImageGenService,
    ToolRegistryService,
    ChatService
  ],
  controllers: [AIController, SettingsController],
  exports: [
    ModelRouterService,
    SystemToolsService,
    AtlasSystemControlService,
    PdfService,
    ImageGenService,
    ToolRegistryService,
    ChatService
  ]
})
export class AIModule {}
