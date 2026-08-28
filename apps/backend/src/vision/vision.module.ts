import { Module } from '@nestjs/common';
import { VisionAnalyzerService } from './vision-analyzer.service';
import { ErrorDiagnosticsService } from './error-diagnostics.service';
import { VisionController } from './vision.controller';

@Module({
  providers: [VisionAnalyzerService, ErrorDiagnosticsService],
  controllers: [VisionController],
  exports: [VisionAnalyzerService, ErrorDiagnosticsService]
})
export class VisionModule {}
