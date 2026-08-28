export interface IndexedFileRecord {
  id: string;
  path: string;
  fileName: string;
  extension: string;
  sizeBytes: number;
  lineCount: number;
  hash: string;
  directoryRoot: string;
  indexedAt: string;
  lastModified: string;
}

export interface DirectoryScope {
  path: string;
  fileCount: number;
  totalSizeBytes: number;
  indexedAt: string;
  status: 'indexed' | 'indexing' | 'error';
}

export interface FileScannerStats {
  totalFilesIndexed: number;
  totalDirectories: number;
  totalSizeBytes: number;
  extensionBreakdown: Record<string, number>;
  lastScanDurationMs: number;
}

export interface FileContentExtract {
  filePath: string;
  content: string;
  lineCount: number;
  hash: string;
  extension: string;
}
