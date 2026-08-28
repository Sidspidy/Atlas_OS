import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { ProjectMetadata, FrameworkType, PackageManagerType } from '@atlas-os/shared';

@Injectable()
export class ProjectDetectorService {
  public detectProject(targetPath: string): ProjectMetadata {
    const normPath = path.normalize(targetPath);
    const frameworks: FrameworkType[] = [];
    let packageManager: PackageManagerType = 'npm';
    let dependencies: Record<string, string> = {};
    let scripts: Record<string, string> = {};
    let hasDocker = false;

    if (!fs.existsSync(normPath)) {
      throw new Error(`Path ${normPath} does not exist`);
    }

    // Check Package Manager lockfiles
    if (fs.existsSync(path.join(normPath, 'pnpm-lock.yaml'))) {
      packageManager = 'pnpm';
    } else if (fs.existsSync(path.join(normPath, 'yarn.lock'))) {
      packageManager = 'yarn';
    } else if (fs.existsSync(path.join(normPath, 'bun.lockb'))) {
      packageManager = 'bun';
    }

    // Check Docker
    if (
      fs.existsSync(path.join(normPath, 'docker-compose.yml')) ||
      fs.existsSync(path.join(normPath, 'docker-compose.yaml')) ||
      fs.existsSync(path.join(normPath, 'Dockerfile'))
    ) {
      hasDocker = true;
      frameworks.push('Docker');
    }

    // Check package.json
    const pkgJsonPath = path.join(normPath, 'package.json');
    if (fs.existsSync(pkgJsonPath)) {
      try {
        const pkgData = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
        dependencies = { ...(pkgData.dependencies || {}), ...(pkgData.devDependencies || {}) };
        scripts = pkgData.scripts || {};

        if (dependencies['react']) frameworks.push('React');
        if (dependencies['next']) frameworks.push('Next.js');
        if (dependencies['@nestjs/core']) frameworks.push('NestJS');
        if (dependencies['express']) frameworks.push('Express');
        if (dependencies['electron']) frameworks.push('Node.js');
      } catch (e) {
        console.warn(`[ProjectDetector] Failed to parse package.json at ${pkgJsonPath}:`, e);
      }
    }

    // Check Python
    if (fs.existsSync(path.join(normPath, 'requirements.txt')) || fs.existsSync(path.join(normPath, 'pyproject.toml'))) {
      frameworks.push('Python');
      if (fs.existsSync(path.join(normPath, 'main.py'))) frameworks.push('FastAPI');
    }

    if (frameworks.length === 0) frameworks.push('Node.js');

    return {
      id: Buffer.from(normPath).toString('base64url'),
      name: path.basename(normPath) || 'Atlas Workspace',
      rootPath: normPath,
      frameworks,
      packageManager,
      dependencies,
      scripts,
      hasDocker,
      totalFiles: 48,
      detectedAt: new Date().toISOString()
    };
  }
}
