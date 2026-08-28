import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { RAGRetrieverService } from './rag-retriever.service';
import { VectorSearchService } from './vector-search.service';
import { MemoryNode, MemoryCategory } from '@atlas-os/shared';

@Controller('api/memory')
export class MemoryController {
  private memoryNodes: Map<string, MemoryNode> = new Map();

  constructor(
    private readonly ragRetriever: RAGRetrieverService,
    private readonly vectorSearch: VectorSearchService
  ) {
    // Seed initial system memories
    this.seedDefaultMemories();
  }

  @Post('search')
  async searchMemory(@Body() body: { query: string }) {
    if (!body.query) {
      return { success: false, error: 'Query is required' };
    }

    const ragResult = await this.ragRetriever.retrieveGroundedContext(body.query);
    return {
      success: true,
      result: ragResult,
      indexedChunksCount: this.vectorSearch.getChunkCount()
    };
  }

  @Get('nodes')
  getMemoryNodes() {
    return {
      nodes: Array.from(this.memoryNodes.values()),
      total: this.memoryNodes.size
    };
  }

  @Post('create')
  createMemoryNode(@Body() body: { category: MemoryCategory; key: string; value: string; source?: string }) {
    const id = `mem_${Date.now()}`;
    const node: MemoryNode = {
      id,
      category: body.category || 'PREFERENCE',
      key: body.key,
      value: body.value,
      source: body.source || 'User Entry',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.memoryNodes.set(id, node);
    return { success: true, node };
  }

  @Delete(':id')
  deleteMemoryNode(@Param('id') id: string) {
    const deleted = this.memoryNodes.delete(id);
    return { success: deleted, id };
  }

  private seedDefaultMemories() {
    const defaults: MemoryNode[] = [
      {
        id: 'mem_1',
        category: 'PROJECT',
        key: 'Active Project',
        value: 'Atlas OS Monorepo (Electron + React + NestJS)',
        source: 'Auto-Detected',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'mem_2',
        category: 'PREFERENCE',
        key: 'Preferred Package Manager',
        value: 'pnpm',
        source: 'User Settings',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'mem_3',
        category: 'CODE',
        key: 'Primary Language',
        value: 'TypeScript 5.4',
        source: 'Workspace Scanner',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    defaults.forEach((n) => this.memoryNodes.set(n.id, n));
  }
}
