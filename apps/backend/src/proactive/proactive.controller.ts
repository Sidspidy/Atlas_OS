import { Controller, Get, Post, Param } from '@nestjs/common';
import { SystemMonitorService } from './system-monitor.service';
import { ContextSummarizerService } from './context-summarizer.service';

@Controller('api/proactive')
export class ProactiveController {
  constructor(
    private readonly systemMonitor: SystemMonitorService,
    private readonly contextSummarizer: ContextSummarizerService
  ) {}

  @Get('suggestions')
  getSuggestions() {
    return {
      success: true,
      suggestions: this.systemMonitor.getSuggestions()
    };
  }

  @Get('summary')
  getSummary() {
    return {
      success: true,
      summary: this.contextSummarizer.getWorkspaceSummary()
    };
  }

  @Post('dismiss/:id')
  dismissSuggestion(@Param('id') id: string) {
    const dismissed = this.systemMonitor.dismissSuggestion(id);
    return { success: dismissed, id };
  }
}
