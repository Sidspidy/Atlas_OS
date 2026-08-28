import { Injectable } from '@nestjs/common';

@Injectable()
export class EmbeddingService {
  public async generateEmbedding(text: string): Promise<number[]> {
    // 1. Google Gemini Pro Embeddings Priority
    if (process.env.GEMINI_API_KEY) {
      try {
        const geminiKey = process.env.GEMINI_API_KEY;
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'models/gemini-embedding-001',
            content: {
              parts: [{ text }]
            }
          })
        });

        const data = await response.json();
        if (data.embedding && data.embedding.values) {
          return data.embedding.values;
        }
      } catch (e) {
        console.warn('[EmbeddingService] Gemini gemini-embedding-001 failed, trying OpenAI or local fallback:', e);
      }
    }

    // 2. OpenAI Embedding Priority
    if (process.env.OPENAI_API_KEY) {
      try {
        const response = await fetch('https://api.openai.com/v1/embeddings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: 'text-embedding-3-small',
            input: text
          })
        });

        const data = await response.json();
        if (data.data && data.data[0]?.embedding) {
          return data.data[0].embedding;
        }
      } catch (e) {
        console.warn('[EmbeddingService] OpenAI embedding failed, using local vector fallback:', e);
      }
    }

    // 3. Local deterministic pseudo-embedding fallback (32-dim normalized vector)
    return this.generateLocalVector(text, 32);
  }

  public cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    const len = Math.min(vecA.length, vecB.length);
    for (let i = 0; i < len; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  private generateLocalVector(text: string, dimensions = 32): number[] {
    const vector = new Array(dimensions).fill(0);
    const words = text.toLowerCase().split(/\W+/);

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (!word) continue;
      for (let c = 0; c < word.length; c++) {
        const charCode = word.charCodeAt(c);
        const dimIdx = (charCode + i) % dimensions;
        vector[dimIdx] += 1;
      }
    }

    const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0)) || 1;
    return vector.map((val) => val / norm);
  }
}
