import { Injectable } from '@nestjs/common';
import { VectorSearchService } from './vector-search.service';
import { RAGContextResult } from '@atlas-os/shared';

@Injectable()
export class RAGRetrieverService {
  constructor(private readonly vectorSearch: VectorSearchService) {}

  public async retrieveGroundedContext(query: string): Promise<RAGContextResult> {
    const startTime = Date.now();
    const citations = await this.vectorSearch.search(query, 5);

    let groundedContext = '';
    if (citations.length > 0) {
      groundedContext = citations
        .map((c, i) => `[Source ${i + 1}]: ${c.filePath} (Lines ${c.startLine}-${c.endLine})\n"${c.snippet}"`)
        .join('\n\n');
    } else {
      groundedContext = 'No relevant local workspace context found.';
    }

    const duration = Date.now() - startTime;

    return {
      query,
      groundedContext,
      chunks: [],
      citations,
      retrievalLatencyMs: duration
    };
  }
}
