import { Injectable } from '@nestjs/common';
import { EmbeddingService } from './embedding.service';
import { TextChunk, CitationSource } from '@atlas-os/shared';

export interface VectorIndexEntry {
  chunk: TextChunk;
  embedding: number[];
}

@Injectable()
export class VectorSearchService {
  private indexEntries: VectorIndexEntry[] = [];

  constructor(private readonly embeddingService: EmbeddingService) {}

  public async addChunks(chunks: TextChunk[]): Promise<void> {
    for (const chunk of chunks) {
      const embedding = await this.embeddingService.generateEmbedding(chunk.content);
      this.indexEntries.push({ chunk, embedding });
    }
  }

  public async search(query: string, topK = 5): Promise<CitationSource[]> {
    if (this.indexEntries.length === 0) return [];

    const queryVec = await this.embeddingService.generateEmbedding(query);
    const scored = this.indexEntries.map((entry) => {
      const similarity = this.embeddingService.cosineSimilarity(queryVec, entry.embedding);
      // Keyword boost
      const keywordMatch = query.toLowerCase().split(/\s+/).some(kw => kw.length > 3 && entry.chunk.content.toLowerCase().includes(kw));
      const finalScore = similarity + (keywordMatch ? 0.2 : 0);

      return {
        filePath: entry.chunk.filePath,
        startLine: entry.chunk.startLine,
        endLine: entry.chunk.endLine,
        snippet: entry.chunk.content.slice(0, 300),
        score: Math.min(1.0, finalScore)
      };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK);
  }

  public getChunkCount(): number {
    return this.indexEntries.length;
  }
}
