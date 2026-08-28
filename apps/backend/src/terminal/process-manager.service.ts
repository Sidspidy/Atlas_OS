import { Injectable } from '@nestjs/common';
import { exec, ChildProcess } from 'child_process';
import { CommandExecutionResult, ProcessStatusRecord } from '@atlas-os/shared';

@Injectable()
export class ProcessManagerService {
  private activeProcesses: Map<number, { process: ChildProcess; command: string; startedAt: string }> = new Map();

  public executeCommand(command: string, cwd?: string): Promise<CommandExecutionResult> {
    const startTime = Date.now();
    const workingDir = cwd || process.cwd();

    return new Promise((resolve) => {
      const child = exec(command, { cwd: workingDir }, (error, stdout, stderr) => {
        if (child.pid) {
          this.activeProcesses.delete(child.pid);
        }

        const executionTimeMs = Date.now() - startTime;
        resolve({
          id: `cmd_${Date.now()}`,
          command,
          pid: child.pid,
          stdout: stdout || (error ? error.message : ''),
          stderr: stderr || '',
          exitCode: error ? error.code || 1 : 0,
          executionTimeMs,
          success: !error
        });
      });

      if (child.pid) {
        this.activeProcesses.set(child.pid, {
          process: child,
          command,
          startedAt: new Date().toISOString()
        });
      }
    });
  }

  public getActiveProcesses(): ProcessStatusRecord[] {
    return Array.from(this.activeProcesses.entries()).map(([pid, info]) => ({
      pid,
      command: info.command,
      startedAt: info.startedAt
    }));
  }

  public killProcess(pid: number): boolean {
    const procInfo = this.activeProcesses.get(pid);
    if (procInfo) {
      procInfo.process.kill('SIGKILL');
      this.activeProcesses.delete(pid);
      return true;
    }
    return false;
  }
}
