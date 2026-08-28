export type MemoryCategory =
  | 'PROJECT'
  | 'FILE'
  | 'CODE'
  | 'DOCUMENT'
  | 'CONVERSATION'
  | 'TASK'
  | 'PERSON'
  | 'PREFERENCE'
  | 'EVENT'
  | 'DECISION';

export interface TextChunk {
  id: string;
  fileId: string;
  filePath: string;
  content: string;
  startLine: number;
  endLine: number;
  chunkIdx: number;
  hash: string;
}

export interface MemoryNode {
  id: string;
  category: MemoryCategory;
  key: string;
  value: string;
  source?: string;
  createdAt: string;
  updatedAt: string;
  relevanceScore?: number;
}

export interface CitationSource {
  filePath: string;
  startLine?: number;
  endLine?: number;
  snippet: string;
  score: number;
}

export interface RAGContextResult {
  query: string;
  groundedContext: string;
  chunks: TextChunk[];
  citations: CitationSource[];
  retrievalLatencyMs: number;
}
