import { Module } from '@nestjs/common';
import { TelemetryService } from './telemetry.service';
import { TraceLoggerService } from './trace-logger.service';
import { ObservabilityController } from './observability.controller';

@Module({
  providers: [TelemetryService, TraceLoggerService],
  controllers: [ObservabilityController],
  exports: [TelemetryService, TraceLoggerService]
})
export class ObservabilityModule {}
