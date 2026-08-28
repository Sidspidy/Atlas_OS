import { Controller, Post, Get, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ToolRegistryService } from './tool-registry.service';

@Controller('api/ai')
export class AIController {
  constructor(
    private readonly chatService: ChatService,
    private readonly toolRegistry: ToolRegistryService
  ) {}

  @Post('chat')
  async chat(@Body() body: { query: string }) {
    if (!body.query) {
      return { success: false, error: 'Query is required' };
    }
    const message = await this.chatService.processQuery(body.query);
    return { success: true, message };
  }

  @Get('tools')
  getTools() {
    return {
      tools: this.toolRegistry.getTools()
    };
  }
}
