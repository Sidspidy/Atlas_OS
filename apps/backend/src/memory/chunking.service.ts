import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { TextChunk } from '@atlas-os/shared';

@Injectable()
export class ChunkingService {
  public chunkText(filePath: string, fileId: string, fullContent: string, chunkSize = 500, overlap = 100): TextChunk[] {
    const chunks: TextChunk[] = [];
    const lines = fullContent.split('\n');

    let currentChunkText = '';
    let startLine = 1;
    let currentLine = 1;
    let chunkIdx = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      currentChunkText += line + '\n';
      currentLine = i + 1;

      if (currentChunkText.length >= chunkSize || i === lines.length - 1) {
        const hash = crypto.createHash('md5').update(currentChunkText).digest('hex');
        chunks.push({
          id: `${fileId}_chunk_${chunkIdx}`,
          fileId,
          filePath,
          content: currentChunkText.trim(),
          startLine,
          endLine: currentLine,
          chunkIdx,
          hash
        });

        chunkIdx++;
        // Maintain overlap
        const overlapLines = Math.min(3, lines.length - 1);
        startLine = Math.max(1, currentLine - overlapLines);
        currentChunkText = lines.slice(startLine - 1, currentLine).join('\n') + '\n';
      }
    }

    return chunks;
  }
}
