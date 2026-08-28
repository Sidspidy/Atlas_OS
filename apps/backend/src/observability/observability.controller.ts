import { Controller, Get } from '@nestjs/common';
import { TelemetryService } from './telemetry.service';
import { TraceLoggerService } from './trace-logger.service';

@Controller('api/observability')
export class ObservabilityController {
  constructor(
    private readonly telemetry: TelemetryService,
    private readonly traceLogger: TraceLoggerService
  ) {}

  @Get('summary')
  getSummary() {
    return {
      success: true,
      summary: this.telemetry.getSummary()
    };
  }

  @Get('traces')
  getTraces() {
    return {
      success: true,
      traces: this.traceLogger.getTraces()
    };
  }
}
