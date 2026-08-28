import { Injectable } from '@nestjs/common';
import { FileIndexerService } from '../files/file-indexer.service';
import { TextExtractorService } from '../files/text-extractor.service';
import { CodeSymbolRecord, SymbolType } from '@atlas-os/shared';

@Injectable()
export class SymbolScannerService {
  constructor(
    private readonly fileIndexer: FileIndexerService,
    private readonly textExtractor: TextExtractorService
  ) {}

  public searchSymbols(query: string): CodeSymbolRecord[] {
    const indexedFiles = this.fileIndexer.getIndexedFiles();
    const symbols: CodeSymbolRecord[] = [];

    const lowerQuery = query.toLowerCase();

    for (const file of indexedFiles) {
      const extracted = this.textExtractor.extractText(file.path);
      if (!extracted) continue;

      const lines = extracted.content.split('\n');

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        let symbolType: SymbolType | null = null;
        let symbolName = '';

        if (trimmed.startsWith('export class ') || trimmed.startsWith('class ')) {
          symbolType = 'class';
          symbolName = trimmed.split(' ')[2]?.replace('{', '').trim() || '';
        } else if (trimmed.startsWith('export const ') || trimmed.startsWith('export function ') || trimmed.startsWith('function ')) {
          symbolType = 'function';
          const parts = trimmed.split(' ');
          symbolName = (parts[2] || parts[1])?.split('(')[0]?.replace(':', '').trim() || '';
        } else if (trimmed.startsWith('export interface ') || trimmed.startsWith('interface ')) {
          symbolType = 'interface';
          symbolName = trimmed.split(' ')[2]?.replace('{', '').trim() || '';
        } else if (trimmed.includes('@Get(') || trimmed.includes('@Post(') || trimmed.includes('@Delete(') || trimmed.includes('@Put(')) {
          symbolType = 'route';
          symbolName = trimmed;
        }

        if (symbolType && symbolName) {
          if (!query.trim() || symbolName.toLowerCase().includes(lowerQuery) || file.fileName.toLowerCase().includes(lowerQuery)) {
            symbols.push({
              id: `${file.id}_sym_${i}`,
              name: symbolName,
              symbolType,
              filePath: file.path,
              line: i + 1,
              snippet: trimmed
            });
          }
        }
      }
    }

    return symbols.slice(0, 30);
  }
}
