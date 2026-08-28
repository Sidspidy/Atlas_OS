import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { VSCodeOpenPayload } from '@atlas-os/shared';

@Injectable()
export class VSCodeIntegrationService {
  public openInVSCode(payload: VSCodeOpenPayload): Promise<{ success: boolean; command: string; error?: string }> {
    return new Promise((resolve) => {
      let command = 'code .';

      if (payload.filePath) {
        if (payload.line) {
          command = `code -g "${payload.filePath}:${payload.line}"`;
        } else {
          command = `code "${payload.filePath}"`;
        }
      } else if (payload.projectRoot) {
        command = `code "${payload.projectRoot}"`;
      }

      exec(command, (error) => {
        if (error) {
          console.warn(`[VSCodeIntegration] Command '${command}' failed:`, error.message);
          resolve({ success: false, command, error: error.message });
        } else {
          resolve({ success: true, command });
        }
      });
    });
  }
}
