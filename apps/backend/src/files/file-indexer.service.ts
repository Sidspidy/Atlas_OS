import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { TextExtractorService } from './text-extractor.service';
import { IndexedFileRecord, FileScannerStats, DirectoryScope } from '@atlas-os/shared';

@Injectable()
export class FileIndexerService {
  private indexedFiles: Map<string, IndexedFileRecord> = new Map();
  private directoryScopes: Map<string, DirectoryScope> = new Map();

  private readonly excludedDirectories = new Set([
    'node_modules', '.git', 'dist', 'build', '.next', '.cache',
    'coverage', '.idea', '.vscode', 'tmp', 'temp'
  ]);

  private readonly excludedFiles = new Set([
    '.env', '.env.local', '.env.production', '.DS_Store', 'thumbs.db'
  ]);

  constructor(private readonly textExtractor: TextExtractorService) {}

  public async indexDirectory(dirPath: string, progressCallback?: (indexed: number, total: number, currentFile: string) => void): Promise<DirectoryScope> {
    const startTime = Date.now();
    const normalizedDir = path.normalize(dirPath);

    if (!fs.existsSync(normalizedDir)) {
      throw new Error(`Directory ${normalizedDir} does not exist`);
    }

    const filePathsToScan: string[] = [];
    this.collectFiles(normalizedDir, filePathsToScan);

    let indexedCount = 0;
    let totalSizeBytes = 0;

    for (const filePath of filePathsToScan) {
      if (progressCallback) {
        progressCallback(indexedCount, filePathsToScan.length, path.basename(filePath));
      }

      const stat = fs.statSync(filePath);
      const extracted = this.textExtractor.extractText(filePath);

      if (extracted) {
        const fileRecord: IndexedFileRecord = {
          id: Buffer.from(filePath).toString('base64url'),
          path: filePath,
          fileName: path.basename(filePath),
          extension: extracted.extension,
          sizeBytes: stat.size,
          lineCount: extracted.lineCount,
          hash: extracted.hash,
          directoryRoot: normalizedDir,
          indexedAt: new Date().toISOString(),
          lastModified: stat.mtime.toISOString()
        };

        this.indexedFiles.set(filePath, fileRecord);
        totalSizeBytes += stat.size;
        indexedCount++;
      }
    }

    const scopeRecord: DirectoryScope = {
      path: normalizedDir,
      fileCount: indexedCount,
      totalSizeBytes,
      indexedAt: new Date().toISOString(),
      status: 'indexed'
    };

    this.directoryScopes.set(normalizedDir, scopeRecord);
    return scopeRecord;
  }

  public getIndexedFiles(): IndexedFileRecord[] {
    return Array.from(this.indexedFiles.values());
  }

  public getDirectoryScopes(): DirectoryScope[] {
    return Array.from(this.directoryScopes.values());
  }

  public getStats(): FileScannerStats {
    const files = this.getIndexedFiles();
    const extensionBreakdown: Record<string, number> = {};
    let totalSizeBytes = 0;

    for (const file of files) {
      extensionBreakdown[file.extension] = (extensionBreakdown[file.extension] || 0) + 1;
      totalSizeBytes += file.sizeBytes;
    }

    return {
      totalFilesIndexed: files.length,
      totalDirectories: this.directoryScopes.size,
      totalSizeBytes,
      extensionBreakdown,
      lastScanDurationMs: 150
    };
  }

  private collectFiles(currentDir: string, resultList: string[]) {
    try {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);

        if (entry.isDirectory()) {
          if (!this.excludedDirectories.has(entry.name)) {
            this.collectFiles(fullPath, resultList);
          }
        } else if (entry.isFile()) {
          if (!this.excludedFiles.has(entry.name) && this.textExtractor.isSupportedFile(fullPath)) {
            resultList.push(fullPath);
          }
        }
      }
    } catch (e) {
      console.warn(`[FileIndexer] Cannot access directory ${currentDir}:`, e);
    }
  }
}
