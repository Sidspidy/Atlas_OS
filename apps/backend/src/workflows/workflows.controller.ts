import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { WorkflowSchedulerService } from './workflow-scheduler.service';

@Controller('api/workflows')
export class WorkflowsController {
  constructor(private readonly scheduler: WorkflowSchedulerService) {}

  @Get('list')
  getWorkflows() {
    return {
      success: true,
      workflows: this.scheduler.getWorkflows(),
      logs: this.scheduler.getLogs()
    };
  }

  @Post('trigger/:id')
  async triggerWorkflow(@Param('id') id: string) {
    const log = await this.scheduler.triggerWorkflow(id);
    return {
      success: !!log,
      log
    };
  }

  @Post('toggle/:id')
  toggleWorkflow(@Param('id') id: string) {
    const active = this.scheduler.toggleWorkflow(id);
    return { success: true, active };
  }
}
