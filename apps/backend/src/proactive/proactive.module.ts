import { Module } from '@nestjs/common';
import { SystemMonitorService } from './system-monitor.service';
import { ContextSummarizerService } from './context-summarizer.service';
import { ProactiveController } from './proactive.controller';
import { FilesModule } from '../files/files.module';
import { MemoryModule } from '../memory/memory.module';

@Module({
  imports: [FilesModule, MemoryModule],
  providers: [SystemMonitorService, ContextSummarizerService],
  controllers: [ProactiveController],
  exports: [SystemMonitorService, ContextSummarizerService]
})
export class ProactiveModule {}
