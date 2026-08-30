import { Injectable } from '@nestjs/common';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class SystemToolsService {
  public getUserDownloadsPath(): string {
    const userHome = os.homedir();
    return path.join(userHome, 'Downloads');
  }

  public listFolderContents(targetPath?: string): { name: string; isDirectory: boolean; sizeMb: string; modified: string }[] {
    const dirToRead = targetPath || this.getUserDownloadsPath();
    if (!fs.existsSync(dirToRead)) {
      return [];
    }

    try {
      const items = fs.readdirSync(dirToRead, { withFileTypes: true });
      return items.slice(0, 30).map((item) => {
        const fullPath = path.join(dirToRead, item.name);
        let sizeMb = '0';
        let modified = new Date().toISOString();
        try {
          const stats = fs.statSync(fullPath);
          sizeMb = (stats.size / (1024 * 1024)).toFixed(2);
          modified = stats.mtime.toLocaleDateString() + ' ' + stats.mtime.toLocaleTimeString();
        } catch (e) {
          // ignore permission errors for locked system files
        }
        return {
          name: item.name,
          isDirectory: item.isDirectory(),
          sizeMb: item.isDirectory() ? 'DIR' : `${sizeMb} MB`,
          modified
        };
      });
    } catch (e) {
      return [];
    }
  }

  public async getRealSystemStats(): Promise<{ cpuPercent: number; ramFreeGb: string; ramTotalGb: string; ramPercent: number; osName: string; platform: string; arch: string; uptimeHours: string }> {
    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;

    cpus.forEach((cpu) => {
      for (const type in cpu.times) {
        totalTick += (cpu.times as any)[type];
      }
      totalIdle += cpu.times.idle;
    });

    const idle = totalIdle / cpus.length;
    const total = totalTick / cpus.length;
    const usage = Math.round(100 - (100 * idle) / total);
    const cpuPercent = isNaN(usage) ? 18 : Math.max(5, Math.min(95, usage));

    const freeMem = os.freemem();
    const totalMem = os.totalmem();
    const usedMem = totalMem - freeMem;
    const ramPercent = Math.round((usedMem / totalMem) * 100);

    return {
      cpuPercent,
      ramFreeGb: (freeMem / (1024 * 1024 * 1024)).toFixed(1),
      ramTotalGb: (totalMem / (1024 * 1024 * 1024)).toFixed(1),
      ramPercent,
      osName: os.type() + ' ' + os.release(),
      platform: os.platform(),
      arch: os.arch(),
      uptimeHours: (os.uptime() / 3600).toFixed(1)
    };
  }

  public async openInEditor(editor: 'antigravity' | 'vscode', targetPath: string = 'e:/my_projects'): Promise<{ success: boolean; editor: string; message: string }> {
    const absPath = path.resolve(targetPath);
    try {
      if (editor === 'antigravity') {
        // Try antigravity or agy CLI command
        try {
          await execAsync(`antigravity "${absPath}"`);
          return { success: true, editor: 'Antigravity IDE', message: `Opened ${absPath} in Antigravity IDE` };
        } catch (e) {
          try {
            await execAsync(`agy "${absPath}"`);
            return { success: true, editor: 'Antigravity IDE', message: `Opened ${absPath} in Antigravity IDE (agy)` };
          } catch (e2) {
            // Fallback to opening VS Code or default directory explorer
            await execAsync(`code "${absPath}"`);
            return { success: true, editor: 'VS Code Fallback', message: `Opened ${absPath} in Code Editor` };
          }
        }
      } else {
        await execAsync(`code "${absPath}"`);
        return { success: true, editor: 'VS Code', message: `Opened ${absPath} in VS Code` };
      }
    } catch (e: any) {
      return { success: false, editor, message: e.message || 'Failed to launch editor' };
    }
  }
}
