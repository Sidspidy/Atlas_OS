export type FrameworkType =
  | 'React'
  | 'Next.js'
  | 'NestJS'
  | 'Express'
  | 'FastAPI'
  | 'Python'
  | 'Node.js'
  | 'Docker';

export type PackageManagerType = 'pnpm' | 'npm' | 'yarn' | 'bun';

export type SymbolType = 'function' | 'class' | 'interface' | 'route' | 'export';

export interface CodeSymbolRecord {
  id: string;
  name: string;
  symbolType: SymbolType;
  filePath: string;
  line: number;
  snippet: string;
}

export interface ProjectMetadata {
  id: string;
  name: string;
  rootPath: string;
  frameworks: FrameworkType[];
  packageManager: PackageManagerType;
  dependencies: Record<string, string>;
  scripts: Record<string, string>;
  hasDocker: boolean;
  totalFiles: number;
  detectedAt: string;
}

export interface VSCodeOpenPayload {
  filePath?: string;
  line?: number;
  projectRoot?: string;
}
