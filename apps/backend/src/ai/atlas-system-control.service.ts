import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import os from 'os';
import path from 'path';

const execAsync = promisify(exec);

export interface AtlasActionResult {
  handled: boolean;
  actionType: string;
  message: string;
  details?: any;
}

@Injectable()
export class AtlasSystemControlService {
  public async processAtlasIntent(prompt: string): Promise<AtlasActionResult> {
    const q = prompt.toLowerCase().trim();

    // 1. Open File Explorer
    if (q.includes('open file explorer') || q.includes('open explorer') || q.includes('my computer') || q.includes('open my computer') || q.includes('show file explorer')) {
      try {
        const downloadsPath = path.join(os.homedir(), 'Downloads');
        await execAsync(`explorer.exe "${downloadsPath}"`);
        return {
          handled: true,
          actionType: 'OPEN_FILE_EXPLORER',
          message: `Opened Windows File Explorer at \`${downloadsPath}\`.`
        };
      } catch (e: any) {
        await execAsync('explorer.exe');
        return {
          handled: true,
          actionType: 'OPEN_FILE_EXPLORER',
          message: 'Opened Windows File Explorer.'
        };
      }
    }

    // 2. Open Calculator
    if (q.includes('open calc') || q.includes('open calculator') || q.includes('launch calc')) {
      try {
        await execAsync('calc.exe');
        return {
          handled: true,
          actionType: 'OPEN_CALCULATOR',
          message: 'Launched Windows Calculator.'
        };
      } catch (e: any) {
        return { handled: false, actionType: 'ERROR', message: e.message };
      }
    }

    // 3. Open Notepad
    if (q.includes('open notepad') || q.includes('launch notepad')) {
      try {
        await execAsync('notepad.exe');
        return {
          handled: true,
          actionType: 'OPEN_NOTEPAD',
          message: 'Launched Windows Notepad.'
        };
      } catch (e: any) {
        return { handled: false, actionType: 'ERROR', message: e.message };
      }
    }

    // 4. Open Task Manager
    if (q.includes('open task manager') || q.includes('task manager') || q.includes('show processes')) {
      try {
        await execAsync('taskmgr.exe');
        return {
          handled: true,
          actionType: 'OPEN_TASK_MANAGER',
          message: 'Opened Windows Task Manager.'
        };
      } catch (e: any) {
        return { handled: false, actionType: 'ERROR', message: e.message };
      }
    }

    // 5. Open Web Browser / Chrome
    if (q.includes('open chrome') || q.includes('open browser') || q.includes('launch browser')) {
      try {
        await execAsync('start chrome || start msedge');
        return {
          handled: true,
          actionType: 'OPEN_BROWSER',
          message: 'Launched Web Browser.'
        };
      } catch (e: any) {
        return { handled: false, actionType: 'ERROR', message: e.message };
      }
    }

    // 6. Generic App Launcher ("open <appname>")
    const openMatch = q.match(/^open\s+([a-zA-Z0-9_\-\s\.]+)/i);
    if (openMatch && openMatch[1]) {
      const appName = openMatch[1].trim();
      if (!['file explorer', 'explorer', 'calc', 'calculator', 'notepad', 'chrome', 'browser'].includes(appName)) {
        try {
          await execAsync(`start "" "${appName}"`);
          return {
            handled: true,
            actionType: 'OPEN_APP',
            message: `Attempted to launch system application "${appName}".`
          };
        } catch (e) {
          // pass to next tool handler
        }
      }
    }

    return { handled: false, actionType: 'NONE', message: 'No match' };
  }
}
