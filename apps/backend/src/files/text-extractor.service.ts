import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { FileContentExtract } from '@atlas-os/shared';

@Injectable()
export class TextExtractorService {
  private readonly supportedExtensions = new Set([
    '.txt', '.md', '.json', '.js', '.ts', '.tsx', '.jsx',
    '.py', '.java', '.cpp', '.c', '.html', '.css', '.sql',
    '.yaml', '.yml', '.csv', '.pdf', '.docx'
  ]);

  public isSupportedFile(filePath: string): boolean {
    const ext = path.extname(filePath).toLowerCase();
    return this.supportedExtensions.has(ext);
  }

  public extractText(filePath: string): FileContentExtract | null {
    try {
      if (!fs.existsSync(filePath)) return null;

      const stat = fs.statSync(filePath);
      // Skip files larger than 10MB
      if (stat.size > 10 * 1024 * 1024) return null;

      const ext = path.extname(filePath).toLowerCase();
      let rawText = '';

      if (ext === '.json') {
        const jsonContent = fs.readFileSync(filePath, 'utf-8');
        rawText = jsonContent;
      } else {
        // Read utf-8 text file
        rawText = fs.readFileSync(filePath, 'utf-8');
      }

      const lines = rawText.split('\n');
      const hash = crypto.createHash('sha256').update(rawText).digest('hex');

      return {
        filePath,
        content: rawText,
        lineCount: lines.length,
        hash,
        extension: ext
      };
    } catch (e) {
      console.warn(`[TextExtractor] Failed to extract ${filePath}:`, e);
      return null;
    }
  }
}
