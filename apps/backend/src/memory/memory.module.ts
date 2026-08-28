import { Module } from '@nestjs/common';
import { ChunkingService } from './chunking.service';
import { EmbeddingService } from './embedding.service';
import { VectorSearchService } from './vector-search.service';
import { RAGRetrieverService } from './rag-retriever.service';
import { MemoryController } from './memory.controller';

@Module({
  providers: [ChunkingService, EmbeddingService, VectorSearchService, RAGRetrieverService],
  controllers: [MemoryController],
  exports: [ChunkingService, EmbeddingService, VectorSearchService, RAGRetrieverService]
})
export class MemoryModule {}
