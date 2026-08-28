import { Injectable } from '@nestjs/common';
import { ToolDefinition, ToolResult } from '@atlas-os/shared';
import { FileIndexerService } from '../files/file-indexer.service';
import { TextExtractorService } from '../files/text-extractor.service';
import { VectorSearchService } from '../memory/vector-search.service';

@Injectable()
export class ToolRegistryService {
  private readonly tools: Map<string, ToolDefinition> = new Map();

  constructor(
    private readonly fileIndexer: FileIndexerService,
    private readonly textExtractor: TextExtractorService,
    private readonly vectorSearch: VectorSearchService
  ) {
    this.registerDefaultTools();
  }

  public getTools(): ToolDefinition[] {
    return Array.from(this.tools.values());
  }

  public async executeTool(name: string, args: Record<string, any>): Promise<ToolResult> {
    const startTime = Date.now();
    const tool = this.tools.get(name);

    if (!tool) {
      return {
        toolName: name,
        success: false,
        result: null,
        error: `Tool '${name}' not found`,
        executionTimeMs: Date.now() - startTime
      };
    }

    try {
      let resultData: any = null;

      if (name === 'search_files') {
        const query = args.query || '';
        const allFiles = this.fileIndexer.getIndexedFiles();
        resultData = allFiles
          .filter(f => f.fileName.toLowerCase().includes(query.toLowerCase()) || f.path.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 10);
      } else if (name === 'read_file') {
        const filePath = args.filePath;
        resultData = this.textExtractor.extractText(filePath);
      } else if (name === 'search_memory') {
        const query = args.query || '';
        resultData = await this.vectorSearch.search(query, 5);
      } else if (name === 'get_system_status') {
        resultData = {
          totalFilesIndexed: this.fileIndexer.getIndexedFiles().length,
          indexedMemoryChunks: this.vectorSearch.getChunkCount(),
          status: 'operational'
        };
      }

      return {
        toolName: name,
        success: true,
        result: resultData,
        executionTimeMs: Date.now() - startTime
      };
    } catch (e: any) {
      return {
        toolName: name,
        success: false,
        result: null,
        error: e.message || 'Execution error',
        executionTimeMs: Date.now() - startTime
      };
    }
  }

  private registerDefaultTools() {
    this.tools.set('search_files', {
      name: 'search_files',
      description: 'Search indexed local workspace files by keyword or file path pattern',
      riskLevel: 'low',
      inputSchema: { query: 'string' }
    });

    this.tools.set('read_file', {
      name: 'read_file',
      description: 'Read content from a supported text/code file',
      riskLevel: 'low',
      inputSchema: { filePath: 'string' }
    });

    this.tools.set('search_memory', {
      name: 'search_memory',
      description: 'Query AI persistent vector memory graph and grounded citations',
      riskLevel: 'low',
      inputSchema: { query: 'string' }
    });

    this.tools.set('get_system_status', {
      name: 'get_system_status',
      description: 'Retrieve current Atlas OS system status and workspace indexing counts',
      riskLevel: 'low',
      inputSchema: {}
    });
  }
}
