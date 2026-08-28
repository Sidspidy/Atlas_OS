import { Injectable } from '@nestjs/common';
import { ModelRouterService } from './model-router.service';
import { ToolRegistryService } from './tool-registry.service';
import { RAGRetrieverService } from '../memory/rag-retriever.service';
import { AIChatMessage, ToolResult, ContextualAction } from '@atlas-os/shared';

@Injectable()
export class ChatService {
  constructor(
    private readonly modelRouter: ModelRouterService,
    private readonly toolRegistry: ToolRegistryService,
    private readonly ragRetriever: RAGRetrieverService
  ) {}

  public async processQuery(userQuery: string): Promise<AIChatMessage> {
    const executedTools: ToolResult[] = [];
    const actions: ContextualAction[] = [];
    const sources: string[] = [];

    // 1. Determine tool invocation needs
    const lower = userQuery.toLowerCase();
    if (lower.includes('file') || lower.includes('find') || lower.includes('search')) {
      const searchRes = await this.toolRegistry.executeTool('search_files', { query: userQuery });
      executedTools.push(searchRes);
      actions.push({ label: 'Open File', actionId: 'open_file', payload: { query: userQuery } });
    }

    if (lower.includes('memory') || lower.includes('preference')) {
      const memRes = await this.toolRegistry.executeTool('search_memory', { query: userQuery });
      executedTools.push(memRes);
    }

    // 2. Retrieve grounded RAG context
    const ragResult = await this.ragRetriever.retrieveGroundedContext(userQuery);
    if (ragResult.citations.length > 0) {
      ragResult.citations.forEach((c) => {
        sources.push(`${c.filePath} (L${c.startLine}-${c.endLine})`);
      });
      actions.push({ label: 'Explain Source Code', actionId: 'explain_source' });
    }

    // 3. Generate completion via Model Router
    const completionText = await this.modelRouter.generateCompletion(userQuery, ragResult.groundedContext);

    // Default action fallback
    if (actions.length === 0) {
      actions.push({ label: 'Run Health Check', actionId: 'run_health' });
      actions.push({ label: 'Explain Solution', actionId: 'explain' });
    }

    return {
      id: `msg_${Date.now()}`,
      sender: 'atlas',
      text: completionText,
      timestamp: new Date().toLocaleTimeString(),
      toolCalls: executedTools,
      actions,
      sources
    };
  }
}
