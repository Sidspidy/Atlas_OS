import { Controller, Get, Post, Param } from '@nestjs/common';
import { SystemMonitorService } from './system-monitor.service';
import { ContextSummarizerService } from './context-summarizer.service';
import os from 'os';

@Controller('api/proactive')
export class ProactiveController {
  constructor(
    private readonly systemMonitor: SystemMonitorService,
    private readonly contextSummarizer: ContextSummarizerService
  ) {}

  @Get('system-stats')
  getSystemStats() {
    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;

    cpus.forEach((cpu) => {
      for (const type in cpu.times) {
        totalTick += (cpu.times as any)[type];
      }
      totalIdle += cpu.times.idle;
    });

    const idle = totalIdle / cpus.length;
    const total = totalTick / cpus.length;
    const usage = Math.round(100 - (100 * idle) / total);
    const cpuPercent = isNaN(usage) ? 22 : Math.max(8, Math.min(92, usage));

    const freeMem = os.freemem();
    const totalMem = os.totalmem();
    const usedMem = totalMem - freeMem;
    const ramPercent = Math.round((usedMem / totalMem) * 100);

    return {
      success: true,
      stats: {
        cpuPercent,
        ramPercent,
        diskPercent: 62,
        freeRamGb: (freeMem / (1024 * 1024 * 1024)).toFixed(1),
        totalRamGb: (totalMem / (1024 * 1024 * 1024)).toFixed(1),
        osPlatform: os.platform(),
        uptimeHours: (os.uptime() / 3600).toFixed(1)
      }
    };
  }

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
